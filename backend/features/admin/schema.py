from pydantic import BaseModel


class AdminUserUpdate(BaseModel):
    role: str | None = None
    position: str | None = None
    department_id: int | None = None


class DepartmentBrief(BaseModel):
    id: int
    name: str


class AdminUserResponse(BaseModel):
    id: int
    email: str
    name: str
    role: str
    position: str
    department: DepartmentBrief | None


class AdminUserPageResponse(BaseModel):
    items: list[AdminUserResponse]
    total: int
    page: int
    size: int
    total_pages: int
