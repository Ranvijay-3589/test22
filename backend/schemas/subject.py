from pydantic import BaseModel
from typing import Optional


class SubjectCreate(BaseModel):
    name: str
    code: str
    teacher_id: Optional[int] = None
    class_id: Optional[int] = None


class SubjectUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    teacher_id: Optional[int] = None
    class_id: Optional[int] = None


class SubjectResponse(BaseModel):
    id: int
    name: str
    code: str
    teacher_id: Optional[int] = None
    class_id: Optional[int] = None

    model_config = {"from_attributes": True}
