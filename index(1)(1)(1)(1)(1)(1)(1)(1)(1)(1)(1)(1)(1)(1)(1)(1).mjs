export function portfolioRisk(assets=[]) {
  const total=assets.reduce((s,a)=>s+Number(a.value||0),0)||1;
  const weights=assets.map(a=>({...a,weight:Number((Number(a.value||0)/total).toFixed(4))}));
  const concentration=Math.max(...weights.map(a=>a.weight),0);
  const weightedRisk=weights.reduce((s,a)=>s+a.weight*Math.max(0,Math.min(1,Number(a.risk||.5))),0);
  return {totalValue:total,weights,concentration:Number(concentration.toFixed(3)),weightedRisk:Number(weightedRisk.toFixed(3)),flags:concentration>.4?['HIGH_CONCENTRATION']:[]};
}
