from pydantic import BaseModel
from typing import Optional


class TeacherCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    department: Optional[str] = None


class TeacherUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    department: Optional[str] = None


class TeacherResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    department: Optional[str] = None

    model_config = {"from_attributes": True}
