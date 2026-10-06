import {append,list} from '../persistence/store.mjs';
const n=x=>Number(x||0);
export async function createPaperAccount({cash=100000,currency='USD'}={}){const a={id:`paper_${Date.now()}`,cash:n(cash),currency,positions:{},equity:n(cash),createdAt:new Date().toISOString(),mode:'PAPER_ONLY'};return append('paper_accounts',a);}
export async function paperOrder({accountId,symbol,side,quantity,price,reason='',decisionId=null}){
  const accounts=await list('paper_accounts',10000), a=accounts.find(x=>x.id===accountId); if(!a) throw new Error('PAPER_ACCOUNT_NOT_FOUND');
  const q=n(quantity),p=n(price); if(q<=0||p<=0) throw new Error('INVALID_ORDER'); if(!['BUY','SELL'].includes(side)) throw new Error('INVALID_SIDE');
  const pos=a.positions[symbol]||{quantity:0,avgPrice:0}; const value=q*p;
  if(side==='BUY'){if(a.cash<value) throw new Error('INSUFFICIENT_PAPER_CASH'); const newQ=pos.quantity+q; pos.avgPrice=(pos.avgPrice*pos.quantity+value)/newQ; pos.quantity=newQ; a.cash-=value;}
  else {if(pos.quantity<q) throw new Error('INSUFFICIENT_PAPER_POSITION'); pos.quantity-=q; a.cash+=value; if(pos.quantity===0)pos.avgPrice=0;}
  a.positions[symbol]=pos; a.equity=a.cash+Object.values(a.positions).reduce((s,x)=>s+x.quantity*p,0); a.updatedAt=new Date().toISOString();
  await append('paper_trades',{accountId,symbol,side,quantity:q,price:p,value,reason,decisionId,executedAt:a.updatedAt});
  await append('paper_accounts_snapshots',a); return {account:a,trade:{symbol,side,quantity:q,price:p,value}};
}
export async function paperStatus(accountId){const accounts=await list('paper_accounts',10000),a=accounts.find(x=>x.id===accountId);if(!a)throw new Error('PAPER_ACCOUNT_NOT_FOUND');return a;}
export async function paperTrades(limit=100){return list('paper_trades',limit);}
