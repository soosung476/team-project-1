from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, Identity, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db.database import Base


class BoardPost(Base):
    __tablename__ = "board_posts"

    id: Mapped[int] = mapped_column(Identity(), primary_key=True)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    title: Mapped[str] = mapped_column(String(200))
    content: Mapped[str] = mapped_column(Text)
    view_count: Mapped[int] = mapped_column(Integer, default=0, server_default="0")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.now, onupdate=datetime.now
    )

    author: Mapped["User"] = relationship(back_populates="board_posts")
    # 글을 지우면 댓글도 함께 지워집니다.
    # cascade: 파이썬에서 db.delete(post) 하면 댓글도 같이 지움
    # passive_deletes: 댓글을 일부러 읽어 오지 않고 DB의 ON DELETE CASCADE에 맡김
    comments: Mapped[list["BoardComment"]] = relationship(
        back_populates="post",
        order_by="BoardComment.created_at",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
