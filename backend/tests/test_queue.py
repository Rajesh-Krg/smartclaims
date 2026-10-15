"""Regression tests for bounded claims queue and access isolation."""
from uuid import uuid4

def create(client, headers, payload, **changes):
    result = client.post("/api/v1/claims", headers=headers, json=payload | changes)
    assert result.status_code == 201, result.text
    return result.json()

def test_queue_requires_auth(client):
    assert client.get("/api/v1/claims-page").status_code == 401

def test_queue_pages_filters_and_sort(client, auth, payload):
    marker = uuid4().hex[:12]
    a = create(client, auth, payload, member_name=f"Queue {marker} A")
    b = create(client, auth, payload, member_name=f"Queue {marker} B")
    result = client.get("/api/v1/claims-page", headers=auth,
                        params={"q": marker, "page_size": 1, "page": 1})
    assert result.status_code == 200
    body = result.json()
    assert body["total"] == 2 and body["pages"] == 2
    assert len(body["items"]) == 1
    other = client.get("/api/v1/claims-page", headers=auth,
                       params={"q": marker, "page_size": 1, "page": 2}).json()
    assert {body["items"][0]["id"], other["items"][0]["id"]} == {a["id"], b["id"]}
    assert client.get("/api/v1/claims-page", headers=auth,
                      params={"q": marker, "status": "CLOSED"}).json()["total"] == 0
    assert client.get("/api/v1/claims-page", headers=auth,
                      params={"q": marker, "sort": "oldest"}).status_code == 200

def test_queue_isolation_and_literal_wildcards(client, auth, payload):
    marker = uuid4().hex[:12]
    create(client, auth, payload, member_name=f"Adjuster {marker}")
    member = {"Authorization": "Bearer test-member-alpha"}
    own = create(client, member, payload, member_name=f"Member {marker}")
    other = {"Authorization": "Bearer test-other-alpha"}
    beta = {"Authorization": "Bearer test-adjuster-beta"}
    assert client.get("/api/v1/claims-page", headers=member,
                      params={"q": marker}).json()["items"][0]["id"] == own["id"]
    assert client.get("/api/v1/claims-page", headers=other,
                      params={"q": marker}).json()["total"] == 0
    assert client.get("/api/v1/claims-page", headers=beta,
                      params={"q": marker}).json()["total"] == 0
    for wildcard in ("%", "_"):
        assert client.get("/api/v1/claims-page", headers=auth,
                          params={"q": wildcard}).json()["total"] == 0

def test_queue_validation(client, auth):
    for params in ({"page": 0}, {"page_size": 0}, {"page_size": 101},
                   {"sort": "unsupported"}, {"status": "UNKNOWN"}):
        assert client.get("/api/v1/claims-page", headers=auth, params=params).status_code == 422
