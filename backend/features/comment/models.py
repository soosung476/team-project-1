from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, Identity, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db.database import Base


class BoardComment(Base):
    __tablename__ = "board_comments"

    id: Mapped[int] = mapped_column(Identity(), primary_key=True)
    # 게시글을 지우면 댓글도 함께 지워짐 (CASCADE는 이 한 곳뿐)
    post_id: Mapped[int] = mapped_column(
        ForeignKey("board_posts.id", ondelete="CASCADE"), index=True
    )
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    content: Mapped[str] = mapped_column(String(1000))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)

    post: Mapped["BoardPost"] = relationship(back_populates="comments")
    author: Mapped["User"] = relationship(back_populates="board_comments")
