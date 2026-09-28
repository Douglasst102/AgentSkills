# Google Scholar — Assisted Browser Workflow

Google Scholar has **no free official API**. This skill uses **assisted browser search** only — never automated scraping.

---

## Prerequisites

- **cursor-ide-browser** MCP available
- User has **opted in** to Scholar supplementation
- Briefing confirmed (topic, date range, inclusion criteria)

---

## Workflow

### 1. Lock browser and navigate

```
browser_navigate → https://scholar.google.com
browser_lock (after tab exists)
```

If CAPTCHA or login wall appears: **stop** and ask the user to complete it manually, then resume.

### 2. Enter search query

Use Boolean query from `query-templates.md` (Scholar section).

Apply UI filters when possible:

- **Since year**: match briefing `from_year`
- **Sort**: Relevance first; switch to date for recency check on final pass

### 3. Collect candidates (first 2 pages)

For each relevant result (target 15–30 candidates before reconciliation):

| Field | How to capture |
|-------|----------------|
| Title | From snapshot |
| Authors | From snapshot |
| Year | From snippet |
| Venue | From snippet |
| Cited by count | From snippet (approximate) |
| Link | PDF or publisher link |

Use `browser_snapshot` after each page navigation. Do **not** click through paywalled PDFs unless user requests.

### 4. Pagination

- Click "Next" or increase results per page if available
- Stop after 2 pages unless coverage is insufficient
- Record `Scholar pages searched: N`

### 5. Reconcile each candidate in APIs

For **every** Scholar candidate, before adding to the merged corpus:

1. **DOI search** (if visible): OpenAlex `https://api.openalex.org/works/https://doi.org/{doi}`
2. **Title search**: Semantic Scholar `/paper/search?query={title}`
3. **Title search**: OpenAlex `/works?search={title}`

| Reconciliation outcome | Action |
|------------------------|--------|
| API match found | Use API record as canonical; tag `sources` with `google_scholar` |
| No API match | Keep Scholar-only stub; mark `metadata: unverified` in screening table |
| Multiple API matches | Disambiguate by year and first author |

### 6. Unlock browser

```
browser_unlock
```

When all browser operations are complete.

---

## Reconciliation Checklist

- [ ] Every Scholar hit has an API lookup attempted
- [ ] DOIs validated against OpenAlex or Crossref
- [ ] Duplicates against API corpus removed
- [ ] Unverified stubs listed separately in report (not in core papers unless user approves)
- [ ] Scholar limitations noted in report

---

## Anti-Patterns

| Do not | Reason |
|--------|--------|
| Run headless scrapers or Scholar API wrappers | Violates ToS; unreliable |
| Include Scholar-only papers in "core" without flag | Unverified metadata |
| Use "Cited by" as only snowball method | Use OpenAlex/S2 citation graph instead |
| Export bulk BibTeX from Scholar buttons without review | Often malformed |

---

## Reporting Scholar Usage

In the final report **Search Strategy** section, document:

```markdown
### Google Scholar (optional)
- Query: "..."
- Filters: since 2020
- Pages reviewed: 2
- Candidates collected: 24
- Reconciled via API: 19
- Unverified stubs: 5
```

In **Limitations**:

> Google Scholar results were collected via assisted manual search. Metadata for N works could not be verified in OpenAlex or Semantic Scholar.
