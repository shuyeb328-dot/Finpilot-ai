import test from 'node:test';
import assert from 'node:assert/strict';
import {financeOverview,budgetPlan,debtPlan,cashflowForecast,taxReserve,goalPlan,financialHealth} from '../services/finance/index.mjs';

test('finance overview calculates net worth and cashflow',()=>{const r=financeOverview({assets:[{type:'cash',value:20000},{type:'equity',value:80000}],liabilities:[{value:30000}],income:[{amount:10000}],expenses:[{amount:6000}]});assert.equal(r.netWorth,70000);assert.equal(r.monthlyFreeCash,4000);});
test('budget identifies unallocated cash',()=>{const r=budgetPlan({monthlyIncome:10000,categories:[{name:'needs',amount:5000},{name:'investing',amount:2000}]});assert.equal(r.unallocated,3000);assert.equal(r.balanced,false);});
test('debt plan prioritizes highest APR',()=>{const r=debtPlan({debts:[{id:'low',balance:1000,apr:5,minimum:50},{id:'high',balance:500,apr:20,minimum:30}]});assert.equal(r.priority[0].id,'high');});
test('cashflow forecast produces requested horizon',()=>{const r=cashflowForecast({startingCash:1000,monthlyIncome:5000,monthlyExpenses:4000,months:6});assert.equal(r.forecast.length,6);assert.equal(r.endingBalance,7000);});
test('tax reserve is a planning estimate',()=>{const r=taxReserve({annualIncome:100000,deductions:10000,effectiveRatePct:20});assert.equal(r.estimatedTax,18000);});
test('goal planner calculates contribution',()=>{const r=goalPlan({target:12000,current:0,months:12,annualReturnPct:0});assert.equal(r.requiredMonthlyContribution,1000);});
test('financial health is bounded',()=>{const r=financialHealth({assets:[{type:'cash',value:12000}],liabilities:[],income:[{amount:5000}],expenses:[{amount:3000}]});assert.ok(r.score>=0&&r.score<=100);});
