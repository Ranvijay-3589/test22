def test_create_subject(client):
    resp = client.post("/api/subjects/", json={
        "name": "Mathematics",
        "code": "MATH101",
    })
    assert resp.status_code == 201
    assert resp.json()["name"] == "Mathematics"


def test_create_subject_with_relations(client):
    teacher = client.post("/api/teachers/", json={"name": "T", "email": "t@s.com"}).json()
    cls = client.post("/api/classes/", json={"name": "G10"}).json()
    resp = client.post("/api/subjects/", json={
        "name": "Physics",
        "code": "PHY101",
        "teacher_id": teacher["id"],
        "class_id": cls["id"],
    })
    assert resp.status_code == 201
    data = resp.json()
    assert data["teacher_name"] == "T"
    assert data["class_name"] == "G10"


def test_create_subject_duplicate_code(client):
    subj = {"name": "A", "code": "DUP01"}
    client.post("/api/subjects/", json=subj)
    resp = client.post("/api/subjects/", json=subj)
    assert resp.status_code == 400


def test_list_subjects(client):
    client.post("/api/subjects/", json={"name": "A", "code": "A01"})
    client.post("/api/subjects/", json={"name": "B", "code": "B01"})
    resp = client.get("/api/subjects/")
    assert len(resp.json()) == 2


def test_search_subjects(client):
    client.post("/api/subjects/", json={"name": "Mathematics", "code": "MATH01"})
    client.post("/api/subjects/", json={"name": "Physics", "code": "PHY01"})
    resp = client.get("/api/subjects/?search=Math")
    assert len(resp.json()) == 1


def test_get_subject(client):
    create = client.post("/api/subjects/", json={"name": "S", "code": "S01"})
    sid = create.json()["id"]
    resp = client.get(f"/api/subjects/{sid}")
    assert resp.status_code == 200


def test_get_subject_not_found(client):
    assert client.get("/api/subjects/999").status_code == 404


def test_update_subject(client):
    create = client.post("/api/subjects/", json={"name": "Old", "code": "O01"})
    sid = create.json()["id"]
    resp = client.put(f"/api/subjects/{sid}", json={"name": "New"})
    assert resp.json()["name"] == "New"


def test_delete_subject(client):
    create = client.post("/api/subjects/", json={"name": "Del", "code": "D01"})
    sid = create.json()["id"]
    assert client.delete(f"/api/subjects/{sid}").status_code == 204
    assert client.get(f"/api/subjects/{sid}").status_code == 404
