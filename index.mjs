import { alphaEnabled, alphaNews } from './alphavantage.mjs';
import { secCompanyFacts, secSubmissions } from './sec.mjs';

export function providerStatus(){return {SEC_EDGAR:true,ALPHAVANTAGE:alphaEnabled(),timestamp:new Date().toISOString()};}
export async function fetchMarketIntelligence(input={}){
  const result={providers:[],items:[],timestamp:new Date().toISOString()};
  if(alphaEnabled()) { const x=await alphaNews(input); result.providers.push('ALPHAVANTAGE'); result.items.push(...x.items); }
  if(input.cik){ const [sub,facts]=await Promise.all([secSubmissions(input.cik),secCompanyFacts(input.cik)]); result.providers.push('SEC_EDGAR'); result.company={name:sub.name,cik:sub.cik,tickers:sub.tickers,factsCount:Object.keys(facts.facts||{}).length}; }
  return result;
}
