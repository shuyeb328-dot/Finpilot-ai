export const TIMEFRAMES={
  TICK:{seconds:5,role:'observe',description:'ingest fresh quotes/events; no trading action'},
  MINUTE_1:{seconds:60,role:'observe',description:'refresh market state and anomaly signals'},
  MINUTE_15:{seconds:900,role:'reassess',description:'rerun agent debate when material inputs change'},
  HOUR_1:{seconds:3600,role:'adapt',description:'re-score forecasts, risk and portfolio state'},
  DAY_1:{seconds:86400,role:'learn',description:'resolve due forecasts, update agent trust and lessons'},
  WEEK_1:{seconds:604800,role:'review',description:'review strategy, drift, calibration and governance'}
};
export function dueTimeframes(lastRunMs=0,now=Date.now()){return Object.entries(TIMEFRAMES).filter(([,x])=>now-lastRunMs>=x.seconds*1000).map(([name,x])=>({name,...x}));}
