from sqlalchemy import Identity, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db.database import Base


class Department(Base):
    __tablename__ = "departments"

    id: Mapped[int] = mapped_column(Identity(), primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True)
    # 부서 select에 보일 순서
    sort_order: Mapped[int] = mapped_column(Integer)

    # department.users
    users: Mapped[list["User"]] = relationship(back_populates="department")
