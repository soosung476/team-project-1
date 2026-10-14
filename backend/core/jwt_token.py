from core.config import settings
from datetime import datetime, timedelta, timezone
from features.user.exceptions import UserCredentialsException
from jwt.exceptions import InvalidTokenError
import jwt


def verify_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(
            token, settings.secret_key, algorithms=[settings.jwt_algorithm]
        )
        return payload
    except InvalidTokenError:
        raise UserCredentialsException


def create_access_token(
    data: dict, expires_delta: int = settings.access_token_expire_seconds
) -> str:
    """
    JWT 토큰 생성
    data : 토큰에 포함할 데이터 (ex: 사용자 정보)
    expires_delta : 토큰 만료시간(초 단위, 기본값 1시간)
    return: 생성된 JWT 토큰 문자열
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(seconds=expires_delta)
    to_encode.update({"exp": expire})

    encode_jwt = jwt.encode(
        to_encode, settings.secret_key, algorithm=settings.jwt_algorithm
    )
    return encode_jwt


def decode_access_token(token: str) -> int:
    try:
        payload = jwt.decode(
            token, settings.secret_key, algorithms=[settings.jwt_algorithm]
        )
        return int(payload["sub"])
    except jwt.InvalidTokenError, KeyError, ValueError:
        raise UserCredentialsException
