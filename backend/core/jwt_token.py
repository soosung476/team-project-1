from core.config import settings
from datetime import datetime, timedelta, timezone
from features.user.exceptions import UserCredentialsException
import jwt


def create_access_token(
    data: dict, expires_delta: int = settings.access_token_expire_seconds
) -> str:
    """
    JWT 토큰 생성
    data : 토큰에 포함할 데이터 (ex: 사용자 정보)
    expires_delta : 토큰 만료시간(초 단위, 기본값 30분)
    return: 생성된 JWT 토큰 문자열
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(seconds=expires_delta)
    to_encode.update({"exp": expire})

    encode_jwt = jwt.encode(
        to_encode, settings.secret_key, algorithm=settings.jwt_algorithm
    )
    return encode_jwt


def create_refresh_token(data: dict) -> str:
    """
    refresh token 생성 (access token이 만료됐을 때 새 토큰을 받는 재발급권)
    data : 토큰에 포함할 데이터 (ex: 사용자 정보)
    만료시간 : settings.refresh_token_expire_seconds (2시간)
    return: 생성된 JWT 토큰 문자열
    "type": "refresh" 표시를 넣어서 access token 자리에는 쓰지 못하게 함
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(
        seconds=settings.refresh_token_expire_seconds
    )
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> int:
    """
    access token 확인 (get_current_user에서 사용)
    token : 요청 헤더(Authorization: Bearer ...)에 담겨 온 토큰
    return: 토큰에 담긴 사용자 id (sub)
    서명이 틀리거나 만료됐거나, refresh token을 넣으면 UserCredentialsException
    """
    try:
        payload = jwt.decode(
            token, settings.secret_key, algorithms=[settings.jwt_algorithm]
        )
        # refresh token은 API 요청에 쓰지 못하게 막음
        if payload.get("type") == "refresh":
            raise UserCredentialsException
        return int(payload["sub"])
    # KeyError: sub가 없음, ValueError: sub가 숫자가 아님
    except jwt.InvalidTokenError, KeyError, ValueError:
        raise UserCredentialsException


def decode_refresh_token(token: str) -> int:
    """
    refresh token 확인 (/auth/refresh에서 사용)
    token : 화면이 보낸 refresh token
    return: 토큰에 담긴 사용자 id (sub)
    서명이 틀리거나 만료됐거나, "type": "refresh"가 없는 토큰(access token)이면 UserCredentialsException
    """
    try:
        payload = jwt.decode(
            token, settings.secret_key, algorithms=[settings.jwt_algorithm]
        )
        # access token으로는 재발급 받지 못하게 막음
        if payload.get("type") != "refresh":
            raise UserCredentialsException
        return int(payload["sub"])
    # KeyError: sub가 없음, ValueError: sub가 숫자가 아님
    except jwt.InvalidTokenError, KeyError, ValueError:
        raise UserCredentialsException
