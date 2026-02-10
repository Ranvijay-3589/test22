from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from database import Base


class Class(Base):
    __tablename__ = "classes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    section = Column(String, nullable=False)

    students = relationship("Student", back_populates="class_rel")
    subjects = relationship("Subject", back_populates="class_rel")


class Teacher(Base):
    __tablename__ = "teachers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String, nullable=True)

    subjects = relationship("Subject", back_populates="teacher")


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String, nullable=True)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=True)

    class_rel = relationship("Class", back_populates="students")


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    teacher_id = Column(Integer, ForeignKey("teachers.id"), nullable=True)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=True)

    teacher = relationship("Teacher", back_populates="subjects")
    class_rel = relationship("Class", back_populates="subjects")
