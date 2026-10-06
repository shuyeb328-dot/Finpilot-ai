# FinPilot Security & Trust Division — v1210

FinPilot now uses a dedicated security organization rather than one general-purpose security agent.

## Company structure

CEO / Final Decision AI
- CFO & Financial Intelligence AI
- Investment & Valuation AI
- Risk & Security AI
- Markets & Macro AI
- Business & Strategy AI
- Assets & Real-World AI
- Compliance, Tax & Governance AI
- **Security & Trust Division**
  - Security Director AI
  - Application Security AI
  - Identity & Access AI
  - Mobile Integrity AI
  - Data & Secrets AI
  - Infrastructure Defense AI
  - Threat Intelligence AI
  - Incident Response AI

The Security & Trust Division is independent enough to challenge other divisions and reports material incidents to the CEO/Governance layer.

## Defensive operating loop

OBSERVE → CORRELATE → VERIFY → CONTAIN → ROTATE/RECOVER → PATCH THROUGH TESTED RELEASE → VERIFY → LEARN

The security agents are defensive-only. They do not perform unauthorized intrusion, exploitation, credential theft, or destructive actions. Production credential revocation, data deletion, code deployment, and any real-money execution remain human-approved actions.

## APIs

- `GET /api/security/org` — organization and agent roster
- `GET /api/security/status` — current security posture
- `GET /api/security/incidents` — recent incidents
- `GET /api/security/findings` — security findings
- `POST /api/security/scan` — run the Guardian plus Security Division review
- `POST /api/security/incident` — record an owner-authorized defensive incident
