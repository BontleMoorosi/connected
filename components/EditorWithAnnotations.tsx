import React, { useEffect, useRef, useState } from 'react'
import InlineAnnotation from './InlineAnnotation'

type Annotation = {
  id: string
  start: number
  end: number
  text: string
  author?: string
  created_at?: string
  status?: 'open' | 'resolved'
}

type Props = {
  value: string
  onChange: (text: string) => void
  annotations?: Annotation[]
  onAddAnnotation?: (a: { start: number; end: number; text: string }) => void
  onResolveAnnotation?: (id: string) => void
}

export default function EditorWithAnnotations({ value, onChange, annotations = [], onAddAnnotation, onResolveAnnotation }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [selection, setSelection] = useState<{ start: number; end: number } | null>(null)
  const [note, setNote] = useState('')

  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    const handler = () => setSelection({ start: ta.selectionStart, end: ta.selectionEnd })
    ta.addEventListener('select', handler)
    return () => ta.removeEventListener('select', handler)
  }, [])

  function addAnnotation() {
    if (!selection || selection.start === selection.end) return
    onAddAnnotation?.({ start: selection.start, end: selection.end, text: note })
    setNote('')
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={18}
          className="w-full p-4 border rounded-lg"
        />
        <div className="mt-2 flex gap-2 items-center">
          <input className="flex-1 p-2 border rounded" placeholder="Add a note to selected text" value={note} onChange={(e) => setNote(e.target.value)} />
          <button className="bg-rosewood text-white px-4 py-2 rounded" onClick={addAnnotation}>Add note</button>
        </div>
      </div>

      <div>
        <div className="mb-3">
          <h4 className="font-semibold">Annotations</h4>
          <p className="text-xs text-slate-500">Reader notes appear here. Click resolve when addressed.</p>
        </div>

        <div className="space-y-3">
          {annotations.length === 0 && <div className="text-sm text-slate-500">No annotations yet.</div>}
          {annotations.map(a => (
            <InlineAnnotation key={a.id} annotation={a} onResolve={(id) => onResolveAnnotation?.(id || a.id)} />
          ))}
        </div>
      </div>
    </div>
  )
}
