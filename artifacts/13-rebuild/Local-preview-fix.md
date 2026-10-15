# Mac local preview access

The original verified loopback URL belonged to the cloud executor. It was not a URL the user could open on their Mac. This fix supplies a Docker-only local launcher rather than requiring the user to install Node/Python or copy source between tools.

With Docker Desktop running, execute `bash scripts/start-local.sh` from the repository root. The launcher:

1. Checks Docker and Compose availability.
2. Generates private synthetic configuration using a Python container, preserving existing configuration.
3. Builds/starts PostgreSQL, API and web, with bounded readiness checks.
4. Seeds 12 fictional claims using Python standard-library HTTP inside the API container.
5. On macOS, pipes the synthetic adjuster token directly to pbcopy without printing it or putting it in a browser URL.
6. Opens http://localhost:5173 on the user's Mac. Paste the token with Command-V and choose Open workspace.

Stop with `docker compose -p smartclaims-local down`; data remains in the named database volume. Alternate ports are supported through SMARTCLAIMS_DB_PORT, SMARTCLAIMS_API_PORT and SMARTCLAIMS_WEB_PORT. Missing/partial credentials and unavailable Docker produce actionable errors without overwriting files.

Verification: shell syntax and whitespace checks; fresh configuration generated in Docker with correct host path and mode-0600 credentials; full launcher built and started an isolated stack on ports 5434/8011/5175; readiness and frontend HTTP 200; container seeding succeeded after removing an unavailable httpx dependency. Existing real Chromium acceptance suite exercises the resulting stack. The macOS pbcopy/open branches require execution on the user's Mac; this cloud Linux environment cannot open a window on their computer. The root README now leads with the exact local launch command and fresh-clone instructions.

Result: all 4 Chromium acceptance workflows passed against the launcher-created stack (8.6 seconds). This verifies actual navigation, FNOL submission, persistent claims/timeline, mobile workflow, auditor access and API retry through that stack.
