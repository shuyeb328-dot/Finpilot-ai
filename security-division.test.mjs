import test from 'node:test';
import assert from 'node:assert/strict';
import {securityAgents,securityOrg,securityIncident,securityIncidents} from '../services/security/security-division.mjs';

test('security division has independent specialist agents',()=>{
  const agents=securityAgents();
  assert.equal(agents.length,8);
  assert.ok(agents.some(a=>a.id==='appsec'));
  assert.ok(agents.some(a=>a.id==='incident-response'));
  assert.ok(agents.every(a=>a.mode==='DEFENSIVE_ONLY'));
});

test('security org reports to CEO and preserves human approval gates',()=>{
  const org=securityOrg();
  assert.equal(org.reportsTo,'CEO / Final Decision AI');
  assert.ok(org.humanApprovalRequiredFor.includes('production credential revocation'));
});

test('security incidents are recorded',()=>{
  const x=securityIncident({severity:'HIGH',type:'AUTH_ATTACK'});
  assert.equal(x.status,'OPEN');
  assert.equal(securityIncidents(1)[0].id,x.id);
});
