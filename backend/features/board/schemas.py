from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class ORMBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class AuthorBrief(ORMBase):
    id: int
    name: str


class CommentResponse(ORMBase):
    id: int
    content: str
    post_id: int
    author_id: int
    author: AuthorBrief
    created_at: datetime


class BoardResponse(ORMBase):
    id: int
    author_id: int
    title: str
    content: str
    view_count: int
    created_at: datetime
    updated_at: datetime
    author: AuthorBrief
    comments: list[CommentResponse] = []


class BoardListItem(ORMBase):
    id: int
    title: str
    view_count: int
    created_at: datetime
    author: AuthorBrief


class BoardPageResponse(BaseModel):
    items: list[BoardListItem]
    total: int
    page: int
    size: int
    total_pages: int


class BoardCreate(BaseModel):
    title: str = Field(min_length=1, max_length=60)
    content: str = Field(min_length=1)


class BoardUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=60)
    content: str | None = Field(default=None, min_length=1)


class CommentCreate(BaseModel):
    content: str = Field(min_length=1)