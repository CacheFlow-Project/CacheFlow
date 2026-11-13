-- 0) Scoate politica veche (FOR ALL)
drop policy if exists "Utilizatorul isi administreaza propriul profil" on public.profiles;

-- 1) Trigger: profil automat la înregistrare
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data->>'username'), ''),
      split_part(new.email, '@', 1) || '_' || substr(new.id::text, 1, 4)
    )
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2) RLS pe profiles
alter table public.profiles enable row level security;

drop policy if exists "own profile" on public.profiles;
drop policy if exists "select own profile" on public.profiles;
drop policy if exists "update own profile" on public.profiles;

create policy "select own profile" on public.profiles
  for select to authenticated using (id = auth.uid());

create policy "update own profile" on public.profiles
  for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
