from sqlalchemy import select
from sqlalchemy.orm import Session
from features.room.models import MeetingRoom


def get_meeting_rooms(db: Session):
    query = select(MeetingRoom).where(MeetingRoom.is_active == 'Y').order_by(MeetingRoom.id)
    return db.scalars(query).all()

