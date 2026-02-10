from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from database import Base


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    code = Column(String, unique=True, nullable=False)
    teacher_id = Column(Integer, ForeignKey("teachers.id"), nullable=True)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=True)

    teacher = relationship("Teacher", back_populates="subjects")
    school_class = relationship("SchoolClass", back_populates="subjects")
