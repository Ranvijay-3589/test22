from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from database import Base


class SchoolClass(Base):
    __tablename__ = "classes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    grade_level = Column(Integer, nullable=False)
    section = Column(String, nullable=True)

    students = relationship("Student", back_populates="school_class")
    subjects = relationship("Subject", back_populates="school_class")
