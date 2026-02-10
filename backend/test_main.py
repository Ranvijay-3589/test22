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
client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


# Health check
def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json() == {"status": "healthy"}


# --- Classes ---
def test_create_class():
    res = client.post("/api/classes/", json={"name": "10th", "section": "A"})
    assert res.status_code == 201
    assert res.json()["name"] == "10th"


def test_list_classes():
    client.post("/api/classes/", json={"name": "10th", "section": "A"})
    res = client.get("/api/classes/")
    assert res.status_code == 200
    assert len(res.json()) == 1


def test_get_class():
    client.post("/api/classes/", json={"name": "10th", "section": "A"})
    res = client.get("/api/classes/1")
    assert res.status_code == 200
    assert res.json()["name"] == "10th"


def test_update_class():
    client.post("/api/classes/", json={"name": "10th", "section": "A"})
    res = client.put("/api/classes/1", json={"name": "11th"})
    assert res.status_code == 200
    assert res.json()["name"] == "11th"


def test_delete_class():
    client.post("/api/classes/", json={"name": "10th", "section": "A"})
    res = client.delete("/api/classes/1")
    assert res.status_code == 204


def test_get_class_not_found():
    res = client.get("/api/classes/999")
    assert res.status_code == 404


def test_search_classes():
    client.post("/api/classes/", json={"name": "10th", "section": "A"})
    client.post("/api/classes/", json={"name": "11th", "section": "B"})
    res = client.get("/api/classes/?search=10")
    assert len(res.json()) == 1


# --- Teachers ---
def test_create_teacher():
    res = client.post("/api/teachers/", json={"name": "John", "email": "john@school.com"})
    assert res.status_code == 201
    assert res.json()["name"] == "John"


def test_list_teachers():
    client.post("/api/teachers/", json={"name": "John", "email": "john@school.com"})
    res = client.get("/api/teachers/")
    assert res.status_code == 200
    assert len(res.json()) == 1


def test_get_teacher():
    client.post("/api/teachers/", json={"name": "John", "email": "john@school.com"})
    res = client.get("/api/teachers/1")
    assert res.status_code == 200


def test_update_teacher():
    client.post("/api/teachers/", json={"name": "John", "email": "john@school.com"})
    res = client.put("/api/teachers/1", json={"name": "Jane"})
    assert res.status_code == 200
    assert res.json()["name"] == "Jane"


def test_delete_teacher():
    client.post("/api/teachers/", json={"name": "John", "email": "john@school.com"})
    res = client.delete("/api/teachers/1")
    assert res.status_code == 204


def test_get_teacher_not_found():
    res = client.get("/api/teachers/999")
    assert res.status_code == 404


def test_search_teachers():
    client.post("/api/teachers/", json={"name": "John", "email": "john@school.com"})
    client.post("/api/teachers/", json={"name": "Jane", "email": "jane@school.com"})
    res = client.get("/api/teachers/?search=Jane")
    assert len(res.json()) == 1


# --- Students ---
def test_create_student():
    res = client.post("/api/students/", json={"name": "Alice", "email": "alice@school.com"})
    assert res.status_code == 201
    assert res.json()["name"] == "Alice"


def test_list_students():
    client.post("/api/students/", json={"name": "Alice", "email": "alice@school.com"})
    res = client.get("/api/students/")
    assert res.status_code == 200
    assert len(res.json()) == 1


def test_get_student():
    client.post("/api/students/", json={"name": "Alice", "email": "alice@school.com"})
    res = client.get("/api/students/1")
    assert res.status_code == 200


def test_update_student():
    client.post("/api/students/", json={"name": "Alice", "email": "alice@school.com"})
    res = client.put("/api/students/1", json={"name": "Bob"})
    assert res.status_code == 200
    assert res.json()["name"] == "Bob"


def test_delete_student():
    client.post("/api/students/", json={"name": "Alice", "email": "alice@school.com"})
    res = client.delete("/api/students/1")
    assert res.status_code == 204


def test_get_student_not_found():
    res = client.get("/api/students/999")
    assert res.status_code == 404


def test_search_students():
    client.post("/api/students/", json={"name": "Alice", "email": "alice@school.com"})
    client.post("/api/students/", json={"name": "Bob", "email": "bob@school.com"})
    res = client.get("/api/students/?search=Alice")
    assert len(res.json()) == 1


def test_student_with_class():
    client.post("/api/classes/", json={"name": "10th", "section": "A"})
    res = client.post("/api/students/", json={"name": "Alice", "email": "alice@school.com", "class_id": 1})
    assert res.status_code == 201
    assert res.json()["class_id"] == 1


def test_filter_students_by_class():
    client.post("/api/classes/", json={"name": "10th", "section": "A"})
    client.post("/api/students/", json={"name": "Alice", "email": "alice@school.com", "class_id": 1})
    client.post("/api/students/", json={"name": "Bob", "email": "bob@school.com"})
    res = client.get("/api/students/?class_id=1")
    assert len(res.json()) == 1


# --- Subjects ---
def test_create_subject():
    res = client.post("/api/subjects/", json={"name": "Math"})
    assert res.status_code == 201
    assert res.json()["name"] == "Math"


def test_list_subjects():
    client.post("/api/subjects/", json={"name": "Math"})
    res = client.get("/api/subjects/")
    assert res.status_code == 200
    assert len(res.json()) == 1


def test_get_subject():
    client.post("/api/subjects/", json={"name": "Math"})
    res = client.get("/api/subjects/1")
    assert res.status_code == 200


def test_update_subject():
    client.post("/api/subjects/", json={"name": "Math"})
    res = client.put("/api/subjects/1", json={"name": "Science"})
    assert res.status_code == 200
    assert res.json()["name"] == "Science"


def test_delete_subject():
    client.post("/api/subjects/", json={"name": "Math"})
    res = client.delete("/api/subjects/1")
    assert res.status_code == 204


def test_get_subject_not_found():
    res = client.get("/api/subjects/999")
    assert res.status_code == 404


def test_search_subjects():
    client.post("/api/subjects/", json={"name": "Math"})
    client.post("/api/subjects/", json={"name": "Science"})
    res = client.get("/api/subjects/?search=Math")
    assert len(res.json()) == 1


def test_subject_with_teacher_and_class():
    client.post("/api/teachers/", json={"name": "John", "email": "john@school.com"})
    client.post("/api/classes/", json={"name": "10th", "section": "A"})
    res = client.post("/api/subjects/", json={"name": "Math", "teacher_id": 1, "class_id": 1})
    assert res.status_code == 201
    assert res.json()["teacher_id"] == 1
    assert res.json()["class_id"] == 1


def test_filter_subjects_by_teacher():
    client.post("/api/teachers/", json={"name": "John", "email": "john@school.com"})
    client.post("/api/subjects/", json={"name": "Math", "teacher_id": 1})
    client.post("/api/subjects/", json={"name": "Science"})
    res = client.get("/api/subjects/?teacher_id=1")
    assert len(res.json()) == 1
