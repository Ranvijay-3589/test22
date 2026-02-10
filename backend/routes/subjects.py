from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models import Subject, Teacher, Class
from schemas.subject import SubjectCreate, SubjectUpdate, SubjectResponse

router = APIRouter()


@router.get("/", response_model=list[SubjectResponse])
def list_subjects(
    search: Optional[str] = Query(None),
    teacher_id: Optional[int] = Query(None),
    class_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Subject)
    if search:
        query = query.filter(
            Subject.name.ilike(f"%{search}%")
            | Subject.code.ilike(f"%{search}%")
        )
    if teacher_id:
        query = query.filter(Subject.teacher_id == teacher_id)
    if class_id:
        query = query.filter(Subject.class_id == class_id)
    subjects = query.all()
    result = []
    for s in subjects:
        data = SubjectResponse(
            id=s.id,
            name=s.name,
            code=s.code,
            teacher_id=s.teacher_id,
            class_id=s.class_id,
            teacher_name=s.teacher.name if s.teacher else None,
            class_name=s.subject_class.name if s.subject_class else None,
        )
        result.append(data)
    return result


@router.get("/{subject_id}", response_model=SubjectResponse)
def get_subject(subject_id: int, db: Session = Depends(get_db)):
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    return SubjectResponse(
        id=subject.id,
        name=subject.name,
        code=subject.code,
        teacher_id=subject.teacher_id,
        class_id=subject.class_id,
        teacher_name=subject.teacher.name if subject.teacher else None,
        class_name=subject.subject_class.name if subject.subject_class else None,
    )


@router.post("/", response_model=SubjectResponse, status_code=201)
def create_subject(subject: SubjectCreate, db: Session = Depends(get_db)):
    existing = db.query(Subject).filter(Subject.code == subject.code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Subject code already exists")
    if subject.teacher_id:
        teacher = db.query(Teacher).filter(Teacher.id == subject.teacher_id).first()
        if not teacher:
            raise HTTPException(status_code=400, detail="Teacher not found")
    if subject.class_id:
        cls = db.query(Class).filter(Class.id == subject.class_id).first()
        if not cls:
            raise HTTPException(status_code=400, detail="Class not found")
    db_subject = Subject(**subject.model_dump())
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return SubjectResponse(
        id=db_subject.id,
        name=db_subject.name,
        code=db_subject.code,
        teacher_id=db_subject.teacher_id,
        class_id=db_subject.class_id,
        teacher_name=db_subject.teacher.name if db_subject.teacher else None,
        class_name=db_subject.subject_class.name if db_subject.subject_class else None,
    )


@router.put("/{subject_id}", response_model=SubjectResponse)
def update_subject(
    subject_id: int, subject: SubjectUpdate, db: Session = Depends(get_db)
):
    db_subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not db_subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    update_data = subject.model_dump(exclude_unset=True)
    if "code" in update_data:
        existing = (
            db.query(Subject)
            .filter(Subject.code == update_data["code"], Subject.id != subject_id)
            .first()
        )
        if existing:
            raise HTTPException(status_code=400, detail="Subject code already exists")
    if "teacher_id" in update_data and update_data["teacher_id"]:
        teacher = (
            db.query(Teacher).filter(Teacher.id == update_data["teacher_id"]).first()
        )
        if not teacher:
            raise HTTPException(status_code=400, detail="Teacher not found")
    if "class_id" in update_data and update_data["class_id"]:
        cls = db.query(Class).filter(Class.id == update_data["class_id"]).first()
        if not cls:
            raise HTTPException(status_code=400, detail="Class not found")
    for key, value in update_data.items():
        setattr(db_subject, key, value)
    db.commit()
    db.refresh(db_subject)
    return SubjectResponse(
        id=db_subject.id,
        name=db_subject.name,
        code=db_subject.code,
        teacher_id=db_subject.teacher_id,
        class_id=db_subject.class_id,
        teacher_name=db_subject.teacher.name if db_subject.teacher else None,
        class_name=db_subject.subject_class.name if db_subject.subject_class else None,
    )


@router.delete("/{subject_id}")
def delete_subject(subject_id: int, db: Session = Depends(get_db)):
    db_subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not db_subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    db.delete(db_subject)
    db.commit()
    return {"message": "Subject deleted successfully"}
