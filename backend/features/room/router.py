from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.database import get_db
from features.room.schema import MeetingRoomResponse, ReservationResponse
from features.room.service import get_meeting_rooms, get_room_reservations


router = APIRouter(prefix="/rooms", tags=["rooms"])

@router.get("", response_model=list[MeetingRoomResponse])
def list_rooms(db: Session = Depends(get_db)):
    return get_meeting_rooms(db)

