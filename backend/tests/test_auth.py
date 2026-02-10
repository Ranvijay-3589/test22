from fastapi.testclient import TestClient


def test_register(client: TestClient):
    res = client.post("/api/auth/register", json={
        "username": "admin",
        "email": "admin@school.com",
        "full_name": "Admin User",
        "password": "password123",
    })
    assert res.status_code == 201
    data = res.json()
    assert data["access_token"]
    assert data["user"]["username"] == "admin"
    assert data["user"]["email"] == "admin@school.com"


def test_register_duplicate_username(client: TestClient):
    client.post("/api/auth/register", json={
        "username": "admin2",
        "email": "admin2@school.com",
        "full_name": "Admin",
        "password": "pass",
    })
    res = client.post("/api/auth/register", json={
        "username": "admin2",
        "email": "other@school.com",
        "full_name": "Other",
        "password": "pass",
    })
    assert res.status_code == 400
    assert "Username already taken" in res.json()["detail"]


def test_register_duplicate_email(client: TestClient):
    client.post("/api/auth/register", json={
        "username": "user1",
        "email": "same@school.com",
        "full_name": "User",
        "password": "pass",
    })
    res = client.post("/api/auth/register", json={
        "username": "user2",
        "email": "same@school.com",
        "full_name": "User",
        "password": "pass",
    })
    assert res.status_code == 400
    assert "Email already registered" in res.json()["detail"]


def test_login_success(client: TestClient):
    client.post("/api/auth/register", json={
        "username": "loginuser",
        "email": "login@school.com",
        "full_name": "Login User",
        "password": "secret",
    })
    res = client.post("/api/auth/login", json={
        "username": "loginuser",
        "password": "secret",
    })
    assert res.status_code == 200
    data = res.json()
    assert data["access_token"]
    assert data["user"]["username"] == "loginuser"


def test_login_wrong_password(client: TestClient):
    client.post("/api/auth/register", json={
        "username": "wrongpass",
        "email": "wp@school.com",
        "full_name": "WP",
        "password": "correct",
    })
    res = client.post("/api/auth/login", json={
        "username": "wrongpass",
        "password": "wrong",
    })
    assert res.status_code == 401
    assert "Invalid" in res.json()["detail"]


def test_login_nonexistent_user(client: TestClient):
    res = client.post("/api/auth/login", json={
        "username": "noone",
        "password": "pass",
    })
    assert res.status_code == 401


def test_get_me(client: TestClient):
    reg = client.post("/api/auth/register", json={
        "username": "meuser",
        "email": "me@school.com",
        "full_name": "Me User",
        "password": "pass",
    })
    token = reg.json()["access_token"]
    res = client.get("/api/auth/me", params={"token": token})
    assert res.status_code == 200
    assert res.json()["username"] == "meuser"


def test_get_me_invalid_token(client: TestClient):
    res = client.get("/api/auth/me", params={"token": "invalid"})
    assert res.status_code == 401


def test_logout(client: TestClient):
    reg = client.post("/api/auth/register", json={
        "username": "logoutuser",
        "email": "logout@school.com",
        "full_name": "Logout",
        "password": "pass",
    })
    token = reg.json()["access_token"]
    res = client.post("/api/auth/logout", params={"token": token})
    assert res.status_code == 200

    # Token should be invalidated
    res = client.get("/api/auth/me", params={"token": token})
    assert res.status_code == 401
