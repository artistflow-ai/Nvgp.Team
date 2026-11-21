# NVGP STUDIO — The Artist District
Cartella `studio/` da copiare nella radice del repo `Nvgp.Team` (GitHub Pages → `/studio/`). Non tocca nessun altro file: il magazine resta intatto.

## 1. Supabase (gratis)
1. Crea un progetto su supabase.com. 2. SQL Editor → incolla `supabase/schema.sql` → Run.
3. Authentication → URL Configuration: Site URL e Redirect = URL pubblico di `/studio/`.
4. Settings → API: copia **Project URL** e chiave **anon** in `js/config.js` (la `service_role` NON va mai nel repo).
5. Registrati dal sito, poi in SQL: `insert into admins values('<tuo user id>');` per abilitare l'area admin.

## 2. Altre integrazioni (tutte in `js/config.js`)
Web3Forms (access key), Tally (ID form), Turnstile (site key; verifica server-side nelle impostazioni Web3Forms), Umami (website id), Spotify (ID playlist).

## 3. Foto
Il design è predisposto per foto in bianco e nero (`img/`). Usa solo foto di cui hai i diritti (tue, o di artisti con consenso).
