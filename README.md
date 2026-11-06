# CacheFlow

> Aplicație de educație financiară gamificată pentru tineri: înveți să-ți gestionezi banii prin lecții video, chestionare și simulări, nu prin teorie.

## Viziune

CacheFlow îi învață pe tinerii de 16–25 de ani, mai ales pe cei care părăsesc sistemul de protecție a copilului (centrele de plasament), conceptele financiare de bază: cum îți faci un buget, ce înseamnă o chirie, cum îți plătești facturile, cum economisești și cum te ferești de înșelătorii.

Lipsa educației financiare la vârsta majoratului îi poate duce pe tinerii vulnerabili direct în datorii. CacheFlow vrea să fie un „simulator de viață reală”, în care greșelile se fac în aplicație, nu în viața reală.

## Cum funcționează

Aplicația e construită ca o aplicație de chestionare auto: înveți pe capitole, exersezi și dai un examen final.

```
Nivelul 1          Nivelul 2              Nivelul 3          Nivelul 4
Bugetul personal → Economii și urgențe → Taxe și salariu → Investiții și dobândă → Examen final
```

Fiecare nivel conține:

1. **Lecții video scurte** (2–5 minute)
2. **Chestionar de exersare**: grilă cu unul sau mai multe răspunsuri corecte, cu explicație după fiecare răspuns
3. **Un instrument interactiv**:

   | Nivel | Instrument |
   |---|---|
   | 1. Bugetul personal | Simulatorul de buget lunar: venit, chirie, facturi, mâncare, cheltuieli neprevăzute |
   | 2. Economii și urgențe | Jocul de decizii („chirie singur sau cu colegi?”), cu raport final despre consecințe |
   | 3. Taxe și salariu | Calculatorul „câte ore de muncă costă” un obiect |
   | 4. Investiții și dobândă | Vizualizatorul de dobândă compusă (18 vs. 30 de ani) și simulatorul de inflație |

4. **Test de nivel**: dacă îl treci, se deblochează nivelul următor

La final urmează **examenul CacheFlow**: întrebări aleatorii din toate nivelurile, cu cronometru și număr limitat de greșeli. Utilizatorul poate relua oricând lista cu **întrebările greșite**.

### În afara MVP-ului (mai târziu)

- Comparatorul de credite
- Secțiunea despre fraude online, credite cu dobânzi ascunse și contracte de muncă

## Echipa

| Rol | Membri |
|---|---|
| Product Owner | Nițan Ioana |
| Scrum Master | Perșa Diana-Alexandra |
| Tester | Mranovatz Brigitte |
| Dezvoltare – perechea 1: chestionare, teste, examen | Leaț Elena Anabela, Putanu Elena-Florina |
| Dezvoltare – perechea 2: skill tree, lecții, cont, progres | Popa Miruna Andreea, Nodiș Bianca-Loredana |
| Dezvoltare – perechea 3: instrumente interactive, design | Stoina Alexia Fanuria, Vălcan Georgiana-Ana |

Fiecare pereche își face funcționalitățile cap-coadă, cu frontend-ul și partea de Supabase din spate.

## Tehnologii

| Parte | Tehnologie |
|---|---|
| Frontend | _de stabilit – vezi [#1](https://github.com/CacheFlow-Project/CacheFlow/issues/1)_ |
| Backend, bază de date, autentificare | [Supabase](https://supabase.com) (PostgreSQL, Auth, Row Level Security, Edge Functions, Storage) |
| Deploy | _de stabilit – vezi [#56](https://github.com/CacheFlow-Project/CacheFlow/issues/56)_ |

## Pornirea proiectului local

> Se completează după alegerea stack-ului ([#1](https://github.com/CacheFlow-Project/CacheFlow/issues/1)) și setup-ul proiectului ([#51](https://github.com/CacheFlow-Project/CacheFlow/issues/51), [#55](https://github.com/CacheFlow-Project/CacheFlow/issues/55)).

```bash
git clone https://github.com/CacheFlow-Project/CacheFlow.git
cd CacheFlow
cp .env.example .env   # completează URL-ul și cheia anon din Supabase
# pașii de instalare și rulare vin aici
```

### Variabile de mediu

| Variabilă | Descriere |
|---|---|
| `SUPABASE_URL` | URL-ul proiectului Supabase |
| `SUPABASE_ANON_KEY` | Cheia publică `anon` |

> ⚠️ Fișierul `.env` nu se pune niciodată pe GitHub. Cheia `service_role` nu se folosește niciodată în frontend.

## Formatul conținutului

Lecțiile și întrebările se scriu în fișiere JSON și se încarcă în Supabase printr-un script de seed ([#47](https://github.com/CacheFlow-Project/CacheFlow/issues/47)). Formatul final se stabilește în [#2](https://github.com/CacheFlow-Project/CacheFlow/issues/2). Propunerea de pornire arată așa:

```json
{
  "nivel": 1,
  "intrebare": "Ce ar trebui să incluzi în bugetul lunar pe lângă chirie?",
  "variante": ["Utilități", "Abonamentul la sală", "Mâncare", "Fond de urgență"],
  "corecte": [0, 2, 3],
  "explicatie": "Utilitățile, mâncarea și economiile sunt cheltuieli esențiale; sala e opțională."
}
```

Fiecare întrebare e verificată de tester și aprobată de Product Owner înainte să intre în aplicație.

## Cum lucrăm

Lucrăm în **sprinturi Scrum**. Taskurile sunt pe [board-ul Kanban](https://github.com/orgs/CacheFlow-Project/projects/1).

**Board:** `Backlog → Ready → In progress → In review → Done`

- Când începi un task, îți pui numele pe el (Assignees) și îl muți în **In progress**
- Când ai deschis pull request-ul, îl muți în **In review**
- Ajunge în **Done** numai după ce l-a testat Brigitte

**Etichete utile:** `pereche-1: chestionare`, `pereche-2: skill tree & lecții`, `pereche-3: instrumente & UI`, `rol: Product Owner`, `rol: Scrum Master`, `rol: tester`, `frontend`, `backend / Supabase`, `conținut`, `must` / `should` / `could`

### Git

- Câte un branch pentru fiecare issue, cu numărul în nume: `9-chestionar-exersare`
- **Nimeni nu face push direct în `main`**
- Fiecare pull request are `Closes #<număr>` în descriere și cel puțin un review de la altcineva

### Definition of Done

Un task e gata când:

- [ ] îndeplinește toate criteriile de acceptare din issue
- [ ] codul e în `main` prin pull request, după review
- [ ] a fost testat de tester
- [ ] funcționează pe ecran de telefon

## Linkuri

- [Board Kanban](https://github.com/orgs/CacheFlow-Project/projects/1)
- [Issues](https://github.com/CacheFlow-Project/CacheFlow/issues)
- [Milestones](https://github.com/CacheFlow-Project/CacheFlow/milestones)
