# CEO Decision Protocol

## Input
The CEO receives one normalized Decision Packet:
- objective and decision type
- verified evidence and source timestamps
- current price/market data where available
- financial model
- valuation range and methodology
- probability distribution
- expected return and expected downside
- risk/reward ratio
- stress-test results
- liquidity and concentration impact
- tax/compliance constraints
- disagreements between agents
- missing evidence

## Round table
1. All 8 major divisions submit independent conclusions.
2. Evidence Controller flags unsupported claims.
3. Valuation Controller challenges assumptions.
4. Risk Controller attacks the proposal with downside scenarios.
5. Probability Controller recalibrates probabilities.
6. Each division may revise its position.
7. Decision Controller checks hard rules.
8. CEO synthesizes the surviving evidence and dissent.

## CEO output
```json
{
  "decision": "PROMOTE|PROCEED_WITH_LIMITS|WATCH|REJECT|INSUFFICIENT_EVIDENCE|HUMAN_APPROVAL_REQUIRED",
  "probability_positive": 0,
  "probability_neutral": 0,
  "probability_negative": 0,
  "expected_return": 0,
  "expected_downside": 0,
  "risk_reward": 0,
  "confidence": 0,
  "position_limit": 0,
  "time_horizon": "",
  "top_reasons": [],
  "key_risks": [],
  "dissenting_views": [],
  "missing_evidence": [],
  "approval_required": false,
  "audit_id": ""
}
```

## Hard stop rules
- Missing critical evidence → INSUFFICIENT_EVIDENCE.
- Material source conflict not resolved → INSUFFICIENT_EVIDENCE.
- Stale data presented as current → reject the current-data claim.
- Risk limit breach → HUMAN_APPROVAL_REQUIRED or REJECT.
- Valuation cannot be independently challenged → no PROMOTE.
- Probability must express uncertainty; it is never a guarantee.

PROMOTE means the proposal passes the defined decision gates and is recommended for the next authorized action. It does not mean guaranteed profit.
