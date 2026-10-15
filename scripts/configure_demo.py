#!/usr/bin/env python3
"""Create private synthetic-only credentials. Never overwrite existing setup."""
import json
import os
import secrets
from pathlib import Path

root = Path(__file__).resolve().parents[1]
work = root / 'work'
work.mkdir(exist_ok=True)
identity_file = work / 'demo-identities.json'
env_file = root / '.env'
if identity_file.exists() or env_file.exists():
    raise SystemExit('Existing configuration preserved. Inspect .env and work/demo-identities.json locally.')
identities = {}
for subject, tenant, role in [('demo-adjuster','synthetic-insurance','adjuster'),
                              ('demo-member','synthetic-insurance','policyholder'),
                              ('demo-auditor','synthetic-insurance','auditor'),
                              ('other-adjuster','other-insurance','adjuster')]:
    identities[secrets.token_urlsafe(32)] = dict(subject=subject, tenant=tenant, role=role)
identity_file.write_text(json.dumps(identities, indent=2)+'\n')
identity_file.chmod(0o600)
password = secrets.token_urlsafe(24)
env_file.write_text(f'POSTGRES_PASSWORD={password}\nDATABASE_URL=postgresql+psycopg://smartclaims:{password}@127.0.0.1:5432/smartclaims\nDEMO_IDENTITIES_FILE={Path(os.environ.get('HOST_PROJECT_ROOT', str(root))) / 'work' / 'demo-identities.json'}\n')
with env_file.open('a') as stream:
    stream.write(f'LOCAL_UID={os.getuid()}\nLOCAL_GID={os.getgid()}\n')
env_file.chmod(0o600)
print('Private configuration created in .env and work/demo-identities.json. No tokens printed.')
print('Open the identity file locally and use the token whose subject is demo-adjuster.')
