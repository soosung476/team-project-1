from datetime import datetime
from pydantic import BaseModel, Field


# 기안자·결재자를 보여줄 때 쓰는 짧은 사용자 정보
class UserBrief(BaseModel):
    id: int
    name: str
    position: str


# 목록 한 줄 (본문 content는 빼고 보냄)
class ApprovalListItem(BaseModel):
    id: int
    title: str
    status: str
    created_at: datetime
    completed_at: datetime | None
    drafter: UserBrief
    approver: UserBrief


# 문서 하나 자세히 보기
class ApprovalResponse(BaseModel):
    id: int
    title: str
    content: str
    status: str
    created_at: datetime
    completed_at: datetime | None
    drafter: UserBrief
    approver: UserBrief


# 기안하기: 기안자는 로그인한 사람이라 받지 않습니다.
class ApprovalCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    content: str = Field(min_length=1)
    approver_id: int


# 승인·반려: status에 "APPROVED" 또는 "REJECTED"
class ApprovalStatusUpdate(BaseModel):
    status: str


class ApprovalPageResponse(BaseModel):
    items: list[ApprovalListItem]
    total: int
    page: int
    size: int
    total_pages: int
