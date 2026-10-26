from pydantic import BaseModel,ConfigDict,Field, field_validator
from datetime import datetime
from zoneinfo import ZoneInfo

class MeetingRoomResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int 
    name: str
    capacity: int
    location: str


class ReservationResponse(BaseModel):
    id: int
    user_id: int
    title: str
    start_at: datetime
    end_at: datetime
    user_name: str
    user_position: str | None

class RoomSlotResponse(BaseModel):
    start_at: datetime
    end_at: datetime
    available: bool

class ReservationCreate(BaseModel):
    room_id: int
    title: str
    start_at: datetime = Field(examples=["2026-11-20T09:30"])
    end_at: datetime = Field(examples=["2026-11-20T10:00"])

    @field_validator("start_at", "end_at")
    @classmethod
    def normalize_time(cls, v: datetime) -> datetime:
        # ① 시간대가 붙어 왔으면 (예: ...Z) → 한국 시간으로 바꾸고 시간대 정보 제거
        if v.tzinfo is not None:
            v = v.astimezone(ZoneInfo("Asia/Seoul"))
            v = v.replace(tzinfo=None)

        # ② 초·밀리초 0으로
        return v.replace(second=0, microsecond=0)

class ReservationDetailResponse(BaseModel):
    id: int
    user_id: int
    room_id: int
    room_name: str
    title: str
    start_at: datetime
    end_at: datetime
    user_name: str
    user_position: str | None
    created_at: datetime
