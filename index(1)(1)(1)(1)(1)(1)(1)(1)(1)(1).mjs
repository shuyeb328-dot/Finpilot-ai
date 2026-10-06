import {runDecision} from '../decision-kernel/index.mjs';
import {recordForecast,learnFromOutcome,adaptationReport} from '../learning/index.mjs';
import {liveQuote} from '../market/index.mjs';
import {paperOrder} from '../paper/index.mjs';

export async function agentCycle(input){
  const observedAt=new Date().toISOString();
  const market=[]; for(const s of (input.symbols||[])){try{market.push(await liveQuote(s));}catch(e){market.push({symbol:s,error:e.message});}}
  const decision=await runDecision({...input,market});
  const forecasts=[]; for(const a of decision.agents||[]){forecasts.push(await recordForecast({agentId:a.id,decisionId:decision.id||decision.decisionId,asset:input.asset||input.symbol||'UNKNOWN',predictedProbability:a.score,horizon:input.horizon||'1d',features:{market}}));}
  let paper=null;
  if(input.paperAccountId && input.paperOrder){paper=await paperOrder({...input.paperOrder,accountId:input.paperAccountId,decisionId:decision.id||decision.decisionId});}
  return {observedAt,market,decision,forecasts,paper,mode:'PAPER_AUTONOMOUS'};
}
export async function adapt({decisionId,actualReturnPct,thesisCorrect,lessons=[]}){return learnFromOutcome({decisionId,actualReturnPct,thesisCorrect,lessons});}
export async function learningStatus(){return adaptationReport();}
