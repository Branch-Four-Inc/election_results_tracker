/* Shared helpers for index.html (Step 1) and publish.html (Steps 2 & 3). */

let raceIdCounter = 0;

function newCandidate() {
  return { name: "", votes: "", vote_share: "", incumbent: false };
}

function newRace() {
  raceIdCounter += 1;
  return { id: raceIdCounter, race_name: "", pct_counted: "", total_votes: "", candidates: [newCandidate()] };
}

/* ───────────── CSV build/parse ───────────── */

function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function isRaceFilled(r) {
  return r.race_name.trim() !== "" || r.candidates.some(c => c.name.trim() !== "");
}

function racesToCsv(races) {
  const cleanRaces = races.filter(isRaceFilled);
  if (cleanRaces.length === 0) return "";

  let maxCandidates = 0;
  cleanRaces.forEach(r => {
    const validCount = r.candidates.filter(c => c.name && c.name.trim() !== "").length;
    if (validCount > maxCandidates) maxCandidates = validCount;
  });
  if (maxCandidates === 0) maxCandidates = 1;

  const headers = ["race_name", "incumbent", "pct_counted", "total_votes"];
  for (let i = 1; i <= maxCandidates; i++) {
    headers.push(`candidate_${i}_name`, `candidate_${i}_votes`, `candidate_${i}_vote_share`, `candidate_${i}_incumbent`);
  }

  const rows = cleanRaces.map(race => {
    const candidates = race.candidates
      .filter(c => c.name && c.name.trim() !== "")
      .map(c => ({
        name: c.name.trim(),
        votes: c.votes === undefined || c.votes === "" ? null : Number(c.votes),
        vote_share: c.vote_share === "" ? null : Number(c.vote_share),
        incumbent: !!c.incumbent
      }));
    const incumbentCandidate = candidates.find(c => c.incumbent);
    const voteSum = candidates.reduce((t, c) => t + (c.votes || 0), 0);
    const total = Number(race.total_votes) || voteSum;

    const fields = [
      race.race_name.trim(),
      incumbentCandidate ? incumbentCandidate.name : "",
      race.pct_counted === "" ? "" : Number(race.pct_counted),
      total || ""
    ];
    for (let i = 0; i < maxCandidates; i++) {
      if (i < candidates.length) {
        fields.push(candidates[i].name);
        fields.push(candidates[i].votes === null ? "" : candidates[i].votes);
        fields.push(candidates[i].vote_share === null ? "" : candidates[i].vote_share);
        fields.push(candidates[i].incumbent ? "true" : "false");
      } else {
        fields.push("", "", "", "");
      }
    }
    return fields.map(csvEscape).join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}

function parseCsvRow(line) {
  const fields = [];
  let i = 0;
  let field = "";
  let inQuotes = false;
  while (i < line.length) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') { field += '"'; i += 2; }
        else { inQuotes = false; i++; }
      } else { field += ch; i++; }
    } else {
      if (ch === '"') { inQuotes = true; i++; }
      else if (ch === ',') { fields.push(field); field = ""; i++; }
      else { field += ch; i++; }
    }
  }
  fields.push(field);
  return fields;
}

function parseCsv(text) {
  const rows = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') { inQuotes = !inQuotes; current += ch; }
    else if ((ch === '\n' || ch === '\r') && !inQuotes) {
      if (ch === '\r' && i + 1 < text.length && text[i + 1] === '\n') i++;
      if (current.trim().length > 0) rows.push(parseCsvRow(current));
      current = "";
    } else { current += ch; }
  }
  if (current.trim().length > 0) rows.push(parseCsvRow(current));
  return rows;
}

function csvToRaces(text) {
  const rows = parseCsv(text);
  if (rows.length < 2) throw new Error("The data appears empty.");

  const headers = rows[0].map(h => h.trim().toLowerCase());
  const col = (name) => headers.indexOf(name);
  const nums = [];
  headers.forEach(h => { const m = h.match(/^candidate_(\d+)_name$/); if (m) nums.push(parseInt(m[1], 10)); });
  nums.sort((x, y) => x - y);

  const result = [];
  for (let r = 1; r < rows.length; r++) {
    const f = rows[r];
    const get = (i) => (i === -1 ? "" : (f[i] || ""));
    raceIdCounter += 1;

    const incumbent = get(col("incumbent"));
    const pctCounted = get(col("pct_counted"));
    const totalVotes = get(col("total_votes"));

    const candidates = [];
    nums.forEach(n => {
      const candName = get(col(`candidate_${n}_name`)).trim();
      if (candName === "") return;
      const votes = get(col(`candidate_${n}_votes`));
      const share = get(col(`candidate_${n}_vote_share`));
      candidates.push({
        name: candName,
        votes: votes === "" ? "" : Number(votes),
        vote_share: share === "" ? "" : Number(share),
        incumbent: get(col(`candidate_${n}_incumbent`)).toLowerCase() === "true" || (!!incumbent && candName === incumbent)
      });
    });
    if (candidates.length === 0) candidates.push(newCandidate());

    result.push({
      id: raceIdCounter,
      race_name: get(col("race_name")),
      pct_counted: pctCounted === "" ? "" : Number(pctCounted),
      total_votes: totalVotes === "" ? "" : Number(totalVotes),
      candidates
    });
  }
  return result;
}

/* ───────────── Base64url (matches race-viewer.html) ───────────── */

function encodeCsvForUrl(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach(b => { binary += String.fromCharCode(b); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decodeCsvFromUrl(encoded) {
  const b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

/* ───────────── Page-to-page state (URL hash) ───────────── */

// Hash looks like: #data=<base64url csv>&max=3&sort=0
function buildHash(races, maxCandidates, sortByShare) {
  const csv = racesToCsv(races);
  if (!csv) return "";
  const p = new URLSearchParams();
  p.set("data", encodeCsvForUrl(csv));
  p.set("max", String(maxCandidates));
  if (!sortByShare) p.set("sort", "0");
  return "#" + p.toString();
}

function readHash() {
  const p = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const data = p.get("data");
  if (!data) return null;
  return {
    data,
    max: Math.max(1, parseInt(p.get("max"), 10) || 3),
    sort: p.get("sort") !== "0"
  };
}

// Accepts a full embed link, an <iframe> snippet, a query string, or a bare data value.
// Returns { data, max, sort }.
function extractEmbedParams(input) {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const srcMatch = trimmed.match(/src\s*=\s*["']([^"']+)["']/i);
  const candidate = srcMatch ? srcMatch[1].replace(/&amp;/g, "&") : trimmed;

  try {
    const url = new URL(candidate, window.location.href);
    const data = url.searchParams.get("data");
    if (data) {
      return {
        data,
        max: Math.max(1, parseInt(url.searchParams.get("max"), 10) || 3),
        sort: url.searchParams.get("sort") !== "0"
      };
    }
  } catch (e) { /* fall through */ }

  const match = candidate.match(/data=([^&\s"']+)/);
  if (match) return { data: decodeURIComponent(match[1]), max: 3, sort: true };

  if (/^[A-Za-z0-9_-]+$/.test(candidate)) return { data: candidate, max: 3, sort: true };
  return null;
}

async function copyToClipboard(text, btn) {
  const old = btn.textContent;
  try {
    await navigator.clipboard.writeText(text);
    btn.textContent = "Copied!";
  } catch (e) {
    btn.textContent = "Press Ctrl+C to copy";
  }
  setTimeout(() => { btn.textContent = old; }, 1600);
}
