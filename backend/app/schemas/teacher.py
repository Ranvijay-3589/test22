from pydantic import BaseModel, EmailStr
from typing import Optional


class TeacherBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    department: Optional[str] = None


class TeacherCreate(TeacherBase):
    pass


class TeacherUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    department: Optional[str] = None


class TeacherResponse(TeacherBase):
    id: int

    model_config = {"from_attributes": True}
