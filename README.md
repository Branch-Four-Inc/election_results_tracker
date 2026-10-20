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
2. **Enter data from scratch** — click "+ Add Race", fill in race names, candidates, vote shares, vote counts, and % counted.
3. **Preview & export** — click "Preview & Embed →" to see how the results will render and copy the generated `<iframe>` snippet. The race data is base64url-encoded directly into the URL (`race-viewer.html?embed=1&data=<encoded>&max=3`), so the embed is entirely self-contained — no CSV file, hosting, or CORS needed.

Since the data lives entirely in the URL, the embed is frozen at generation time. Re-generate and re-share the snippet after making changes. The panel warns if the URL gets long enough to risk truncation by some servers/proxies (roughly >8 000 characters).

## Sample embed

Generated from `sample-races.csv` (Toy Story election data):

```html
<iframe src="race-viewer.html?embed=1&data=cmFjZV9uYW1lLGluY3VtYmVudCxwY3RfY291bnRlZCxjYW5kaWRhdGVfMV9uYW1lLGNhbmRpZGF0ZV8xX3ZvdGVfc2hhcmUsY2FuZGlkYXRlXzFfaW5jdW1iZW50LGNhbmRpZGF0ZV8yX25hbWUsY2FuZGlkYXRlXzJfdm90ZV9zaGFyZSxjYW5kaWRhdGVfMl9pbmN1bWJlbnQsY2FuZGlkYXRlXzNfbmFtZSxjYW5kaWRhdGVfM192b3RlX3NoYXJlLGNhbmRpZGF0ZV8zX2luY3VtYmVudCxjYW5kaWRhdGVfNF9uYW1lLGNhbmRpZGF0ZV80X3ZvdGVfc2hhcmUsY2FuZGlkYXRlXzRfaW5jdW1iZW50LGNhbmRpZGF0ZV81X25hbWUsY2FuZGlkYXRlXzVfdm90ZV9zaGFyZSxjYW5kaWRhdGVfNV9pbmN1bWJlbnQKRmF2b3JpdGUgVG95IC0gQW5keSdzIFJvb20sV29vZHksODgsV29vZHksNDIuNyx0cnVlLEJ1enogTGlnaHR5ZWFyLDM5LjUsZmFsc2UsSmVzc2llLDkuOCxmYWxzZSxNci4gUG90YXRvIEhlYWQsNS4xLGZhbHNlLFJleCwyLjksZmFsc2UKRmF2b3JpdGUgVG95IC0gQm9ubmllJ3MgUm9vbSxEb2xseSw2NCxEb2xseSwzNC44LHRydWUsQnV6eiBMaWdodHllYXIsMjguMSxmYWxzZSxKZXNzaWUsMTkuMixmYWxzZSxNci4gUHJpY2tsZXBhbnRzLDEwLjQsZmFsc2UsRm9ya3ksNy41LGZhbHNlClNoZXJpZmYgb2YgdGhlIFRveSBCb3gsV29vZHksMTAwLFdvb2R5LDY3LjMsdHJ1ZSxKZXNzaWUsMzIuNyxmYWxzZSwsLCwsLAo&max=3" width="100%" height="600" style="border:1px solid #d0d5dd;border-radius:8px;" loading="lazy"></iframe>
```

To test it locally, serve the directory and paste the snippet into any HTML page, or open `test-embed.html` which already contains a sample embed.
