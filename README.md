# CacheFlow

Aplicație educațională cu 4 niveluri (lecții video, chestionare, instrumente, examen final).

> Notă: viziunea completă, echipa și modul de lucru se află în PR #57. Acest README
> conține deocamdată doar partea tehnică agreată la tichetul **#1** (stack + structură).
> La merge-ul PR-ului #57, secțiunile se unesc.

## Stack 

| Aspect    | Alegere                                   |
| --------- | ----------------------------------------- |
| UI        | React 19 + Vite                           |
| Limbaj    | TypeScript (strict)                       |
| Formă     | Aplicație web PWA, mobile-first           |
| Backend   | Supabase (se configurează la #44)         |
| Runtime   | Node 24 LTS                               |
| Instalare | `npm ci` din `package-lock.json` (commis) |
| Deploy    | Vercel / Netlify (ulterior)               |


## Pornire locală

Prerechizite: Node **24 LTS** (versiunea exactă în [`.nvmrc`](.nvmrc)).

```bash
nvm use            # sau: fnm use  (aliniază versiunea de Node)
npm ci             # instalează exact versiunile din package-lock.json
npm run dev        # pornește aplicația (merge și fără .env / fără Supabase)
```

Pentru variabilele de mediu: copiază `.env.example` în `.env`.

### Scripturi

| Script                 | Ce face                                  |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Server de dezvoltare (Vite)              |
| `npm run build`        | Typecheck + build de producție în `dist` |
| `npm run preview`      | Servește build-ul de producție           |
| `npm run typecheck`    | Verificare de tipuri (TypeScript)        |
| `npm run lint`         | ESLint                                   |
| `npm run format`       | Prettier (scrie modificările)            |
| `npm run format:check` | Prettier (doar verifică)                 |

## Structura proiectului

```text
src/
  screens/      # ecrane (lecție, test, examen) — se umplu la tichetele lor
  components/   # componente de UI reutilizabile 
  content/      # conținut JSON: lecții + chestionare 
  services/     # tot ce vorbește cu Supabase 
  lib/          # client Supabase și utilitare
  styles/       # stiluri globale
supabase/
  migrations/   # migrații SQL 
```

Folderele de mai sus sunt create de la început (criteriul de structură din #1); se
populează la tichetele corespunzătoare. Convenție git: un branch per tichet
(`initialele_voastre/<nrTichet>/descriere`).
