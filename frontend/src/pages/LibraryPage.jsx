import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";

function LibraryPage({ books, currentUser, onLogout, onDeleteAccount, setBooks, token }) {
  const navigate = useNavigate();

  return (
    <Layout
      books={books}
      currentUser={currentUser}
      onLogout={onLogout}
      onDeleteAccount={onDeleteAccount}
      setBooks={setBooks}
      token={token}
    >
      <div className="space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-ink)]">
            The Stacks
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-[var(--oak-deep)]">Library</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--muted-ink)]">
            Every book you add is placed here with its progress and cover, ready to reopen whenever you want to read, annotate, or reflect.
          </p>
        </div>

        {books.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-[rgba(111,74,45,0.24)] bg-[rgba(255,250,243,0.72)] p-12 text-center text-[var(--muted-ink)]">
            Your library is empty. Add a book to get started.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {books.map((book) => (
              <button
                key={book.id}
                type="button"
                onClick={() => navigate(`/book/${book.id}`)}
                className={`rounded-[1.75rem] p-5 text-left transition hover:-translate-y-1 hover:shadow-[0_20px_34px_rgba(57,37,22,0.12)] ${
                  book.finishedReading
                    ? "border border-[rgba(71,43,23,0.18)] bg-[linear-gradient(180deg,rgba(222,203,177,0.96),rgba(205,183,154,0.98))] shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_12px_24px_rgba(57,37,22,0.12)]"
                    : "shelf-card"
                }`}
              >
                <div className="mb-4 flex gap-4">
                  <div className="flex h-32 w-24 items-center justify-center overflow-hidden rounded-[1rem] bg-[rgba(111,74,45,0.1)] text-xs text-[var(--muted-ink)]">
                    {book.cover ? (
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>No Cover</span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="line-clamp-2 text-xl font-semibold text-[var(--oak-deep)]">
                      {book.title}
                    </h2>
                    <p className="mt-2 text-sm text-[var(--muted-ink)]">
                      {book.author}
                    </p>
                    <p className="mt-4 inline-flex rounded-full bg-[rgba(183,138,63,0.14)] px-3 py-1 text-sm text-[var(--oak)]">
                      Page {book.currentPage}
                    </p>
                    {book.finishedReading && (
                      <p className="mt-3 text-xs uppercase tracking-[0.24em] text-[var(--oak)]">
                        Finished Reading
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default LibraryPage;
