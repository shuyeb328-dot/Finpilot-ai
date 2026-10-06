import { alphaNews, alphaEnabled } from '../providers/alphavantage.mjs';
import { secCompanyFacts, secSubmissions } from '../providers/sec.mjs';
export async function searchIntelligence(input={}){
 const q=String(input.query||''); const out={query:q,timestamp:new Date().toISOString(),providers:[],items:[],verification:'DISCOVERY_ONLY'};
 if(alphaEnabled()) { const a=await alphaNews({tickers:input.tickers,topics:input.topics,limit:input.limit||20}); out.providers.push('ALPHAVANTAGE'); out.items.push(...a.items.map(x=>({title:x.title,url:x.url,published:x.time_published,source:x.source,summary:x.summary,sentiment:x.overall_sentiment_score}))); }
 if(input.cik){ const [s,f]=await Promise.all([secSubmissions(input.cik),secCompanyFacts(input.cik)]); out.providers.push('SEC_EDGAR'); out.sec={entityName:s.name,cik:s.cik,tickers:s.tickers,latestFilings:s.filings?.recent?.form?.slice(0,20),factsCount:Object.keys(f.facts||{}).length}; }
 if(!out.providers.length) out.message='No live provider configured. Add server-side provider credentials.';
 return out;
}
