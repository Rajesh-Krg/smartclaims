from datetime import date, datetime
from sqlalchemy import Date, DateTime, ForeignKey, Index, Integer, String, Text, UniqueConstraint, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column
from .db import Base

class ClaimRecord(Base):
    __tablename__ = 'claims'
    __table_args__ = (
        UniqueConstraint('tenant_id','owner_id','idempotency_key', name='uq_claim_submission'),
        CheckConstraint('version >= 1', name='ck_claim_version'),
        CheckConstraint("status IN ('SUBMITTED','TRIAGE','ASSESSMENT','REPAIR_PLANNING','AUTHORIZATION_PENDING','REPAIR_IN_PROGRESS','REPAIR_COMPLETE','SETTLEMENT_REVIEW','CLOSED','ON_HOLD')", name='ck_claim_status'),
        Index('ix_claim_tenant_status', 'tenant_id', 'status'),
    )
    id: Mapped[str] = mapped_column(String(40), primary_key=True)
    tenant_id: Mapped[str] = mapped_column(String(100), index=True)
    owner_id: Mapped[str] = mapped_column(String(100))
    member_name: Mapped[str] = mapped_column(String(100))
    policy_reference: Mapped[str] = mapped_column(String(80))
    vehicle: Mapped[str] = mapped_column(String(120))
    vin: Mapped[str] = mapped_column(String(17))
    incident_date: Mapped[date] = mapped_column(Date)
    location: Mapped[str] = mapped_column(String(200))
    incident_summary: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(40))
    version: Mapped[int] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    idempotency_key: Mapped[str | None] = mapped_column(String(100), nullable=True)
    payload_hash: Mapped[str] = mapped_column(String(64))

class ClaimEvent(Base):
    __tablename__ = 'claim_events'
    __table_args__ = (UniqueConstraint('claim_id','version', name='uq_event_version'),)
    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    claim_id: Mapped[str] = mapped_column(ForeignKey('claims.id'), index=True)
    previous: Mapped[str | None] = mapped_column(String(40), nullable=True)
    current: Mapped[str] = mapped_column(String(40))
    actor: Mapped[str] = mapped_column(String(100))
    reason: Mapped[str] = mapped_column(String(1000))
    occurred_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    version: Mapped[int] = mapped_column(Integer)
