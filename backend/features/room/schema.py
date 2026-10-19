from pydantic import BaseModel,ConfigDict
from datetime import datetime

class MeetingRoomResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int 
    name: str
    capacity: int
    location: str


class ReservationResponse(BaseModel):
    id: int
    title: str
    start_at: datetime
    end_at: datetime
    user_name: str
    user_position: str

class RoomSlotResponse(BaseModel):
    start_at: datetime
    end_at: datetime
    available: bool

class ReservationCreate(BaseModel):
    room_id: int
    title: str
    start_at: datetime
    end_at: datetime

class ReservationDetailResponse(BaseModel):
    id: int
    room_id: int
    room_name: str
    title: str
    start_at: datetime
    end_at: datetime
    user_name: str
    user_position: str
    created_at: datetime
