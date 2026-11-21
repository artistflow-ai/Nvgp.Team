# NVGP.TEAM — Complete redesign + NVGP STUDIO

This package replaces the current static GitHub Pages front end and adds a separate `/studio/` workspace.

## Included
- `index.html`, `style.css`, `script.js`: responsive NVGP magazine homepage, sections, filters, social links, contact mailto composer, optional Supabase auth and article publishing.
- `studio/index.html`, `studio/studio.css`, `studio/studio.js`: artist dashboard, session setup, audio file selection, optional Supabase sign-in, private uploads and project list.
- `config.js`: public Supabase URL + anon key placeholders only.
- `schema.sql`: profiles, articles, orders, Studio sessions/tracks/outputs, RLS and private storage policies.

## Preserved details
- Existing service names and prices: Instagram Post €35, Story €15, Reel €50, No Cap €80; TikTok Post €10, Video Lyrics €80; Spotify Basic €10/1 week, Medium €25/2 weeks, Premium €40/1 month.
- Official profiles: Instagram @NVGP.TEAM, TikTok @NVGPMTEAM, TikTok News @NVGP.TEAMNEWS.
- Existing image assets are referenced by their current filenames: `nvgp-logo.png`, `nvgp-never-give-up-banner.jpg`, `nvgp-bot.png`. Keep those files in the repository root.

## GitHub Pages deployment
1. Replace the root `index.html`, `style.css`, `script.js`, and `config.js` with the files in this package.
2. Upload the entire `studio/` folder to the repository root.
3. Keep the existing PNG/JPG assets in the repository root.
4. Commit to the branch used by GitHub Pages. No build step is required.
5. The Studio URL will be `https://artistflow-ai.github.io/Nvgp.Team/studio/`.

## Supabase setup
1. Create/use a Supabase project.
2. Run `schema.sql` in SQL Editor.
3. Create a **private** Storage bucket named `studio-audio`.
4. Copy the project URL and anon/public key into `config.js`.
5. Create an account on the website, then promote the admin with the SQL comment at the end of `schema.sql`.
6. Enable email confirmation and configure allowed redirect URLs for your GitHub Pages URL.

## Important integrations not included as fake features
- The contact form opens a prefilled email draft; replace `INSERISCI_EMAIL_CONTATTO` in `script.js` with the official contact email. It does not silently submit to a server.
- The Studio UI can create sessions and upload audio only after Supabase is configured. It does **not** yet process or mix audio.
- Real AI mixing/mastering requires selecting and integrating an audio-processing provider, with API credentials stored only as Supabase Edge Function secrets. Do not put provider secrets in `config.js`.
- Real card payments/subscriptions require server-side Stripe Checkout + webhook Edge Functions and verified product/price IDs. Existing PayPal links are not assumed to be configured by this package.
- Spotify embeds/playlist URLs are intentionally not invented; add verified playlist links when available.

## Notes
This is a static HTML/CSS/JS project compatible with GitHub Pages. The package does not change repository settings or publish itself.
