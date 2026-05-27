from tests.conftest import auth_headers, create_book, create_note


def test_create_note(client):
    headers = auth_headers(client)
    book = create_book(client, headers).json()

    response = create_note(client, headers, book["id"], content="My first note")

    assert response.status_code == 201
    data = response.json()
    assert data["content"] == "My first note"
    assert data["book_id"] == book["id"]


def test_get_notes(client):
    headers = auth_headers(client)
    book = create_book(client, headers).json()
    create_note(client, headers, book["id"], content="Note one")

    response = client.get(f"/books/{book['id']}/notes/", headers=headers)

    assert response.status_code == 200
    notes = response.json()
    assert len(notes) == 1
    assert notes[0]["content"] == "Note one"


def test_get_one_note(client):
    headers = auth_headers(client)
    book = create_book(client, headers).json()
    note = create_note(client, headers, book["id"]).json()

    response = client.get(
        f"/books/{book['id']}/notes/{note['id']}",
        headers=headers,
    )

    assert response.status_code == 200
    assert response.json()["id"] == note["id"]


def test_update_note(client):
    headers = auth_headers(client)
    book = create_book(client, headers).json()
    note = create_note(client, headers, book["id"]).json()

    response = client.put(
        f"/books/{book['id']}/notes/{note['id']}",
        json={"content": "Updated note"},
        headers=headers,
    )

    assert response.status_code == 200
    assert response.json()["content"] == "Updated note"


def test_delete_note(client):
    headers = auth_headers(client)
    book = create_book(client, headers).json()
    note = create_note(client, headers, book["id"]).json()

    delete_response = client.delete(
        f"/books/{book['id']}/notes/{note['id']}",
        headers=headers,
    )

    assert delete_response.status_code == 204

    get_response = client.get(
        f"/books/{book['id']}/notes/{note['id']}",
        headers=headers,
    )

    assert get_response.status_code == 404


def test_user_cannot_access_another_users_notes(client):
    user_a_headers = auth_headers(
        client,
        username="usera",
        email="usera@example.com",
    )
    book = create_book(client, user_a_headers).json()
    note = create_note(client, user_a_headers, book["id"]).json()

    user_b_headers = auth_headers(
        client,
        username="userb",
        email="userb@example.com",
    )

    response = client.get(
        f"/books/{book['id']}/notes/{note['id']}",
        headers=user_b_headers,
    )

    assert response.status_code == 403


def test_deleting_user_cascades_books_and_notes(client):
    headers = auth_headers(client)
    book = create_book(client, headers).json()
    create_note(client, headers, book["id"]).json()

    delete_response = client.delete("/users/1", headers=headers)

    assert delete_response.status_code == 204

    login_response = client.post(
        "/login",
        json={
            "email": "test@example.com",
            "password": "password123",
        },
    )

    assert login_response.status_code == 403
