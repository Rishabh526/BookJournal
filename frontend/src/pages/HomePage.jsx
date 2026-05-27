import Layout from "../components/layout/Layout";
import { useNavigate } from "react-router-dom";

function HomePage({ books, currentUser, onLogout, onDeleteAccount, setBooks, token }) {
  const navigate = useNavigate();

  const lastViewedBook =
    books.length > 0
      ? [...books].sort(
          (a, b) =>
            new Date(b.lastViewedAt) - new Date(a.lastViewedAt)
        )[0]
      : null;

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
        {!lastViewedBook ? (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="shelf-card rounded-[2rem] p-8 md:p-10">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-ink)]">
                Private Collection
              </p>
              <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight text-[var(--oak-deep)]">
                Build a library that feels like a room you want to return to.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted-ink)]">
                Add the books you are reading, record page progress, write thoughtful reviews, and leave notes the way you would in the margins of a favorite copy.
              </p>
            </div>

            <div className="rounded-[2rem] bg-[linear-gradient(180deg,rgba(111,74,45,0.96),rgba(73,43,24,0.96))] p-8 text-[#f5e8d2] shadow-[0_18px_40px_rgba(57,37,22,0.18)]">
              <p className="text-xs uppercase tracking-[0.28em] text-[#d4b98d]">
                First Entry
              </p>
              <h2 className="mt-4 text-2xl font-semibold">
                Your shelves are waiting
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#ead9bc]">
                Use the Add Book button to place your first title in the library. Once it is there, you can open the detail page and begin writing notes and reviews.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div
              onClick={() => navigate(`/book/${lastViewedBook.id}`)}
              className="shelf-card cursor-pointer rounded-[2rem] p-8 transition hover:-translate-y-0.5 hover:shadow-[0_20px_38px_rgba(57,37,22,0.12)]"
            >
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted-ink)]">
                Continue Reading
              </p>
              <div className="mt-6 flex flex-col gap-6 md:flex-row">
                <div className="flex h-56 w-40 items-center justify-center overflow-hidden rounded-[1.25rem] bg-[rgba(111,74,45,0.1)] text-sm text-[var(--muted-ink)]">
                  {lastViewedBook.cover ? (
                    <img
                      src={lastViewedBook.cover}
                      alt={lastViewedBook.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>No Cover</span>
                  )}
                </div>

                <div className="flex-1">
                  <h1 className="text-3xl font-semibold text-[var(--oak-deep)]">
                    {lastViewedBook.title}
                  </h1>
                  <p className="mt-3 text-lg text-[var(--muted-ink)]">
                    {lastViewedBook.author}
                  </p>
                  <div className="mt-6 inline-flex rounded-full bg-[rgba(183,138,63,0.14)] px-4 py-2 text-sm text-[var(--oak)]">
                    Page {lastViewedBook.currentPage}
                  </div>
                  <p className="mt-6 max-w-lg text-sm leading-7 text-[var(--muted-ink)]">
                    Reopen the book to continue your reading log, refine your review, or leave more notes.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] bg-[rgba(255,248,237,0.78)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
                <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted-ink)]">
                  Collection Status
                </p>
                <div className="mt-4 text-4xl font-semibold text-[var(--oak-deep)]">
                  {books.length}
                </div>
                <p className="mt-2 text-sm text-[var(--muted-ink)]">
                  {books.length === 1 ? "Book on the shelf" : "Books on the shelf"}
                </p>
              </div>

              <div className="rounded-[2rem] bg-[linear-gradient(180deg,rgba(111,74,45,0.95),rgba(73,43,24,0.95))] p-6 text-[#f7ead4] shadow-[0_18px_38px_rgba(57,37,22,0.18)]">
                <p className="text-xs uppercase tracking-[0.28em] text-[#d4b98d]">
                  Reading Note
                </p>
                <p className="mt-4 text-sm leading-7 text-[#ead9bc]">
                  A strong library is not just a list of books. It is the record of what stayed with you after you closed them.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default HomePage;
