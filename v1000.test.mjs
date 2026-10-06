import test from 'node:test'; import assert from 'node:assert/strict';
import { runDecision } from '../services/decision-kernel/index.mjs';
import { portfolioRisk } from '../services/portfolio/index.mjs';
import { rankCapital } from '../services/capital/index.mjs';
import { cryptoAssessment } from '../services/crypto/index.mjs';
import { realEstateAssessment } from '../services/realestate/index.mjs';
import { detectAlerts } from '../services/watchtower/rules.mjs';

test('decision kernel produces bounded probabilities and governed approval', async()=>{const r=await runDecision({upsidePct:20,downsidePct:-10,baseProbability:.65,simulations:500,marketRisk:.3,liquidityRisk:.2,evidenceStatus:'VERIFIED_MULTI_SOURCE'}); const sum=r.probability.positive+r.probability.neutral+r.probability.negative; assert.ok(Math.abs(sum-1)<.01); assert.ok(['PROMOTE','PROCEED_WITH_LIMITS','WATCH','REJECT','HUMAN_APPROVAL_REQUIRED'].includes(r.approval)); assert.equal(r.schemaVersion,'1000.0');});
test('portfolio concentration is detected',()=>{const r=portfolioRisk([{value:800,risk:.3},{value:200,risk:.5}]); assert.equal(r.concentration,.8); assert.deepEqual(r.flags,['HIGH_CONCENTRATION']);});
test('capital ranking orders by risk-adjusted opportunity',()=>{const r=rankCapital([{id:'A',expectedReturnPct:20,probability:.7,risk:.3,liquidity:.8},{id:'B',expectedReturnPct:8,probability:.8,risk:.5,liquidity:.5}]); assert.equal(r[0].id,'A');});
test('crypto risk increases with volatility and leverage',()=>{const r=cryptoAssessment({asset:'BTC',volatilityPct:100,liquidity:.3,leverage:2}); assert.equal(r.riskLevel,'HIGH');});
test('real estate metrics calculate',()=>{const r=realEstateAssessment({purchasePrice:1000000,annualNOI:80000,debt:700000,annualDebtService:50000}); assert.equal(r.capRate,8); assert.equal(r.dscr,1.6);});
test('watchtower catches material events',()=>{const a=detectAlerts([{changePct:-15},{volatilityPct:120},{evidenceStatus:'CONTRADICTED'}]); assert.equal(a.length,3);});
