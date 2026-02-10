from pydantic import BaseModel, EmailStr
from typing import Optional


class StudentCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    class_id: Optional[int] = None


class StudentUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    class_id: Optional[int] = None


class StudentResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    class_id: Optional[int] = None

    model_config = {"from_attributes": True}
