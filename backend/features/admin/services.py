from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload
from core.positions import POSITION_LEVEL
from features.user.models import User
from features.department.models import Department
from features.user.exceptions import UserNotFoundException
from features.department.exceptions import DepartmentNotFoundException
from features.admin.schema import AdminUserUpdate
from features.admin.exceptions import (
    InvalidRoleException,
    InvalidPositionException,
    SelfRoleChangeException,
)


# 관리자 페이지에서 가져올 유저 정보들
def get_users(db: Session):
    stmt = select(User).options(selectinload(User.department)).order_by(User.id)
    return db.scalars(stmt).all()


# 관리자가 유저에 대한 정보를 update로 요청하면 실행될 기능.
def update_user(user_id: int, data: AdminUserUpdate, db: Session, admin: User):
    user = db.get(User, user_id)
    if user is None:
        raise UserNotFoundException

    if data.role is not None:
        if data.role not in ("USER", "ADMIN"):
            raise InvalidRoleException

        if user.id == admin.id and data.role != user.role:
            raise SelfRoleChangeException
        user.role = data.role

    if data.position is not None:
        if data.position not in POSITION_LEVEL:
            raise InvalidPositionException
        user.position = data.position

    if data.department_id is not None:
        if db.get(Department, data.department_id) is None:
            raise DepartmentNotFoundException
        user.department_id = data.department_id

    db.commit()
    db.refresh(user)
    return user
