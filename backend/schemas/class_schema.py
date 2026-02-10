from pydantic import BaseModel
from typing import Optional


class ClassBase(BaseModel):
    name: str
    section: str
    room_number: Optional[str] = None


class ClassCreate(ClassBase):
    pass


class ClassUpdate(BaseModel):
    name: Optional[str] = None
    section: Optional[str] = None
    room_number: Optional[str] = None


class ClassResponse(ClassBase):
    id: int

    class Config:
        from_attributes = True
