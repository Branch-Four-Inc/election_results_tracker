# Election Results Tracker

Static, client-side tool for building election race result data and generating self-contained embed links — no server, build step, or dependencies needed.

## Files

- `index.html` — the main app: enter race/candidate data in a form, see a live preview, import from a previously generated embed link, and export a new embed snippet.
- `race-viewer.html` — lightweight renderer used inside `<iframe>` embeds. Decodes race data from the URL and displays result tables. Not meant to be opened directly.
- `sample-races.csv` — example data set.
- `test-embed.html` — test page with lorem ipsum and a sample embed for checking layout behavior.

No build step, server, or dependencies — everything runs in the browser via vanilla JS.

## Run locally

Open the file directly:

```bash
open index.html
```

Or serve the directory (useful to avoid `file://` quirks):

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## How it works

1. **Import existing data** — paste a previously generated embed link (or just its `data=` value) into the Import box to load races back into the form.
2. **Enter data from scratch** — click "+ Add Race", fill in race names, candidates, vote shares, and % counted.
3. **Preview live** — the right-hand panel updates as you type so you can see exactly how the results will render.
4. **Export an embed link** — copy the generated `<iframe>` snippet from the Embed Link panel and paste it into any page. The race data is base64url-encoded directly into the URL (`race-viewer.html?embed=1&data=<encoded>&max=3`), so the embed is entirely self-contained — no CSV file, hosting, or CORS needed.

Since the data lives entirely in the URL, the embed is frozen at generation time. Re-generate and re-share the snippet after making changes. The panel warns if the URL gets long enough to risk truncation by some servers/proxies (roughly >8 000 characters).
