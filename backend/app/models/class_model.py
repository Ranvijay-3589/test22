from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from ..database import Base


class Class(Base):
    __tablename__ = "classes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    section = Column(String, nullable=True)
    room_number = Column(String, nullable=True)

    students = relationship("Student", back_populates="class_rel")
    subjects = relationship("Subject", back_populates="class_rel")
