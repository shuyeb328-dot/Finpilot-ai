import { append } from '../persistence/store.mjs';
export async function audit(event, meta={}) {
  return append('audit', { id: crypto.randomUUID(), timestamp:new Date().toISOString(), event, meta });
}
