from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, Identity, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Identity(), primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    name: Mapped[str] = mapped_column(String(50))
    # USER · ADMIN (관리자 페이지에서 지정, 첫 ADMIN만 DBeaver로)
    role: Mapped[str] = mapped_column(String(10), default="USER", server_default="USER")
    # 부서 미배정이면 비어 있음 (기안 불가)
    department_id: Mapped[int | None] = mapped_column(
        ForeignKey("departments.id"), index=True
    )
    # 사원 팀장 사장
    position: Mapped[str] = mapped_column(
        String(20), default="사원", server_default="사원"
    )
    phone: Mapped[str | None] = mapped_column(String(20))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)

    # user.department
    department: Mapped["Department | None"] = relationship(back_populates="users")
    # 결재 문서는 users를 두 번 가리켜서(기안자·결재자) 어느 FK로 연결할지 foreign_keys로 알려 줍니다.
    # user.drafted_documents: 내가 올린 문서
    drafted_documents: Mapped[list["ApprovalDocument"]] = relationship(
        back_populates="drafter", foreign_keys="ApprovalDocument.drafter_id"
    )
    # user.approving_documents: 내가 결재할 문서
    approving_documents: Mapped[list["ApprovalDocument"]] = relationship(
        back_populates="approver", foreign_keys="ApprovalDocument.approver_id"
    )
    # user.reservations
    reservations: Mapped[list["Reservation"]] = relationship(back_populates="user")
    # user.notices
    notices: Mapped[list["Notice"]] = relationship(back_populates="author")
    # user.board_posts
    board_posts: Mapped[list["BoardPost"]] = relationship(back_populates="author")
    # user.board_comments
    board_comments: Mapped[list["BoardComment"]] = relationship(back_populates="author")
