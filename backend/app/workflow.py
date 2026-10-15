"""Explicit claims lifecycle; synthetic prototype only."""
from enum import Enum
from pydantic import BaseModel, Field, ConfigDict

class Stage(str, Enum):
    SUBMITTED = "SUBMITTED"
    TRIAGE = "TRIAGE"
    ASSESSMENT = "ASSESSMENT"
    REPAIR_PLANNING = "REPAIR_PLANNING"
    AUTHORIZATION_PENDING = "AUTHORIZATION_PENDING"
    REPAIR_IN_PROGRESS = "REPAIR_IN_PROGRESS"
    REPAIR_COMPLETE = "REPAIR_COMPLETE"
    SETTLEMENT_REVIEW = "SETTLEMENT_REVIEW"
    CLOSED = "CLOSED"
    ON_HOLD = "ON_HOLD"

ALLOWED = {
    Stage.SUBMITTED: {Stage.TRIAGE, Stage.ON_HOLD},
    Stage.TRIAGE: {Stage.ASSESSMENT, Stage.ON_HOLD},
    Stage.ASSESSMENT: {Stage.REPAIR_PLANNING, Stage.ON_HOLD},
    Stage.REPAIR_PLANNING: {Stage.AUTHORIZATION_PENDING, Stage.ON_HOLD},
    Stage.AUTHORIZATION_PENDING: {Stage.REPAIR_IN_PROGRESS, Stage.ON_HOLD},
    Stage.REPAIR_IN_PROGRESS: {Stage.REPAIR_COMPLETE, Stage.ON_HOLD},
    Stage.REPAIR_COMPLETE: {Stage.SETTLEMENT_REVIEW, Stage.ON_HOLD},
    Stage.SETTLEMENT_REVIEW: {Stage.CLOSED, Stage.ON_HOLD},
    Stage.CLOSED: set(),
    Stage.ON_HOLD: set(),
}

class TransitionRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
    target: Stage
    expected_version: int = Field(ge=1)
    reason: str = Field(min_length=3, max_length=1000)

def can_transition(current: Stage, target: Stage) -> bool:
    return target in ALLOWED[current]
