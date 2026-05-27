import { useState } from "react";
import { api } from "../../api";

function NotesSection({ book, setBooks, onFeedback, token }) {
  const [drafts, setDrafts] = useState({});
  const [savingNoteId, setSavingNoteId] = useState(null);

  const handleChange = (id, value) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleBlur = async (id) => {
    const value = drafts[id] || "";
    const trimmed = value.trim();

    if (id === "placeholder") {
      if (!trimmed) return;

      setSavingNoteId(id);

      try {
        const createdNote = await api.createNote(book.id, { content: trimmed }, token);

        setBooks((prev) =>
          prev.map((b) =>
            b.id === book.id
              ? {
                  ...b,
                  notes: [...b.notes, createdNote],
                  lastViewedAt: new Date(),
                }
              : b,
          ),
        );
        onFeedback?.("Note added.");
      } catch (error) {
        onFeedback?.(error.message);
        return;
      } finally {
        setSavingNoteId(null);
      }
    } else if (!trimmed) {
      setSavingNoteId(id);

      try {
        await api.deleteNote(book.id, id, token);

        setBooks((prev) =>
          prev.map((b) =>
            b.id === book.id
              ? {
                  ...b,
                  notes: b.notes.filter((n) => n.id !== id),
                  lastViewedAt: new Date(),
                }
              : b,
          ),
        );
        onFeedback?.("Note deleted.");
      } catch (error) {
        onFeedback?.(error.message);
        return;
      } finally {
        setSavingNoteId(null);
      }
    } else {
      const existingNote = book.notes.find((note) => note.id === id);

      if (existingNote?.content === trimmed) {
        return;
      }

      setSavingNoteId(id);

      try {
        const updatedNote = await api.updateNote(
          book.id,
          id,
          { content: trimmed },
          token,
        );

        setBooks((prev) =>
          prev.map((b) =>
            b.id === book.id
              ? {
                  ...b,
                  notes: b.notes.map((n) =>
                    n.id === id ? updatedNote : n,
                  ),
                  lastViewedAt: new Date(),
                }
              : b,
          ),
        );
        onFeedback?.("Note saved.");
      } catch (error) {
        onFeedback?.(error.message);
        return;
      } finally {
        setSavingNoteId(null);
      }
    }

    setDrafts((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const renderedNotes = [
    ...book.notes,
    { id: "placeholder", content: "" },
  ];

  return (
    <div className="space-y-4">
      {renderedNotes.map((note) => {
        const isPlaceholder = note.id === "placeholder";

        return (
          <div
            key={note.id}
            className={`rounded-r-2xl border-l-4 bg-[rgba(255,251,245,0.52)] px-4 py-3 ${
              isPlaceholder
                ? "border-[rgba(111,74,45,0.16)] opacity-70"
                : "border-[var(--brass)]"
            }`}
          >
            <textarea
              value={drafts[note.id] ?? note.content ?? ""}
              onChange={(e) =>
                handleChange(note.id, e.target.value)
              }
              onBlur={() => handleBlur(note.id)}
              placeholder="Write a note..."
              className="w-full resize-none bg-transparent text-[var(--ink)] outline-none placeholder:text-[var(--muted-ink)]"
              rows={2}
              disabled={savingNoteId === note.id}
            />
          </div>
        );
      })}
    </div>
  );
}

export default NotesSection;
