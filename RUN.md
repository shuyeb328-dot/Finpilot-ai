# Run FinPilot AI 0.2

1. Install Node.js 20+.
2. Copy `.env.example` to `.env` and set `OWNER_TOKEN`.
3. Export environment variables (or use your process manager's secret store).
4. Run `npm start`.
5. Open `http://localhost:8787`.

Authenticated API requests need `x-owner-id: shuyeb328`; if `OWNER_TOKEN` is configured, also send `Authorization: Bearer <token>`.
