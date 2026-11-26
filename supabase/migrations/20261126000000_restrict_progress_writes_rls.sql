-------------------------------------------------------
-- 1. REVOCARE PRIVILEGII DE SCRIERE PENTRU BROWSER (Opțional extra-layer)
-- Ne asigurăm că nici la nivel de GRANT nu există permisiuni în plus,
-- iar politicile RLS rămân strict pe SELECT.
-------------------------------------------------------

-------------------------------------------------------
-- 2. ACTUALIZARE POLITICI RLS: DOAR SELECT PENTRU AUTHENTICATED
-------------------------------------------------------

-- A. QUIZ_ATTEMPTS
DROP POLICY IF EXISTS "Utilizatorul isi administreaza incercarile de quiz" ON public.quiz_attempts;
DROP POLICY IF EXISTS "Utilizatorul isi vede incercarile de quiz" ON public.quiz_attempts;

CREATE POLICY "Utilizatorul isi vede incercarile de quiz" 
  ON public.quiz_attempts FOR SELECT 
  TO authenticated 
  USING ((SELECT auth.uid()) = user_id);


-- B. ATTEMPT_ANSWERS
DROP POLICY IF EXISTS "Utilizatorul isi administreaza raspunsurile din incercari" ON public.attempt_answers;
DROP POLICY IF EXISTS "Utilizatorul isi vede raspunsurile din incercari" ON public.attempt_answers;

CREATE POLICY "Utilizatorul isi vede raspunsurile din incercari" 
  ON public.attempt_answers FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts qa 
      WHERE qa.id = attempt_answers.attempt_id 
        AND qa.user_id = (SELECT auth.uid())
    )
  );


-- C. WRONG_ANSWERS
DROP POLICY IF EXISTS "Utilizatorul isi administreaza raspunsurile gresite" ON public.wrong_answers;
DROP POLICY IF EXISTS "Utilizatorul isi vede raspunsurile gresite" ON public.wrong_answers;

CREATE POLICY "Utilizatorul isi vede raspunsurile gresite" 
  ON public.wrong_answers FOR SELECT 
  TO authenticated 
  USING ((SELECT auth.uid()) = user_id);


-- D. LEVEL_PROGRESS
DROP POLICY IF EXISTS "Utilizatorul isi administreaza propriul level_progress" ON public.level_progress;
DROP POLICY IF EXISTS "Utilizatorul isi vede propriul level_progress" ON public.level_progress;

CREATE POLICY "Utilizatorul isi vede propriul level_progress" 
  ON public.level_progress FOR SELECT 
  TO authenticated 
  USING ((SELECT auth.uid()) = user_id);


-- E. USER_PROGRESS
DROP POLICY IF EXISTS "Utilizatorul isi administreaza propriul progres" ON public.user_progress;
DROP POLICY IF EXISTS "Utilizatorul isi vede propriul progres" ON public.user_progress;

CREATE POLICY "Utilizatorul isi vede propriul progres" 
  ON public.user_progress FOR SELECT 
  TO authenticated 
  USING ((SELECT auth.uid()) = user_id);

-------------------------------------------------------
-- 1. OPTIMIZARE POLITICI RLS PE PROFILES (SELECT și UPDATE)
-- Înlocuim auth.uid() cu (SELECT auth.uid()) pentru performanță
-------------------------------------------------------
DROP POLICY IF EXISTS "select own profile" ON public.profiles;
CREATE POLICY "select own profile" 
  ON public.profiles FOR SELECT 
  TO authenticated 
  USING ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "update own profile" ON public.profiles;
CREATE POLICY "update own profile" 
  ON public.profiles FOR UPDATE 
  TO authenticated 
  USING ((SELECT auth.uid()) = id) 
  WITH CHECK ((SELECT auth.uid()) = id);


-------------------------------------------------------
-- 2. BLOCARE APEL DIRECT DIN API PENTRU HANDLE_NEW_USER()
-- Această funcție este un trigger intern (rulează automat la sign-up),
-- nu trebuie să poată fi apelată manual prin RPC din browser.
-------------------------------------------------------
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;











