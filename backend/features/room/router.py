from datetime import date  
from fastapi import APIRouter, Depends, HTTPException 
from sqlalchemy.orm import Session

from db.database import get_db
from features.room.models import MeetingRoom
from features.room.schema import MeetingRoomResponse, ReservationResponse, RoomSlotResponse, ReservationCreate, ReservationDetailResponse, AdminReservationPageResponse
from features.room.service import get_meeting_rooms, get_room_reservations, get_room_slots, create_room_reservation, get_reservations, cancel_reservation, get_admin_reservations, admin_cancel_reservation
from core.dependencies import get_current_user, get_admin_user
from features.user.models import User
from typing import Literal

router = APIRouter(prefix="/rooms", tags=["rooms"], dependencies=[Depends(get_current_user)])

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

# 기존 고정 경로하고 달라서 reservations로 하나 더 만듬 
reserv_router = APIRouter(prefix="/reservations", tags=["reservations"])

@reserv_router.post("",response_model=ReservationDetailResponse,status_code=201)
def list_create_reservation(
      data:ReservationCreate,
      db: Session = Depends(get_db),
      user: User= Depends(get_current_user),
):
    return create_room_reservation(db, user, data)


@reserv_router.get("",response_model=list[ReservationDetailResponse])
def list_reservations(
    scope: Literal["mine", "all"] = "mine",
    user: User = Depends(get_current_user), 
    db: Session= Depends(get_db),
):
    return get_reservations(db, user.id, scope )


@reserv_router.delete("/{reservation_id}")
def delete_reservation(
    reservation_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return cancel_reservation(db, user, reservation_id)


admin_reserv_router = APIRouter(
    prefix="/admin/reservations",
    tags=["admin-reservations"],
    dependencies=[Depends(get_admin_user)],
)

#--------------------
# 관리자용

# 전체 예약 페이징 조회
@admin_reserv_router.get("", response_model=AdminReservationPageResponse)
def list_admin_reservations(page: int = 1, size: int = 10, db: Session = Depends(get_db)):
    return get_admin_reservations(db, page, size)

# 관리자 예약 취소
@admin_reserv_router.delete("/{reservation_id}")
def admin_delete_reservation(reservation_id: int, db: Session = Depends(get_db)):
    return admin_cancel_reservation(db, reservation_id)