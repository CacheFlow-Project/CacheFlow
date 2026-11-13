# Planul de testare CacheFlow

Acest document stabilește ce testăm, pe ce dispozitive și cum raportăm bug-urile în MVP 1 (tichetul #38).

Responsabil QA: Mranovatz Brigitte.

## Ce testăm

| Zonă                   | Tichete         | Ce verificăm                                                     |
| ---------------------- | --------------- | ---------------------------------------------------------------- |
| Skill tree             | #4              | Cele 4 niveluri, starea blocat/deblocat, deschiderea nivelului   |
| Lecții video           | #5              | Încărcarea din conținut, redarea, marcarea ca vizionată          |
| Deblocare și progres   | #6, #7          | Deblocarea validată pe server, progresul păstrat între sesiuni   |
| Chestionar de exersare | #9, #10         | Feedback imediat, scor final, răspunsuri multiple                |
| Test de nivel          | #11             | 10 întrebări aleatorii, explicații la final, prag de 9/10        |
| Simulator de buget     | #15             | Calculul soldului, sold negativ, cheltuială neprevăzută          |
| Conținut Nivelul 1     | #21, #41        | Răspunsuri marcate corect, explicații clare, informații corecte  |

Nu intră în MVP 1: testele automate și testele de încărcare.

## Dispozitive și browsere

Lista trebuie confirmată în funcție de dispozitivele reale ale echipei.

| Prioritate | Platformă | Browser          | Lățime de verificat |
| ---------- | --------- | ---------------- | ------------------- |
| Obligatoriu | Telefon Android | Chrome      | 375 px              |
| Obligatoriu | iPhone    | Safari           | 375 px              |
| Obligatoriu | Laptop/PC | Chrome           | 1440 px             |
| Secundar   | Laptop/PC | Firefox          | 1440 px             |
| Secundar   | Tabletă sau emulare | Chrome | 768 px              |

Emularea din DevTools e bună pentru verificări rapide, dar înainte de „Done” fiecare funcționalitate se verifică pe cel puțin un telefon real.

## Unde testăm

- **Implicit:** pe link-ul de test publicat din `main` (#56).
- **Până există link-ul:** local, după pașii din README.
- **Conturi:** se folosesc doar conturi de test, niciodată date personale reale.

## Cum decurge testarea unui tichet

1. Developerul mută cardul în `Review` și deschide PR-ul.
2. După merge, testerul rulează cazurile de test din comentariul de pe issue.
3. Dacă toate trec, testerul mută cardul în `Done`.
4. Dacă un caz pică, testerul deschide un bug și îl leagă de tichet, iar cardul rămâne deschis până la re-test.

Un card ajunge în `Done` doar după aprobarea QA (vezi [CONTRIBUTING.md](CONTRIBUTING.md)).

## Raportarea unui bug

Bug-urile se raportează pe GitHub: **Issues → New issue**, cu șablonul din `.github/ISSUE_TEMPLATE/`. Autorul atribuie issue-ul developerului sau perechii responsabile.

| Câmp                  | Ce se completează                                       |
| --------------------- | ------------------------------------------------------- |
| Title                 | `[UNDE APARE] - descriere scurtă`                       |
| Description           | Ce s-a întâmplat, pe larg                               |
| Visual proof          | Captură de ecran sau înregistrare                       |
| Expected result       | Ce ar fi trebuit să se întâmple                         |
| Actual result         | Ce s-a întâmplat greșit                                 |
| Steps to reproduce    | Pașii numerotați care duc la bug                        |
| Environment           | Dispozitiv, sistem de operare, browser                  |
| Console logs          | Erorile din consola browserului, dacă există            |
| Network requests      | Cererile eșuate și codul lor, dacă există               |
| Source URL            | Pagina pe care apare bug-ul                             |
| Severity and priority | Valorile din secțiunea următoare                        |

### Severitate

Severitatea arată cât de grav e efectul bug-ului.

| Severitate | Când se folosește                                         | Exemplu                                      |
| ---------- | --------------------------------------------------------- | -------------------------------------------- |
| Critică    | Aplicația nu poate fi folosită sau datele sunt afectate   | Progresul se pierde, autentificarea nu merge |
| Majoră     | O funcționalitate importantă e greșită                    | Testul trece cu 8/10                         |
| Minoră     | Funcționalitatea merge, dar are un defect mic             | Text tăiat pe telefon, greșeală de scriere   |

### Prioritate

Prioritatea arată cât de repede trebuie rezolvat bug-ul. Termenele sunt o propunere de confirmat cu echipa.

| Prioritate | Termen propus      |
| ---------- | ------------------ |
| P1         | În aceeași zi      |
| P2         | În sprintul curent |
| P3         | Când există timp   |

### Închiderea unui bug

Developerul leagă rezolvarea cu `Closes #nr` în PR. După merge, testerul refolosește pașii din raport și, dacă bug-ul apare din nou, redeschide issue-ul.

## Criterii pentru MVP 1

MVP 1 e gata de prezentare când:

- toate cazurile de test obligatorii au trecut;
- nu există bug-uri critice sau majore deschise;
- banca de întrebări a Nivelului 1 e verificată de tester și aprobată de PO.
