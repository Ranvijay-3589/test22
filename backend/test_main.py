import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from database import Base, get_db
from main import app

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
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
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


# --- Class CRUD ---
def test_create_class():
    response = client.post(
        "/api/classes/", json={"name": "Grade 10", "section": "A", "room_number": "101"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Grade 10"
    assert data["section"] == "A"


def test_list_classes():
    client.post("/api/classes/", json={"name": "Grade 10", "section": "A"})
    client.post("/api/classes/", json={"name": "Grade 11", "section": "B"})
    response = client.get("/api/classes/")
    assert response.status_code == 200
    assert len(response.json()) == 2


def test_get_class():
    res = client.post("/api/classes/", json={"name": "Grade 10", "section": "A"})
    class_id = res.json()["id"]
    response = client.get(f"/api/classes/{class_id}")
    assert response.status_code == 200
    assert response.json()["name"] == "Grade 10"


def test_update_class():
    res = client.post("/api/classes/", json={"name": "Grade 10", "section": "A"})
    class_id = res.json()["id"]
    response = client.put(f"/api/classes/{class_id}", json={"name": "Grade 12"})
    assert response.status_code == 200
    assert response.json()["name"] == "Grade 12"


def test_delete_class():
    res = client.post("/api/classes/", json={"name": "Grade 10", "section": "A"})
    class_id = res.json()["id"]
    response = client.delete(f"/api/classes/{class_id}")
    assert response.status_code == 200
    response = client.get(f"/api/classes/{class_id}")
    assert response.status_code == 404


def test_search_classes():
    client.post("/api/classes/", json={"name": "Grade 10", "section": "A"})
    client.post("/api/classes/", json={"name": "Grade 11", "section": "B"})
    response = client.get("/api/classes/?search=Grade 10")
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_get_class_not_found():
    response = client.get("/api/classes/999")
    assert response.status_code == 404


# --- Teacher CRUD ---
def test_create_teacher():
    response = client.post(
        "/api/teachers/",
        json={"name": "John Doe", "email": "john@school.com", "department": "Math"},
    )
    assert response.status_code == 201
    assert response.json()["name"] == "John Doe"


def test_create_teacher_duplicate_email():
    client.post(
        "/api/teachers/", json={"name": "John", "email": "john@school.com"}
    )
    response = client.post(
        "/api/teachers/", json={"name": "Jane", "email": "john@school.com"}
    )
    assert response.status_code == 400


def test_list_teachers():
    client.post("/api/teachers/", json={"name": "John", "email": "john@school.com"})
    client.post("/api/teachers/", json={"name": "Jane", "email": "jane@school.com"})
    response = client.get("/api/teachers/")
    assert response.status_code == 200
    assert len(response.json()) == 2


def test_get_teacher():
    res = client.post(
        "/api/teachers/", json={"name": "John", "email": "john@school.com"}
    )
    teacher_id = res.json()["id"]
    response = client.get(f"/api/teachers/{teacher_id}")
    assert response.status_code == 200
    assert response.json()["name"] == "John"


def test_update_teacher():
    res = client.post(
        "/api/teachers/", json={"name": "John", "email": "john@school.com"}
    )
    teacher_id = res.json()["id"]
    response = client.put(
        f"/api/teachers/{teacher_id}", json={"department": "Science"}
    )
    assert response.status_code == 200
    assert response.json()["department"] == "Science"


def test_delete_teacher():
    res = client.post(
        "/api/teachers/", json={"name": "John", "email": "john@school.com"}
    )
    teacher_id = res.json()["id"]
    response = client.delete(f"/api/teachers/{teacher_id}")
    assert response.status_code == 200
    response = client.get(f"/api/teachers/{teacher_id}")
    assert response.status_code == 404


def test_search_teachers():
    client.post(
        "/api/teachers/",
        json={"name": "John", "email": "john@school.com", "department": "Math"},
    )
    client.post(
        "/api/teachers/",
        json={"name": "Jane", "email": "jane@school.com", "department": "Science"},
    )
    response = client.get("/api/teachers/?search=John")
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_get_teacher_not_found():
    response = client.get("/api/teachers/999")
    assert response.status_code == 404


# --- Student CRUD ---
def test_create_student():
    response = client.post(
        "/api/students/",
        json={"name": "Alice", "email": "alice@student.com"},
    )
    assert response.status_code == 201
    assert response.json()["name"] == "Alice"


def test_create_student_with_class():
    cls = client.post("/api/classes/", json={"name": "Grade 10", "section": "A"})
    class_id = cls.json()["id"]
    response = client.post(
        "/api/students/",
        json={"name": "Alice", "email": "alice@student.com", "class_id": class_id},
    )
    assert response.status_code == 201
    assert response.json()["class_id"] == class_id
    assert response.json()["class_name"] == "Grade 10"


def test_create_student_duplicate_email():
    client.post("/api/students/", json={"name": "Alice", "email": "alice@student.com"})
    response = client.post(
        "/api/students/", json={"name": "Bob", "email": "alice@student.com"}
    )
    assert response.status_code == 400


def test_list_students():
    client.post("/api/students/", json={"name": "Alice", "email": "alice@student.com"})
    client.post("/api/students/", json={"name": "Bob", "email": "bob@student.com"})
    response = client.get("/api/students/")
    assert response.status_code == 200
    assert len(response.json()) == 2


def test_get_student():
    res = client.post(
        "/api/students/", json={"name": "Alice", "email": "alice@student.com"}
    )
    student_id = res.json()["id"]
    response = client.get(f"/api/students/{student_id}")
    assert response.status_code == 200
    assert response.json()["name"] == "Alice"


def test_update_student():
    res = client.post(
        "/api/students/", json={"name": "Alice", "email": "alice@student.com"}
    )
    student_id = res.json()["id"]
    response = client.put(
        f"/api/students/{student_id}", json={"phone": "123-456-7890"}
    )
    assert response.status_code == 200
    assert response.json()["phone"] == "123-456-7890"


def test_delete_student():
    res = client.post(
        "/api/students/", json={"name": "Alice", "email": "alice@student.com"}
    )
    student_id = res.json()["id"]
    response = client.delete(f"/api/students/{student_id}")
    assert response.status_code == 200
    response = client.get(f"/api/students/{student_id}")
    assert response.status_code == 404


def test_search_students():
    client.post("/api/students/", json={"name": "Alice", "email": "alice@student.com"})
    client.post("/api/students/", json={"name": "Bob", "email": "bob@student.com"})
    response = client.get("/api/students/?search=Alice")
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_get_student_not_found():
    response = client.get("/api/students/999")
    assert response.status_code == 404


# --- Subject CRUD ---
def test_create_subject():
    response = client.post(
        "/api/subjects/", json={"name": "Mathematics", "code": "MATH101"}
    )
    assert response.status_code == 201
    assert response.json()["name"] == "Mathematics"


def test_create_subject_with_teacher_and_class():
    teacher = client.post(
        "/api/teachers/", json={"name": "John", "email": "john@school.com"}
    )
    cls = client.post("/api/classes/", json={"name": "Grade 10", "section": "A"})
    response = client.post(
        "/api/subjects/",
        json={
            "name": "Mathematics",
            "code": "MATH101",
            "teacher_id": teacher.json()["id"],
            "class_id": cls.json()["id"],
        },
    )
    assert response.status_code == 201
    assert response.json()["teacher_name"] == "John"
    assert response.json()["class_name"] == "Grade 10"


def test_create_subject_duplicate_code():
    client.post("/api/subjects/", json={"name": "Math", "code": "MATH101"})
    response = client.post(
        "/api/subjects/", json={"name": "Maths", "code": "MATH101"}
    )
    assert response.status_code == 400


def test_list_subjects():
    client.post("/api/subjects/", json={"name": "Math", "code": "MATH101"})
    client.post("/api/subjects/", json={"name": "Science", "code": "SCI101"})
    response = client.get("/api/subjects/")
    assert response.status_code == 200
    assert len(response.json()) == 2


def test_get_subject():
    res = client.post("/api/subjects/", json={"name": "Math", "code": "MATH101"})
    subject_id = res.json()["id"]
    response = client.get(f"/api/subjects/{subject_id}")
    assert response.status_code == 200
    assert response.json()["name"] == "Math"


def test_update_subject():
    res = client.post("/api/subjects/", json={"name": "Math", "code": "MATH101"})
    subject_id = res.json()["id"]
    response = client.put(
        f"/api/subjects/{subject_id}", json={"name": "Advanced Math"}
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Advanced Math"


def test_delete_subject():
    res = client.post("/api/subjects/", json={"name": "Math", "code": "MATH101"})
    subject_id = res.json()["id"]
    response = client.delete(f"/api/subjects/{subject_id}")
    assert response.status_code == 200
    response = client.get(f"/api/subjects/{subject_id}")
    assert response.status_code == 404


def test_search_subjects():
    client.post("/api/subjects/", json={"name": "Math", "code": "MATH101"})
    client.post("/api/subjects/", json={"name": "Science", "code": "SCI101"})
    response = client.get("/api/subjects/?search=Math")
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_get_subject_not_found():
    response = client.get("/api/subjects/999")
    assert response.status_code == 404
