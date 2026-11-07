# CacheFlow

## Schema bazei de date

```mermaid
erDiagram
  profiles ||--o{ user_progress : has
  profiles ||--o{ quiz_attempts : makes
  levels ||--o{ lessons : contains
  lessons ||--o{ questions : contains
  lessons ||--o{ user_progress : tracked_in
  lessons ||--o{ quiz_attempts : for
  quiz_attempts ||--o{ wrong_answers : has
  questions ||--o{ wrong_answers : missed_in
```

| Tabel | Rol |
|---|---|
| profiles | Datele utilizatorului, legat de auth.users |
| levels | Nivelurile aplicației, în ordine |
| lessons | Lecțiile dintr-un nivel |
| questions | Întrebările unei lecții |
| user_progress | Ce lecții a terminat fiecare utilizator |
| quiz_attempts | Încercările de quiz și scorul |
| wrong_answers | Răspunsurile greșite dintr-o încercare |

Migrațiile se găsesc în `supabase/migrations`.
