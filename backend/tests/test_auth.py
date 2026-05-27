from tests.conftest import create_user, auth_headers

def test_create_user(client):
    response = create_user(client)

    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["username"] == "testuser"
    assert "password" not in data
    assert "hashed_password" not in data


def test_login_returns_token(client):
    create_user(client)

    response = client.post(
        "/login",
        json={
            "email": "test@example.com",
            "password": "password123",
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_get_me(client):
    headers = auth_headers(client)

    response = client.get("/users/me", headers=headers)

    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"


def test_wrong_login_fails(client):
    create_user(client)

    response = client.post(
        "/login",
        json={
            "email": "test@example.com",
            "password": "wrongpassword",
        },
    )

    assert response.status_code == 403


def test_duplicate_signup_email_fails(client):
    create_user(client)

    response = client.post(
        "/users/",
        json={
            "username": "seconduser",
            "email": "test@example.com",
            "password": "password123",
        },
    )

    assert response.status_code == 409


def test_protected_route_without_token_fails(client):
    response = client.get("/users/me")

    assert response.status_code == 401


def test_user_cannot_view_another_user_profile(client):
    user_a = create_user(
        client,
        username="usera",
        email="usera@example.com",
    ).json()

    headers = auth_headers(
        client,
        username="userb",
        email="userb@example.com",
    )

    response = client.get(f"/users/{user_a['id']}", headers=headers)

    assert response.status_code == 403

