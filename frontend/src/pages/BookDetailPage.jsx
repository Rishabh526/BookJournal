import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import NotesSection from "../components/books/NotesSetion";
import { api } from "../api";

function BookDetailPage({ books, currentUser, onLogout, onDeleteAccount, setBooks, token }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");

  const book = books.find((b) => b.id === Number(id));
  const bookId = book?.id;

  useEffect(() => {
    if (!feedback) return undefined;

    const timeoutId = window.setTimeout(() => {
      setFeedback("");
    }, 2500);

    return () => window.clearTimeout(timeoutId);
  }, [feedback]);

  useEffect(() => {
    if (!id || !token) return undefined;

    let ignore = false;

    api.getBook(id, token)
      .then((apiBook) => {
        if (ignore) return;

        setBooks((prev) => {
          const hasBook = prev.some((b) => b.id === apiBook.id);

          if (!hasBook) {
            return [...prev, apiBook];
          }

          return prev.map((b) => (b.id === apiBook.id ? apiBook : b));
        });
      })
      .catch((error) => {
        if (!ignore) {
          setFeedback(error.message);
        }
      });

    return () => {
      ignore = true;
    };
  }, [id, token, setBooks]);

  useEffect(() => {
    if (!bookId || !token) return undefined;

    let ignore = false;

    api.getNotes(bookId, token)
      .then((notes) => {
        if (ignore) return;

        setBooks((prev) =>
          prev.map((b) => (b.id === bookId ? { ...b, notes } : b)),
        );
      })
      .catch((error) => {
        if (!ignore) {
          setFeedback(error.message);
        }
      });

    return () => {
      ignore = true;
    };
  }, [bookId, token, setBooks]);

  if (!book) {
    return (
      <Layout
        books={books}
        currentUser={currentUser}
        onLogout={onLogout}
        onDeleteAccount={onDeleteAccount}
        setBooks={setBooks}
        token={token}
      >
        <div className="rounded-[2rem] bg-[rgba(255,248,237,0.78)] p-8 text-[var(--oak)]">
          Book not found
        </div>
      </Layout>
    );
  }

  const replaceBook = (updatedBook) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === updatedBook.id ? updatedBook : b)),
    );
  };

  const saveBookUpdate = async (updates, successMessage) => {
    try {
      const updatedBook = await api.updateBook(book.id, updates, token);
      replaceBook(updatedBook);
      setFeedback(successMessage);
    } catch (error) {
      setFeedback(error.message);
    }
  };

  const handlePageChange = (value) => {
    const nextPage = Number.isFinite(value) ? Math.max(0, value) : 0;

    setBooks((prev) =>
      prev.map((b) =>
        b.id === book.id
          ? {
              ...b,
              currentPage: nextPage,
              lastViewedAt: new Date(),
            }
          : b,
      ),
    );
  };

  const handlePageBlur = () => {
    saveBookUpdate(
      { current_page: book.currentPage },
      "Progress updated.",
    );
  };

  const handleReviewBlur = (value) => {
    saveBookUpdate(
      { review: value },
      "Review saved.",
    );
  };

  const handleFinishedReadingChange = async (checked) => {
    await saveBookUpdate(
      { finished_reading: checked },
      checked ? "Marked as finished reading." : "Marked as currently reading.",
    );
  };

  const handleDeleteBook = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?",
    );

    if (!confirmDelete) return;

    try {
      await api.deleteBook(book.id, token);
      setBooks((prev) => prev.filter((b) => b.id !== book.id));
      navigate("/");
    } catch (error) {
      setFeedback(error.message);
    }
  };

  return (
    <Layout
      books={books}
      currentUser={currentUser}
      onLogout={onLogout}
      onDeleteAccount={onDeleteAccount}
      setBooks={setBooks}
      token={token}
    >
      <div className="mx-auto max-w-5xl space-y-8">
        {feedback && (
          <div className="rounded-2xl border border-[rgba(95,120,70,0.16)] bg-[rgba(95,120,70,0.1)] px-4 py-3 text-sm text-[#445536]">
            {feedback}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="shelf-card rounded-[2rem] p-6 md:p-8">
            <div className="mx-auto flex h-[26rem] max-w-xs items-center justify-center overflow-hidden rounded-[1.5rem] bg-[rgba(111,74,45,0.1)] text-sm text-[var(--muted-ink)]">
              {book.cover ? (
                <img
                  src={book.cover}
                  alt={book.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <div className="text-xs uppercase tracking-[0.28em]">No Cover</div>
                  <div className="mt-2 text-base">{book.title}</div>
                </div>
              )}
            </div>
          </div>

          <div className="shelf-card rounded-[2rem] p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-ink)]">
              Book Record
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-[var(--oak-deep)]">{book.title}</h1>
            <p className="mt-4 text-xl text-[var(--muted-ink)]">{book.author}</p>

            <div className="mt-8 rounded-[1.5rem] bg-[rgba(255,251,245,0.72)] p-5">
              <div className="flex items-center gap-3">
                <span className="text-sm uppercase tracking-[0.22em] text-[var(--muted-ink)]">Current page</span>
                <input
                  type="number"
                  min="0"
                  value={book.currentPage}
                  onChange={(e) => handlePageChange(Number(e.target.value))}
                  onBlur={handlePageBlur}
                  className="library-input w-28 px-4 py-2"
                />
              </div>

              <p className="mt-4 text-sm leading-7 text-[var(--muted-ink)]">
                Update your progress as you move through the book. This title will surface on the home page as your most recently opened volume.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="shelf-card rounded-[2rem] p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-[var(--oak-deep)]">Review</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--muted-ink)]">
              Write the reaction you want to remember after closing the book.
            </p>

            <textarea
              defaultValue={book.review}
              onBlur={(e) => handleReviewBlur(e.target.value)}
              placeholder="Write your thoughts about this book..."
              className="library-input mt-5 min-h-[220px] p-5"
            />
          </div>

          <div className="shelf-card rounded-[2rem] p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-[var(--oak-deep)]">Notes</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--muted-ink)]">
              Keep fragments, quotes, and observations as the book unfolds.
            </p>
            <div className="mt-6">
              <NotesSection
                book={book}
                onFeedback={setFeedback}
                setBooks={setBooks}
                token={token}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[rgba(71,43,23,0.12)] pt-6">
          <label className="flex items-center gap-3 text-sm text-[var(--oak)]">
            <input
              type="checkbox"
              checked={Boolean(book.finishedReading)}
              onChange={(event) =>
                handleFinishedReadingChange(event.target.checked)
              }
              className="h-4 w-4 rounded border-[rgba(111,74,45,0.28)] text-[var(--oak)] focus:ring-[rgba(183,138,63,0.4)]"
            />
            <span>Finished Reading</span>
          </label>

          <button
            onClick={handleDeleteBook}
            className="rounded-full border border-[rgba(155,57,35,0.22)] bg-[rgba(155,57,35,0.08)] px-5 py-2.5 text-sm text-[#8c3923] transition hover:bg-[rgba(155,57,35,0.14)]"
          >
            Delete Book
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default BookDetailPage;
