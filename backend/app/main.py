"""SmartClaims synthetic demo API. NEVER expose publicly without authentication."""
from datetime import datetime, timezone
from threading import Lock
from uuid import uuid4
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from .workflow import Stage, TransitionRequest, can_transition

app = FastAPI(title="SmartClaims API", version="0.2.0",
              description="Unauthenticated local prototype using synthetic data only.")
_lock = Lock()

class ClaimCreate(BaseModel):
    member_name: str = Field(min_length=1, max_length=100)
    vehicle: str = Field(min_length=1, max_length=120)
    incident_summary: str = Field(min_length=1, max_length=2000)

class Claim(ClaimCreate):
    id: str
    status: Stage
    version: int
    created_at: datetime

class StageEvent(BaseModel):
    id: str
    claim_id: str
    previous: Stage | None
    current: Stage
    actor: str
    reason: str
    occurred_at: datetime
    version: int

_claims: dict[str, Claim] = {}
_events: dict[str, list[StageEvent]] = {}

@app.get("/health")
def health():
    return {"status": "ok", "environment": "synthetic-demo"}

@app.get("/api/v1/claims", response_model=list[Claim])
def list_claims():
    with _lock:
        return list(_claims.values())

@app.post("/api/v1/claims", response_model=Claim, status_code=201)
def create_claim(data: ClaimCreate):
    claim = Claim(**data.model_dump(), id="DEMO-" + uuid4().hex[:12].upper(),
                  status=Stage.SUBMITTED, version=1,
                  created_at=datetime.now(timezone.utc))
    event = StageEvent(id=str(uuid4()), claim_id=claim.id, previous=None,
                       current=claim.status, actor="demo-member", reason="FNOL submitted",
                       occurred_at=claim.created_at, version=1)
    with _lock:
        _claims[claim.id] = claim
        _events[claim.id] = [event]
    return claim

@app.get("/api/v1/claims/{claim_id}", response_model=Claim)
def get_claim(claim_id: str):
    with _lock:
        claim = _claims.get(claim_id)
    if claim is None:
        raise HTTPException(status_code=404, detail="Claim not found")
    return claim

@app.get("/api/v1/claims/{claim_id}/events", response_model=list[StageEvent])
def get_events(claim_id: str):
    with _lock:
        if claim_id not in _claims:
            raise HTTPException(status_code=404, detail="Claim not found")
        return list(_events[claim_id])

@app.post("/api/v1/claims/{claim_id}/transitions", response_model=Claim)
def transition_claim(claim_id: str, data: TransitionRequest):
    with _lock:
        claim = _claims.get(claim_id)
        if claim is None:
            raise HTTPException(status_code=404, detail="Claim not found")
        if claim.version != data.expected_version:
            raise HTTPException(status_code=409, detail="Claim version conflict")
        if not can_transition(claim.status, data.target):
            raise HTTPException(status_code=422, detail="Transition not allowed")
        previous = claim.status
        updated = claim.model_copy(update={"status": data.target, "version": claim.version + 1})
        event = StageEvent(id=str(uuid4()), claim_id=claim_id, previous=previous,
                           current=data.target, actor=data.actor, reason=data.reason,
                           occurred_at=datetime.now(timezone.utc), version=updated.version)
        _claims[claim_id] = updated
        _events[claim_id].append(event)
        return updated
