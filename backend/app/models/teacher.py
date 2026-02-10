from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from ..database import Base


class Teacher(Base):
    __tablename__ = "teachers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String, nullable=True)
    department = Column(String, nullable=True)

    subjects = relationship("Subject", back_populates="teacher")
