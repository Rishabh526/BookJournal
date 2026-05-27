import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

 const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div>
        <p className='text-xs uppercase tracking-[0.3em] text-[var(--muted-ink)]'>
            Member Access
        </p>
        <h2 className='mt-3 text-3xl font-semibold text-[var(--oak-deep)]'>
            Return to your library
        </h2>
        <p className='mt-3 text-sm leading-6 text-[var(--muted-ink)]'>
            Sign in to continue adding books, reviews, and notes to your collection.
        </p>

        <form
          className='mt-8 space-y-5'
          onSubmit={async (event) => {
            event.preventDefault();
            setError("");

            if (!email.trim() || !password) {
              setError("Email and password are required.");
              return;
            }

            setIsSubmitting(true);

            const result = await onLogin({
              email,
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
                <label className='mb-2 block text-sm font-medium text-[var(--oak)]'>
                    Email
                </label>
                <input 
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className='library-input px-4 py-3'
                    placeholder='Enter your email'
                    disabled={isSubmitting}
                />
            </div>
            <div>
                <label className='mb-2 block text-sm font-medium text-[var(--oak)]'>
                    Password
                </label>
                <input 
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className='library-input px-4 py-3'
                    placeholder='Enter your password'
                    disabled={isSubmitting}
                />
            </div>
            {error && (
                <p className='rounded-2xl bg-[rgba(155,57,35,0.08)] px-4 py-3 text-sm text-[#8c3923]'>
                    {error}
                </p>
            )}
            <button 
                type='submit'
                className='library-button w-full py-3 text-sm uppercase tracking-[0.18em] transition'
                disabled={isSubmitting}
                >
                    {isSubmitting ? "Logging In..." : "Login"}
                </button>
        </form>

        <p className='mt-6 text-sm text-[var(--muted-ink)]'>Dont have an account? <Link to="/signup"
            className='font-medium text-[var(--oak)] underline decoration-[rgba(183,138,63,0.55)] underline-offset-4'
        > Sign up
        </Link>
        </p>
    </div>
  )
}

export default Login
