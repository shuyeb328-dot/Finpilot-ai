import {append,list} from '../persistence/store.mjs';

const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
export async function recordForecast({agentId,decisionId,asset,predictedProbability,outcome=null,horizon='1d',features={}}){
  const p=clamp(Number(predictedProbability));
  const item={id:`fc_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,agentId,decisionId,asset,predictedProbability:p,outcome,horizon,features,createdAt:new Date().toISOString()};
  return append('forecasts',item);
}
export async function resolveForecast(id,outcome){
  const all=await list('forecasts',100000); const f=all.find(x=>x.id===id); if(!f) throw new Error('FORECAST_NOT_FOUND');
  f.outcome=Number(outcome)?1:0; f.brier=Number(((f.predictedProbability-f.outcome)**2).toFixed(6)); f.resolvedAt=new Date().toISOString();
  await append('forecast_resolutions',f); return f;
}
export async function agentScorecard(){
  const fs=await list('forecasts',100000), rs=await list('forecast_resolutions',100000), latest=new Map(rs.map(x=>[x.id,x])), map=new Map();
  for(const f of fs){const r=latest.get(f.id); const outcome=r?.outcome ?? f.outcome; if(outcome===null||outcome===undefined) continue; const a=map.get(f.agentId)||{agentId:f.agentId,n:0,brierSum:0,accuracy:0}; a.n++; a.brierSum+=(r?.brier ?? (f.predictedProbability-outcome)**2); a.accuracy += (f.predictedProbability>=.5)===Boolean(outcome)?1:0; map.set(f.agentId,a);}
  return [...map.values()].map(a=>({...a,brierScore:Number((a.brierSum/a.n).toFixed(4)),accuracy:Number((a.accuracy/a.n).toFixed(4)),calibrationTrust:Number(clamp(1-a.brierSum/a.n).toFixed(4))}));
}
export async function learnFromOutcome({decisionId,actualReturnPct,thesisCorrect,lessons=[]}){
  const item={decisionId,actualReturnPct:Number(actualReturnPct||0),thesisCorrect:Boolean(thesisCorrect),lessons,learnedAt:new Date().toISOString()};
  const fs=await list('forecasts',100000); for(const f of fs.filter(x=>x.decisionId===decisionId)) await resolveForecast(f.id,thesisCorrect); return append('learning_events',item);
}
export async function adaptationReport(){
  const scores=await agentScorecard(); const lessons=await list('learning_events',100); return {asOf:new Date().toISOString(),agentScorecards:scores,lessons:lessons.slice(0,50),policy:'Use resolved forecast accuracy to adjust agent influence; never rewrite historical outcomes.'};
}
