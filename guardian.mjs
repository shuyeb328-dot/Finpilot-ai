import crypto from 'node:crypto';

const WINDOW_MS = Number(process.env.SECURITY_RATE_WINDOW_MS || 60_000);
const MAX_REQUESTS = Number(process.env.SECURITY_RATE_MAX || 120);
const MAX_BODY = Number(process.env.SECURITY_MAX_BODY_BYTES || 1_000_000);
const BLOCK_MS = Number(process.env.SECURITY_BLOCK_MS || 15 * 60_000);
const FAIL_LIMIT = Number(process.env.SECURITY_AUTH_FAIL_LIMIT || 8);

const clients = new Map();
const events = [];
let securityState = {score:100, level:'GREEN', lastScan:null, blocked:0, findings:[]};

function now(){return Date.now();}
function record(type, data={}){
  events.push({id:crypto.randomUUID(),ts:new Date().toISOString(),type,...data});
  if(events.length>500) events.shift();
}
function clientKey(req){return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';}

export function securityGuard(req){
  const key=clientKey(req), t=now();
  let c=clients.get(key);
  if(!c || t-c.windowStart>WINDOW_MS){c={windowStart:t,count:0,failures:0,blockedUntil:0};clients.set(key,c);}
  if(c.blockedUntil>t) return {allowed:false,status:429,reason:'SECURITY_BLOCK_ACTIVE'};
  c.count++;
  if(c.count>MAX_REQUESTS){c.blockedUntil=t+BLOCK_MS;record('RATE_LIMIT_BLOCK',{key});return {allowed:false,status:429,reason:'RATE_LIMITED'};}
  return {allowed:true,key};
}

export function securityFailure(key, reason='AUTH_FAILURE'){
  const c=clients.get(key)||{windowStart:now(),count:0,failures:0,blockedUntil:0};
  c.failures++;
  if(c.failures>=FAIL_LIMIT){c.blockedUntil=now()+BLOCK_MS;record('AUTH_ATTACK_BLOCK',{key,reason,failures:c.failures});}
  clients.set(key,c);
}

export function securitySuccess(key){const c=clients.get(key);if(c)c.failures=0;}
export function maxBodyBytes(){return MAX_BODY;}
export function securityEvents(limit=100){return events.slice(-Math.min(limit,500)).reverse();}

export async function runSecurityGuardian({env=process.env}={}){
  const findings=[];
  if(!env.OWNER_TOKEN) findings.push({severity:'CRITICAL',code:'OWNER_TOKEN_MISSING',fix:'Set OWNER_TOKEN to a long random secret.'});
  if(!env.OWNER_RECOVERY_CODE) findings.push({severity:'CRITICAL',code:'RECOVERY_CODE_MISSING',fix:'Set OWNER_RECOVERY_CODE separately from the app.'});
  if(env.NODE_ENV==='production' && !env.SECURITY_PROXY_TRUST) findings.push({severity:'HIGH',code:'PROXY_TRUST_UNSET',fix:'Configure a trusted TLS reverse proxy before production.'});
  if(env.LLM_API_KEY) findings.push({severity:'CRITICAL',code:'SERVER_SECRET_PRESENT',fix:'Keep provider keys server-side and never expose them to the Android client.'});
  const blocks=[...clients.values()].filter(x=>x.blockedUntil>now()).length;
  const critical=findings.filter(x=>x.severity==='CRITICAL').length;
  const high=findings.filter(x=>x.severity==='HIGH').length;
  securityState={score:Math.max(0,100-critical*35-high*15-blocks*5),level:critical?'RED':high||blocks?'AMBER':'GREEN',lastScan:new Date().toISOString(),blocked:blocks,findings};
  record('GUARDIAN_SCAN',{level:securityState.level,score:securityState.score,findings:findings.length});
  return {agent:'Security Guardian',status:'ACTIVE',mode:'DEFENSIVE_AUTO_HARDENING',state:securityState,events:securityEvents(20)};
}

export function securityStatus(){return securityState;}
