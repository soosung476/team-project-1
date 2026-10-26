from pydantic import BaseModel
from datetime import datetime

class UserResponse(BaseModel):
    id:int
    name:str

class NoticeCreate(BaseModel):
    title:str
    content:str
    is_pinned: str

class NoticeUpdate(BaseModel):
    title:str|None =None
    content:str|None =None
    is_pinned: str|None = None
    
class NoticeResponse(BaseModel):
    id:int
    author_id: int
    title: str
    content:str 
    is_pinned:str
    #view_count: int
    created_at: datetime
    updated_at: datetime
    author : UserResponse

class NoticeListResponse(BaseModel):
    items:list[NoticeResponse]
    total:int
    page:int
    size:int
    total_pages:int

