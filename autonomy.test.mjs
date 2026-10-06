import test from 'node:test'; import assert from 'node:assert/strict';
import {agentCycle,adapt,learningStatus} from '../services/autonomy/index.mjs';
import {createPaperAccount,paperOrder} from '../services/paper/index.mjs';
import {executionPolicy} from '../services/execution/index.mjs';

test('autonomy cycle records all eight agent forecasts', async()=>{const r=await agentCycle({asset:'BTC',symbols:['BTC'],horizon:'1d'});assert.equal(r.forecasts.length,8);assert.ok(r.decision.id);await adapt({decisionId:r.decision.id,actualReturnPct:1.5,thesisCorrect:true,lessons:['test']});const s=await learningStatus();assert.ok(s.agentScorecards.length>=8);});
test('paper execution never requires a live broker', async()=>{const a=await createPaperAccount({cash:1000});const r=await paperOrder({accountId:a.id,symbol:'TEST',side:'BUY',quantity:2,price:100});assert.equal(r.trade.value,200);assert.equal(r.account.cash,800);});
test('live execution is blocked',()=>{const r=executionPolicy({mode:'LIVE',humanApproved:true,approval:'PROMOTE'});assert.equal(r.allowed,false);});
