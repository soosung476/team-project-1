from fastapi import APIRouter, HTTPException, status
from fastapi import Depends
from sqlalchemy.orm import Session
from db.database import get_db
from features.user.models import User
from core.dependencies import get_current_user

user_router = APIRouter(prefix="/auth", tags=["Users"])


@user_router.get("/me")
async def read_me(current_user: User = Depends(get_current_user)):
    return current_user
