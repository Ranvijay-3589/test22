from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.school_class import SchoolClass
from schemas.school_class import ClassCreate, ClassUpdate, ClassResponse

router = APIRouter()


@router.get("/", response_model=list[ClassResponse])
def list_classes(
    search: Optional[str] = Query(None),
    grade_level: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(SchoolClass)
    if search:
        query = query.filter(SchoolClass.name.ilike(f"%{search}%"))
    if grade_level is not None:
        query = query.filter(SchoolClass.grade_level == grade_level)
    return query.all()


@router.get("/{class_id}", response_model=ClassResponse)
def get_class(class_id: int, db: Session = Depends(get_db)):
    school_class = db.query(SchoolClass).filter(SchoolClass.id == class_id).first()
    if not school_class:
        raise HTTPException(status_code=404, detail="Class not found")
    return school_class


@router.post("/", response_model=ClassResponse, status_code=201)
def create_class(school_class: ClassCreate, db: Session = Depends(get_db)):
    existing = db.query(SchoolClass).filter(SchoolClass.name == school_class.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Class name already exists")
    db_class = SchoolClass(**school_class.model_dump())
    db.add(db_class)
    db.commit()
    db.refresh(db_class)
    return db_class


@router.put("/{class_id}", response_model=ClassResponse)
def update_class(class_id: int, school_class: ClassUpdate, db: Session = Depends(get_db)):
    db_class = db.query(SchoolClass).filter(SchoolClass.id == class_id).first()
    if not db_class:
        raise HTTPException(status_code=404, detail="Class not found")
    for key, value in school_class.model_dump(exclude_unset=True).items():
        setattr(db_class, key, value)
    db.commit()
    db.refresh(db_class)
    return db_class


@router.delete("/{class_id}", status_code=204)
def delete_class(class_id: int, db: Session = Depends(get_db)):
    db_class = db.query(SchoolClass).filter(SchoolClass.id == class_id).first()
    if not db_class:
        raise HTTPException(status_code=404, detail="Class not found")
    db.delete(db_class)
    db.commit()
