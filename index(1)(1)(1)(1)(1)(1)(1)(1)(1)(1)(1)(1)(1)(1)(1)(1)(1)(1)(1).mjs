import { complete, llmEnabled } from '../llm/index.mjs';
const defs=[
 ['CFO','Finance','cash, capital structure, unit economics and capital efficiency'],
 ['INVESTMENT','Investment','return, portfolio fit, opportunity cost and thesis'],
 ['RISK','Risk','loss, liquidity, concentration, tail risk and failure modes'],
 ['MARKETS','Markets','macro, rates, volatility, correlations and regime'],
 ['STRATEGY','Strategy','competition, game theory, positioning and execution'],
 ['ASSETS','Real Assets','crypto, real estate, commodities and tangible assets'],
 ['GOVERNANCE','Governance','tax, legal/compliance, fiduciary controls and approvals'],
 ['RED_TEAM','Independent Red Team','strongest case against the proposal, data gaps and hidden assumptions']
];
export const agentDefinitions=()=>defs.map(([id,division,focus])=>({id,division,focus}));
function fallback(d,ctx,i){const edge=ctx.val.expectedReturnPct>0?0.06:-0.04; const riskPenalty=ctx.risk.score*.08; const score=Math.max(.05,Math.min(.95,.55+edge-riskPenalty+(i%2?-.03:.03))); return {...d,stance:score>.6?'SUPPORT':score<.42?'OPPOSE':'NEUTRAL',score:Number(score.toFixed(3)),argument:`${d.focus}: expected return ${ctx.val.expectedReturnPct.toFixed(1)}%, risk ${ctx.risk.score.toFixed(2)}, simulation success ${ctx.sim.successProbability.toFixed(2)}.`,keyRisk:ctx.risk.level,missingEvidence:[]};}
export async function buildAgents(input,ctx){const base=defs.map(([id,division,focus])=>({id,division,focus})); if(!llmEnabled()) return base.map((d,i)=>fallback(d,ctx,i)); return Promise.all(base.map(async d=>{const r=await complete({system:`You are the ${d.division} division of FinPilot AI. Analyze only supplied evidence. Never invent facts. Return strict JSON: stance SUPPORT|NEUTRAL|OPPOSE, score 0..1, argument, keyRisk, missingEvidence[].`,user:JSON.stringify({focus:d.focus,input,context:ctx})});let parsed;try{parsed=JSON.parse(r.text)}catch{parsed={stance:'NEUTRAL',score:.5,argument:r.text||'No usable model output',keyRisk:'UNKNOWN',missingEvidence:['structured model output']};}return {...d,...parsed};}));}
export function debate(agents){const scores=agents.map(a=>a.stance==='SUPPORT'?1:a.stance==='OPPOSE'?-1:0);const avg=scores.reduce((a,b)=>a+b,0)/Math.max(1,scores.length);const contradictions=new Set(scores.filter(Boolean)).size>1;const sorted=[...agents].sort((a,b)=>b.score-a.score);return {rounds:['Independent analysis','Cross-examination','Evidence challenge','Red-team challenge','Final vote'],votes:scores,averageVote:Number(avg.toFixed(3)),contradictions,leader:sorted[0]?.id||null,judge:avg>=.25?'RISK_ADJUSTED_SUPPORT':avg<=-.25?'DOWNSIDE_DOMINANT':'MIXED_REQUIRES_CONTROLS'};}
