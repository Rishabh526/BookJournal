import { Navigate, Route, Routes } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"
import HomePage from "./pages/HomePage"
import { useCallback, useEffect, useState } from "react"
import BookDetailPage from "./pages/BookDetailPage"
import LibraryPage from "./pages/LibraryPage"
import { api } from "./api"

const STORAGE_KEY = "bookjournal-data";

function loadAppData() {
  if (typeof window === "undefined") {
    return { users: [], currentUserId: null, booksByUser: {}, token: null };
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return { users: [], currentUserId: null, booksByUser: {}, token: null };
  }

  try {
    const parsed = JSON.parse(raw);

    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      currentUserId: parsed.currentUserId ?? null,
      booksByUser: parsed.booksByUser ?? {},
      token: parsed.token ?? null,
    };
  } catch {
    return { users: [], currentUserId: null, booksByUser: {}, token: null };
  }
}

function App() {
  const [appData, setAppData] = useState(loadAppData);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
  }, [appData]);

  useEffect(() => {
    if (!appData.token) return undefined;

    let ignore = false;

    api.getMe(appData.token)
      .then((user) => {
        if (ignore) return;

        setAppData((prev) => ({
          ...prev,
          users: [
            ...prev.users.filter((entry) => entry.id !== user.id),
            user,
          ],
          currentUserId: user.id,
        }));
      })
      .catch(() => {
        if (ignore) return;

        setAppData((prev) => ({
          ...prev,
          currentUserId: null,
          token: null,
        }));
      });

    return () => {
      ignore = true;
    };
  }, [appData.token]);

  useEffect(() => {
    if (!appData.token || !appData.currentUserId) return undefined;

    let ignore = false;

    api.getBooks(appData.token)
      .then((apiBooks) => {
        if (ignore) return;

        setAppData((prev) => ({
          ...prev,
          booksByUser: {
            ...prev.booksByUser,
            [prev.currentUserId]: apiBooks,
          },
        }));
      })
      .catch((error) => {
        console.error("Unable to load books from API:", error);

        if (error.message.includes("Could not validate credentials")) {
          setAppData((prev) => ({
            ...prev,
            currentUserId: null,
            token: null,
          }));
        }
      });

    return () => {
      ignore = true;
    };
  }, [appData.token, appData.currentUserId]);

  const currentUser = appData.users.find(
    (user) => user.id === appData.currentUserId,
  ) ?? null;

  const books = currentUser
    ? appData.booksByUser[currentUser.id] ?? []
    : [];

  const setBooks = useCallback((updater) => {
    if (!currentUser) return;

    setAppData((prev) => {
      const currentBooks = prev.booksByUser[currentUser.id] ?? [];
      const nextBooks =
        typeof updater === "function" ? updater(currentBooks) : updater;

      return {
        ...prev,
        booksByUser: {
          ...prev.booksByUser,
          [currentUser.id]: nextBooks,
        },
      };
    });
  }, [currentUser]);

  const handleLogin = async ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    try {
      const token = await api.login({ email: normalizedEmail, password });
      const user = await api.getMe(token.access_token);

      if (!user) {
        return {
          ok: false,
          message: "Login worked, but the user profile was not found.",
        };
      }

      setAppData((prev) => ({
        ...prev,
        users: [
          ...prev.users.filter((entry) => entry.id !== user.id),
          user,
        ],
        currentUserId: user.id,
        token: token.access_token,
      }));

      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message: error.message,
      };
    }
  };

  const handleSignup = async ({ username, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    try {
      const newUser = await api.createUser({
        username: username.trim(),
        email: normalizedEmail,
        password,
      });
      const token = await api.login({ email: normalizedEmail, password });

      setAppData((prev) => ({
        users: [
          ...prev.users.filter((user) => user.id !== newUser.id),
          newUser,
        ],
        currentUserId: newUser.id,
        token: token.access_token,
        booksByUser: {
          ...prev.booksByUser,
          [newUser.id]: [],
        },
      }));

      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message: error.message,
      };
    }
  };

  const handleLogout = () => {
    setAppData((prev) => ({
      ...prev,
      currentUserId: null,
      token: null,
    }));
  };

  const handleDeleteAccount = async () => {
    if (!currentUser || !appData.token) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This will also delete your books and notes.",
    );

    if (!confirmDelete) return;

    try {
      await api.deleteUser(currentUser.id, appData.token);

      setAppData((prev) => {
        const nextBooksByUser = { ...prev.booksByUser };
        delete nextBooksByUser[currentUser.id];

        return {
          users: prev.users.filter((user) => user.id !== currentUser.id),
          currentUserId: null,
          token: null,
          booksByUser: nextBooksByUser,
        };
      });
    } catch (error) {
      window.alert(error.message);
    }
  };

  const protectedElement = (element) =>
    currentUser ? element : <Navigate to="/login" replace />;

  return (
    <Routes> 
      <Route
        path="/login"
        element={
          currentUser ? (
            <Navigate to="/" replace />
          ) : (
            <LoginPage onLogin={handleLogin} />
          )
        }
      />
      <Route
        path="/signup"
        element={
          currentUser ? (
            <Navigate to="/" replace />
          ) : (
            <SignUpPage onSignup={handleSignup} />
          )
        }
      />
      <Route
        path="/"
        element={protectedElement(
          <HomePage
            books={books}
            currentUser={currentUser}
            onLogout={handleLogout}
            onDeleteAccount={handleDeleteAccount}
            setBooks={setBooks}
            token={appData.token}
          />,
        )}
      />
      <Route
        path="/library"
        element={protectedElement(
          <LibraryPage
            books={books}
            currentUser={currentUser}
            onLogout={handleLogout}
            onDeleteAccount={handleDeleteAccount}
            setBooks={setBooks}
            token={appData.token}
          />,
        )}
      />
      <Route
        path="/book/:id"
        element={protectedElement(
          <BookDetailPage
            books={books}
            currentUser={currentUser}
            onLogout={handleLogout}
            onDeleteAccount={handleDeleteAccount}
            setBooks={setBooks}
            token={appData.token}
          />,
        )}
      />
      <Route
        path="*"
        element={<Navigate to={currentUser ? "/" : "/login"} replace />}
      />
    </Routes>
  )
}

export default App
