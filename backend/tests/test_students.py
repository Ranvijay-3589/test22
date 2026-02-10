def test_create_student(client):
    resp = client.post("/api/students/", json={
        "name": "Jane Doe",
        "email": "jane@school.com",
        "phone": "555-0201",
    })
    assert resp.status_code == 201
    assert resp.json()["name"] == "Jane Doe"


def test_create_student_with_class(client):
    cls = client.post("/api/classes/", json={"name": "Grade 10"}).json()
    resp = client.post("/api/students/", json={
        "name": "Bob",
        "email": "bob@school.com",
        "class_id": cls["id"],
    })
    assert resp.status_code == 201
    assert resp.json()["class_name"] == "Grade 10"


def test_create_student_duplicate_email(client):
    student = {"name": "A", "email": "dup@school.com"}
    client.post("/api/students/", json=student)
    resp = client.post("/api/students/", json=student)
    assert resp.status_code == 400


def test_list_students(client):
    client.post("/api/students/", json={"name": "A", "email": "a@s.com"})
    client.post("/api/students/", json={"name": "B", "email": "b@s.com"})
    resp = client.get("/api/students/")
    assert len(resp.json()) == 2


def test_search_students(client):
    client.post("/api/students/", json={"name": "Alice", "email": "a@s.com"})
    client.post("/api/students/", json={"name": "Bob", "email": "b@s.com"})
    resp = client.get("/api/students/?search=Alice")
    assert len(resp.json()) == 1


def test_get_student(client):
    create = client.post("/api/students/", json={"name": "S", "email": "s@s.com"})
    sid = create.json()["id"]
    resp = client.get(f"/api/students/{sid}")
    assert resp.status_code == 200


def test_get_student_not_found(client):
    assert client.get("/api/students/999").status_code == 404


def test_update_student(client):
    create = client.post("/api/students/", json={"name": "Old", "email": "s@s.com"})
    sid = create.json()["id"]
    resp = client.put(f"/api/students/{sid}", json={"name": "New"})
    assert resp.json()["name"] == "New"


def test_delete_student(client):
    create = client.post("/api/students/", json={"name": "Del", "email": "d@s.com"})
    sid = create.json()["id"]
    assert client.delete(f"/api/students/{sid}").status_code == 204
    assert client.get(f"/api/students/{sid}").status_code == 404
