const timeout=(ms)=>AbortSignal.timeout(ms);
export async function liveQuote(symbol){
  const av=process.env.ALPHAVANTAGE_API_KEY;
  if(av){const u=new URL('https://www.alphavantage.co/query');u.searchParams.set('function','GLOBAL_QUOTE');u.searchParams.set('symbol',symbol);u.searchParams.set('apikey',av);const r=await fetch(u,{signal:timeout(10000)});const j=await r.json();const q=j['Global Quote']||{};if(q['05. price'])return {provider:'alphavantage',symbol,price:Number(q['05. price']),timestamp:new Date().toISOString(),raw:q};}
  const coinMap={BTC:'bitcoin',ETH:'ethereum',SOL:'solana',DOGE:'dogecoin'}; const id=coinMap[String(symbol).toUpperCase()];
  if(id){const r=await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_last_updated_at=true`,{signal:timeout(10000)});const j=await r.json();if(j[id]?.usd)return {provider:'coingecko',symbol,price:j[id].usd,timestamp:j[id].last_updated_at?new Date(j[id].last_updated_at*1000).toISOString():new Date().toISOString()};}
  throw new Error('LIVE_QUOTE_UNAVAILABLE');
}
