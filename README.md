# Karteikasten

Leitner spaced-repetition drills for German irregular verbs and verbs/adjectives
with fixed prepositions. Source material: *Aspekte Neu* appendix
(Unregelmäßige Verben pp. 184–187; Verben, Nomen und Adjektive mit Präpositionen
pp. 188–191).

- 180 irregular verbs, 73 preposition/adjective entries
- 5-box Leitner scheduler; weak cards resurface more often
- Synonyms and antonyms with English glosses for every card
- Progress saved in `localStorage`; export/import JSON to move it between devices
- Installable PWA, works offline

## Files

```
index.html              the whole app (no build step, no dependencies)
manifest.webmanifest    PWA metadata
sw.js                   service worker (offline cache)
icons/                  app icons, incl. maskable for Android
vercel.json             cache headers
```

## Deploy to Vercel

Static site, no build step.

```bash
git init
git add .
git commit -m "Karteikasten"
gh repo create karteikasten --public --source=. --push
```

Then on vercel.com: **Add New → Project → import the repo → Deploy.**
Framework preset: **Other**. Build command: leave empty. Output directory: `./`

Or straight from the CLI:

```bash
npx vercel --prod
```

## After redeploying

Bump `CACHE_VERSION` in `sw.js` (e.g. `karteikasten-v2`) so installed clients
pick up the new build instead of serving the cached old one.

## Local preview

```bash
python3 -m http.server 8000
```

Service workers need `localhost` or HTTPS — opening `index.html` as a `file://`
URL will skip offline support.
