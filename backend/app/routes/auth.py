from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import hashlib
import secrets
import hmac

from ..database import get_db
from ..models.user import User
from ..schemas.auth import LoginRequest, RegisterRequest, UserResponse, TokenResponse

router = APIRouter(prefix="/api/auth", tags=["auth"])

SECRET_KEY = secrets.token_hex(32)
TOKEN_EXPIRY_HOURS = 24

# In-memory token store (maps token -> user_id)
active_tokens: dict[str, int] = {}


def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    hashed = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100000)
    return f"{salt}:{hashed.hex()}"


def verify_password(password: str, hashed: str) -> bool:
    salt, hash_hex = hashed.split(":")
    new_hash = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100000)
    return hmac.compare_digest(new_hash.hex(), hash_hex)


def create_token(user_id: int) -> str:
    token = secrets.token_urlsafe(32)
    active_tokens[token] = user_id
    return token


def get_current_user(
    db: Session = Depends(get_db),
    token: str = None,
) -> User:
    """Dependency to extract the current user from the Authorization header."""
    if not token or token not in active_tokens:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    user_id = active_tokens[token]
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    return user


@router.post("/register", response_model=TokenResponse, status_code=201)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(
        (User.username == data.username) | (User.email == data.email)
    ).first()
    if existing:
        if existing.username == data.username:
            raise HTTPException(status_code=400, detail="Username already taken")
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        username=data.username,
        email=data.email,
        full_name=data.full_name,
        hashed_password=hash_password(data.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_token(user.id)
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = create_token(user.id)
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.get("/me", response_model=UserResponse)
def get_me(db: Session = Depends(get_db), token: str = None):
    if not token or token not in active_tokens:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user_id = active_tokens[token]
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return UserResponse.model_validate(user)


@router.post("/logout")
def logout(token: str = None):
    if token and token in active_tokens:
        del active_tokens[token]
    return {"message": "Logged out successfully"}
