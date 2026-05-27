from tests.conftest import auth_headers, create_book


def test_create_book(client):
    headers = auth_headers(client)

    response = create_book(client, headers)

    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Atomic Habits"
    assert data["author"] == "James Clear"
    assert data["current_page"] == 1
    assert data["finished_reading"] is False


def test_get_books_returns_user_books(client):
    headers = auth_headers(client)
    create_book(client, headers)

    response = client.get("/books/", headers=headers)

    assert response.status_code == 200
    books = response.json()
    assert len(books) == 1
    assert books[0]["title"] == "Atomic Habits"


def test_get_one_book(client):
    headers = auth_headers(client)
    book = create_book(client, headers).json()

    response = client.get(f"/books/{book['id']}", headers=headers)

    assert response.status_code == 200
    assert response.json()["id"] == book["id"]


def test_update_book(client):
    headers = auth_headers(client)
    book = create_book(client, headers).json()

    response = client.put(
        f"/books/{book['id']}",
        json={
            "current_page": 42,
            "finished_reading": True,
            "review": "Great book.",
        },
        headers=headers,
    )

    assert response.status_code == 200
    data = response.json()
    assert data["current_page"] == 42
    assert data["finished_reading"] is True
    assert data["review"] == "Great book."


def test_delete_book(client):
    headers = auth_headers(client)
    book = create_book(client, headers).json()

    delete_response = client.delete(f"/books/{book['id']}", headers=headers)

    assert delete_response.status_code == 204

    get_response = client.get(f"/books/{book['id']}", headers=headers)

    assert get_response.status_code == 404


def test_user_cannot_access_another_users_book(client):
    user_a_headers = auth_headers(
        client,
        username="usera",
        email="usera@example.com",
    )
    book = create_book(client, user_a_headers).json()

    user_b_headers = auth_headers(
        client,
        username="userb",
        email="userb@example.com",
    )

    response = client.get(f"/books/{book['id']}", headers=user_b_headers)

    assert response.status_code == 403


def test_books_require_authentication(client):
    response = client.get("/books/")

    assert response.status_code == 401
