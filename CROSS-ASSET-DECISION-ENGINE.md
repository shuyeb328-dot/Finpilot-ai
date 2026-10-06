# Cross-Asset Decision Engine

FinPilot compares business, equities, bonds, funds, crypto, commodities, FX and real estate inside one risk framework.

## Portfolio questions
- Where should the next unit of capital go?
- What is the marginal expected return per unit of risk?
- What improves diversification?
- What happens under recession, inflation, rate shock, liquidity shock, currency shock or market crash?
- Which assets compete for the same capital?
- What is the opportunity cost of holding cash?

## Common output
```json
{
  "decision": "APPROVE|REVIEW|REJECT|INSUFFICIENT_EVIDENCE",
  "positiveProbability": 0.0,
  "neutralProbability": 0.0,
  "negativeProbability": 0.0,
  "expectedReturn": 0.0,
  "expectedDownside": 0.0,
  "riskReward": 0.0,
  "confidence": 0.0,
  "liquidityRisk": 0.0,
  "concentrationRisk": 0.0,
  "dataFreshness": "timestamp",
  "evidence": [],
  "assumptions": [],
  "approvalGate": "human|required|automatic"
}
```

Probabilities must be calibrated against historical performance and validated models where sufficient data exists. Otherwise the engine labels them as model estimates rather than facts.
