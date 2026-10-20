# Election Results Tracker

Static, client-side tool for building election race result data and generating self-contained embed links — no server, build step, or dependencies needed.

## Files

- `index.html` — **Step 1**: enter race/candidate data in a form (or load an existing widget from a previously generated embed code via the side panel).
- `publish.html` — **Steps 2 & 3**: preview the real widget, then copy the `<iframe>` embed code.
- `shared.js` — CSV build/parse, URL encoding, and import helpers shared by both pages.
- `race-viewer.html` — lightweight renderer used inside `<iframe>` embeds. Decodes race data from the URL and displays result tables. Not meant to be opened directly.
- `sample-races.csv` — example data set.

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

1. **Enter results** (`index.html`) — fill in race names, candidates, vote shares, and % counted. To edit an earlier widget, open "Already made a widget? Edit it" in the side panel and paste its embed code or link.
2. **Preview** (`publish.html`) — the real embed is shown in an `<iframe>`, with Desktop/Tablet/Phone widths and an adjustable height. "Back to edit" returns to Step 1 with your data intact (state travels in the URL hash).
3. **Get embed code** — copy the generated `<iframe>` snippet and paste it into a Custom HTML block (WordPress, Ghost, etc.). The race data is base64url-encoded directly into the URL (`race-viewer.html?embed=1&data=<encoded>&max=3`), so the embed is entirely self-contained — no CSV file, hosting, or CORS needed.

Since the data lives entirely in the URL, the embed is frozen at generation time. Re-generate and re-share the snippet after making changes. The panel warns if the URL gets long enough to risk truncation by some servers/proxies (roughly >8 000 characters).
