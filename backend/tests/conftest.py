import os 
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

test_database_url = os.getenv("TEST_DATABASE_URL")

if not test_database_url:
    raise RuntimeError(
        "TEST_DATABASE_URL is required to run tests. "
        "See backend/.env.test.example for the expected format."
    )

os.environ["DATABASE_URL"] = test_database_url
os.environ.setdefault("SECRET_KEY", "test-secret")
os.environ.setdefault("ALGORITHM", "HS256")
os.environ.setdefault("ACCESS_TOKEN_EXPIRE_MINUTES", "60")

from app.database import Base, get_db
from app.main import app

engine = create_engine(os.environ["DATABASE_URL"])
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(autouse=True)
def reset_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client():
    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()


def create_user(client, username="testuser", email="test@example.com", password="password123"):
    return client.post(
        "/users/",
        json={
            "username": username,
            "email": email,
            "password": password
        },
    )


def login_user(client, email="test@example.com", password="password123"):
    response = client.post(
        "/login",
        json = {
            "email": email,
            "password": password
        },
    )
    return response.json()["access_token"]


def auth_headers(client, username="testuser", email="test@example.com", password="password123"):
    create_user(client, username=username, email=email, password=password)
    token = login_user(client, email=email, password=password)
    return {"Authorization": f"Bearer {token}"}


def create_book(client, headers, title="Atomic Habits", author="James Clear"):
    return client.post(
        "/books/",
        json={
            "title": title,
            "author": author,
        },
        headers=headers

    )

def create_note(client, headers, book_id, content="Useful note"):
    return client.post(
        f"/books/{book_id}/notes/",
        json={
            "content": content,
        },
        headers=headers
    )
