import { append, list } from '../persistence/store.mjs';
import { riskAssessment } from '../risk/index.mjs';
import { valuation } from '../valuation/index.mjs';
import { simulate } from '../simulation/index.mjs';
import { runRoundTable } from '../roundtable/index.mjs';
import { calibrateProbability } from '../calibration/index.mjs';
import { governanceGate } from '../governance/index.mjs';

function rawProbability(avg,risk,sim){let p=.5+avg*.22+(sim.successProbability-.5)*.35-risk*.08; p=Math.max(.03,Math.min(.9,p)); let n=.18+risk*.08, q=1-p-n; if(q<.03){q=.03;n=Math.max(.03,1-p-q);} const t=p+n+q; return {positive:p/t,neutral:n/t,negative:q/t};}
function approval(p,risk,rt,input){if(risk.hardStop||risk.score>=.85)return 'HUMAN_APPROVAL_REQUIRED'; if(['CONTRADICTED','UNVERIFIED_RUMOR'].includes(input.evidenceStatus))return 'REJECT'; if(p.positive>=.62&&risk.score<.65&&rt.verdict==='SUPPORT')return 'PROMOTE'; if(p.positive>=.52)return 'PROCEED_WITH_LIMITS'; if(p.negative>=.55)return 'REJECT'; return 'WATCH';}
export async function runDecision(input={}) { const val=valuation(input), risk=riskAssessment(input), sim=simulate(input,val,risk), history=await list('outcomes',100); const rt=await runRoundTable(input,{val,risk,sim}); const calibrated=calibrateProbability(rawProbability(rt.averageScore*2-1,risk.score,sim),history); const finalApproval=approval(calibrated,risk,rt,input); const governance=governanceGate({riskScore:risk.score,evidenceStatus:input.evidenceStatus,amount:input.amount,approval:finalApproval}); const result={id:crypto.randomUUID(),schemaVersion:'1000.0',timestamp:new Date().toISOString(),input,valuation:val,risk,simulation:sim,probability:calibrated,roundTable:rt,agents:rt.agents,governance,approval:governance.humanApprovalRequired?'HUMAN_APPROVAL_REQUIRED':finalApproval}; await append('decisions',result); return result; }
