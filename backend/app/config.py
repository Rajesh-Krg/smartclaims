"""Explicit synthetic configuration; no credentials or permissive defaults."""
import json
import os
from pathlib import Path
from typing import Literal
from pydantic import BaseModel, ConfigDict, Field

class Principal(BaseModel):
    model_config = ConfigDict(extra='forbid', frozen=True)
    subject: str = Field(min_length=1, max_length=100)
    tenant: str = Field(min_length=1, max_length=100)
    role: Literal['adjuster', 'policyholder', 'auditor']

def identities() -> dict[str, Principal]:
    raw = os.getenv('DEMO_IDENTITIES_JSON')
    if not raw:
        path = os.getenv('DEMO_IDENTITIES_FILE')
        raw = Path(path).read_text() if path else '{}'
    data = json.loads(raw)
    if not isinstance(data, dict) or not data:
        raise RuntimeError('Configure synthetic demo identities before starting the API')
    if any(len(token) < 16 for token in data):
        raise RuntimeError('Demo bearer tokens must contain at least 16 characters')
    return {token: Principal.model_validate(value) for token, value in data.items()}
