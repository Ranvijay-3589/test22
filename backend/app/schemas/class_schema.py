from pydantic import BaseModel
from typing import Optional


class ClassBase(BaseModel):
    name: str
    section: Optional[str] = None
    room_number: Optional[str] = None


class ClassCreate(ClassBase):
    pass


class ClassUpdate(BaseModel):
    name: Optional[str] = None
    section: Optional[str] = None
    room_number: Optional[str] = None


class ClassResponse(ClassBase):
    id: int

    model_config = {"from_attributes": True}
