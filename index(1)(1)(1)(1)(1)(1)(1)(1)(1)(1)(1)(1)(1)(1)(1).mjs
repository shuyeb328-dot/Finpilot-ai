const num=v=>Number(v)||0;
const sum=(xs,key='amount')=>xs.reduce((s,x)=>s+num(x?.[key]),0);
export const HUB_SCHEMA='FINANCE-HUB-1.0';
export function normalizeHub(input={}){
 const accounts=(input.accounts||[]).map(a=>({id:a.id||`acct-${Math.random().toString(36).slice(2,8)}`,name:a.name||'Unnamed account',type:a.type||'cash',institution:a.institution||'manual',currency:a.currency||'USD',balance:num(a.balance)}));
 const assets=(input.assets||[]).map(a=>({name:a.name||'Asset',type:a.type||'other',value:Math.max(0,num(a.value)),currency:a.currency||'USD'}));
 const liabilities=(input.liabilities||[]).map(l=>({name:l.name||'Liability',type:l.type||'debt',balance:Math.max(0,num(l.balance??l.value)),apr:Math.max(0,num(l.apr))}));
 const transactions=(input.transactions||[]).map(t=>({id:t.id||`txn-${Math.random().toString(36).slice(2,8)}`,accountId:t.accountId||null,date:t.date||new Date().toISOString().slice(0,10),type:t.type||'expense',category:t.category||'uncategorized',amount:num(t.amount),currency:t.currency||'USD',description:t.description||''}));
 return {schemaVersion:HUB_SCHEMA,accounts,assets,liabilities,transactions};
}
export function hubSnapshot(input={}){
 const h=normalizeHub(input), accountAssets=sum(h.accounts,'balance')+sum(h.assets,'value'), debt=sum(h.liabilities,'balance');
 const income=sum(h.transactions.filter(t=>t.type==='income')), expenses=sum(h.transactions.filter(t=>t.type==='expense'));
 const investments=sum(h.assets.filter(a=>['equity','fund','bond','crypto','investment'].includes(a.type)),'value');
 return {schemaVersion:HUB_SCHEMA,accounts:h.accounts,assetTotal:accountAssets,debtTotal:debt,netWorth:accountAssets-debt,investments,periodIncome:income,periodExpenses:expenses,periodNetCashflow:income-expenses,transactionCount:h.transactions.length,currencies:[...new Set([...h.accounts,...h.assets,...h.transactions].map(x=>x.currency).filter(Boolean))]};
}
export function categorizeTransactions(transactions=[]){const groups={};for(const t of transactions){const k=t.category||'uncategorized';groups[k]=(groups[k]||0)+num(t.amount)*(t.type==='income'?-1:1)}return Object.entries(groups).map(([category,net])=>({category,netAmount:net})).sort((a,b)=>Math.abs(b.netAmount)-Math.abs(a.netAmount));}
export function connectorCatalog(){return [{id:'bank-open-banking',name:'Bank/Open-Banking',status:'adapter-ready',mode:'read-only-first'},{id:'broker',name:'Brokerage',status:'adapter-ready',mode:'positions-and-orders'},{id:'crypto',name:'Crypto Exchange',status:'adapter-ready',mode:'balances-and-market-data'},{id:'real-estate',name:'Real Estate',status:'manual-plus-adapter',mode:'asset-values'},{id:'insurance',name:'Insurance',status:'planned',mode:'policies-and-premiums'},{id:'tax',name:'Tax Records',status:'planned',mode:'documents-and-estimates'}];}
