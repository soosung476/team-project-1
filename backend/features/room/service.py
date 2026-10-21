from sqlalchemy import select
from datetime import date, datetime, time, timedelta # timedelta: 두 시간 사이 간격
from sqlalchemy.orm import Session
from features.room.models import MeetingRoom, Reservation
from features.room.schema import ReservationCreate
from features.user.models import User
from fastapi import HTTPException

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

# 시간 겹침 검사
def is_overlapping(a_start, a_end, b_start, b_end) -> bool:
    return a_start < b_end and a_end > b_start

def get_room_slots(db: Session, room_id: int, target_date: date):
    reservations = get_room_reservations(db, room_id, target_date)
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

def create_room_reservation(db: Session, user: User, data: ReservationCreate):
    # 요청한 room_id로 회의실 조회
    room = db.get(MeetingRoom,data.room_id)
    # 회의실이 존재 하지 않을때
    if room is None:
        raise HTTPException(status_code=404, detail={"code":"ROOM_NOT_FOUND","message":"회의실을 찾을 수 없습니다."})
    # 회의실이 비활성화일때
    elif room.is_active != 'Y':
        raise HTTPException(status_code=400, detail={"code":"ROOM_INACTIVE","message":"사용할 수 없는 회의실입니다."})
    # 예약 시작과 끝이 날짜가 다를때
    elif data.start_at.date() != data.end_at.date():
        raise HTTPException(status_code=400, detail= {"code":"INVALID_DATE", "message":"시작과 종료는 같은 날짜여야 합니다."})
    # 예약 종료가 시작보다 빠를때
    elif data.start_at >= data.end_at:
        raise HTTPException(status_code=400, detail= {"code":"INVALID_TIME_RANGE", "message":"시작이 종료보다 빨라야 합니다."})
    
    # 시간 단위 검사
    correct_time = data.start_at.minute in (0,30) and data.start_at.second == 0 and data.end_at.minute in (0,30) and data.end_at.second == 0
    # 시간 단위가 30분이 아닐때
    if not correct_time:
        raise HTTPException(status_code=400, detail= {"code":"INVALID_TIME_INTERVAL", "message":"예약 시간 단위는 30분 입니다"})
    
    # 예약 가능 시간 검사용 변수
    open_at = datetime.combine(data.start_at.date(), time(hour=8, minute=0))   # 08:00
    close_at = datetime.combine(data.end_at.date(), time(hour=20, minute=0))   # 20:00
    
    #예약한 시간이 08:00~20:00 가 아님
    if open_at > data.start_at or close_at < data.end_at:
        raise HTTPException(status_code=400, detail= {"code":"OUTSIDE_BUSINESS_HOURS", "message":"예약 가능 시간은 08:00~20:00 입니다."})
    # 예약 시작 시간이 지금보다 과거일때
    if data.start_at <= datetime.now():
        raise HTTPException(status_code=400, detail= {"code":"PAST_TIME_RESERVATION","message":"이미 지난시간은 예약할 수 없습니다."})

    # 예약목록 함수로 가져옴
    reservations = get_room_reservations(db, data.room_id, open_at.date())

    # 예약 겹치면 예약 불가(위의 is_booked 재활용)
    is_booked = any(
        is_overlapping(data.start_at, data.end_at, r["start_at"], r["end_at"])
        for r in reservations
    )
    # 기존 예약과 겹치는지 검사
    if is_booked:
        raise HTTPException(status_code=409, detail= {"code":"RESERVATION_CONFLICT","message":"이미 예약되어 있는 시간대 입니다."})

    # 검사가 끝난 예약의 데이터를 Reservation에 넣어서 변수에 저장
    # 모델 객체 = 테이블 한줄
    reservation = Reservation(
        room_id=data.room_id,
        title=data.title,
        start_at=data.start_at,
        end_at= data.end_at,
        user_id=user.id
    )
    # db에 예약정보 넣기
    db.add(reservation) #db.add(객체): 모델 객체를 테이블에 한 줄로 넣기
    db.commit()
    db.refresh(reservation) # db의 id, created_at 값 받아오기 위해서

    # 응답
    return {
        "id": reservation.id,
        "room_id": room.id,
        "room_name": room.name,
        "title": reservation.title,
        "start_at": reservation.start_at,
        "end_at": reservation.end_at,
        "user_name": user.name,
        "user_position": user.position,
        "created_at": reservation.created_at,
    }

# 내 or 전체 예약 조회-> scope 변수로 구분:mine/all  
def get_reservations(db: Session, user_id: int, scope:str):
    query = (
        select(
            Reservation.id,
            Reservation.room_id,
            MeetingRoom.name.label("room_name"),
            Reservation.title,
            Reservation.start_at,
            Reservation.end_at,
            User.name.label("user_name"),
            User.position.label("user_position"),
            Reservation.created_at,
        )
        .join(MeetingRoom, MeetingRoom.id == Reservation.room_id)
        .join(User, Reservation.user_id == User.id)
        .order_by(Reservation.start_at)
    )
    if scope == "mine":
        query = query.where(Reservation.user_id == user_id)

    return db.execute(query).mappings().all()

# 권한 검사
def can_manage_reservation(user: User, reservation: Reservation) -> bool:
    # 지금 규칙: 예약자 본인
    is_owner = user.id == reservation.user_id
    # 나중에 규칙 추가: ADMIN이면 전부 가능
    # is_admin = user.role == "ADMIN"
    # return is_owner or is_admin
    return is_owner


def cancel_reservation(db: Session, user: User, reservation_id: int):
    # 예약 꺼내기
    reservation = db.get(Reservation, reservation_id)

    # 예약 없으면 오류 404
    if reservation is None:
        raise HTTPException(status_code=404, detail={"code": "RESERVATION_NOT_FOUND", "message": "예약을 찾을 수 없습니다."})

    # 권한 없으면 오류 403
    if not can_manage_reservation(user, reservation):
        raise HTTPException(status_code=403, detail={"code": "FORBIDDEN", "message": "본인 예약만 취소할 수 있습니다."})

    # 삭제
    deleted_id = reservation.id
    db.delete(reservation)
    db.commit()

    return {"id": deleted_id, "message": "예약이 취소되었습니다."}