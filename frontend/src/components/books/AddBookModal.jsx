import { useRef, useState } from "react";

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });
}

function AddBookModal({ isOpen, onClose, onAdd}) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [cover, setCover] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setCover("");
    setSelectedFileName("");
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(38,22,12,0.45)] px-4 backdrop-blur-sm">
      <div className="library-card w-full max-w-lg rounded-[1.75rem] p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-ink)]">
          New Volume
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-[var(--oak-deep)]">
          Add a book to your library
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--muted-ink)]">
          Start a new entry with the essentials. You can add pages, notes, and a review after it lands on your shelf.
        </p>

        <form 
          className="mt-8 space-y-5"
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");

            if (!title.trim() || !author.trim()) {
              setError("Title and author are required.");
              return;
            }

            const wasAdded = await onAdd({
              title: title.trim(),
              author: author.trim(),
              cover,
            });

            if (wasAdded) {
              resetForm();
            }
          }}
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--oak)]">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e)=>setTitle(e.target.value)}
              className="library-input px-4 py-3"
              placeholder="Book title"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--oak)]">
              Author
            </label>
            <input
              value={author}
              onChange={(e)=>setAuthor(e.target.value)}
              type="text"
              className="library-input px-4 py-3"
              placeholder="Author name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--oak)]">
              Cover Image (optional)
            </label>
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center justify-between rounded-[1rem] border border-[rgba(111,74,45,0.18)] bg-[rgba(255,251,245,0.88)] px-4 py-3 text-sm text-[var(--oak)] transition hover:bg-white">
                <span className="truncate">
                  {selectedFileName || "Choose an image from your computer"}
                </span>
                <span className="library-button-secondary ml-4 shrink-0 px-3 py-1.5 text-xs uppercase tracking-[0.16em]">
                  Browse
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (event) => {
                    const file = event.target.files?.[0];

                    if (!file) {
                      setCover("");
                      setSelectedFileName("");
                      return;
                    }

                    try {
                      const dataUrl = await readFileAsDataUrl(file);
                      setCover(dataUrl);
                      setSelectedFileName(file.name);
                      setError("");
                    } catch {
                      setError("Unable to load that image. Try another file.");
                    }
                  }}
                />
              </label>

              {cover && (
                <div className="flex items-center gap-4 rounded-[1rem] bg-[rgba(255,251,245,0.72)] p-3">
                  <img
                    src={cover}
                    alt="Selected cover preview"
                    className="h-20 w-14 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCover("");
                      setSelectedFileName("");
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="text-sm text-[var(--oak)] underline underline-offset-4"
                  >
                    Remove image
                  </button>
                </div>
              )}
            </div>
          </div>

          {error && (
            <p className="rounded-2xl bg-[rgba(155,57,35,0.08)] px-4 py-3 text-sm text-[#8c3923]">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="library-button-secondary px-5 py-2.5 text-sm transition hover:bg-[rgba(255,251,245,0.95)]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="library-button px-5 py-2.5 text-sm uppercase tracking-[0.14em] transition"
            >
              Add Book
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddBookModal;
