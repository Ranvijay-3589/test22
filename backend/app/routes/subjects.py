from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import Optional
from ..database import get_db
from ..models.subject import Subject
from ..schemas.subject import SubjectCreate, SubjectUpdate, SubjectResponse

router = APIRouter(prefix="/api/subjects", tags=["subjects"])


def _to_response(subject: Subject) -> dict:
    return {
        "id": subject.id,
        "name": subject.name,
        "code": subject.code,
        "teacher_id": subject.teacher_id,
        "class_id": subject.class_id,
        "teacher_name": subject.teacher.name if subject.teacher else None,
        "class_name": subject.class_rel.name if subject.class_rel else None,
    }


@router.get("/", response_model=list[SubjectResponse])
def list_subjects(
    search: Optional[str] = Query(None),
    teacher_id: Optional[int] = Query(None),
    class_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Subject).options(
        joinedload(Subject.teacher), joinedload(Subject.class_rel)
    )
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
    return [_to_response(s) for s in subjects]


@router.get("/{subject_id}", response_model=SubjectResponse)
def get_subject(subject_id: int, db: Session = Depends(get_db)):
    subject = (
        db.query(Subject)
        .options(joinedload(Subject.teacher), joinedload(Subject.class_rel))
        .filter(Subject.id == subject_id)
        .first()
    )
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    return _to_response(subject)


@router.post("/", response_model=SubjectResponse, status_code=201)
def create_subject(subject: SubjectCreate, db: Session = Depends(get_db)):
    existing = db.query(Subject).filter(Subject.code == subject.code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Subject code already exists")
    db_subject = Subject(**subject.model_dump())
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    db_subject = (
        db.query(Subject)
        .options(joinedload(Subject.teacher), joinedload(Subject.class_rel))
        .filter(Subject.id == db_subject.id)
        .first()
    )
    return _to_response(db_subject)


@router.put("/{subject_id}", response_model=SubjectResponse)
def update_subject(
    subject_id: int, subject: SubjectUpdate, db: Session = Depends(get_db)
):
    db_subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not db_subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    update_data = subject.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_subject, key, value)
    db.commit()
    db.refresh(db_subject)
    db_subject = (
        db.query(Subject)
        .options(joinedload(Subject.teacher), joinedload(Subject.class_rel))
        .filter(Subject.id == db_subject.id)
        .first()
    )
    return _to_response(db_subject)


@router.delete("/{subject_id}", status_code=204)
def delete_subject(subject_id: int, db: Session = Depends(get_db)):
    db_subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not db_subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    db.delete(db_subject)
    db.commit()
