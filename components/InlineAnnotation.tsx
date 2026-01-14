import React, { useState } from 'react'

type Annotation = {
  id?: string
  start: number
  end: number
  text: string
  author?: string
  created_at?: string
  status?: 'open' | 'resolved'
}

type Props = {
  annotation: Annotation
  onResolve?: (id?: string) => void
  onEdit?: (a: Annotation) => void
}

export default function InlineAnnotation({ annotation, onResolve, onEdit }: Props) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(annotation.text)

  return (
    <div className="bg-[rgba(255,240,240,0.9)] border-l-2 border-rosewood p-3 rounded-md">
      <div className="flex justify-between items-start gap-2">
        <div>
          <div className="text-xs text-rosewood font-medium">{annotation.author || 'Reader'}</div>
          {!editing ? (
            <div className="text-sm text-slate-700 mt-1 whitespace-pre-wrap">{annotation.text}</div>
          ) : (
            <textarea className="w-full p-2 border rounded" rows={3} value={value} onChange={(e) => setValue(e.target.value)} />
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          {annotation.status !== 'resolved' && !editing && (
            <button className="text-sm text-rosewood" onClick={() => setEditing(true)}>Edit</button>
          )}
          {editing ? (
            <div className="flex gap-2">
              <button className="text-sm bg-rosewood text-white px-2 py-1 rounded" onClick={() => { setEditing(false); onEdit?.({ ...annotation, text: value }) }}>Save</button>
              <button className="text-sm px-2 py-1 rounded border" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          ) : (
            <div className="flex gap-2">
              {annotation.status !== 'resolved' && <button className="text-sm px-2 py-1 rounded border" onClick={() => onResolve?.(annotation.id)}>Resolve</button>}
              <div className="text-xs text-slate-400">{annotation.created_at ? new Date(annotation.created_at).toLocaleString() : ''}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
