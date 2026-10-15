import json
import os

os.environ['DATABASE_URL'] = os.environ.get('TEST_DATABASE_URL', 'postgresql+psycopg://smartclaims:synthetic-local-only@127.0.0.1:5432/smartclaims_test')
os.environ['DEMO_IDENTITIES_JSON'] = json.dumps({
    'test-adjuster-alpha': {'subject': 'adjuster-a', 'tenant': 'alpha', 'role': 'adjuster'},
    'test-adjuster-beta': {'subject': 'adjuster-b', 'tenant': 'beta', 'role': 'adjuster'},
    'test-member-alpha': {'subject': 'member-a', 'tenant': 'alpha', 'role': 'policyholder'},
    'test-other-alpha': {'subject': 'member-b', 'tenant': 'alpha', 'role': 'policyholder'},
    'test-auditor-alpha': {'subject': 'audit-a', 'tenant': 'alpha', 'role': 'auditor'},
})

import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

@pytest.fixture
def auth():
    return {'Authorization': 'Bearer test-adjuster-alpha'}

@pytest.fixture
def payload():
    return {'member_name': 'Morgan Example', 'policy_reference': 'SYN-10001',
            'vehicle': '2023 Toyota Camry', 'vin': '1HGCM82633A004352',
            'incident_date': '2026-10-01', 'location': 'Fictional Lake Street',
            'incident_summary': 'Synthetic parked vehicle damage'}
