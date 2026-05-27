function Navbar({ currentUser, onLogout, onDeleteAccount }) {
  return (
    <header className="relative border-b border-[rgba(71,43,23,0.14)] bg-[rgba(250,245,236,0.72)] px-6 py-4 backdrop-blur">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[rgba(183,138,63,0.55)] to-transparent" />
      <div className="flex items-center gap-4">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted-ink)]">
            Reading Room
          </p>
          <div className="text-sm text-[var(--oak)]">
            Welcome back, {currentUser?.username ?? "Reader"}
          </div>
        </div>

        <div className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 text-center md:block">
          <h1 className="text-2xl font-semibold tracking-[0.18em] text-[var(--oak-deep)]">
            BookJournal
          </h1>
          <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted-ink)]">
            Personal Library Ledger
          </p>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={onDeleteAccount}
            className="rounded-full border border-[rgba(155,57,35,0.22)] bg-[rgba(155,57,35,0.08)] px-4 py-2 text-sm text-[#8c3923] transition hover:bg-[rgba(155,57,35,0.14)]"
          >
            Delete Account
          </button>
          <button
            onClick={onLogout}
            className="library-button-secondary px-4 py-2 text-sm transition hover:bg-[rgba(255,251,245,0.95)]"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
