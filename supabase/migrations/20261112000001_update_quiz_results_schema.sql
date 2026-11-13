-------------------------------------------------------
-- 1. ACTUALIZARE TABELĂ QUIZ_ATTEMPTS
-------------------------------------------------------
ALTER TABLE public.quiz_attempts
  DROP COLUMN IF EXISTS lesson_id;

ALTER TABLE public.quiz_attempts
  ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'practice',
  ADD COLUMN IF NOT EXISTS level_id INT REFERENCES public.levels(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS finished_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS score INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_questions INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS passed BOOLEAN DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS ended_reason TEXT DEFAULT NULL;

ALTER TABLE public.quiz_attempts
  DROP CONSTRAINT IF EXISTS check_quiz_attempts_type,
  ADD CONSTRAINT check_quiz_attempts_type 
  CHECK (type IN ('practice', 'level_test', 'final_exam'));

ALTER TABLE public.quiz_attempts
  DROP CONSTRAINT IF EXISTS check_quiz_attempts_ended_reason,
  ADD CONSTRAINT check_quiz_attempts_ended_reason 
  CHECK (ended_reason IS NULL OR ended_reason IN ('completed', 'timeout', 'max_mistakes'));

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_type_level 
  ON public.quiz_attempts(user_id, type, level_id);


-------------------------------------------------------
-- 2. CREARE TABELĂ NOUĂ: ATTEMPT_ANSWERS (CU INT PENTRU FK)
-------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.attempt_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  attempt_id INT NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
  question_id INT NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  selected JSONB NOT NULL,
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT unique_attempt_question UNIQUE (attempt_id, question_id),
  CONSTRAINT check_selected_is_array CHECK (jsonb_typeof(selected) = 'array')
);

CREATE INDEX IF NOT EXISTS idx_attempt_answers_attempt_id 
  ON public.attempt_answers(attempt_id);

ALTER TABLE public.attempt_answers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Utilizatorul isi administreaza raspunsurile din incercari" ON public.attempt_answers;
CREATE POLICY "Utilizatorul isi administreaza raspunsurile din incercari" 
  ON public.attempt_answers FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts qa 
      WHERE qa.id = attempt_answers.attempt_id 
        AND qa.user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts qa 
      WHERE qa.id = attempt_answers.attempt_id 
        AND qa.user_id = (SELECT auth.uid())
    )
  );


-------------------------------------------------------
-- 3. ACTUALIZARE TABELĂ WRONG_ANSWERS
-------------------------------------------------------
ALTER TABLE public.wrong_answers
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMPTZ DEFAULT NULL;

UPDATE public.wrong_answers wa
SET user_id = qa.user_id
FROM public.quiz_attempts qa
WHERE wa.attempt_id = qa.id AND wa.user_id IS NULL;

ALTER TABLE public.wrong_answers
  ALTER COLUMN user_id SET NOT NULL;

DROP INDEX IF EXISTS idx_wrong_answers_unique_unresolved;
CREATE UNIQUE INDEX idx_wrong_answers_unique_unresolved 
  ON public.wrong_answers(user_id, question_id) 
  WHERE resolved_at IS NULL;

DROP POLICY IF EXISTS "Utilizatorul isi vede raspunsurile gresite" ON public.wrong_answers;
CREATE POLICY "Utilizatorul isi administreaza raspunsurile gresite" 
  ON public.wrong_answers FOR ALL 
  TO authenticated 
  USING ((SELECT auth.uid()) = user_id) 
  WITH CHECK ((SELECT auth.uid()) = user_id);
