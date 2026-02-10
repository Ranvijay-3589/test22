from pydantic import BaseModel, EmailStr
from typing import Optional


class StudentCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    class_id: Optional[int] = None


class StudentUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    class_id: Optional[int] = None


class StudentResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str] = None
    class_id: Optional[int] = None

    model_config = {"from_attributes": True}
