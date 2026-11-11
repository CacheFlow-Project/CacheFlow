-------------------------------------------------------
-- 1. CREARE TABELĂ LEVEL_PROGRESS
-------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.level_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  level_id INT NOT NULL REFERENCES public.levels(id) ON DELETE CASCADE,
  practice_done_at TIMESTAMPTZ DEFAULT NULL,
  tool_done_at TIMESTAMPTZ DEFAULT NULL,
  studied_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Cheie unică: un utilizator are un singur rând de progres per nivel
  CONSTRAINT unique_user_level UNIQUE (user_id, level_id)
);

-------------------------------------------------------
-- 2. ACTIVARE RLS (Row Level Security)
-------------------------------------------------------
ALTER TABLE public.level_progress ENABLE ROW LEVEL SECURITY;

-- Politică RLS optimizată cu (SELECT auth.uid())
CREATE POLICY "Utilizatorul isi administreaza propriul level_progress" 
  ON public.level_progress FOR ALL 
  TO authenticated 
  USING ((SELECT auth.uid()) = user_id) 
  WITH CHECK ((SELECT auth.uid()) = user_id);

-------------------------------------------------------
-- 3. FUNCȚIE SQL: is_level_studied (CU SEARCH_PATH SETAT)
-------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_level_studied(
  p_user_id UUID,
  p_level_id INT
) 
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY INVOKER 
SET search_path = public
AS $$
DECLARE
  v_total_lessons INT;
  v_completed_lessons INT;
  v_practice_done TIMESTAMPTZ;
  v_tool_done TIMESTAMPTZ;
BEGIN
  -- Numărăm câte lecții are nivelul respectiv
  SELECT COUNT(*) INTO v_total_lessons 
  FROM public.lessons 
  WHERE level_id = p_level_id;

  -- Numărăm câte lecții a marcat utilizatorul ca vizionate în user_progress
  SELECT COUNT(DISTINCT up.lesson_id) INTO v_completed_lessons
  FROM public.user_progress up
  JOIN public.lessons l ON l.id = up.lesson_id
  WHERE up.user_id = p_user_id AND l.level_id = p_level_id;

  -- Verificăm starea pentru practică și instrument în level_progress
  SELECT practice_done_at, tool_done_at 
  INTO v_practice_done, v_tool_done
  FROM public.level_progress
  WHERE user_id = p_user_id AND level_id = p_level_id;

  -- Întoarcem TRUE doar dacă toate lecțiile sunt gata + practica + instrumentul
  IF v_total_lessons > 0 
     AND v_completed_lessons = v_total_lessons 
     AND v_practice_done IS NOT NULL 
     AND v_tool_done IS NOT NULL THEN
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$;

-- Permisiune de executare pentru utilizatorii autentificați
GRANT EXECUTE ON FUNCTION public.is_level_studied(UUID, INT) TO authenticated;
