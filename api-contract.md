# Initial API contract

POST /v1/auth/login
POST /v1/chat
POST /v1/voice/session
POST /v1/research
GET  /v1/dashboard
GET  /v1/net-worth
GET  /v1/portfolio
POST /v1/scenarios
POST /v1/risk/analyze
GET  /v1/knowledge/sources
POST /v1/consents
GET  /v1/audit-log

Admin-only:
GET/POST /v1/admin/knowledge
GET/POST /v1/admin/providers
GET /v1/admin/usage
GET /v1/admin/audit
POST /v1/admin/emergency-lock
