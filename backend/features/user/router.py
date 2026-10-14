from fastapi import APIRouter, HTTPException, status
from features.user.service import (
    register,
    authenticate,
    update_name,
    update_email,
    update_password,
)
from features.user.schemas import (
    UserCreate,
    UserLogin,
    UserResponse,
    NameChange,
    PasswordChange,
    EmailChange,
    Token,
)
from fastapi import Depends
from sqlalchemy.orm import Session
from db.database import get_db
from features.user.exceptions import (
    UserExistingException,
    UserNotFoundException,
    InvalidPasswordException,
    SamePasswordException,
)
from features.user.models import User
from features.user.dependencies import get_current_user

auth_router = APIRouter(tags=["Users"])


# 회원가입
# /auth + post

# 로그인
# /auth/login + post

# 비밀번호 수정
# /auth/user_id/password + patch

# 이름 수정
# /auth/user_id/name + patch


# email 수정
# /auth/user_id/email + patch
@auth_router.get("/me", response_model=UserResponse)
async def read_me(current_user: User = Depends(get_current_user)) -> UserResponse:
    return current_user


@auth_router.post("", response_model=dict)
async def post_signup(data: UserCreate, db: Session = Depends(get_db)) -> dict:
    try:
        user = register(db=db, data=data)
    except UserExistingException:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="이미 등록된 이메일입니다"
        )

    return {"message": "회원가입이 완료되었습니다.", "user_id": user.user_id}


@auth_router.post("/login", response_model=Token)
async def post_signin(data: UserLogin, db: Session = Depends(get_db)) -> Token:
    try:
        token = authenticate(db=db, data=data)
    except UserNotFoundException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="아이디나 비밀번호를 확인해주세요.",
        )
    except InvalidPasswordException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="아이디나 비밀번호를 확인해주세요.",
        )

    return token


@auth_router.patch("/{user_id}/name", response_model=dict)
async def patch_name(
    user_id: int, data: NameChange, db: Session = Depends(get_db)
) -> dict:
    try:
        update_name(user_id=user_id, data=data, db=db)
    except UserNotFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="존재하지 않는 사용자입니다",
        )
    return {"message": "이름이 변경되었습니다."}


@auth_router.patch("/{user_id}/password", response_model=dict)
async def patch_password(
    user_id: int, data: PasswordChange, db: Session = Depends(get_db)
) -> dict:
    try:
        update_password(user_id=user_id, db=db, data=data)
    except UserNotFoundException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="존재하지 않는 사용자입니다",
        )
    except InvalidPasswordException:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="비밀번호를 확인해주세요",
        )
    except SamePasswordException:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이전과 다른 비밀번호를 입력해주세요",
        )
    return {"message": "password가 변경되었습니다."}


@auth_router.patch("/{user_id}/email", response_model=dict)
async def patch_email(
    user_id: int, data: EmailChange, db: Session = Depends(get_db)
) -> dict:
    try:
        update_email(db=db, data=data, user_id=user_id)
    except UserNotFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="존재하지 않는 사용자입니다."
        )
    return {"message": "email이 변경되었습니다."}
