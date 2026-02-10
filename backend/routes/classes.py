from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models import Class
from schemas.class_schema import ClassCreate, ClassUpdate, ClassResponse

router = APIRouter()


@router.get("/", response_model=list[ClassResponse])
def list_classes(
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Class)
    if search:
        query = query.filter(
            Class.name.ilike(f"%{search}%")
            | Class.section.ilike(f"%{search}%")
        )
    return query.all()


@router.get("/{class_id}", response_model=ClassResponse)
def get_class(class_id: int, db: Session = Depends(get_db)):
    cls = db.query(Class).filter(Class.id == class_id).first()
    if not cls:
        raise HTTPException(status_code=404, detail="Class not found")
    return cls


@router.post("/", response_model=ClassResponse, status_code=201)
def create_class(cls: ClassCreate, db: Session = Depends(get_db)):
    db_class = Class(**cls.model_dump())
    db.add(db_class)
    db.commit()
    db.refresh(db_class)
    return db_class


@router.put("/{class_id}", response_model=ClassResponse)
def update_class(
    class_id: int, cls: ClassUpdate, db: Session = Depends(get_db)
):
    db_class = db.query(Class).filter(Class.id == class_id).first()
    if not db_class:
        raise HTTPException(status_code=404, detail="Class not found")
    update_data = cls.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_class, key, value)
    db.commit()
    db.refresh(db_class)
    return db_class


@router.delete("/{class_id}")
def delete_class(class_id: int, db: Session = Depends(get_db)):
    db_class = db.query(Class).filter(Class.id == class_id).first()
    if not db_class:
        raise HTTPException(status_code=404, detail="Class not found")
    db.delete(db_class)
    db.commit()
    return {"message": "Class deleted successfully"}
