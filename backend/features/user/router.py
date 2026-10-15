from fastapi import APIRouter, HTTPException, status
from fastapi import Depends
from sqlalchemy.orm import Session
from db.database import get_db
from core.dependencies import get_current_user
from features.user.models import User
from features.user.schema import UserLogin, Token, UserCreate
from features.user.service import authenticate, user_register
from features.user.exceptions import (
    UserNotFoundException,
    InvalidPasswordException,
    UserExistingException,
)

user_router = APIRouter(prefix="/auth", tags=["Users"])


@user_router.get("/me")
async def read_me(current_user: User = Depends(get_current_user)):
    return current_user


@user_router.post("", response_model=dict)
async def post_signup(data: UserCreate, db: Session = Depends(get_db)) -> dict:
    try:
        user = user_register(data=data, db=db)
    except UserExistingException:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="이미 등록된 이메일입니다."
        )

    return {"message": f"회원가입이 완료되었습니다.", "user_id": user.id}


@user_router.post("/login", response_model=Token)
async def post_login(data: UserLogin, db: Session = Depends(get_db)) -> Token:
    try:
        token = authenticate(data=data, db=db)
    except UserNotFoundException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="이메일, 비밀번호를 확인해주세요",
        )
    except InvalidPasswordException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="이메일, 비밀번호를 확인해주세요",
        )
    return token
