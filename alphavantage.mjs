const key=process.env.ALPHAVANTAGE_API_KEY;
export function alphaEnabled(){return Boolean(key)}
export async function alphaNews({tickers,topics,limit=20}={}){
 if(!key) return {enabled:false,reason:'ALPHAVANTAGE_API_KEY not configured',items:[]};
 const p=new URLSearchParams({function:'NEWS_SENTIMENT',apikey:key,limit:String(limit)}); if(tickers)p.set('tickers',tickers); if(topics)p.set('topics',topics);
 const r=await fetch(`https://www.alphavantage.co/query?${p}`); if(!r.ok) throw new Error(`Alpha Vantage HTTP ${r.status}`); const j=await r.json();
 return {enabled:true,items:j.feed||[],raw:j};
}
