"""Synthetic-data-only SmartClaims API prototype; not production claims handling."""
from datetime import datetime, timezone
from threading import Lock
from uuid import uuid4
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="SmartClaims API", version="0.1.0",
              description="Local prototype using synthetic data only.")
_lock = Lock()

class ClaimCreate(BaseModel):
    member_name: str = Field(min_length=1, max_length=100)
    vehicle: str = Field(min_length=1, max_length=120)
    incident_summary: str = Field(min_length=1, max_length=2000)

class Claim(ClaimCreate):
    id: str
    status: str
    created_at: datetime

_claims: dict[str, Claim] = {}

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
                  status="SUBMITTED", created_at=datetime.now(timezone.utc))
    with _lock:
        _claims[claim.id] = claim
    return claim

@app.get("/api/v1/claims/{claim_id}", response_model=Claim)
def get_claim(claim_id: str):
    with _lock:
        claim = _claims.get(claim_id)
    if claim is None:
        raise HTTPException(status_code=404, detail="Claim not found")
    return claim
