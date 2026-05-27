import { useNavigate } from "react-router-dom";

function Sidebar({ books = [], openAddBook}) {
  const navigate = useNavigate();
  const navButtonClass = "group flex items-center justify-start gap-3 rounded-2xl border border-transparent p-3 px-4 text-[var(--oak-deep)] transition hover:border-[rgba(111,74,45,0.12)] hover:bg-[rgba(255,251,245,0.72)]";
  const recentBooks = [...books]
    .sort((a, b) => new Date(b.lastViewedAt) - new Date(a.lastViewedAt))
    .slice(0, 3);

  return (
    <aside
      className="flex w-64 flex-col border-r border-[rgba(71,43,23,0.12)] bg-[rgba(244,235,220,0.78)] backdrop-blur"
    >
      <div className="flex h-20 items-center border-b border-[rgba(71,43,23,0.12)] px-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--muted-ink)]">
            Navigation
          </p>
          <p className="mt-1 text-sm text-[var(--oak)]">
            Reading room controls
          </p>
        </div>
      </div>

      <div className="flex-1 p-3 space-y-3">
        <button
          onClick={() => navigate("/")}
          className={navButtonClass}
        >
          <span className="text-lg">⌂</span>
          <span>Home</span>
        </button>

        <button
          onClick={openAddBook}
          className="library-button flex items-center justify-center gap-2 px-4 py-3 text-sm uppercase tracking-[0.18em] transition"
        >
          <span className="text-lg leading-none">+</span>
          <span>Add Book</span>
        </button>

        <button
          onClick={() => navigate("/library")}
          className={navButtonClass}
        >
          <span className="text-lg">📚</span>
          <span>Library</span>
        </button>

        {recentBooks.length > 0 && (
          <div className="mx-2 rounded-2xl bg-[rgba(255,248,237,0.82)] p-3">
            <p className="px-2 text-[11px] uppercase tracking-[0.24em] text-[var(--muted-ink)]">
              Recent Books
            </p>
            <div className="mt-2 space-y-1">
              {recentBooks.map((book) => (
                <button
                  key={book.id}
                  type="button"
                  onClick={() => navigate(`/book/${book.id}`)}
                  className="w-full rounded-xl px-3 py-2 text-left transition hover:bg-[rgba(111,74,45,0.08)]"
                >
                  <div className="truncate text-sm font-medium text-[var(--oak-deep)]">
                    {book.title}
                  </div>
                  <div className="truncate text-xs text-[var(--muted-ink)]">
                    {book.author}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-[rgba(71,43,23,0.12)] p-4">
        <div className="rounded-2xl bg-[rgba(255,248,237,0.8)] p-4 text-sm text-[var(--muted-ink)]">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--oak)]">
            Reading Ritual
          </p>
          <p className="mt-2 leading-6">
            Capture what you read, what you felt, and what deserves a second shelf.
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
