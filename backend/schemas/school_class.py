from pydantic import BaseModel
from typing import Optional


class ClassCreate(BaseModel):
    name: str
    grade_level: int
    section: Optional[str] = None


class ClassUpdate(BaseModel):
    name: Optional[str] = None
    grade_level: Optional[int] = None
    section: Optional[str] = None


class ClassResponse(BaseModel):
    id: int
    name: str
    grade_level: int
    section: Optional[str] = None

    model_config = {"from_attributes": True}
