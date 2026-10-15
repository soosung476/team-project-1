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
