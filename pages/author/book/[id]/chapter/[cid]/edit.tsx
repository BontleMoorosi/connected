import React, { useState } from 'react'
import Recorder from '../../../../../../components/Recorder'
import EditorWithAnnotations from '../../../../../../components/EditorWithAnnotations'
import { supabase } from '../../../../../../lib/supabaseClient'

export default function ChapterEdit() {
  const [text, setText] = useState<string>("This is the draft text for this chapter. Authors can edit in place or use the recorder.")
  const [annotations, setAnnotations] = useState<any[]>([])

  async function handleAddAnnotation(payload: { start: number; end: number; text: string }) {
    const { data, error } = await supabase.from('annotations').insert([{
      chapter_id: 'placeholder-chapter-id',
      start_char: payload.start,
      end_char: payload.end,
      text: payload.text
    }]).select().single()
    if (!error) {
      setAnnotations(prev => [{ id: data.id, start: payload.start, end: payload.end, text: payload.text }, ...prev])
    } else {
      console.error(error)
    }
  }

  async function handleResolve(id?: string) {
    if (!id) return
    await supabase.from('annotations').update({ status: 'resolved' }).eq('id', id)
    setAnnotations(prev => prev.map(a => a.id === id ? { ...a, status: 'resolved' } : a))
  }

  function handleSaveTranscript(t: string) {
    setText(prev => prev + "\n\n" + t)
  }

  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl h1">Edit Chapter</h1>
        <div className="text-sm text-slate-500">Auto-save drafts · Version history</div>
      </header>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <EditorWithAnnotations value={text} onChange={setText} annotations={annotations} onAddAnnotation={handleAddAnnotation} onResolveAnnotation={handleResolve} />
        </div>

        <aside className="space-y-4">
          <div className="card">
            <h4 className="font-semibold mb-2">Recorder</h4>
            <Recorder onSaveTranscript={handleSaveTranscript} uploadEndpoint="/api/transcribe" />
          </div>

          <div className="card">
            <h4 className="font-semibold">AI Tools</h4>
            <p className="text-sm text-slate-600 mt-2">Use AI to fix grammar or make text more alluring.</p>
            <div className="mt-3 flex flex-col gap-2">
              <button className="bg-rosewood text-white px-3 py-2 rounded" onClick={async () => {
                const res = await fetch('/api/ai/polish', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, mode: 'grammar' }) })
                const json = await res.json()
                if (json.edited) setText(json.edited)
              }}>Fix grammar</button>
              <button className="bg-[#6A0D2A] text-white px-3 py-2 rounded" onClick={async () => {
                const res = await fetch('/api/ai/polish', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, mode: 'alluring', tone: 'romantic' }) })
                const json = await res.json()
                if (json.edited) setText(json.edited)
              }}>Make more alluring</button>
            </div>
          </div>
        </aside>
      </section>
    </main>
  )
}
