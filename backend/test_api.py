import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from database import Base, get_db
from main import app

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


client = TestClient(app)


# ── Health ──────────────────────────────────────────────
def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "healthy"


# ── Students CRUD ───────────────────────────────────────
def test_create_student():
    r = client.post("/api/students/", json={"first_name": "Alice", "last_name": "Smith", "email": "alice@test.com"})
    assert r.status_code == 201
    assert r.json()["first_name"] == "Alice"


def test_create_student_duplicate_email():
    client.post("/api/students/", json={"first_name": "A", "last_name": "B", "email": "dup@test.com"})
    r = client.post("/api/students/", json={"first_name": "C", "last_name": "D", "email": "dup@test.com"})
    assert r.status_code == 400


def test_list_students():
    client.post("/api/students/", json={"first_name": "A", "last_name": "B", "email": "a@test.com"})
    r = client.get("/api/students/")
    assert r.status_code == 200
    assert len(r.json()) >= 1


def test_get_student():
    cr = client.post("/api/students/", json={"first_name": "A", "last_name": "B", "email": "g@test.com"})
    sid = cr.json()["id"]
    r = client.get(f"/api/students/{sid}")
    assert r.status_code == 200
    assert r.json()["email"] == "g@test.com"


def test_get_student_not_found():
    r = client.get("/api/students/9999")
    assert r.status_code == 404


def test_update_student():
    cr = client.post("/api/students/", json={"first_name": "A", "last_name": "B", "email": "u@test.com"})
    sid = cr.json()["id"]
    r = client.put(f"/api/students/{sid}", json={"first_name": "Updated"})
    assert r.status_code == 200
    assert r.json()["first_name"] == "Updated"


def test_update_student_not_found():
    r = client.put("/api/students/9999", json={"first_name": "X"})
    assert r.status_code == 404


def test_delete_student():
    cr = client.post("/api/students/", json={"first_name": "A", "last_name": "B", "email": "d@test.com"})
    sid = cr.json()["id"]
    r = client.delete(f"/api/students/{sid}")
    assert r.status_code == 204


def test_delete_student_not_found():
    r = client.delete("/api/students/9999")
    assert r.status_code == 404


def test_search_students():
    client.post("/api/students/", json={"first_name": "Charlie", "last_name": "Brown", "email": "cb@test.com"})
    r = client.get("/api/students/?search=Charlie")
    assert r.status_code == 200
    assert any(s["first_name"] == "Charlie" for s in r.json())


# ── Teachers CRUD ───────────────────────────────────────
def test_create_teacher():
    r = client.post("/api/teachers/", json={"first_name": "John", "last_name": "Doe", "email": "john@test.com", "department": "Math"})
    assert r.status_code == 201
    assert r.json()["department"] == "Math"


def test_create_teacher_duplicate_email():
    client.post("/api/teachers/", json={"first_name": "A", "last_name": "B", "email": "tdup@test.com"})
    r = client.post("/api/teachers/", json={"first_name": "C", "last_name": "D", "email": "tdup@test.com"})
    assert r.status_code == 400


def test_list_teachers():
    client.post("/api/teachers/", json={"first_name": "A", "last_name": "B", "email": "tl@test.com"})
    r = client.get("/api/teachers/")
    assert r.status_code == 200
    assert len(r.json()) >= 1


def test_get_teacher():
    cr = client.post("/api/teachers/", json={"first_name": "A", "last_name": "B", "email": "tg@test.com"})
    tid = cr.json()["id"]
    r = client.get(f"/api/teachers/{tid}")
    assert r.status_code == 200


def test_get_teacher_not_found():
    r = client.get("/api/teachers/9999")
    assert r.status_code == 404


def test_update_teacher():
    cr = client.post("/api/teachers/", json={"first_name": "A", "last_name": "B", "email": "tu@test.com"})
    tid = cr.json()["id"]
    r = client.put(f"/api/teachers/{tid}", json={"department": "Science"})
    assert r.status_code == 200
    assert r.json()["department"] == "Science"


def test_update_teacher_not_found():
    r = client.put("/api/teachers/9999", json={"first_name": "X"})
    assert r.status_code == 404


def test_delete_teacher():
    cr = client.post("/api/teachers/", json={"first_name": "A", "last_name": "B", "email": "td@test.com"})
    tid = cr.json()["id"]
    r = client.delete(f"/api/teachers/{tid}")
    assert r.status_code == 204


