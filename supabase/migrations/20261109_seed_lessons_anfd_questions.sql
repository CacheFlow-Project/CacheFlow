-- 1. EXTINDERE NIVELURI (LEVELS)
INSERT INTO public.levels (id, title, description, position)
VALUES 
  (1, 'Nivelul 1: Bugetare & Administrare', 'Învață cum să îți administrezi veniturile, cheltuielile și regula 50/30/20.', 1),
  (2, 'Nivelul 2: Economisire & Fonduri', 'Construiește un fond de urgență și învață tehnici de economisire inteligentă.', 2),
  (3, 'Nivelul 3: Investiții & Pasive', 'Înțelege inflația, dobânda compusă și noțiunile de bază despre bursă.', 3),
  (4, 'Nivelul 4: Gestionarea Datoriilor', 'Cum să eviți capcanele creditelor și strategiile de achitare rapidă.', 4)
ON CONFLICT (id) DO NOTHING;

SELECT setval('public.levels_id_seq', (SELECT MAX(id) FROM public.levels));


-- 2. EXTINDERE LECȚII (LESSONS)
INSERT INTO public.lessons (id, level_id, title, content, position)
VALUES 
  -- Nivelul 1
  (1, 1, 'Regula 50/30/20', 'Regula 50/30/20 presupune alocarea a 50% din venituri pentru nevoi (chirie, mâncare), 30% pentru dorințe (haine, ieșiri) și 20% pentru economii și investiții.', 1),
  (2, 1, 'Cheltuieli Fixe vs. Variabile', 'Cheltuielile fixe sunt constante în fiecare lună (chirie, abonamente), în timp ce cheltuielile variabile oscilează (mâncare la restaurant, cumpărături impulsive).', 2),
  (3, 1, 'Urmărirea Flow-ului de Bani', 'Notarea fiecărui leu cheltuit oferă vizibilitate completă asupra găurilor din buget și a obiceiurilor de consum.', 3),
  
  -- Nivelul 2
  (4, 2, 'Fondul de Urgență', 'Un fond de urgență acoperă între 3 și 6 luni de cheltuieli de bază și trebuie păstrat într-un cont lichid și sigur.', 1),
  (5, 2, 'Fondul de Siguranță vs. Fondul de Război', 'Fondul de siguranță te protejează de imprevizibil, pe când fondul de oportunitate/război te ajută să aprovești de investiții avantajoase.', 2),
  
  -- Nivelul 3
  (6, 3, 'Efectul Inflației', 'Inflația erodează puterea de cumpărare a banilor păstrați „la saltea”. Dacă inflația e 7%, banii tăi pierd 7% din valoare anual.', 1),
  (7, 3, 'Dobânda Compusă', 'Albert Einstein a numit dobânda compusă a opta minune a lumii. Este randamentul obținut atât la capitalul inițial, cât și la dobânda acumulată.', 2),

  -- Nivelul 4
  (8, 4, 'Datorie Bună vs. Datorie Rea', 'Datoria bună îți bagă bani în buzunar (ex: un credit imobiliar pentru un activ), iar datoria rea îți scoate bani (ex: credit de consum pentru o vacanță).', 1)
ON CONFLICT (id) DO NOTHING;

SELECT setval('public.lessons_id_seq', (SELECT MAX(id) FROM public.lessons));


-- 3. EXTINDERE ÎNTREBĂRI (QUESTIONS)
INSERT INTO public.questions (lesson_id, question_text, options, correct_answer, explanation)
VALUES 
  -- Lecția 1: 50/30/20
  (1, 'Ce procent din venituri ar trebui alocat pentru NEVOI conform regulii 50/30/20?', '["50%", "30%", "20%", "10%"]'::jsonb, '50%', '50% merge pe cheltuieli obligatorii de supraviețuire.'),
  (1, 'În ce categorie intră economiile și rambursarea datoriilor?', '["Nevoi (50%)", "Dorințe (30%)", "Economii (20%)", "Niciuna"]'::jsonb, 'Economii (20%)', 'Cei 20% sunt dedicați viitorului tău financiar.'),

  -- Lecția 2: Fixe vs Variabile
  (2, 'Care dintre următoarele este o cheltuială FIXĂ?', '["Chiria lunară", "Ieșirea la restaurant", "Cumpărarea de haine noi", "Bilete la cinema"]'::jsonb, 'Chiria lunară', 'Cheltuielile fixe au aceeași valoare stabilită prin contract.'),
  (2, 'Abonamentul lunar la un serviciu de streaming este de regulă:', '["O cheltuială fixă de tip dorință", "O cheltuială variabilă de urgență", "O investiție", "Un activ"]'::jsonb, 'O cheltuială fixă de tip dorință', 'Este fixă (recurentă), dar face parte din categoria dorințelor (30%).'),

  -- Lecția 4: Fond de Urgență
  (4, 'Câte luni de cheltuieli ar trebui să acopere un fond de urgență complet?', '["1 lună", "3-6 luni", "12-24 luni", "1 saptămână"]'::jsonb, '3-6 luni', 'Standardul financiar recomandă minim 3-6 luni de cheltuieli de bază.'),
  (4, 'Unde este cel mai bine să păstrezi fondul de urgență?', '["Într-un cont de economii lichid", "În acțiuni la bursă", "În criptomonede", "Într-un depozit blocat pe 5 ani"]'::jsonb, 'Într-un cont de economii lichid', 'Fondul de urgență trebuie să fie accesibil rapid și fără risc de pierdere.'),

  -- Lecția 6: Inflație
  (6, 'Ce se întâmplă cu banii ținuți „la saltea” în timp de inflație?', '["Le crește puterea de cumpărare", "Le scade puterea de cumpărare", "Rămân exact la fel", "Se dublează"]'::jsonb, 'Le scade puterea de cumpărare', 'Prețurile cresc, deci cu aceeași sumă poți cumpăra mai puține lucruri.'),

  -- Lecția 7: Dobânda Compusă
  (7, 'Ce reprezintă dobânda compusă?', '["Dobândă aplicată doar pe suma inițială", "Dobândă la dobândă", "O taxă bancară", "O penalizare de întârziere"]'::jsonb, 'Dobândă la dobândă', 'Calculul randamentului se face la întreaga sumă acumulată anterior.'),

  -- Lecția 8: Datorii
  (8, 'Care este un exemplu de „datorie rea”?', '["Un credit de consum pentru o vacanță", "Un credit ipotecar pentru un spațiu închiriat", "Un împrumut pentru extinderea afacerii", "Niciunul"]'::jsonb, 'Un credit de consum pentru o vacanță', 'Vacanța nu produce venituri viitoare și își pierde valoarea instant.');
