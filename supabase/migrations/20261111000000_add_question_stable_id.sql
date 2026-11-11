alter table public.questions
  add column if not exists stable_id text;

create unique index if not exists questions_stable_id_key
  on public.questions (stable_id);
