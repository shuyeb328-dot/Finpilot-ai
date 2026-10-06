# Autonomous Observe → Debate → Paper Execute → Measure → Learn → Adapt

FinPilot's autonomous mode is a closed-loop research and paper-trading system. It can observe live provider data, run the 8 executive agents, record probabilistic forecasts, simulate/paper-execute decisions, resolve forecasts when outcomes become known, and update agent calibration/trust.

## Timeframes
- Tick/1m: observation and anomaly detection.
- 15m: reassessment when material evidence changes.
- 1h: risk/forecast refresh.
- 1d: outcome resolution and learning.
- 1w: strategy and calibration review.

## Agent learning
Each forecast is stored with agent ID, probability, asset, horizon and feature context. Once an outcome is known, Brier score and directional accuracy are updated. Agent influence should be adjusted from measured calibration, not from self-declared confidence.

## Market data
The live market adapter uses configured providers. Alpha Vantage documents stocks, ETFs, funds, crypto, FX, commodities, economic indicators and news/sentiment, with freshness depending on entitlement. SEC EDGAR provides public filing/submission and XBRL APIs without API keys. The application must label delayed data as delayed and never claim a feed is real-time unless the provider entitlement supports it.

## Execution boundary
Autonomous execution is **PAPER ONLY**. No broker order is submitted by this module. Real-money execution requires a separate broker connector, explicit human approval, broker permissions, compliance controls and a kill switch.

## No fake learning
The system never rewrites historical forecasts to make an agent look better. Outcomes are append-only, auditable, and used to compute calibration/trust.