def test_delete_teacher_not_found():
    r = client.delete("/api/teachers/9999")
    assert r.status_code == 404


def test_search_teachers():
    client.post("/api/teachers/", json={"first_name": "Jane", "last_name": "Smith", "email": "js@test.com"})
    r = client.get("/api/teachers/?search=Jane")
    assert any(t["first_name"] == "Jane" for t in r.json())


# ── Classes CRUD ────────────────────────────────────────
def test_create_class():
    r = client.post("/api/classes/", json={"name": "10-A", "grade_level": 10, "section": "A"})
    assert r.status_code == 201
    assert r.json()["name"] == "10-A"


def test_create_class_duplicate_name():
    client.post("/api/classes/", json={"name": "Dup", "grade_level": 1})
    r = client.post("/api/classes/", json={"name": "Dup", "grade_level": 1})
    assert r.status_code == 400


def test_list_classes():
    client.post("/api/classes/", json={"name": "CL1", "grade_level": 1})
    r = client.get("/api/classes/")
    assert r.status_code == 200
    assert len(r.json()) >= 1


def test_get_class():
    cr = client.post("/api/classes/", json={"name": "CL2", "grade_level": 2})
    cid = cr.json()["id"]
    r = client.get(f"/api/classes/{cid}")
    assert r.status_code == 200


def test_get_class_not_found():
    r = client.get("/api/classes/9999")
    assert r.status_code == 404


def test_update_class():
    cr = client.post("/api/classes/", json={"name": "CL3", "grade_level": 3})
    cid = cr.json()["id"]
    r = client.put(f"/api/classes/{cid}", json={"section": "B"})
    assert r.status_code == 200
    assert r.json()["section"] == "B"


def test_update_class_not_found():
    r = client.put("/api/classes/9999", json={"name": "X"})
    assert r.status_code == 404


def test_delete_class():
    cr = client.post("/api/classes/", json={"name": "CL4", "grade_level": 4})
    cid = cr.json()["id"]
    r = client.delete(f"/api/classes/{cid}")
    assert r.status_code == 204


def test_delete_class_not_found():
    r = client.delete("/api/classes/9999")
    assert r.status_code == 404


def test_search_classes():
    client.post("/api/classes/", json={"name": "Advanced", "grade_level": 12})
    r = client.get("/api/classes/?search=Advanced")
    assert any(c["name"] == "Advanced" for c in r.json())


# ── Subjects CRUD ───────────────────────────────────────
def test_create_subject():
    r = client.post("/api/subjects/", json={"name": "Mathematics", "code": "MATH101"})
    assert r.status_code == 201
    assert r.json()["code"] == "MATH101"


def test_create_subject_duplicate_code():
    client.post("/api/subjects/", json={"name": "A", "code": "DUP1"})
    r = client.post("/api/subjects/", json={"name": "B", "code": "DUP1"})
    assert r.status_code == 400


def test_list_subjects():
    client.post("/api/subjects/", json={"name": "Sci", "code": "SCI1"})
    r = client.get("/api/subjects/")
    assert r.status_code == 200
    assert len(r.json()) >= 1


def test_get_subject():
    cr = client.post("/api/subjects/", json={"name": "Eng", "code": "ENG1"})
    sid = cr.json()["id"]
    r = client.get(f"/api/subjects/{sid}")
    assert r.status_code == 200


def test_get_subject_not_found():
    r = client.get("/api/subjects/9999")
    assert r.status_code == 404


def test_update_subject():
    cr = client.post("/api/subjects/", json={"name": "Art", "code": "ART1"})
    sid = cr.json()["id"]
    r = client.put(f"/api/subjects/{sid}", json={"name": "Fine Art"})
    assert r.status_code == 200
    assert r.json()["name"] == "Fine Art"


def test_update_subject_not_found():
    r = client.put("/api/subjects/9999", json={"name": "X"})
    assert r.status_code == 404


def test_delete_subject():
    cr = client.post("/api/subjects/", json={"name": "Music", "code": "MUS1"})
    sid = cr.json()["id"]
    r = client.delete(f"/api/subjects/{sid}")
    assert r.status_code == 204


def test_delete_subject_not_found():
    r = client.delete("/api/subjects/9999")
    assert r.status_code == 404


def test_search_subjects():
    client.post("/api/subjects/", json={"name": "Physics", "code": "PHY1"})
    r = client.get("/api/subjects/?search=Physics")
    assert any(s["name"] == "Physics" for s in r.json())
