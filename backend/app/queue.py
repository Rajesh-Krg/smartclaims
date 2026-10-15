"""Bounded, tenant-scoped claim queue queries.

The existing /claims endpoint remains for backward compatibility in Milestone 1.
This module provides the server-side contract for the next UI increment.
"""
from typing import Literal
from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel, Field
from sqlalchemy import func, select
from sqlalchemy.orm import Session
from .auth import principal
from .config import Principal
from .db import session
from .models import ClaimRecord
from .schemas import Claim
from .workflow import Stage

router = APIRouter(prefix="/api/v1", tags=["Claims queue"])

class ClaimPage(BaseModel):
    items: list[Claim]
    total: int = Field(ge=0)
    page: int = Field(ge=1)
    page_size: int = Field(ge=1, le=100)
    pages: int = Field(ge=0)

@router.get("/claims-page", response_model=ClaimPage)
def list_claims_page(
    page: int = Query(default=1, ge=1, le=100000),
    page_size: int = Query(default=20, ge=1, le=100),
    status: Stage | None = None,
    q: str | None = Query(default=None, min_length=1, max_length=100),
    sort: Literal["newest", "oldest"] = "newest",
    user: Principal = Depends(principal),
    db: Session = Depends(session),
):
    filters = [ClaimRecord.tenant_id == user.tenant]
    if user.role == "policyholder":
        filters.append(ClaimRecord.owner_id == user.subject)
    if status is not None:
        filters.append(ClaimRecord.status == status.value)
    if q is not None:
        # Treat wildcard characters as literal input, not SQL LIKE operators.
        escaped = q.strip().replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
        if escaped:
            filters.append(
                ClaimRecord.id.ilike(f"%{escaped}%", escape="\\")
                | ClaimRecord.member_name.ilike(f"%{escaped}%", escape="\\")
                | ClaimRecord.vehicle.ilike(f"%{escaped}%", escape="\\")
                | ClaimRecord.policy_reference.ilike(f"%{escaped}%", escape="\\")
            )
    total = db.scalar(select(func.count()).select_from(ClaimRecord).where(*filters)) or 0
    ordering = ClaimRecord.created_at.desc() if sort == "newest" else ClaimRecord.created_at.asc()
    items = db.scalars(
        select(ClaimRecord).where(*filters).order_by(ordering, ClaimRecord.id)
        .limit(page_size).offset((page - 1) * page_size)
    ).all()
    return ClaimPage(items=items, total=total, page=page, page_size=page_size,
                     pages=(total + page_size - 1) // page_size)
