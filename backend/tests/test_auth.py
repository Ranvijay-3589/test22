from fastapi.testclient import TestClient
from app.models.user import User
from app.routes.auth import hash_password, create_token
from app.database import get_db
from main import app


def _create_user(username: str, email: str, full_name: str, password: str):
    """Helper to create a user directly in the DB and return the user + token."""
    db = next(app.dependency_overrides[get_db]())
    user = User(
        username=username,
        email=email,
        full_name=full_name,
        hashed_password=hash_password(password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_token(user.id)
    return user, token


def test_login_success(client: TestClient):
    _create_user("loginuser", "login@school.com", "Login User", "secret")
    res = client.post("/api/auth/login", json={
        "username": "loginuser",
        "password": "secret",
    })
    assert res.status_code == 200
    data = res.json()
    assert data["access_token"]
    assert data["user"]["username"] == "loginuser"


def test_login_wrong_password(client: TestClient):
    _create_user("wrongpass", "wp@school.com", "WP", "correct")
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
    _, token = _create_user("meuser", "me@school.com", "Me User", "pass")
    res = client.get("/api/auth/me", params={"token": token})
    assert res.status_code == 200
    assert res.json()["username"] == "meuser"


def test_get_me_invalid_token(client: TestClient):
    res = client.get("/api/auth/me", params={"token": "invalid"})
    assert res.status_code == 401


def test_logout(client: TestClient):
    _, token = _create_user("logoutuser", "logout@school.com", "Logout", "pass")
    res = client.post("/api/auth/logout", params={"token": token})
    assert res.status_code == 200

    # Token should be invalidated
    res = client.get("/api/auth/me", params={"token": token})
    assert res.status_code == 401
