import { buildAgents } from '../agents/index.mjs';
import { agentScorecard } from '../learning/index.mjs';

export async function runRoundTable(input, ctx) {
  const agents = await buildAgents(input, ctx);
  const scorecards = await agentScorecard();
  const trust = new Map(scorecards.map(x=>[x.agentId, x.calibrationTrust]));
  const weightedAgents = agents.map(a=>({...a, calibrationTrust: trust.get(a.id) ?? 0.5, influenceWeight: 0.5 + (trust.get(a.id) ?? 0.5)}));
  const rounds = [];
  let current = weightedAgents.map(a => ({...a}));
  rounds.push({name:'INDEPENDENT', positions: current.map(x=>({id:x.id,stance:x.stance,score:x.score}))});
  const weightTotal=current.reduce((s,a)=>s+(a.influenceWeight||1),0);
  const mean = current.reduce((s,a)=>s+(Number(a.score)||0)*(a.influenceWeight||1),0)/Math.max(1,weightTotal);
  current = current.map((a,i)=> {
    const pressure = a.id==='RED_TEAM' ? -0.06 : (ctx.risk.score>0.7 ? -0.04 : 0.015);
    const score = Math.max(0,Math.min(1,(Number(a.score)||0)*0.72+mean*0.28+pressure+(i%3===0?0.01:0)));
    return {...a,score:Number(score.toFixed(3)), stance:score>=.62?'SUPPORT':score<=.38?'OPPOSE':'NEUTRAL'};
  });
  rounds.push({name:'CROSS_EXAMINATION', positions: current.map(x=>({id:x.id,stance:x.stance,score:x.score}))});
  const challenge = current.map(a=>({agent:a.id,challenge:a.id==='RED_TEAM'?'Identify thesis-breaking evidence and hidden downside.':'Challenge the strongest opposing argument using only supplied evidence.'}));
  rounds.push({name:'EVIDENCE_CHALLENGE', challenges:challenge});
  const support=current.filter(a=>a.stance==='SUPPORT').length, oppose=current.filter(a=>a.stance==='OPPOSE').length;
  const avg=current.reduce((s,a)=>s+(Number(a.score)||0)*(a.influenceWeight||1),0)/Math.max(1,current.reduce((s,a)=>s+(a.influenceWeight||1),0));
  const verdict=avg>=.64&&support>oppose?'SUPPORT':avg<=.36&&oppose>=support?'OPPOSE':'MIXED';
  rounds.push({name:'FINAL_VOTE',support,oppose,neutral:current.length-support-oppose,verdict});
  return {agents:current,rounds,verdict,averageScore:Number(avg.toFixed(3)),dissent:Math.abs(support-oppose)<=1};
}
