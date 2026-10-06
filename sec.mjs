const ua=process.env.SEC_USER_AGENT||'FinPilotAI/0.2 contact@example.com';
export async function secCompanyFacts(cik){
 const id=String(cik).replace(/\D/g,'').padStart(10,'0');
 const r=await fetch(`https://data.sec.gov/api/xbrl/companyfacts/CIK${id}.json`,{headers:{'User-Agent':ua,'Accept':'application/json'}});
 if(!r.ok) throw new Error(`SEC HTTP ${r.status}`); return r.json();
}
export async function secSubmissions(cik){
 const id=String(cik).replace(/\D/g,'').padStart(10,'0');
 const r=await fetch(`https://data.sec.gov/submissions/CIK${id}.json`,{headers:{'User-Agent':ua,'Accept':'application/json'}});
 if(!r.ok) throw new Error(`SEC HTTP ${r.status}`); return r.json();
}
