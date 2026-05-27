from tests.conftest import auth_headers, create_book


def test_signup_rejects_short_password(client):
    response = client.post(
        "/users/",
        json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "short",
        },
    )

    assert response.status_code == 422


def test_book_rejects_blank_title(client):
    headers = auth_headers(client)

    response = client.post(
        "/books/",
        json={
            "title": "   ",
            "author": "James Clear",
        },
        headers=headers,
    )

    assert response.status_code == 422


def test_book_rejects_negative_current_page(client):
    headers = auth_headers(client)
    book = create_book(client, headers).json()

    response = client.put(
        f"/books/{book['id']}",
        json={"current_page": -1},
        headers=headers,
    )

    assert response.status_code == 422


def test_note_rejects_blank_content(client):
    headers = auth_headers(client)
    book = create_book(client, headers).json()

    response = client.post(
        f"/books/{book['id']}/notes/",
        json={"content": "   "},
        headers=headers,
    )

    assert response.status_code == 422


def test_empty_book_update_fails(client):
    headers = auth_headers(client)
    book = create_book(client, headers).json()

    response = client.put(
        f"/books/{book['id']}",
        json={},
        headers=headers,
    )

    assert response.status_code == 422


def test_empty_note_update_fails(client):
    headers = auth_headers(client)
    book = create_book(client, headers).json()
    note = client.post(
        f"/books/{book['id']}/notes/",
        json={"content": "Original note"},
        headers=headers,
    ).json()

    response = client.put(
        f"/books/{book['id']}/notes/{note['id']}",
        json={},
        headers=headers,
    )

    assert response.status_code == 422
