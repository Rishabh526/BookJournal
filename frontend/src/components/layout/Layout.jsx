import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import AddBookModal from "../books/AddBookModal";
import { api } from "../../api";

function Layout({ children, books = [], currentUser, onLogout, onDeleteAccount, setBooks, token }) {
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!feedback) return undefined;

    const timeoutId = window.setTimeout(() => {
      setFeedback("");
    }, 2500);

    return () => window.clearTimeout(timeoutId);
  }, [feedback]);

  const handleAddBook = async (newBook) => {
    try {
      const createdBook = await api.createBook(newBook, token);

      setBooks((prev) => [...prev, createdBook]);
      setIsAddBookOpen(false);
      setFeedback("Book added from the API.");
      return true;
    } catch (error) {
      setFeedback(error.message);
      return false;
    }
  };

  return (
    <div className="library-shell min-h-screen flex flex-col">
      <Navbar
        currentUser={currentUser}
        onLogout={onLogout}
        onDeleteAccount={onDeleteAccount}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          books={books}
          openAddBook={() => setIsAddBookOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="library-card min-h-full rounded-[2rem] p-5 md:p-8">
            {feedback && (
              <div className="mb-5 rounded-2xl border border-[rgba(95,120,70,0.16)] bg-[rgba(95,120,70,0.1)] px-4 py-3 text-sm text-[#445536]">
                {feedback}
              </div>
            )}
            {children}
          </div>
        </main>
      </div>

      <AddBookModal
        isOpen={isAddBookOpen}
        onClose={() => setIsAddBookOpen(false)}
        onAdd={handleAddBook}
      />
    </div>
  );
}

export default Layout;
