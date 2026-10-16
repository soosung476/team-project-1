from datetime import date  
from fastapi import APIRouter, Depends, HTTPException 
from sqlalchemy.orm import Session

from db.database import get_db
from features.room.models import MeetingRoom
from features.room.schema import MeetingRoomResponse, ReservationResponse, RoomSlotResponse
from features.room.service import get_meeting_rooms, get_room_reservations, get_room_slots


router = APIRouter(prefix="/rooms", tags=["rooms"])

@router.get("", response_model=list[MeetingRoomResponse])
def list_rooms(db: Session = Depends(get_db)):
    return get_meeting_rooms(db)

@router.get("/{room_id}/reservations", response_model=list[ReservationResponse])
def list_room_reservations(
    room_id: int,
    date: date,
    db: Session = Depends(get_db),
):
    if db.get(MeetingRoom, room_id) is None:
        raise HTTPException(status_code=404, detail={"code":"ROOM_NOT_FOUND","message":"해당 날짜에 예약된 회의실이 없습니다."})
    return get_room_reservations(db, room_id, date)


@router.get("/{room_id}/slots", response_model=list[RoomSlotResponse])
def list_room_slots(
    room_id: int,
    date: date,
    db: Session = Depends(get_db),
):
    room = db.get(MeetingRoom, room_id)
    if room is None:
            raise HTTPException(status_code=404, detail={"code":"ROOM_NOT_FOUND","message":"예약가능한 회의실이 없습니다."})
    elif room.is_active != 'Y':
            raise HTTPException(status_code=400, detail={"code":"ROOM_INACTIVE","message":"사용할 수 없는 회의실입니다."})
    elif date < date.today():
            raise HTTPException(status_code=400, detail={"code":"PAST_DATE", "message":"이미 지난 날짜 입니다."})
    return get_room_slots(db,room_id,date)