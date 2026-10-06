import test from 'node:test';
import assert from 'node:assert/strict';
import {runSecurityGuardian,securityStatus,maxBodyBytes} from '../services/security/guardian.mjs';

test('Security Guardian is active and bounded', async()=>{
  const r=await runSecurityGuardian({env:{OWNER_TOKEN:'test-token',OWNER_RECOVERY_CODE:'test-recovery',NODE_ENV:'test'}});
  assert.equal(r.agent,'Security Guardian');
  assert.equal(r.status,'ACTIVE');
  assert.ok(r.state.score>=0 && r.state.score<=100);
  assert.equal(maxBodyBytes(),1000000);
  assert.equal(securityStatus().level,'GREEN');
});
