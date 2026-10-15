from hmac import compare_digest
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from .config import Principal, identities

bearer = HTTPBearer(auto_error=False)

def principal(credentials: HTTPAuthorizationCredentials | None = Depends(bearer)) -> Principal:
    if credentials:
        for token, identity in identities().items():
            if compare_digest(credentials.credentials, token):
                return identity
    raise HTTPException(401, 'A valid synthetic session token is required', headers={'WWW-Authenticate':'Bearer'})

def operator(user: Principal = Depends(principal)) -> Principal:
    if user.role != 'adjuster':
        raise HTTPException(403, 'Adjuster permission required')
    return user
