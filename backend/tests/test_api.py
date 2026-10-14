from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["environment"] == "synthetic-demo"

def test_create_and_fetch_claim():
    payload = {"member_name": "Demo Person", "vehicle": "Demo Vehicle", "incident_summary": "Synthetic incident"}
    created = client.post("/api/v1/claims", json=payload)
    assert created.status_code == 201
    assert created.json()["status"] == "SUBMITTED"
    fetched = client.get("/api/v1/claims/" + created.json()["id"])
    assert fetched.status_code == 200
    assert fetched.json()["member_name"] == "Demo Person"

def test_validation_and_not_found():
    assert client.post("/api/v1/claims", json={"member_name": "", "vehicle": "X", "incident_summary": "Y"}).status_code == 422
    assert client.get("/api/v1/claims/unknown").status_code == 404
