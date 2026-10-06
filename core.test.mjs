import test from 'node:test';
import assert from 'node:assert/strict';
import { runDecision } from '../services/decision-kernel/index.mjs';
import { providerStatus } from '../services/providers/index.mjs';

test('decision kernel returns normalized probabilities', async()=>{
 const r=await runDecision({upsidePct:15,downsidePct:-10,baseProbability:.65,marketRisk:.2,liquidityRisk:.2,creditRisk:.2,concentrationRisk:.2,regulatoryRisk:.2,executionRisk:.2,simulations:2000});
 const sum=r.probability.positive+r.probability.neutral+r.probability.negative;
 assert.ok(Math.abs(sum-1)<=.002); assert.equal(r.schemaVersion,'1000.0'); assert.ok(r.agents.length===8);
});
test('provider status is safe without secrets',()=>{const s=providerStatus();assert.equal(typeof s.SEC_EDGAR,'boolean');assert.equal(typeof s.ALPHAVANTAGE,'boolean');});
