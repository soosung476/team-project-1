from pydantic import BaseModel
from fastapi.security import HTTPBearer

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
