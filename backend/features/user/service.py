from sqlalchemy import select
from sqlalchemy.orm import Session
from core.security import verify_password, hash_password
from core.jwt_token import create_access_token
from features.user.models import User
from features.user.exceptions import (
    UserNotFoundException,
    InvalidPasswordException,
    UserExistingException,
)
from features.user.schema import UserLogin, Token, UserCreate

DUMMY_HASH = hash_password("dummypassword")


def get_user(db: Session, user_id: int) -> User:
    user = db.get(User, user_id)
    if user is None:
        raise UserNotFoundException

    return user


def user_register(db: Session, data: UserCreate):
    existing_user = db.scalar(select(User).where(User.email == data.email))
    if existing_user:
        raise UserExistingException

    user = User(
        email=data.email, password_hash=hash_password(data.password), name=data.name
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate(db: Session, data: UserLogin):
    user = db.scalar(select(User).where(User.email == data.email))
    if user is None:
        verify_password(data.password, DUMMY_HASH)
        raise UserNotFoundException

    if not verify_password(data.password, user.password_hash):
        raise InvalidPasswordException

    access_token = create_access_token(data={"sub": str(user.id)})
    return Token(access_token=access_token)
