from datetime import date, datetime, timezone
from pydantic import BaseModel, ConfigDict, Field, field_validator
from .workflow import Stage

class ClaimCreate(BaseModel):
    model_config = ConfigDict(extra='forbid', str_strip_whitespace=True)
    member_name: str = Field(min_length=1, max_length=100)
    policy_reference: str = Field(min_length=1, max_length=80)
    vehicle: str = Field(min_length=1, max_length=120)
    vin: str = Field(pattern=r'^[A-HJ-NPR-Z0-9]{17}$')
    incident_date: date
    location: str = Field(min_length=1, max_length=200)
    incident_summary: str = Field(min_length=3, max_length=2000)

    @field_validator('incident_date')
    @classmethod
    def past_incident(cls, value):
        if value > datetime.now(timezone.utc).date():
            raise ValueError('Incident date must not be in the future')
        return value

class Claim(ClaimCreate):
    model_config = ConfigDict(from_attributes=True)
    id: str
    status: Stage
    version: int
    created_at: datetime

class StageEvent(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    claim_id: str
    previous: Stage | None
    current: Stage
    actor: str
    reason: str
    occurred_at: datetime
    version: int
