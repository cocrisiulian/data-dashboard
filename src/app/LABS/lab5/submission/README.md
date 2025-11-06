# Lab 5 — Submission (MVC)

Acest folder conține cele 3 fișiere pentru predare:

- `Model.ts` — acces date pe Supabase (CRUD pentru entitatea `plans`)
- `Controller.ts` — apelează Modelul și expune acțiuni: Index/Details/Create/Edit
- `View.ts` — helperi de prezentare (formatări și proiecții pentru Index/Details)

Surse de inspirație:
- Paginile demo (Next.js): `src/app/LABS/lab5/plans/*`

Notă: logica sursă de adevăr pentru Lab 5 trăiește aici, în folderul `submission` (nu mai există duplicat în `src/lib/lab5`).

Note:
- Pentru rulare efectivă, sunt necesare variabilele de mediu Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
- Fișierele de aici sunt orientate către predare (logica MVC) și pot fi folosite independent de UI.

