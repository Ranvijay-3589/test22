from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models import Student, Class
from schemas.student import StudentCreate, StudentUpdate, StudentResponse

router = APIRouter()


@router.get("/", response_model=list[StudentResponse])
def list_students(
    search: Optional[str] = Query(None),
    class_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Student)
    if search:
        query = query.filter(
            Student.name.ilike(f"%{search}%")
            | Student.email.ilike(f"%{search}%")
        )
    if class_id:
        query = query.filter(Student.class_id == class_id)
    students = query.all()
    result = []
    for s in students:
        data = StudentResponse(
            id=s.id,
            name=s.name,
            email=s.email,
            phone=s.phone,
            class_id=s.class_id,
            class_name=s.student_class.name if s.student_class else None,
        )
        result.append(data)
    return result


@router.get("/{student_id}", response_model=StudentResponse)
def get_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return StudentResponse(
        id=student.id,
        name=student.name,
        email=student.email,
        phone=student.phone,
        class_id=student.class_id,
        class_name=student.student_class.name if student.student_class else None,
    )


@router.post("/", response_model=StudentResponse, status_code=201)
def create_student(student: StudentCreate, db: Session = Depends(get_db)):
    existing = db.query(Student).filter(Student.email == student.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    if student.class_id:
        cls = db.query(Class).filter(Class.id == student.class_id).first()
        if not cls:
            raise HTTPException(status_code=400, detail="Class not found")
    db_student = Student(**student.model_dump())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return StudentResponse(
        id=db_student.id,
        name=db_student.name,
        email=db_student.email,
        phone=db_student.phone,
        class_id=db_student.class_id,
        class_name=db_student.student_class.name if db_student.student_class else None,
    )


@router.put("/{student_id}", response_model=StudentResponse)
def update_student(
    student_id: int, student: StudentUpdate, db: Session = Depends(get_db)
):
    db_student = db.query(Student).filter(Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    update_data = student.model_dump(exclude_unset=True)
    if "email" in update_data:
        existing = (
            db.query(Student)
            .filter(Student.email == update_data["email"], Student.id != student_id)
            .first()
        )
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
    if "class_id" in update_data and update_data["class_id"]:
        cls = db.query(Class).filter(Class.id == update_data["class_id"]).first()
        if not cls:
            raise HTTPException(status_code=400, detail="Class not found")
    for key, value in update_data.items():
        setattr(db_student, key, value)
    db.commit()
    db.refresh(db_student)
    return StudentResponse(
        id=db_student.id,
        name=db_student.name,
        email=db_student.email,
        phone=db_student.phone,
        class_id=db_student.class_id,
        class_name=db_student.student_class.name if db_student.student_class else None,
    )


@router.delete("/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    db_student = db.query(Student).filter(Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(db_student)
    db.commit()
    return {"message": "Student deleted successfully"}
