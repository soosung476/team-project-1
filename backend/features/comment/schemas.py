from pydantic import BaseModel
from datetime import datetime

class CommentCreate(BaseModel):
    content: str

class CommentUpdate(BaseModel):
    content: str | None = None