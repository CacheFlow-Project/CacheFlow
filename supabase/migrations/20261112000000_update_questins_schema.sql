-------------------------------------------------------
-- 1. ȘTERGERE VIEW VECHI (Pentru a putea modifica coloanele tabelei)
-------------------------------------------------------
DROP VIEW IF EXISTS public.questions_public;


-------------------------------------------------------
-- 2. ACTUALIZARE STRUCTURĂ TABELĂ QUESTIONS
-------------------------------------------------------
-- A. Adăugăm coloanele noi: level_id, external_id, correct_answers
ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS level_id INT REFERENCES public.levels(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS external_id TEXT,
  ADD COLUMN IF NOT EXISTS correct_answers JSONB;

-- B. Populăm level_id din lecții (pentru eventuale rânduri existente) și îl facem obligatoriu
UPDATE public.questions q
SET level_id = l.level_id
FROM public.lessons l
WHERE q.lesson_id = l.id AND q.level_id IS NULL;

-- Dacă există întrebări fără lecție, le asociem temporar nivelului 1 (dacă există) pentru a nu bloca NOT NULL
UPDATE public.questions
SET level_id = (SELECT id FROM public.levels ORDER BY id LIMIT 1)
WHERE level_id IS NULL;

ALTER TABLE public.questions
  ALTER COLUMN level_id SET NOT NULL,
  ALTER COLUMN lesson_id DROP NOT NULL;

-- C. Adăugăm constrângerea de unicitate pe external_id
ALTER TABLE public.questions
  DROP CONSTRAINT IF EXISTS questions_external_id_key,
  ADD CONSTRAINT questions_external_id_key UNIQUE (external_id);

-- D. Eliminăm vechea coloană single-answer (correct_answer)
ALTER TABLE public.questions
  DROP COLUMN IF EXISTS correct_answer;

-- E. Populăm orice valoare NULL din correct_answers cu '[0]' înainte de a seta NOT NULL
UPDATE public.questions
SET correct_answers = '[0]'::jsonb
WHERE correct_answers IS NULL;

-- Setăm correct_answers ca obligatoriu
ALTER TABLE public.questions
  ALTER COLUMN correct_answers SET NOT NULL;

-- Verificăm că options este un array JSON non-vid
ALTER TABLE public.questions
  DROP CONSTRAINT IF EXISTS check_options_is_array,
  ADD CONSTRAINT check_options_is_array 
  CHECK (jsonb_typeof(options) = 'array' AND jsonb_array_length(options) > 0);

-- Verificăm că correct_answers este un array JSON cu cel puțin 1 element
ALTER TABLE public.questions
  DROP CONSTRAINT IF EXISTS check_correct_answers_non_empty,
  ADD CONSTRAINT check_correct_answers_non_empty 
  CHECK (jsonb_typeof(correct_answers) = 'array' AND jsonb_array_length(correct_answers) >= 1);

-- Funcție de validare: verifică dacă toți indicii din correct_answers sunt numere valide în intervalul [0, lungime_options - 1]
CREATE OR REPLACE FUNCTION public.validate_question_indices(p_options JSONB, p_correct_answers JSONB)
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
  v_elem JSONB;
  v_idx INT;
  v_len INT;
BEGIN
  IF jsonb_typeof(p_options) <> 'array' OR jsonb_typeof(p_correct_answers) <> 'array' THEN
    RETURN FALSE;
  END IF;

  v_len := jsonb_array_length(p_options);

  FOR v_elem IN SELECT * FROM jsonb_array_elements(p_correct_answers)
  LOOP
    IF jsonb_typeof(v_elem) <> 'number' THEN
      RETURN FALSE;
    END IF;
    
    v_idx := (v_elem::TEXT)::INT;
    
    IF v_idx < 0 OR v_idx >= v_len THEN
      RETURN FALSE;
    END IF;
  END LOOP;

  RETURN TRUE;
END;
$$;

ALTER TABLE public.questions
  DROP CONSTRAINT IF EXISTS check_valid_answer_indices,
  ADD CONSTRAINT check_valid_answer_indices 
  CHECK (public.validate_question_indices(options, correct_answers));


-------------------------------------------------------
-- 3. INDEX PE LEVEL_ID (Pentru extragere aleatorie rapidă)
-------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_questions_level_id ON public.questions(level_id);


-------------------------------------------------------
-- 4. RE-CREARE VIEW SECURIZAT QUESTIONS_PUBLIC
-- Fără correct_answers și fără explanation
-------------------------------------------------------
CREATE OR REPLACE VIEW public.questions_public 
WITH (security_invoker = true) AS
SELECT 
  id,
  external_id,
  level_id,
  lesson_id,
  question_text,
  options
FROM public.questions;

GRANT SELECT ON public.questions_public TO authenticated;
