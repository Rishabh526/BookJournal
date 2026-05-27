import React from 'react'

const AuthLayout = ({children}) => {
  return (
    <div className='relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#f8f0e3_0%,#efe0c8_100%)] px-4 py-10'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(183,138,63,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(111,74,45,0.16),transparent_30%)]' />
        <div className='library-card relative w-full max-w-5xl overflow-hidden rounded-[2rem]'>
            <div className='grid md:grid-cols-[1.1fr_0.9fr]'>
                <div className='hidden bg-[linear-gradient(180deg,rgba(88,56,34,0.96),rgba(58,34,19,0.96))] p-10 text-[#f7ead4] md:block'>
                    <p className='text-xs uppercase tracking-[0.35em] text-[#d6bb8a]'>
                        BookJournal
                    </p>
                    <h1 className='mt-6 text-4xl font-semibold leading-tight'>
                        Build a personal library that remembers what every book meant to you.
                    </h1>
                    <p className='mt-6 max-w-md text-base leading-7 text-[#e8d8bb]'>
                        Track your reading progress, keep margin-like notes, and preserve reviews in one warm, quiet space.
                    </p>
                    <div className='mt-10 rounded-[1.5rem] border border-[rgba(214,187,138,0.22)] bg-[rgba(255,248,237,0.08)] p-5'>
                        <p className='text-sm uppercase tracking-[0.25em] text-[#d6bb8a]'>
                            Archivist Notes
                        </p>
                        <p className='mt-3 text-sm leading-6 text-[#f0e2ca]'>
                            Every entry becomes part of your reading history: pages, reactions, and the lines worth keeping.
                        </p>
                    </div>
                </div>

                <div className='bg-[rgba(251,247,239,0.94)] p-8 md:p-10'>
                    {children}
                </div>
            </div>
        </div>
    </div>
  )
}

export default AuthLayout
