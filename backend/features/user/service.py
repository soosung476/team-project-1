# CRUD
from sqlalchemy.orm import Session
from sqlalchemy import select
from features.user.schemas import (
    UserCreate,
    UserLogin,
    NameChange,
    PasswordChange,
    EmailChange,
    Token,
)
from features.user.models import User
from features.user.exceptions import (
    UserExistingException,
    InvalidPasswordException,
    UserNotFoundException,
    SamePasswordException,
)
from core.security import hash_password, verify_password
from core.jwt_token import create_access_token

DUMMY_HASH = hash_password("dummypassword")


def update_name(user_id: int, db: Session, data: NameChange):
    user = db.get(User, user_id)

    if user is None:
        raise UserNotFoundException

    user.name = data.name
    db.commit()
    db.refresh(user)
    return user


def update_email(user_id: int, db: Session, data: EmailChange):
    user = db.get(User, user_id)

    if user is None:
        raise UserNotFoundException

    user.email = data.email
    db.commit()
    db.refresh(user)
    return user


def update_password(user_id: int, db: Session, data: PasswordChange):
    user = db.get(User, user_id)

    if user is None:
        raise UserNotFoundException

    if not verify_password(data.current_password, user.password):
        raise InvalidPasswordException

    if verify_password(data.new_password, user.password):
        raise SamePasswordException

    user.password = hash_password(data.new_password)
    db.commit()
    db.refresh(user)
    return user


# 비밀번호 => 암호화
def register(db: Session, data: UserCreate):
    # 동일한 이메일로 가입된 정보가 있는가?
    existing_user = db.scalar(select(User).where(User.email == data.email))
    if existing_user:
        raise UserExistingException
    # 가입된 정보가 없을 때 회원가입
    user = User(email=data.email, password=hash_password(data.password), name=data.name)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# 현재 로그인된 사용자를 반환하는 함수.


def get_user(db: Session, user_id: int) -> User:
    user = db.get(User, user_id)
    if user is None:
        raise UserNotFoundException

    return user


def authenticate(db: Session, data: UserLogin):

    user = db.scalar(select(User).where(User.email == data.email))
    if user is None:
        # Timing attack 방지
        verify_password(data.password, DUMMY_HASH)
        raise UserNotFoundException

    if not verify_password(data.password, user.password):
        raise InvalidPasswordException

    access_token = create_access_token(data={"sub": str(user.user_id)})
    return Token(access_token=access_token)
