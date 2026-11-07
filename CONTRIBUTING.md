# CacheFlow
# CacheFlow

# 🚀 Ghidul Echipei & Regulile de Lucru (Working Agreements)

Acest document conține convențiile și regulile stabilite pentru ca echipa noastră să lucreze eficient, transparent și fără conflicte pe parcursul sprinturilor.

---

## 1. Regulile Board-ului (GitHub Projects)

> **De ce?**  
> Board-ul arată starea reală a proiectului doar dacă toată lumea îl folosește la fel și în mod regulat.

### Pași & Criterii:
* **Coloane standard:** `To do` | `In progress` | `Review` | `Done`
* **Responsabilitate individuală:** Fiecare membru își mută singur cardul când începe lucrul și când îl termină.
* **Limită de WIP (Work in Progress):** Maxim **2 carduri** în starea `In progress` per persoană.
* **Validare:** Un card ajunge în starea `Done` **doar** după testarea și aprobarea făcută de **QA (Quality Assurance)**.

---

## 2. Definition of Done (DoD)

> **De ce?**  
> Toată lumea trebuie să aibă aceeași definiție și aceleași așteptări pentru termenul „terminat”.

### Pași & Criterii:
* Codul este integrat în branch-ul `main` prin Pull Request (PR).
* PR-ul are cel puțin **un review aprobat**.
* Toate **criteriile de acceptare** stabilite inițial pe issue sunt îndeplinite.
* Funcționalitatea este **testată de Brigitte** și este confirmată că funcționează corect pe mediul web.

---

## 3. Workflow de Git & GitHub

> **De ce?**  
> Evităm conflictele de cod (merge conflicts) și codul stricat pe branch-ul principal `main`.

### Pași & Criterii:
* **Branch-uri dedicate:** Se creează câte un branch separat pentru fiecare issue (ex: `9-chestionar-exersare`).
* **Protecție:** **Nimeni nu face push direct în branch-ul `main`!**
* **Pull Request (PR):**
  * Fiecare PR trebuie să includă în descriere textul `Closes #nr_issue` (pentru a închide automat issue-ul la merge).
  * PR-ul necesită cel puțin **un review** de la un coleg înainte de merge.
* Toate regulile de branching și commit sunt documentate în acest `README.md`.

---

## 4. Comunicare & Daily Stand-up

> **De ce?**  
> Blocajele trebuie identificate și rezolvate cât mai repede.

### Pași & Criterii:
* **Canal stabilit:** Comunicarea zilnică are loc pe **WhatsApp**.
* **Format Daily (scurt & la obiect):**
  1. Ce am făcut ieri/recomandat?
  2. Ce fac astăzi?
  3. Ce blocaje am?
* **Coordonare:** SM (Scrum Master) urmărește discuțiile zilnice și ajută la deblocarea problemelor apărute.

---

## 5. Retrospectiva de Sprint

> **De ce?**  
> Echipa învață constant și își îmbunătățește procesul de la un sprint la altul.

### Pași & Criterii:
* La final de sprint analizăm:
  * Ce a mers bine?
  * Ce nu a mers bine?
  * Ce schimbăm pe viitor?
* Stabilirea a **1–2 acțiuni concrete** de îmbunătățire pentru sprintul următor (acestea se notează și se urmăresc).

---

## 6. Ritmul Sprintului & Calendar

> **De ce?**  
> Echipa trebuie să știe clar când se planifică, când se prezintă rezultatele și când se analizează procesul.

### Pași & Criterii:
* **Durata sprintului:** Stabilită la **1 sau 2 săptămâni** (conform deciziei echipei).
* **Zile fixe:** Sunt stabilite zile și ore fixe pentru:
  * **Planning** (Planificarea Sprintului)
  * **Review / Demo** (Prezentarea rezultatelor)
  * **Retrospectivă** (Analiza procesului)
* **Calendar:** Toate evenimentele sunt comunicate și vizibile întregii echipe.