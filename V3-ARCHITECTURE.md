# FinPilot AI v3.0

v3.0 is the first consolidated service baseline. It adds a Decision Kernel, eight executive divisions, auditable decisions, provider status, live-market adapter routing, a Watchtower event stream, and API endpoints designed for a mobile client.

## Decision flow
DATA -> EVIDENCE -> VALUATION -> SIMULATION -> AGENT ANALYSIS -> CROSS-EXAMINATION -> RED TEAM -> PROBABILITY -> RISK -> CEO APPROVAL -> AUDIT -> WATCHTOWER

## Safety
- No client-side provider secrets.
- Live data must retain source/timestamp metadata in production adapters.
- High-risk or contradictory evidence requires rejection or human approval.
- Probabilities are model outputs, not guarantees.
