export function calibrateProbability(raw={positive:.5,neutral:.2,negative:.3}, history=[]) {
  const vals=[raw.positive,raw.neutral,raw.negative].map(Number); const total=vals.reduce((a,b)=>a+b,0)||1;
  const normalized=vals.map(v=>v/total);
  const sample=history.filter(x=>Number.isFinite(Number(x.outcome))).slice(-100);
  const brier=sample.length?sample.reduce((s,x)=>{const p=Number(x.predicted||0);const y=Number(x.outcome);return s+(p-y)**2},0)/sample.length:null;
  return {positive:Number(normalized[0].toFixed(3)),neutral:Number(normalized[1].toFixed(3)),negative:Number(normalized[2].toFixed(3)),calibrationSamples:sample.length,brierScore:brier===null?null:Number(brier.toFixed(4))};
}
