import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start p-8">
      <header className="w-full max-w-4xl flex items-center justify-between py-8">
        <h1 className="text-4xl h1">Connected</h1>
        <nav className="space-x-4">
          <Link href="/explore" className="text-slate-700">Explore</Link>
          <Link href="/workshop" className="text-slate-700">Workshop</Link>
          <Link href="/community" className="text-slate-700">Community</Link>
        </nav>
      </header>

      <section className="w-full max-w-4xl mt-6 card">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h2 className="text-3xl h1 mb-2">Write by voice. Share your drafts. Create a listening experience.</h2>
            <p className="text-slate-600">Connected helps authors capture the heart of a story through audio-first recording, real-time transcription, AI-assisted polish, and reader workshops for feedback — all in a trendy, chic, romantic interface.</p>
            <div className="mt-6 flex gap-3">
              <Link href="/auth/signup" className="bg-rosewood text-white px-4 py-2 rounded-md">Get started</Link>
              <Link href="/explore" className="border border-rosewood text-rosewood px-4 py-2 rounded-md">Explore books</Link>
            </div>
          </div>

          <div className="w-full md:w-96">
            <div className="bg-[color:var(--color-blush)] rounded-xl p-6">
              <p className="text-sm text-rosewood mb-4">Featured</p>
              <h3 className="h1 text-2xl">Where roses whisper</h3>
              <p className="text-slate-700 mt-2">A romantic novella in audio-first chapters. Hear how the author intended.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
