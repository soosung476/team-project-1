from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from db.database import get_db
from features.user.models import User
from core.jwt_token import decode_access_token
from features.user.exceptions import UserCredentialsException
from features.user.service import get_user

bearer_scheme = HTTPBearer()


def get_current_user(
    cred: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="인증이 필요합니다.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # token = cred.credentials
        # payload = decode_access_token(token)
        user_id = decode_access_token(cred.credentials)
    except UserCredentialsException:
        raise credentials_error

    return get_user(db=db, user_id=user_id)
