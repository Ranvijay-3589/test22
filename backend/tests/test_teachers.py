def test_create_teacher(client):
    resp = client.post("/api/teachers/", json={
        "name": "John Smith",
        "email": "john@school.com",
        "phone": "555-0101",
        "department": "Mathematics",
    })
    assert resp.status_code == 201
    data = resp.json()
    assert data["name"] == "John Smith"
    assert data["email"] == "john@school.com"
    assert data["id"] is not None


def test_create_teacher_duplicate_email(client):
    teacher = {"name": "A", "email": "dup@school.com"}
    client.post("/api/teachers/", json=teacher)
    resp = client.post("/api/teachers/", json=teacher)
    assert resp.status_code == 400


def test_list_teachers(client):
    client.post("/api/teachers/", json={"name": "A", "email": "a@s.com"})
    client.post("/api/teachers/", json={"name": "B", "email": "b@s.com"})
    resp = client.get("/api/teachers/")
    assert resp.status_code == 200
    assert len(resp.json()) == 2


def test_search_teachers(client):
    client.post("/api/teachers/", json={"name": "Alice Math", "email": "a@s.com", "department": "Math"})
    client.post("/api/teachers/", json={"name": "Bob Science", "email": "b@s.com", "department": "Science"})
    resp = client.get("/api/teachers/?search=Alice")
    assert len(resp.json()) == 1


def test_get_teacher(client):
    create = client.post("/api/teachers/", json={"name": "T", "email": "t@s.com"})
    tid = create.json()["id"]
    resp = client.get(f"/api/teachers/{tid}")
    assert resp.status_code == 200
    assert resp.json()["name"] == "T"


def test_get_teacher_not_found(client):
    resp = client.get("/api/teachers/999")
    assert resp.status_code == 404


def test_update_teacher(client):
    create = client.post("/api/teachers/", json={"name": "Old", "email": "t@s.com"})
    tid = create.json()["id"]
    resp = client.put(f"/api/teachers/{tid}", json={"name": "New"})
    assert resp.status_code == 200
    assert resp.json()["name"] == "New"


def test_delete_teacher(client):
    create = client.post("/api/teachers/", json={"name": "Del", "email": "d@s.com"})
    tid = create.json()["id"]
    resp = client.delete(f"/api/teachers/{tid}")
    assert resp.status_code == 204
    assert client.get(f"/api/teachers/{tid}").status_code == 404
