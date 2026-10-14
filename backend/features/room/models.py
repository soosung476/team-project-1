from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, Identity, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db.database import Base


class MeetingRoom(Base):
    __tablename__ = "meeting_rooms"

    id: Mapped[int] = mapped_column(Identity(), primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True)
    capacity: Mapped[int] = mapped_column(Integer)
    location: Mapped[str] = mapped_column(String(100))
    # Y · N (21c에는 BOOLEAN이 없어 글자 한 칸으로)
    is_active: Mapped[str] = mapped_column(String(1), default="Y", server_default="Y")

    # room.reservations
    reservations: Mapped[list["Reservation"]] = relationship(back_populates="room")


class Reservation(Base):
    __tablename__ = "reservations"

    id: Mapped[int] = mapped_column(Identity(), primary_key=True)
    room_id: Mapped[int] = mapped_column(ForeignKey("meeting_rooms.id"), index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    title: Mapped[str] = mapped_column(String(100))
    # 30분 단위, 08:00~20:00. 겹침은 DB 제약이 아니라 API에서 막습니다.
    start_at: Mapped[datetime] = mapped_column(DateTime, index=True)
    end_at: Mapped[datetime] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)

    room: Mapped["MeetingRoom"] = relationship(back_populates="reservations")
    user: Mapped["User"] = relationship(back_populates="reservations")
