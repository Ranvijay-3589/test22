from pydantic import BaseModel
from typing import Optional


class ClassCreate(BaseModel):
    name: str
    section: str


class ClassUpdate(BaseModel):
    name: Optional[str] = None
    section: Optional[str] = None


class ClassResponse(BaseModel):
    id: int
    name: str
    section: str

    model_config = {"from_attributes": True}
