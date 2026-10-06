import test from 'node:test';
import assert from 'node:assert/strict';
import {hubSnapshot,categorizeTransactions,connectorCatalog} from '../services/finance-hub/index.mjs';
test('hub aggregates accounts assets and liabilities',()=>{const r=hubSnapshot({accounts:[{balance:10000}],assets:[{type:'equity',value:50000}],liabilities:[{balance:15000}]});assert.equal(r.netWorth,45000);assert.equal(r.investments,50000);});
test('hub calculates transaction categories',()=>{const r=categorizeTransactions([{type:'expense',category:'food',amount:100},{type:'expense',category:'food',amount:50},{type:'income',category:'salary',amount:1000}]);assert.equal(r.find(x=>x.category==='food').netAmount,150);assert.equal(r.find(x=>x.category==='salary').netAmount,-1000);});
test('connector catalog is read-only-first',()=>{const r=connectorCatalog();assert.ok(r.some(x=>x.id==='bank-open-banking'&&x.mode==='read-only-first'));});
