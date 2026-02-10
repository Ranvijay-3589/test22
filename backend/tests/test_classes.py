def test_create_class(client):
    resp = client.post("/api/classes/", json={
        "name": "Grade 10",
        "section": "A",
        "room_number": "101",
    })
    assert resp.status_code == 201
    data = resp.json()
    assert data["name"] == "Grade 10"


def test_create_class_duplicate(client):
    cls = {"name": "Grade 10"}
    client.post("/api/classes/", json=cls)
    resp = client.post("/api/classes/", json=cls)
    assert resp.status_code == 400


def test_list_classes(client):
    client.post("/api/classes/", json={"name": "G1"})
    client.post("/api/classes/", json={"name": "G2"})
    resp = client.get("/api/classes/")
    assert len(resp.json()) == 2


def test_search_classes(client):
    client.post("/api/classes/", json={"name": "Grade 10"})
    client.post("/api/classes/", json={"name": "Grade 11"})
    resp = client.get("/api/classes/?search=10")
    assert len(resp.json()) == 1


def test_get_class(client):
    create = client.post("/api/classes/", json={"name": "C1"})
    cid = create.json()["id"]
    resp = client.get(f"/api/classes/{cid}")
    assert resp.status_code == 200


def test_get_class_not_found(client):
    assert client.get("/api/classes/999").status_code == 404


def test_update_class(client):
    create = client.post("/api/classes/", json={"name": "Old"})
    cid = create.json()["id"]
    resp = client.put(f"/api/classes/{cid}", json={"name": "New"})
    assert resp.json()["name"] == "New"


def test_delete_class(client):
    create = client.post("/api/classes/", json={"name": "Del"})
    cid = create.json()["id"]
    assert client.delete(f"/api/classes/{cid}").status_code == 204
    assert client.get(f"/api/classes/{cid}").status_code == 404
