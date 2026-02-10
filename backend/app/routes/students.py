from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import Optional
from ..database import get_db
from ..models.student import Student
from ..schemas.student import StudentCreate, StudentUpdate, StudentResponse

router = APIRouter(prefix="/api/students", tags=["students"])


def _to_response(student: Student) -> dict:
    return {
        "id": student.id,
        "name": student.name,
        "email": student.email,
        "phone": student.phone,
        "class_id": student.class_id,
        "class_name": student.class_rel.name if student.class_rel else None,
    }


@router.get("/", response_model=list[StudentResponse])
def list_students(
    search: Optional[str] = Query(None),
    class_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Student).options(joinedload(Student.class_rel))
    if search:
        query = query.filter(
            Student.name.ilike(f"%{search}%")
            | Student.email.ilike(f"%{search}%")
        )
    if class_id:
        query = query.filter(Student.class_id == class_id)
    students = query.all()
    return [_to_response(s) for s in students]


@router.get("/{student_id}", response_model=StudentResponse)
def get_student(student_id: int, db: Session = Depends(get_db)):
    student = (
        db.query(Student)
        .options(joinedload(Student.class_rel))
        .filter(Student.id == student_id)
        .first()
    )
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return _to_response(student)


@router.post("/", response_model=StudentResponse, status_code=201)
def create_student(student: StudentCreate, db: Session = Depends(get_db)):
    existing = db.query(Student).filter(Student.email == student.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    db_student = Student(**student.model_dump())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    db_student = (
        db.query(Student)
        .options(joinedload(Student.class_rel))
        .filter(Student.id == db_student.id)
        .first()
    )
    return _to_response(db_student)


@router.put("/{student_id}", response_model=StudentResponse)
def update_student(
    student_id: int, student: StudentUpdate, db: Session = Depends(get_db)
):
    db_student = db.query(Student).filter(Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    update_data = student.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_student, key, value)
    db.commit()
    db.refresh(db_student)
    db_student = (
        db.query(Student)
        .options(joinedload(Student.class_rel))
        .filter(Student.id == db_student.id)
        .first()
    )
    return _to_response(db_student)


@router.delete("/{student_id}", status_code=204)
def delete_student(student_id: int, db: Session = Depends(get_db)):
    db_student = db.query(Student).filter(Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(db_student)
    db.commit()
