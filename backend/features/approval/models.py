from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, Identity, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db.database import Base


class ApprovalDocument(Base):
    __tablename__ = "approval_documents"

    id: Mapped[int] = mapped_column(Identity(), primary_key=True)
    drafter_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    approver_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    title: Mapped[str] = mapped_column(String(200))
    content: Mapped[str] = mapped_column(Text)
    # IN_PROGRESS · APPROVED · REJECTED
    status: Mapped[str] = mapped_column(
        String(12), default="IN_PROGRESS", server_default="IN_PROGRESS", index=True
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    # 승인·반려된 시각. 대기 중이면 비어 있음
    completed_at: Mapped[datetime | None] = mapped_column(DateTime)

    # users를 가리키는 FK가 둘이라 어느 컬럼으로 연결할지 foreign_keys로 알려 줍니다.
    drafter: Mapped["User"] = relationship(
        back_populates="drafted_documents", foreign_keys=[drafter_id]
    )
    approver: Mapped["User"] = relationship(
        back_populates="approving_documents", foreign_keys=[approver_id]
    )
