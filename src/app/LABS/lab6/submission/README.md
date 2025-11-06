# Lab 6 — Submission (MVC)

Acest folder conține cele 3 fișiere pentru predare (entitatea: Dashboard):

- `Model.ts` — acces date pe Supabase (CRUD pentru `dashboards`, filtrat pe utilizatorul curent)
- `Controller.ts` — acțiuni care apelează Modelul: list, details, create, edit
- `View.ts` — helperi de prezentare (card/transformări pentru Index/Details)

Note:
- Se reutilizează aceeași abordare MVC ca la Lab 5.
- Pentru rulare efectivă este nevoie de variabilele de mediu Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) și sesiune de utilizator.
- Fișierele sunt orientate pentru predare; UI-ul (pagini Next.js) nu este inclus aici.

Surse relevante în proiect:
- Tipuri: `src/lib/types/database.ts`
- Client Supabase: `src/lib/supabase/server.ts`