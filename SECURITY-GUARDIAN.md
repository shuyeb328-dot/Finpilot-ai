# Security Guardian

FinPilot includes a defensive Security Guardian that runs on the server.

## Automatic protections
- Request-rate limiting per client.
- Temporary blocking after repeated authentication failures.
- Maximum request-body size to reduce resource-exhaustion attacks.
- Hardened response headers: CSP, frame denial, MIME sniffing protection, referrer and permissions policies.
- Periodic security posture scans.
- Security events for rate-limit and authentication blocks.
- Owner-token recovery/rotation remains server-side.
- Provider/API secrets remain server-side and are never bundled in the APK.

## Safe self-improvement boundary
The Guardian may automatically apply bounded defensive controls such as throttling and temporary blocking. It does **not** download or execute arbitrary code, rewrite its own security logic, or silently deploy unreviewed software. Production upgrades should be signed, tested, reviewed, and deployed through the release pipeline.

## Production requirements
Use HTTPS/TLS, a trusted reverse proxy/WAF, strong owner credentials, separate production secrets, encrypted backups, dependency scanning, signed releases, and monitoring. No software can honestly guarantee that it is impossible to hack; the goal is layered prevention, detection, containment, recovery, and rapid patching.
