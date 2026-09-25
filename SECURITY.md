# Security Policy

Security fixes are applied to the current `main` branch.

Use GitHub Private Vulnerability Reporting / Security Advisories when possible. Do not publish credentials, private user content or working exploit details in a public issue.

- Keep credentials out of source code and `.env` files out of Git.
- Use synthetic data for demos.
- Keep dependencies and GitHub Actions current.
- Board data is stored in the browser. Imported JSON must be treated as untrusted data and rendered through React/React Markdown rather than raw HTML injection.
