<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Reguli pentru agenții AI din CacheFlow

Aceste reguli sunt obligatorii pentru orice agent AI folosit de un membru al echipei. Nu modifica blocul `nextjs-agent-rules` de mai sus.

## 1. Înainte de lucru

1. Lucrează la un singur tichet GitHub. Dacă omul nu a dat numărul tichetului, cere-l.
2. Citește tichetul, inclusiv comentariile, plus `CONTRIBUTING.md` și, pentru teste, `TESTING.md`.
3. Citește codul existent din zona afectată și refolosește ce există.
4. Spune în 1–3 propoziții ce vei modifica, apoi continuă.

## 2. Când te oprești și întrebi

Oprește-te și întreabă omul dacă:

- criteriile de acceptare lipsesc, sunt ambigue sau se contrazic între surse;
- soluția cere o dependență nouă, o schimbare de stack sau de schemă neprevăzută în tichet;
- o regulă de produs nu este scrisă nicăieri.

Nu inventa reguli de produs, praguri, texte financiare sau date lipsă. Ordinea surselor este: tichetul, acest fișier, `CONTRIBUTING.md`, `README.md`. Dacă sursele se contrazic, semnalează contradicția și nu alege singur.

## 3. Limitele modificărilor

- Modifică doar ce cere tichetul. Fără refactorizări, reformatări sau „îmbunătățiri” din alte zone.
- Nu schimba versiunile din `package.json` și nu adăuga pachete fără acordul omului. Instalează cu `npm ci`, pe Node 24.
- Nu șterge și nu rescrie fișiere sau modificări ale altcuiva. Dacă găsești modificări necunoscute, lasă-le neatinse și anunță omul.

## 4. Git și GitHub

- Un branch pentru fiecare issue, cu formatul `<nr>-descriere-scurta` (ex. `9-chestionar-exersare`).
- Nu face push în `main`.
- Fă commit, push, PR sau comentarii pe GitHub doar când omul cere explicit.
- Fiecare PR conține `Closes #<nr>` și are nevoie de cel puțin un review uman.
- Nu face merge, nu aproba PR-uri și nu muta carduri pe board.
- Nu folosi `git push --force`, `git reset --hard` sau `--no-verify`.

## 5. Unde se pune codul

| Folder                 | Conținut                                    |
| ---------------------- | ------------------------------------------- |
| `app/`                 | Rute și pagini (App Router)                 |
| `components/`          | Componente de UI reutilizabile              |
| `backend/`             | Server Actions și logica de server          |
| `lib/`                 | Client Supabase și utilitare                |
| `content/`             | Lecții și întrebări, în JSON                |
| `supabase/migrations/` | Migrații SQL                                |

Nu crea foldere noi la rădăcină fără acordul omului.

## 6. Cod

- TypeScript strict: fără `any` și fără `@ts-ignore` nejustificat.
- Respectă Next.js 16 conform documentației din `node_modules/next/dist/docs/`, nu din memorie.
- Folosește Tailwind CSS v4 pentru stilizare.
- Textele din interfață sunt în limba română, cu diacritice.
- Orice ecran trebuie să funcționeze de la 375 px în sus.

## 7. Reguli de produs

- Scorul, promovarea și deblocarea nivelurilor se calculează numai pe server (Server Actions și Supabase).
- În testele de nivel și la examen, răspunsurile corecte și explicațiile nu se trimit în browser înainte de finalizare.
- Un răspuns este corect doar dacă setul bifat coincide exact cu setul de răspunsuri corecte.
- Exersarea arată feedback și explicație imediat după fiecare răspuns.
- Testul de nivel are 10 întrebări aleatorii din banca nivelului și explicații la final. Promovarea cere minimum 9/10.
- Progresul se salvează în `user_progress`, încercările în `quiz_attempts`, iar greșelile în `wrong_answers`.

## 8. Date și securitate

- Nu citi, nu afișa și nu comite `.env.local` sau alte secrete. Variabilele noi se adaugă cu valoare goală în `.env.example`.
- Prefixul `NEXT_PUBLIC_` se folosește doar pentru valori publice. Cheia `service_role` nu ajunge niciodată în browser.
- Schema se schimbă doar printr-o migrație nouă în `supabase/migrations/`. Nu edita migrațiile deja aplicate.
- Tabelele cu date de utilizator trebuie protejate cu Row Level Security.
- Nu rula comenzi pe baza de date de producție fără acordul explicit al omului.

## 9. Conținut educațional

- Nu marca o întrebare ca verificată sau aprobată. Verifică testerul și aprobă PO-ul.
- Informațiile financiare trebuie să fie corecte pentru România. Dacă nu poți confirma o informație, semnaleaz-o.
- Respectă formatul JSON stabilit la #2.

## 10. Verificare înainte de a anunța finalizarea

Rulează, în această ordine:

```bash
npm run typecheck
```

```bash
npm run lint
```

```bash
npm run format:check
```

```bash
npm run build
```

Pentru modificări vizibile, pornește aplicația și verifică ecranul, inclusiv la 375 px. Dacă adaugi logică de scor sau deblocare, verifică și cazurile limită (9/10 și 8/10).

## 11. Raportul final

Încheie fiecare sarcină cu:

- **Modificat:** fișierele schimbate și de ce;
- **Verificat:** comenzile rulate și rezultatul lor real;
- **Neverificat:** ce nu ai putut testa;
- **De decis:** întrebările rămase pentru om.

Nu spune că ceva funcționează dacă nu ai verificat. Tichetul ajunge în `Done` doar după testarea făcută de Brigitte.
