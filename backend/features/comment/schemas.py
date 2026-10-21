from pydantic import BaseModel
from datetime import datetime

class CommentCreate(BaseModel):
    content: str
    author_id: int
    post_id: int

class CommentUpdate(BaseModel):
    content: str | None = None