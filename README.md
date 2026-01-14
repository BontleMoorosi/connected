# Connected

Connected — write books by voice, edit as you go or chapter-by-chapter, publish unedited drafts to readers for feedback, and provide a listening experience that matches the author's intent. Built for two main user types: Authors and Readers. Includes communities, AI writing tools, grammar & style fixes, and integrated audio recording/editing.

Vision: A trendy, chic, romantic writing platform that helps authors capture voice-first creativity and collaborate with readers and communities.

Core principles:
- Voice-first writing: record, transcribe, edit
- Versioned chapters: edit during or after recording
- Workshop: publish unedited drafts to readers for feedback
- Author-controlled audio: recorded narration (plus optional high-quality TTS)
- Community: groups, reading circles, threaded discussions
- AI tools: grammar fixer, style enhancer ("make more alluring"), plot/character helpers, contextual writing assistant

MVP highlights:
- Signup / login (author, reader roles)
- Create book -> add chapters -> record audio per chapter
- Transcription + inline edit UI per chapter
- Drafts & public "Workshop" area for unedited posts
- Reader feedback: inline annotations, comments, ratings
- Basic community groups and threads
- Grammar and style suggestions (AI)
- Audio player with author's recorded narration

Tech stack (recommended MVP):
- Frontend: Next.js + TypeScript (React) for web + PWA (mobile-friendly)
- Styling: TailwindCSS, with a curated theme (romantic/chic)
- Audio UI: wavesurfer.js (waveform), MediaRecorder API (browser recording)
- Backend: Node.js (NestJS or Next.js API routes) or Supabase for fast MVP
- Storage: S3-compatible (AWS/GCP) for audio blobs, images
- Database: PostgreSQL (Supabase or managed RDS)
- Auth: Supabase Auth / Auth0 / Clerk
- AI: OpenAI (or compatible LLM) for grammar/style; embeddings for contextual assistant
- TTS (optional): ElevenLabs / Azure Neural TTS / Google Cloud TTS (for optional synthetic narration)
- Realtime/notifications: Pusher / Supabase Realtime / WebSockets
- Transcoding: server-side ffmpeg (for MP3/AAC transcoding) or ffmpeg.wasm for client-side tasks

Design tone:
- Trendy, chic, romantic: soft blush, deep burgundy accents, lots of white/cream space
- Typography: a modern serif for headings (romantic feel) + clean sans for body
- UI: large expressive cards for books, prominent play/record CTA, delicate rounded UI components
