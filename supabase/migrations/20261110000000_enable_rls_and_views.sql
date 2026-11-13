-------------------------------------------------------
-- 1. CREARE VIEW SECURIZAT PENTRU ÎNTREBĂRI
-- Omite coloana correct_answer și folosește security_invoker = true
-------------------------------------------------------
CREATE OR REPLACE VIEW public.questions_public 
WITH (security_invoker = true) AS
SELECT 
  id,
  lesson_id,
  question_text,
  options,
  explanation
FROM public.questions;

-- Permite utilizatorilor autentificați să citească din view
GRANT SELECT ON public.questions_public TO authenticated;


-------------------------------------------------------
-- 2. ACTIVARE RLS (Row Level Security) PE TOATE TABELELE
-------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wrong_answers ENABLE ROW LEVEL SECURITY;


-------------------------------------------------------
-- 3. POLITICI DE ACCES SECURIZATE ȘI OPTIMIZATE
-------------------------------------------------------

-- A. LEVELS & LESSONS: Citire publică pentru utilizatorii autentificați
CREATE POLICY "Utilizatorii pot citi nivelurile" 
  ON public.levels FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Utilizatorii pot citi lectiile" 
  ON public.lessons FOR SELECT 
  TO authenticated 
  USING (true);

-- B. QUESTIONS: Blocare acces direct din browser pe tabela completă
CREATE POLICY "Blocare acces direct browser pe questions" 
  ON public.questions FOR SELECT 
  TO authenticated 
  USING (false);

-- C. PROFILES: Fiecare își administrează doar propriul profil
CREATE POLICY "Utilizatorul isi administreaza propriul profil" 
  ON public.profiles FOR ALL 
  TO authenticated 
  USING ((SELECT auth.uid()) = id) 
  WITH CHECK ((SELECT auth.uid()) = id);

-- D. USER_PROGRESS: Vezi și modifici doar propriul progres
CREATE POLICY "Utilizatorul isi administreaza propriul progres" 
  ON public.user_progress FOR ALL 
  TO authenticated 
  USING ((SELECT auth.uid()) = user_id) 
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- E. QUIZ_ATTEMPTS: Vezi și adaugi doar propriile încercări de quiz
CREATE POLICY "Utilizatorul isi administreaza incercarile de quiz" 
  ON public.quiz_attempts FOR ALL 
  TO authenticated 
  USING ((SELECT auth.uid()) = user_id) 
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- F. WRONG_ANSWERS: Acces bazat pe încercarea proprie (attempt)
CREATE POLICY "Utilizatorul isi vede raspunsurile gresite" 
  ON public.wrong_answers FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts qa 
      WHERE qa.id = wrong_answers.attempt_id 
        AND qa.user_id = (SELECT auth.uid())
    )
  );
