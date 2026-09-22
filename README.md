# Election Results Tracker

Static, client-side tools for building and viewing election race result data as CSV.

- `race-editor.html` — build races/candidates in a form UI and export/import a CSV file.
- `race-viewer.html` — load a CSV file and render per-race result tables.
- `sample-races.csv` — example data set.
- `index.html` — landing page linking to the editor and viewer.

No build step, server, or dependencies — everything runs in the browser via vanilla JS.

## Run locally

Open the files directly:

```bash
open index.html
```

Or serve them (useful to avoid any `file://` quirks):

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Embedding the viewer

`race-viewer.html` can run inside an `<iframe>` on another page. Click **Embed...** and choose one of two modes:

**Link to hosted CSV** — enter a publicly reachable CSV URL (e.g. a GitHub raw URL). The embed fetches the CSV at load time via `fetch`, so results stay live as the source file changes. The CSV host must allow cross-origin requests (CORS); same-origin hosting works without extra config. The embed URL looks like `race-viewer.html?embed=1&src=<csv-url>&max=3`.

**Embed CSV data directly** — no hosting or CORS needed. The CSV content is base64url-encoded directly into the embed URL (`race-viewer.html?embed=1&data=<encoded-csv>&max=3`), so the iframe never makes a network request for the data. Use "Use currently loaded data" to pull in whatever CSV is currently open in the editor/viewer, or paste CSV directly. Tradeoff: the embed is frozen at generation time (re-generate the snippet to update it), and the URL grows with the dataset size — the dialog warns if the resulting URL gets long enough to cause issues in some servers/proxies (roughly >8000 characters).

In embed mode the toolbar/header are hidden either way.
