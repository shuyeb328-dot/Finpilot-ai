export function executionPolicy({mode='PAPER',humanApproved=false,approval='WATCH'}={}){
  if(mode!=='PAPER') return {allowed:false,reason:'LIVE_EXECUTION_DISABLED_IN_AUTONOMOUS_AGENT'};
  return {allowed:humanApproved===true&&['PROMOTE','PROCEED_WITH_LIMITS'].includes(approval),mode:'PAPER',note:'Paper execution only; no broker order is submitted.'};
}
