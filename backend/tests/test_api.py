from uuid import uuid4

def test_health(client):
    assert client.get('/health').json()['status'] == 'ok'
    assert client.get('/ready').status_code == 200

def test_auth_required(client, payload):
    assert client.get('/api/v1/claims').status_code == 401
    assert client.post('/api/v1/claims', json=payload).status_code == 401
    assert client.get('/api/v1/claims', headers={'Authorization': 'Bearer forged-token'}).status_code == 401

def test_create_and_fetch_claim(client, auth, payload):
    response = client.post('/api/v1/claims', json=payload, headers=auth)
    assert response.status_code == 201
    claim = response.json()
    assert claim['status'] == 'SUBMITTED'
    assert 'tenant_id' not in claim and 'owner_id' not in claim
    assert client.get('/api/v1/claims/'+claim['id'], headers=auth).json() == claim
    assert claim['id'] in [c['id'] for c in client.get('/api/v1/claims', headers=auth).json()]

def test_validation_and_forged_identity(client, auth, payload):
    for invalid in ({'member_name': '   '}, {'vin': 'NOT-A-VIN'}, {'tenant_id': 'beta'},
                    {'owner_id': 'someone'}, {'role': 'admin'}, {'incident_date': '2099-01-01'}):
        assert client.post('/api/v1/claims', json=payload | invalid, headers=auth).status_code == 422
    assert client.get('/api/v1/claims/unknown', headers=auth).status_code == 404

def test_tenant_and_member_isolation(client, auth, payload):
    member = {'Authorization': 'Bearer test-member-alpha'}
    other = {'Authorization': 'Bearer test-other-alpha'}
    beta = {'Authorization': 'Bearer test-adjuster-beta'}
    claim = client.post('/api/v1/claims', headers=member, json=payload).json()
    for headers in (other, beta):
        assert claim['id'] not in [c['id'] for c in client.get('/api/v1/claims', headers=headers).json()]
        for suffix in ('', '/events'):
            assert client.get('/api/v1/claims/'+claim['id']+suffix, headers=headers).status_code == 404
        assert client.post('/api/v1/claims/'+claim['id']+'/transitions', headers=headers,
                           json={'target':'TRIAGE','expected_version':1,'reason':'Review intake'}).status_code in (403,404)
    assert client.get('/api/v1/claims/'+claim['id'], headers=auth).status_code == 200

def test_auditor_readonly(client, auth, payload):
    auditor = {'Authorization':'Bearer test-auditor-alpha'}
    claim = client.post('/api/v1/claims', headers=auth, json=payload).json()
    assert client.get('/api/v1/claims', headers=auditor).status_code == 200
    assert client.post('/api/v1/claims', headers=auditor, json=payload).status_code == 403
    assert client.post('/api/v1/claims/'+claim['id']+'/transitions', headers=auditor,
                       json={'target':'TRIAGE','expected_version':1,'reason':'Review intake'}).status_code == 403

def test_idempotent_creation(client, auth, payload):
    headers = auth | {'Idempotency-Key': str(uuid4())}
    first = client.post('/api/v1/claims', headers=headers, json=payload)
    second = client.post('/api/v1/claims', headers=headers, json=payload)
    assert first.status_code == second.status_code == 201
    assert first.json()['id'] == second.json()['id']
    assert client.post('/api/v1/claims', headers=headers, json=payload | {'location':'Another fictional road'}).status_code == 409
    assert len(client.get('/api/v1/claims/'+first.json()['id']+'/events', headers=auth).json()) == 1

def test_persistence_across_app_sessions(client, auth, payload):
    from fastapi.testclient import TestClient
    from app.main import app
    claim = client.post('/api/v1/claims', headers=auth, json=payload).json()
    with TestClient(app) as second:
        assert second.get('/api/v1/claims/'+claim['id'], headers=auth).json() == claim

def test_concurrent_idempotency(client, auth, payload):
    from concurrent.futures import ThreadPoolExecutor
    headers = auth | {'Idempotency-Key': str(uuid4())}
    with ThreadPoolExecutor(max_workers=2) as pool:
        results = list(pool.map(lambda _: client.post('/api/v1/claims',headers=headers,json=payload), range(2)))
    assert [r.status_code for r in results] == [201,201]
    assert results[0].json()['id'] == results[1].json()['id']

def test_auth_configuration_fails_closed(monkeypatch):
    import pytest
    from app.config import identities
    monkeypatch.delenv('DEMO_IDENTITIES_JSON',raising=False)
    monkeypatch.delenv('DEMO_IDENTITIES_FILE',raising=False)
    with pytest.raises(RuntimeError,match='Configure synthetic demo identities'):
        identities()
