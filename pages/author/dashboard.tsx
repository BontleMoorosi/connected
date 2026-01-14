import Link from 'next/link'

export default function AuthorDashboard() {
  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl h1">Author Dashboard</h1>
        <Link href="/author/book/new" className="bg-rosewood text-white px-4 py-2 rounded-md">New Book</Link>
      </header>

      <section className="mt-8">
        <div className="grid gap-6">
          <div className="card flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Untitled Book</h2>
              <p className="text-sm text-slate-600">Draft · 3 chapters</p>
            </div>
            <div className="space-x-2">
              <Link href="/author/book/1" className="text-rosewood">Manage</Link>
              <Link href="/author/book/1" className="text-slate-600">Analytics</Link>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold">Recent workshop feedback</h3>
            <p className="text-sm text-slate-600 mt-2">No feedback yet — publish a chapter to Workshop to receive reader insights.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
