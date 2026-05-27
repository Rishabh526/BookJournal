import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup({ onSignup }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-ink)]">
        New Membership
      </p>
      <h2 className="mt-3 text-3xl font-semibold text-[var(--oak-deep)]">
        Open your reading ledger
      </h2>
      <p className="mt-3 text-sm leading-6 text-[var(--muted-ink)]">
        Create an account to build your own quiet corner for books, reviews, and notes.
      </p>

      <form
        className="mt-8 space-y-5"
        onSubmit={async (event) => {
          event.preventDefault();
          setError("");

          const trimmedUsername = username.trim();
          const trimmedEmail = email.trim();

          if (!trimmedUsername || !trimmedEmail || !password) {
            setError("All fields are required.");
            return;
          }

          if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
          }

          setIsSubmitting(true);

          const result = await onSignup({
            username: trimmedUsername,
            email: trimmedEmail,
            password,
          });

          setIsSubmitting(false);

          if (!result.ok) {
            setError(result.message);
            return;
          }

          navigate("/");
        }}
      >
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--oak)]">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="library-input px-4 py-3"
            placeholder="Choose a username"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--oak)]">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="library-input px-4 py-3"
            placeholder="Enter your email"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--oak)]">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="library-input px-4 py-3"
            placeholder="Create a password"
            disabled={isSubmitting}
          />
        </div>
        {error && (
          <p className="rounded-2xl bg-[rgba(155,57,35,0.08)] px-4 py-3 text-sm text-[#8c3923]">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="library-button w-full py-3 text-sm uppercase tracking-[0.18em] transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      <p className="mt-6 text-sm text-[var(--muted-ink)]">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-[var(--oak)] underline decoration-[rgba(183,138,63,0.55)] underline-offset-4"
        >
          Login
        </Link>
      </p>
    </div>
  );
}

export default Signup;
