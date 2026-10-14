from fastapi.testclient import TestClient
from app.main import app
from app.workflow import Stage, can_transition

client = TestClient(app)

def test_workflow_matrix():
    assert can_transition(Stage.SUBMITTED, Stage.TRIAGE)
    assert not can_transition(Stage.SUBMITTED, Stage.CLOSED)
    assert not can_transition(Stage.CLOSED, Stage.TRIAGE)

def test_transition_and_audit():
    created = client.post("/api/v1/claims", json={
        "member_name": "Synthetic Member", "vehicle": "Demo Vehicle",
        "incident_summary": "Synthetic parking lot event"}).json()
    cid = created["id"]
    invalid = client.post(f"/api/v1/claims/{cid}/transitions", json={
        "target": "CLOSED", "expected_version": 1,
        "reason": "Not allowed", "actor": "demo-adjuster"})
    assert invalid.status_code == 422
    result = client.post(f"/api/v1/claims/{cid}/transitions", json={
        "target": "TRIAGE", "expected_version": 1,
        "reason": "Ready for triage", "actor": "demo-adjuster"})
    assert result.status_code == 200
    assert result.json()["version"] == 2
    stale = client.post(f"/api/v1/claims/{cid}/transitions", json={
        "target": "ASSESSMENT", "expected_version": 1,
        "reason": "Stale command", "actor": "demo-adjuster"})
    assert stale.status_code == 409
    events = client.get(f"/api/v1/claims/{cid}/events").json()
    assert [e["current"] for e in events] == ["SUBMITTED", "TRIAGE"]
    assert events[-1]["reason"] == "Ready for triage"

def test_unknown_claim_events():
    assert client.get("/api/v1/claims/does-not-exist/events").status_code == 404
