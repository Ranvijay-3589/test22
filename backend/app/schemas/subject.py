from pydantic import BaseModel
from typing import Optional


class SubjectBase(BaseModel):
    name: str
    code: str
    teacher_id: Optional[int] = None
    class_id: Optional[int] = None


class SubjectCreate(SubjectBase):
    pass


class SubjectUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    teacher_id: Optional[int] = None
    class_id: Optional[int] = None


class SubjectResponse(SubjectBase):
    id: int
    teacher_name: Optional[str] = None
    class_name: Optional[str] = None

    model_config = {"from_attributes": True}
