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
