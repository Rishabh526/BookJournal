const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

function formatApiError(data) {
  if (Array.isArray(data?.detail)) {
    return data.detail
      .map((error) => error.msg)
      .filter(Boolean)
      .join(" ");
  }

  return data?.detail ?? "API request failed.";
}

async function request(path, { token, ...options } = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(formatApiError(data));
  }

  return data;
}

function toBook(apiBook) {
  return {
    id: apiBook.id,
    title: apiBook.title,
    author: apiBook.author,
    cover: apiBook.cover ?? "",
    currentPage: apiBook.current_page,
    finishedReading: apiBook.finished_reading,
    review: apiBook.review ?? "",
    notes: Array.isArray(apiBook.notes) ? apiBook.notes.map(toNote) : [],
    createdAt: apiBook.created_at,
    lastViewedAt: apiBook.last_viewed_at,
  };
}

function toNote(apiNote) {
  return {
    id: apiNote.id,
    bookId: apiNote.book_id,
    content: apiNote.content,
    createdAt: apiNote.created_at,
    updatedAt: apiNote.updated_at,
  };
}

export const api = {
  createUser(user) {
    return request("/users/", {
      method: "POST",
      body: JSON.stringify(user),
    });
  },
  login(credentials) {
    return request("/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },
  getMe(token) {
    return request("/users/me", { token });
  },
  async getBooks(token) {
    const books = await request("/books/", { token });
    return books.map(toBook);
  },
  async getBook(bookId, token) {
    const book = await request(`/books/${bookId}`, { token });
    return toBook(book);
  },
  async createBook(book, token) {
    const createdBook = await request("/books/", {
      method: "POST",
      token,
      body: JSON.stringify(book),
    });

    return toBook(createdBook);
  },
  deleteBook(bookId, token) {
    return request(`/books/${bookId}`, {
      method: "DELETE",
      token,
    });
  },
  async updateBook(bookId, updates, token) {
    const updatedBook = await request(`/books/${bookId}`, {
      method: "PUT",
      token,
      body: JSON.stringify(updates),
    });

    return toBook(updatedBook);
  },
  async getNotes(bookId, token) {
    const notes = await request(`/books/${bookId}/notes/`, { token });
    return notes.map(toNote);
  },
  async getNote(bookId, noteId, token) {
    const note = await request(`/books/${bookId}/notes/${noteId}`, { token });
    return toNote(note);
  },
  async createNote(bookId, note, token) {
    const createdNote = await request(`/books/${bookId}/notes/`, {
      method: "POST",
      token,
      body: JSON.stringify(note),
    });

    return toNote(createdNote);
  },
  async updateNote(bookId, noteId, note, token) {
    const updatedNote = await request(`/books/${bookId}/notes/${noteId}`, {
      method: "PUT",
      token,
      body: JSON.stringify(note),
    });

    return toNote(updatedNote);
  },
  deleteNote(bookId, noteId, token) {
    return request(`/books/${bookId}/notes/${noteId}`, {
      method: "DELETE",
      token,
    });
  },
  deleteUser(userId, token) {
    return request(`/users/${userId}`, {
      method: "DELETE",
      token,
    });
  },
};
