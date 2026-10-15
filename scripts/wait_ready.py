"""Bounded service readiness for local/CI startup; exits nonzero on failure."""
import time
import urllib.request
for attempt in range(30):
    try:
        for url in ('http://127.0.0.1:8000/ready','http://127.0.0.1:5173'):
            with urllib.request.urlopen(url, timeout=1) as response:
                assert response.status == 200
        print('API/database and frontend ready')
        break
    except Exception:
        if attempt == 29:
            raise SystemExit('Services not ready after 30 checks; inspect work/api.log and work/web.log')
        time.sleep(1)
