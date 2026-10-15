from sqlalchemy import select
from datetime import date, datetime, time, timedelta # timedelta: 두 시간 사이 간격
from sqlalchemy.orm import Session
from features.room.models import MeetingRoom, Reservation
from features.user.models import User

def get_meeting_rooms(db: Session):
    query = select(MeetingRoom).where(MeetingRoom.is_active == 'Y').order_by(MeetingRoom.id)
    return db.scalars(query).all()


def get_room_reservations(db: Session, room_id: int, target_date: date):
    start = datetime.combine(target_date, time.min)   # 그날 자정 기준
    end = start + timedelta(days=1)              # 다음날 자정 기준

    query = (
        select(
            Reservation.id,
            Reservation.title,
            Reservation.start_at,
            Reservation.end_at,
            User.name.label("user_name"),
            User.position.label("user_position"),
        )
        .join(User, Reservation.user_id == User.id)
        .where(
            Reservation.room_id == room_id,
            Reservation.start_at >= start,
            Reservation.start_at < end,
        )
        .order_by(Reservation.start_at)
    )
    return db.execute(query).mappings().all()


def is_overlapping(a_start, a_end, b_start, b_end) -> bool:
    return a_start < b_end and a_end > b_start

def get_room_slots(db: Session, room_id: int, target_date: date):
    reservations = get_room_reservations(db, room_id, target_date)   # API 2 함수 재사용
    now = datetime.now()                              # 지금 시각

    slot_start = datetime.combine(target_date, time(hour=8, minute=0))   # 08:00
    day_end    = datetime.combine(target_date, time(hour=20, minute=0))   # 20:00

    slots = []
    while slot_start < day_end:
        slot_end = slot_start + timedelta(minutes=30)

        # 지난 칸이면 불가
        is_past = slot_start < now

        # 예약 겹치면 예약 불가
        is_booked = any(
            is_overlapping(slot_start, slot_end, r["start_at"], r["end_at"])
            for r in reservations
        )

        slots.append({
            "start_at": slot_start,
            "end_at": slot_end,
            "available": not (is_past or is_booked),
        })
        slot_start = slot_end          # 다음 칸으로

    return slots