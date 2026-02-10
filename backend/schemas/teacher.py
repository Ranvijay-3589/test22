from pydantic import BaseModel
from typing import Optional


class TeacherCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None


class TeacherUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None


class TeacherResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str] = None

    model_config = {"from_attributes": True}
