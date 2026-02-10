from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from ..database import get_db
from ..models.teacher import Teacher
from ..schemas.teacher import TeacherCreate, TeacherUpdate, TeacherResponse

router = APIRouter(prefix="/api/teachers", tags=["teachers"])


@router.get("/", response_model=list[TeacherResponse])
def list_teachers(
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Teacher)
    if search:
        query = query.filter(
            Teacher.name.ilike(f"%{search}%")
            | Teacher.email.ilike(f"%{search}%")
            | Teacher.department.ilike(f"%{search}%")
        )
    return query.all()


@router.get("/{teacher_id}", response_model=TeacherResponse)
def get_teacher(teacher_id: int, db: Session = Depends(get_db)):
    teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return teacher


@router.post("/", response_model=TeacherResponse, status_code=201)
def create_teacher(teacher: TeacherCreate, db: Session = Depends(get_db)):
    existing = db.query(Teacher).filter(Teacher.email == teacher.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    db_teacher = Teacher(**teacher.model_dump())
    db.add(db_teacher)
    db.commit()
    db.refresh(db_teacher)
    return db_teacher


@router.put("/{teacher_id}", response_model=TeacherResponse)
def update_teacher(
    teacher_id: int, teacher: TeacherUpdate, db: Session = Depends(get_db)
):
    db_teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if not db_teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    update_data = teacher.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_teacher, key, value)
    db.commit()
    db.refresh(db_teacher)
    return db_teacher


@router.delete("/{teacher_id}", status_code=204)
def delete_teacher(teacher_id: int, db: Session = Depends(get_db)):
    db_teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if not db_teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    db.delete(db_teacher)
    db.commit()
