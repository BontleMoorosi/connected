-- Supabase schema for Connected (Postgres)
-- Run this in your Supabase SQL editor to create the core tables.

-- Users: Supabase Auth will manage most auth fields; store profile info here.
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  role text check (role in ('author','reader','both')) default 'reader',
  bio text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Books
create table if not exists books (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  cover_url text,
  synopsis text,
  genres text[],
  status text check (status in ('draft','published')) default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Chapters
create table if not exists chapters (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references books(id) on delete cascade,
  index integer not null,
  title text,
  text_current text,
  word_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create unique index on chapters(book_id, index);

-- Draft versions (for versioning)
create table if not exists draft_versions (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references chapters(id) on delete cascade,
  author_id uuid not null references profiles(id),
  text text,
  created_at timestamptz default now(),
  is_published boolean default false,
  visibility text check (visibility in ('private','workshop','public')) default 'private'
);

-- Audio tracks
create table if not exists audio_tracks (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references chapters(id) on delete cascade,
  uploader_id uuid references profiles(id),
  file_url text,
  duration_ms integer,
  waveform_json jsonb,
  transcript_id uuid references transcripts(id),
  created_at timestamptz default now(),
  encoding text,
  is_primary boolean default false
);

-- Transcripts
create table if not exists transcripts (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references chapters(id),
  raw_transcript text,
  segments jsonb, -- [{start, end, text}]
  confidence numeric,
  created_at timestamptz default now()
);

-- Workshop feedback & inline annotations
create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid references chapters(id),
  reader_id uuid references profiles(id),
  type text check (type in ('comment','inline-annotation','rating','suggestion')),
  text text,
  location jsonb, -- {start_char, end_char, start_time, end_time}
  created_at timestamptz default now(),
  resolved boolean default false
);

create table if not exists annotations (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid references chapters(id),
  author_id uuid references profiles(id),
  reader_id uuid references profiles(id),
  start_char integer,
  end_char integer,
  text text,
  created_at timestamptz default now(),
  status text check (status in ('open','resolved')) default 'open'
);

-- Community groups
create table if not exists community_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  cover_url text,
  privacy text check (privacy in ('public','private')) default 'public',
  owner_id uuid references profiles(id),
  created_at timestamptz default now()
);

create table if not exists group_posts (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references community_groups(id),
  author_id uuid references profiles(id),
  content text,
  attachments jsonb,
  created_at timestamptz default now()
);

-- Notifications
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  kind text,
  payload jsonb,
  read_at timestamptz,
  created_at timestamptz default now()
);

-- AI request log (cost & moderation)
create table if not exists ai_request_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  book_id uuid references books(id),
  chapter_id uuid references chapters(id),
  prompt text,
  response_summary text,
  cost numeric,
  created_at timestamptz default now()
);

-- Indexes for common queries
create index on books (author_id);
create index on chapters (book_id);
create index on feedback (chapter_id);
create index on annotations (chapter_id);
