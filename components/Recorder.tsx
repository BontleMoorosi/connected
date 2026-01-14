import React, { useEffect, useRef, useState } from 'react'

type Props = {
  onSaveTranscript?: (text: string) => void
  uploadEndpoint?: string // e.g. '/api/transcribe'
}

export default function Recorder({ onSaveTranscript, uploadEndpoint = '/api/transcribe' }: Props) {
  const [recording, setRecording] = useState(false)
  const [mediaUrl, setMediaUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  useEffect(() => {
    return () => {
      if (mediaUrl) URL.revokeObjectURL(mediaUrl)
    }
  }, [mediaUrl])

  async function start() {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      mediaRecorderRef.current = mr
      chunksRef.current = []
      mr.ondataavailable = (ev: BlobEvent) => {
        if (ev.data.size) chunksRef.current.push(ev.data)
      }
      mr.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setMediaUrl(url)
        await uploadAudio(blob)
      }
      mr.start()
      setRecording(true)
    } catch (e: any) {
      setError(e?.message || 'Microphone access failed')
    }
  }

  function stop() {
    const mr = mediaRecorderRef.current
    if (!mr) return
    mr.stop()
    setRecording(false)
  }

  async function uploadAudio(blob: Blob) {
    try {
      const fd = new FormData()
      fd.append('file', blob, 'recording.webm')
      const res = await fetch(uploadEndpoint, { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Upload failed')
      const json = await res.json()
      if (json.transcript && onSaveTranscript) onSaveTranscript(json.transcript)
    } catch (err: any) {
      setError(err?.message || 'Upload error')
    }
  }

  return (
    <div className="p-4 rounded-xl bg-white shadow">
      <div className="flex items-center gap-4">
        <button
          onClick={recording ? stop : start}
          className={`px-4 py-2 rounded-md text-white ${recording ? 'bg-[#E53E3E]' : 'bg-rosewood'}`}
        >
          {recording ? 'Stop' : 'Record'}
        </button>

        <div>
          {recording ? <span className="text-sm text-red-600">Recording…</span> : <span className="text-sm text-slate-600">Ready</span>}
        </div>
      </div>

      {mediaUrl && (
        <div className="mt-4">
          <audio controls src={mediaUrl} className="w-full" />
          <p className="text-xs text-slate-500 mt-2">Preview of the recorded audio. It will be uploaded and transcribed automatically.</p>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}
