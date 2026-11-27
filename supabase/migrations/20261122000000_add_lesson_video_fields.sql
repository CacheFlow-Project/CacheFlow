-------------------------------------------------------
-- ADĂUGARE CÂMPURI VIDEO PE LECȚII (#77)
-- getLessons trebuie să întoarcă video_url și durata lecției.
-- Datele există deja în content/level-*.json; seed.mjs le populează după migrație.
-------------------------------------------------------
ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS video_url TEXT,
  ADD COLUMN IF NOT EXISTS duration_sec INT NOT NULL DEFAULT 0;

-- video_url rămâne nullable (un clip poate lipsi încă, ex. placeholder din content).
-- duration_sec e NOT NULL DEFAULT 0 (content-ul validează deja duration_sec întreg ≥ 0);
-- DEFAULT acoperă rândurile deja importate.
-- RLS pe lessons permite deja SELECT autentificat (20261110000000_enable_rls_and_views.sql),
-- deci nu e nevoie de o politică nouă.
