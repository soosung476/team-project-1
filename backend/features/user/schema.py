from fastapi.security import HTTPBearer
from pydantic import BaseModel, EmailStr, Field, ConfigDict, AfterValidator
from typing import Annotated
import re

SPECIAL_CHARS = "!@#$%^&*"


def validate_password_strength(v: str) -> str:
    if not re.search(r"[A-Z]", v):
        raise ValueError("대문자를 1자 이상 포함해야 합니다.")
    if not re.search(r"[a-z]", v):
        raise ValueError("소문자를 1자 이상 포함해야 합니다.")
    if not re.search(r"\d", v):
        raise ValueError("숫자를 1자 이상 포함해야 합니다.")
    if not any(c in SPECIAL_CHARS for c in v):
        raise ValueError(f"특수문자{SPECIAL_CHARS}를 1개 이상 이상 포함해야 합니다")
    return v


Password = Annotated[
    str, Field(min_length=8, max_length=64), AfterValidator(validate_password_strength)
]


class UserLogin(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserCreate(BaseModel):
    name: str
    password: Password
    email: EmailStr


class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    role: str
    department_id: int | None
    position: str | None
    phone: str | None
