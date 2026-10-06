import {agentCycle,adapt,learningStatus} from '../services/autonomy/index.mjs';
const r=await agentCycle({asset:'BTC',symbols:['BTC'],horizon:'1d'});
if(!r.decision||r.forecasts.length!==8)throw new Error('AGENT_CYCLE_FAILED');
await adapt({decisionId:r.decision.id||r.decision.decisionId,actualReturnPct:2.1,thesisCorrect:true,lessons:['Paper-cycle test']});
const s=await learningStatus(); if(!s.agentScorecards)throw new Error('LEARNING_STATUS_FAILED');
console.log('AGENT_CYCLE_OK',JSON.stringify({agents:r.forecasts.length,market:r.market,lessons:s.lessons.length}));
