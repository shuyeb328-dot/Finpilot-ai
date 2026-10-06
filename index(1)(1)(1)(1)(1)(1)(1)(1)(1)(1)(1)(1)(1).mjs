import { append, list } from '../persistence/store.mjs';

export async function recordEvent(event={}) {
  const normalized={id:crypto.randomUUID(),timestamp:new Date().toISOString(),type:event.type||'GENERAL',severity:event.severity||'INFO',subject:event.subject||'',data:event.data||{}};
  await append('events', normalized); return normalized;
}

export async function scanWatchtower(input={}) {
  const events=await list('events', Number(input.limit||100));
  const alerts=events.filter(e=>['CRITICAL','HIGH'].includes(String(e.severity).toUpperCase()));
  return {scanned:events.length, alerts, status:alerts.length?'ATTENTION_REQUIRED':'CLEAR', checkedAt:new Date().toISOString()};
}
