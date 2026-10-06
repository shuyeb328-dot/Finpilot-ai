# FinPilot Decision Kernel

Every material decision follows the same pipeline:

INTENT -> DATA -> EVIDENCE -> THESIS -> VALUATION -> SCENARIOS -> PROBABILITY -> RISK -> COUNTERARGUMENT -> ROUND TABLE -> CEO JUDGE -> APPROVAL GATE -> ACTION -> MONITOR -> OUTCOME -> LEARNING.

Required output fields:
- decision_id, timestamp, owner, scope
- recommendation: PROMOTE | PROCEED_WITH_LIMITS | WATCH | REJECT | INSUFFICIENT_EVIDENCE | HUMAN_APPROVAL_REQUIRED
- probability_positive/neutral/negative
- expected_return, expected_downside, risk_reward
- valuation_low/base/high and methodology
- liquidity, concentration, leverage, counterparty, regulatory and operational risks
- evidence list with source, retrieval time, freshness, verification state
- dissenting arguments and strongest reason to reject
- assumptions, missing information, sensitivity and stress results
- approval level, limits, expiry time and audit trail

The kernel never guarantees profit or zero errors. It must abstain when evidence is inadequate, contradictory or stale.
