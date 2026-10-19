from pydantic import BaseModel

class DepartmentCreate(BaseModel):
    name: str
    sort_order: int

class DepartmentResponse(BaseModel):
    id: int
    name: str
    sort_order: int

class DepartmentUpdate(BaseModel):
    name: str | None = None
    sort_order: int | None = None