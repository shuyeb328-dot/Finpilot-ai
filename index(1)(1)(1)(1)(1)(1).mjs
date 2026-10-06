const endpoint=process.env.LLM_API_URL;
const key=process.env.LLM_API_KEY;
const model=process.env.LLM_MODEL||'configured-model';
export function llmEnabled(){return Boolean(endpoint&&key)}
export async function complete({system,user}){
 if(!llmEnabled()) return {enabled:false,text:null,reason:'LLM_API_URL/LLM_API_KEY not configured'};
 const r=await fetch(endpoint,{method:'POST',headers:{'content-type':'application/json','authorization':`Bearer ${key}`},body:JSON.stringify({model,messages:[{role:'system',content:system},{role:'user',content:user}],temperature:0.2})});
 if(!r.ok) throw new Error(`LLM provider HTTP ${r.status}`);
 const j=await r.json(); const text=j.choices?.[0]?.message?.content ?? j.output_text ?? null;
 return {enabled:true,text,raw:j};
}
