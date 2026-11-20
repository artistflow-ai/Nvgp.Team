# NVGP.TEAM — progetto completo

## Cosa include
- Magazine responsive nero/fucsia con banner fornito.
- Sezioni news, release, servizi, checkout e contatti.
- Filtri Instagram/TikTok/Spotify.
- Registrazione/accesso con Supabase Auth.
- Area admin per pubblicare news (ruolo admin controllato lato database).
- Scheletro server-side per Stripe Checkout e PayPal Orders/Capture.

## Avvio locale
Apri `index.html` con un server statico locale (ad esempio VS Code Live Server). Il sito grafico funziona senza configurazione; account, articoli dinamici e pagamenti richiedono Supabase.

## Supabase
1. Crea un progetto su https://supabase.com.
2. In SQL Editor esegui `supabase/schema.sql`.
3. In `config.js` inserisci Project URL e anon/public key (mai service_role).
4. Crea un account dal sito.
5. Nel SQL Editor promuovi il tuo utente ad admin:
   `update public.profiles set role='admin' where email='LA_TUA_EMAIL';`
6. Distribuisci le Edge Functions:
   - `create-checkout`
   - `paypal-order`
   - `paypal-capture`
7. Imposta i Secrets delle Functions:
   - `SITE_URL` = URL pubblico del sito
   - `STRIPE_SECRET_KEY` = secret Stripe (solo server)
   - `PAYPAL_CLIENT_ID`
   - `PAYPAL_CLIENT_SECRET`
   - `PAYPAL_BASE_URL` = `https://api-m.sandbox.paypal.com` per test; `https://api-m.paypal.com` per produzione.
8. Abilita e prova i pagamenti in sandbox/test prima di passare in produzione.

## Pubblicazione GitHub Pages
Carica il contenuto di questa cartella nella root del repository GitHub Pages. Mantieni `assets/` e `supabase/`. Configura `config.js` prima di attivare Supabase.

## Sicurezza e note prima di andare live
- Non mettere mai chiavi segrete in `config.js`, HTML o JavaScript client.
- Le Edge Functions devono essere distribuite e testate. Le funzioni qui sono una base d'integrazione: prima della produzione aggiungere verifica webhook Stripe, persistenza ordini, rate limiting, controlli antifrode e gestione degli esiti.
- La funzione PayPal capture deve essere richiamata dopo il redirect e verificare `COMPLETED`; non mostrare conferma ordine prima di tale verifica.
- Aggiornare listino, indirizzo email, handle social, termini, privacy, cookie policy e condizioni di rimborso.
- Le card news iniziali sono esempi grafici. Pubblica solo notizie reali e verificate.
- Le inserzioni Spotify devono rispettare le regole della piattaforma e non promettere stream artificiali o risultati garantiti.

## Prezzi
I prezzi presenti sono quelli della bozza precedente e devono essere confermati prima della vendita.
