-- PROFILES (legat 1-la-1 de utilizatorii din Supabase Auth)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- LEVELS
create table public.levels (
  id serial primary key,
  title text not null,
  description text,
  position int not null unique
);

-- LESSONS
create table public.lessons (
  id serial primary key,
  level_id int not null references public.levels(id) on delete cascade,
  title text not null,
  content text,
  position int not null,
  unique (level_id, position)
);

-- QUESTIONS
create table public.questions (
  id serial primary key,
  lesson_id int not null references public.lessons(id) on delete cascade,
  question_text text not null,
  options jsonb not null,
  correct_answer text not null,
  explanation text
);

-- USER_PROGRESS
create table public.user_progress (
  id serial primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id int not null references public.lessons(id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamptz,
  unique (user_id, lesson_id)
);

-- QUIZ_ATTEMPTS
create table public.quiz_attempts (
  id serial primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id int not null references public.lessons(id) on delete cascade,
  score int not null,
  total_questions int not null,
  created_at timestamptz not null default now()
);

-- WRONG_ANSWERS
create table public.wrong_answers (
  id serial primary key,
  attempt_id int not null references public.quiz_attempts(id) on delete cascade,
  question_id int not null references public.questions(id) on delete cascade,
  given_answer text
);

-- INDEXURI pe cheile străine
create index on public.lessons (level_id);
create index on public.questions (lesson_id);
create index on public.user_progress (user_id);
create index on public.user_progress (lesson_id);
create index on public.quiz_attempts (user_id);
create index on public.quiz_attempts (lesson_id);
create index on public.wrong_answers (attempt_id);
create index on public.wrong_answers (question_id);
