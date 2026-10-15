from sqlalchemy import select
from datetime import date, datetime, time, timedelta # timedelta: 두 시간 사이 간격
from sqlalchemy.orm import Session
from features.room.models import MeetingRoom, Reservation
from features.user.models import User

def get_meeting_rooms(db: Session):
    query = select(MeetingRoom).where(MeetingRoom.is_active == 'Y').order_by(MeetingRoom.id)
    return db.scalars(query).all()


def get_room_reservations(db: Session, room_id: int, target_date: date):
    start = datetime.combine(target_date, time.min)   # 그날 00:00
    end = start + timedelta(days=1)              # 다음날 00:00

    query = (
        select(
            Reservation.id,
            Reservation.title,
            Reservation.start_at,
            Reservation.end_at,
            User.name.label("user_name"),
            User.position.label("user_position"),
        )
        .join(User, Reservation.id == User.id)
        .where(
            Reservation.room_id == room_id,
            Reservation.start_at >= start,
            Reservation.start_at < end,
        )
        .order_by(Reservation.start_at)
    )
    return db.execute(query).mappings().all()
