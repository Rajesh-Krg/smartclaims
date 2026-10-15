from app.workflow import Stage, can_transition

def test_workflow_matrix():
    assert can_transition(Stage.SUBMITTED, Stage.TRIAGE)
    assert not can_transition(Stage.SUBMITTED, Stage.CLOSED)
    assert not can_transition(Stage.CLOSED, Stage.TRIAGE)

def test_transition_and_audit(client, auth, payload):
    claim = client.post('/api/v1/claims', headers=auth, json=payload).json()
    path = '/api/v1/claims/'+claim['id']
    command = {'target':'TRIAGE', 'expected_version':1, 'reason':'Ready for triage'}
    assert client.post(path+'/transitions', headers=auth, json=command | {'actor':'forged'}).status_code == 422
    assert client.post(path+'/transitions', headers=auth, json=command | {'target':'CLOSED'}).status_code == 422
    updated = client.post(path+'/transitions', headers=auth, json=command)
    assert updated.status_code == 200
    assert updated.json()['version'] == 2
    assert client.post(path+'/transitions', headers=auth, json=command | {'target':'ASSESSMENT'}).status_code == 409
    events = client.get(path+'/events', headers=auth).json()
    assert [e['current'] for e in events] == ['SUBMITTED','TRIAGE']
    assert events[-1]['actor'] == 'adjuster-a'
    assert events[-1]['reason'] == 'Ready for triage'

def test_member_cannot_transition(client, payload):
    headers = {'Authorization':'Bearer test-member-alpha'}
    claim = client.post('/api/v1/claims', headers=headers, json=payload).json()
    assert client.post('/api/v1/claims/'+claim['id']+'/transitions', headers=headers,
                       json={'target':'TRIAGE','expected_version':1,'reason':'Intake review'}).status_code == 403

def test_consequential_transition_unavailable(client, auth, payload):
    claim = client.post('/api/v1/claims', headers=auth, json=payload).json()
    for version, target in enumerate(['TRIAGE','ASSESSMENT','REPAIR_PLANNING','AUTHORIZATION_PENDING'], 1):
        assert client.post('/api/v1/claims/'+claim['id']+'/transitions', headers=auth,
                           json={'target':target,'expected_version':version,'reason':'Synthetic human review'}).status_code == 200
    assert client.post('/api/v1/claims/'+claim['id']+'/transitions', headers=auth,
                       json={'target':'REPAIR_IN_PROGRESS','expected_version':5,'reason':'Try approval bypass'}).status_code == 422

def test_concurrent_transition_has_one_event(client, auth, payload):
    from concurrent.futures import ThreadPoolExecutor
    claim = client.post('/api/v1/claims',headers=auth,json=payload).json()
    path = '/api/v1/claims/'+claim['id']
    command = {'target':'TRIAGE','expected_version':1,'reason':'Concurrent synthetic review'}
    with ThreadPoolExecutor(max_workers=2) as pool:
        results = list(pool.map(lambda _: client.post(path+'/transitions',headers=auth,json=command),range(2)))
    assert sorted(r.status_code for r in results) == [200,409]
    assert len(client.get(path+'/events',headers=auth).json()) == 2
