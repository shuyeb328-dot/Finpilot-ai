import {runDecision} from '../services/decision-kernel/index.mjs';
const r=await runDecision({upsidePct:15,downsidePct:-12,baseProbability:.6,simulations:1000,evidenceStatus:'VERIFIED_PRIMARY'});
const sum=r.probability.positive+r.probability.neutral+r.probability.negative;
if(Math.abs(sum-1)>.011) throw new Error('Probability invariant failed');
console.log('V1000_VERIFY_OK', JSON.stringify({approval:r.approval,probability:r.probability,agents:r.roundTable.agents.length}));
