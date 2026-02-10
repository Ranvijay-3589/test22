from pydantic import BaseModel
from typing import Optional


class StudentBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    class_id: Optional[int] = None


class StudentCreate(StudentBase):
    pass


class StudentUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    class_id: Optional[int] = None


class StudentResponse(StudentBase):
    id: int
    class_name: Optional[str] = None

    model_config = {"from_attributes": True}
