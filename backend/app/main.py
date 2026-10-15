"""Synthetic-only, tenant-scoped claims API. OIDC is a later milestone."""
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from hashlib import sha256
from uuid import uuid4
from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy import select, text, update
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session
from .auth import principal, operator
from .config import Principal, identities
from .db import engine, session
from .models import ClaimRecord, ClaimEvent
from .schemas import Claim, ClaimCreate, StageEvent
from .workflow import Stage, TransitionRequest, can_transition
from .queue import router as queue_router

@asynccontextmanager
async def lifespan(app):
    identities()  # fail closed if credentials were not explicitly configured
    yield

app = FastAPI(title='SmartClaims synthetic API', version='1.0.0', lifespan=lifespan)
app.include_router(queue_router)

@app.exception_handler(RequestValidationError)
async def validation_error(request, exc):
    # Do not echo submitted personal fields or bearer tokens into errors.
    return JSONResponse(status_code=422, content={'detail': 'Invalid request: ' + '; '.join(
        '.'.join(str(x) for x in e['loc']) + ': ' + e['msg'] for e in exc.errors())})

@app.middleware('http')
async def security_headers(request, call_next):
    response = await call_next(request)
    response.headers['Cache-Control'] = 'no-store'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    return response

@app.get('/health')
def health():
    return {'status':'ok', 'environment':'synthetic-demo'}

@app.get('/ready')
def ready():
    try:
        with engine.connect() as connection:
            connection.execute(text('SELECT 1 FROM claims LIMIT 1'))
        return {'status':'ready'}
    except SQLAlchemyError:
        raise HTTPException(503, 'Database or migrations unavailable')

@app.get('/api/v1/me', response_model=Principal)
def me(user: Principal = Depends(principal)):
    return user

def scoped(user):
    query = select(ClaimRecord).where(ClaimRecord.tenant_id == user.tenant)
    if user.role == 'policyholder':
        query = query.where(ClaimRecord.owner_id == user.subject)
    return query

def find(db, user, claim_id):
    claim = db.scalar(scoped(user).where(ClaimRecord.id == claim_id))
    if not claim:
        raise HTTPException(404, 'Claim not found')
    return claim

@app.get('/api/v1/claims', response_model=list[Claim])
def list_claims(user: Principal = Depends(principal), db: Session = Depends(session)):
    return db.scalars(scoped(user).order_by(ClaimRecord.created_at.desc(), ClaimRecord.id)).all()

@app.post('/api/v1/claims', response_model=Claim, status_code=201)
def create_claim(data: ClaimCreate, user: Principal = Depends(principal), db: Session = Depends(session),
                 key: str | None = Header(default=None, alias='Idempotency-Key', min_length=1, max_length=100)):
    if user.role not in ('policyholder','adjuster'):
        raise HTTPException(403, 'Claim submission permission required')
    digest = sha256(data.model_dump_json().encode()).hexdigest()
    def existing():
        return db.scalar(select(ClaimRecord).where(ClaimRecord.tenant_id == user.tenant,
            ClaimRecord.owner_id == user.subject, ClaimRecord.idempotency_key == key))
    def replay(previous):
        if previous.payload_hash != digest:
            raise HTTPException(409, 'Idempotency key already used for a different submission')
        return previous
    if key and (previous := existing()):
        return replay(previous)
    now = datetime.now(timezone.utc)
    claim = ClaimRecord(**data.model_dump(), id='SC-'+uuid4().hex.upper(), tenant_id=user.tenant,
                        owner_id=user.subject, status=Stage.SUBMITTED, version=1, created_at=now,
                        idempotency_key=key, payload_hash=digest)
    try:
        db.add(claim)
        db.flush()
        db.add(ClaimEvent(id=str(uuid4()), claim_id=claim.id, previous=None, current=claim.status,
                         actor=user.subject, reason='Synthetic FNOL submitted', occurred_at=now, version=1))
        db.commit()
    except IntegrityError:
        db.rollback()
        if key and (previous := existing()):
            return replay(previous)
        raise
    return claim

@app.get('/api/v1/claims/{claim_id}', response_model=Claim)
def get_claim(claim_id: str, user: Principal = Depends(principal), db: Session = Depends(session)):
    return find(db, user, claim_id)

@app.get('/api/v1/claims/{claim_id}/events', response_model=list[StageEvent])
def get_events(claim_id: str, user: Principal = Depends(principal), db: Session = Depends(session)):
    find(db, user, claim_id)
    return db.scalars(select(ClaimEvent).where(ClaimEvent.claim_id == claim_id).order_by(ClaimEvent.version)).all()

SAFE_TARGETS = {Stage.TRIAGE, Stage.ASSESSMENT, Stage.REPAIR_PLANNING, Stage.AUTHORIZATION_PENDING}

@app.post('/api/v1/claims/{claim_id}/transitions', response_model=Claim)
def transition_claim(claim_id: str, data: TransitionRequest, user: Principal = Depends(operator), db: Session = Depends(session)):
    claim = find(db, user, claim_id)
    if claim.version != data.expected_version:
        raise HTTPException(409, 'Claim version conflict; refresh before retrying')
    if data.target not in SAFE_TARGETS or not can_transition(Stage(claim.status), data.target):
        raise HTTPException(422, 'Transition unavailable in this milestone')
    previous = claim.status
    changed = db.execute(update(ClaimRecord).where(ClaimRecord.id == claim_id,
        ClaimRecord.tenant_id == user.tenant, ClaimRecord.version == data.expected_version)
        .values(status=data.target, version=data.expected_version+1).execution_options(synchronize_session=False))
    if changed.rowcount != 1:
        db.rollback()
        raise HTTPException(409, 'Claim version conflict; refresh before retrying')
    db.add(ClaimEvent(id=str(uuid4()), claim_id=claim_id, previous=previous, current=data.target,
        actor=user.subject, reason=data.reason, occurred_at=datetime.now(timezone.utc), version=data.expected_version+1))
    db.commit()
    db.refresh(claim)
    return claim
