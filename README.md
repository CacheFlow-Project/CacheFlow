# CacheFlow

Aplicație educațională cu 4 niveluri (lecții video, chestionare, instrumente, examen final).

> Notă: viziunea completă, echipa și modul de lucru se află în PR #57. Acest README
> conține deocamdată doar partea tehnică agreată la tichetul **#1** (stack + structură).
> La merge-ul PR-ului #57, secțiunile se unesc.

## Stack (decizia #1)

| Strat     | Tehnologie                                | De ce                                                                                         |
| --------- | ----------------------------------------- | --------------------------------------------------------------------------------------------- |
| Framework | Next.js 16 (App Router)                   | Echipa a mai lucrat cu el; Server Components + Server Actions elimină un strat de API separat |
| Limbaj    | TypeScript (strict)                       | Tipuri partajate între server și client                                                       |
| UI / stil | Tailwind CSS v4                           | Stilizare rapidă, web responsive (desktop + telefon)                                          |
| Backend   | Supabase (PostgreSQL) + Auth              | Postgres găzduit + autentificare inclusă (se configurează la #44)                             |
| Runtime   | Node 24 LTS                               | Fixat în `.nvmrc` + `engines` + `engine-strict`                                               |
| Instalare | `npm ci` din `package-lock.json` (commis) | Versiuni identice la toți                                                                     |
| Deploy    | Vercel (ulterior)                         | Integrare nativă cu Next.js                                                                   |

Aplicație **web responsive**: rulează în browser pe laptop/PC, dar e gândită să arate
bine și pe telefon (conform Definition of Done). Verificarea testului pentru deblocarea
nivelului se va face **pe server** (Server Actions + Supabase), nu în frontend (#44).

## Pornire locală

Prerechizite: Node **24 LTS** (versiunea exactă în [`.nvmrc`](.nvmrc)).

```bash
nvm use            # sau: fnm use  (aliniază versiunea de Node)
npm ci             # instalează exact versiunile din package-lock.json
npm run dev        # pornește aplicația (merge și fără Supabase)
```

Aplicația pornește pe `http://localhost:3000`. Pentru variabilele de mediu (necesare
abia la #44): copiază `.env.example` în `.env.local`.

### Scripturi

| Script                 | Ce face                           |
| ---------------------- | --------------------------------- |
| `npm run dev`          | Server de dezvoltare (Next.js)    |
| `npm run build`        | Build de producție                |
| `npm run start`        | Rulează build-ul de producție     |
| `npm run typecheck`    | Verificare de tipuri (TypeScript) |
| `npm run lint`         | ESLint (reguli Next.js)           |
| `npm run format`       | Prettier (scrie modificările)     |
| `npm run format:check` | Prettier (doar verifică)          |

## Structura proiectului

```text
app/                # rute și pagini (App Router)
components/          # componente de UI reutilizabile (design comun — #3)
content/            # conținut: lecții + chestionare (format — #2)
backend/            # Server Actions (logica de server — backend, #44)
lib/                # client Supabase și utilitare (#44)
supabase/
  migrations/       # migrații SQL (schemă + RLS — #44)
```

Folderele goale sunt create de la început (criteriul de structură din #1) și se
populează la tichetele corespunzătoare. Convenție git: un branch per tichet
(`feature/<nr>-...`), PR cu `Closes #<nr>`, protecție pe `main`.
