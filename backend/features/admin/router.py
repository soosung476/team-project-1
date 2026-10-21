from fastapi import APIRouter, HTTPException, status
from fastapi import Depends
from sqlalchemy.orm import Session
from db.database import get_db
from core.dependencies import get_admin_user
from features.user.models import User
from features.user.exceptions import UserNotFoundException
from features.department.exceptions import DepartmentNotFoundException
from features.admin.schema import AdminUserResponse, AdminUserUpdate
from features.admin.exceptions import (
    InvalidRoleException,
    InvalidPositionException,
    SelfRoleChangeException,
)
from features.admin.services import get_users, update_user

admin_router = APIRouter(prefix="/admin", tags=["admin"])


# admin을 Depends로 받음 -> 만약 로그인이 아니면 401에러
# 로그인 했지만 Admin이 아님 -> 403에러
# /admin/users 일 때 유저목록을 받아서, 리스트업. 이후 개별 유저에 대한 put, patch함수 작성
# -> users의 개별에 role과 포지션, 부서가 변경됨.
@admin_router.get("/users", response_model=list[AdminUserResponse])
async def get_users_list(
    db: Session = Depends(get_db), admin: User = Depends(get_admin_user)
):
    return get_users(db=db)


# /admin/users/{id}
@admin_router.patch("/users/{user_id}", response_model=AdminUserResponse)
async def update_user_status(
    user_id: int,
    data: AdminUserUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    try:
        return update_user(user_id=user_id, db=db, data=data, admin=admin)

    except InvalidRoleException:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="권한에는 USER 또는 ADMIN만 들어갈 수 있습니다.",
        )
    except InvalidPositionException:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="직급은 사원, 팀장, 사장 중 하나여야 합니다.",
        )
    except SelfRoleChangeException:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="본인의 권한은 수정할 수 없습니다.",
        )
    except UserNotFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="해당하는 유저를 찾을 수 없습니다.",
        )
    except DepartmentNotFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="해당하는 부서를 찾을 수 없습니다.",
        )
