-- ============================================
-- Vivelo schema — run this in the Supabase SQL editor
-- (Sharpline Digital project → SQL Editor → New query)
-- Safe to run once; re-running will error on existing tables,
-- which is fine — it means it's already set up.
-- ============================================

-- Basic profile info, one row per user, keyed to auth.users
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  age int,
  sex text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- One row per user per pillar: current score (1-10) + selected interest chips
create table if not exists pillar_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pillar text not null check (pillar in ('purpose','connections','mind','body')),
  score int not null check (score between 1 and 10),
  interests text[] default '{}',
  updated_at timestamptz default now(),
  unique (user_id, pillar)
);

alter table pillar_scores enable row level security;

create policy "Users can view their own pillar scores"
  on pillar_scores for select
  using (auth.uid() = user_id);

create policy "Users can insert their own pillar scores"
  on pillar_scores for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own pillar scores"
  on pillar_scores for update
  using (auth.uid() = user_id);

-- AI-generated suggestions, kept as history (not overwritten)
create table if not exists ai_suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pillar text not null,
  suggestion text not null,
  created_at timestamptz default now()
);

alter table ai_suggestions enable row level security;

create policy "Users can view their own suggestions"
  on ai_suggestions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own suggestions"
  on ai_suggestions for insert
  with check (auth.uid() = user_id);
