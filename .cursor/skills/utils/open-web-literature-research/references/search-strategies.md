# Search Strategies — Open Web Literature Research

Query patterns for `WebSearch` and follow-up `WebFetch`. Adapt language (EN + user locale) and date filters from the briefing.

---

## Concept Expansion Table

Before searching, build a working table:

| Column | Content |
|--------|---------|
| Main term | User's topic phrase |
| Synonyms | Alternate names, abbreviations |
| People / labs | Key researchers, groups (for `author` style queries) |
| Products / tools | Frameworks, datasets, benchmarks named in the space |
| Industry terms | Marketing or engineering vocabulary (for grey lit) |
| Anti-terms | Words that pollute results (exclude with `-term`) |

**Example** (theory of mind in LLMs):

| Main | Synonyms | People/labs | Tools | Anti-terms |
|------|----------|-------------|-------|------------|
| theory of mind LLM | mentalizing, false belief, ToM benchmark | FAIR, Anthropic, Tomer Ullman | BigToM, Hi-ToM | `-minecraft` `-stock` |

---

## Search Objectives and Query Templates

### A. Landscape / panorama

Goal: map who writes what and main subthemes.

```
"{topic}" blog OR newsletter overview
"{topic}" "state of the field" -scholar -arxiv
site:substack.com "{topic}"
"{topic}" lab blog
```

Rotate: add year filter mentally (prefer results from briefing window).

### B. Controversy / debate

Goal: opposing views, critiques, responses.

```
"{topic}" criticism OR critique OR "open problems"
"{topic}" debate OR controversy
"{topic}" "does not" OR "failed to replicate" blog
```

Read both sides; note tension in report.

### C. Implementation / how-to

Goal: docs, repos, tutorials.

```
"{topic}" documentation OR tutorial
site:github.com "{topic}" README
site:huggingface.co "{topic}"
"{topic}" official docs
```

### D. Grey literature / policy

Goal: reports, white papers (open PDFs).

```
"{topic}" filetype:pdf report
"{topic}" white paper site:.gov OR site:.edu
"{topic}" "technical report" filetype:pdf
```

Verify issuer on fetch — not all PDFs are institutional.

### E. Video / talks

Goal: conference talks, interviews.

```
"{topic}" site:youtube.com lecture OR talk
"{topic}" podcast show notes
"{topic}" keynote slides
```

Capture show-note URLs when available.

### F. Popular science bridge

Goal: accessible framing (tier C orientation).

```
"{topic}" site:aeon.co OR site:quantamagazine.org OR site:nautil.us
"{topic}" long read science
```

---

## Operator Reference

| Operator | Example | Use |
|----------|---------|-----|
| `"phrase"` | `"predictive processing"` | Exact phrase |
| `site:` | `site:psychopy.org` | Restrict domain |
| `-term` | `-reddit -twitter` | Exclude noise (forums/social) |
| `OR` | `blog OR newsletter` | Broaden |
| `filetype:pdf` | `filetype:pdf BIDS` | Grey reports |
| `intitle:` | `intitle:benchmark ToM` | Title relevance |

**Avoid** relying on `scholar`, `arxiv`, `openalex` in queries — if results are mostly academic, refine with `-pdf preprint` only when needed; prefer handoff to academic skill for papers.

---

## Execution Plan (per briefing depth)

### Quick scan (15–25 core sources)

| Round | Focus | Queries (approx.) |
|-------|--------|---------------------|
| 1 | General landscape | 2 |
| 2 | Docs / implementation | 1–2 |
| 3 | One of: video OR grey OR debate | 1–2 |
| 4 | Snowball from top 5 seeds | follow links only |

### Deep map (40–80 sources in appendix; 20–30 core)

| Round | Focus | Queries (approx.) |
|-------|--------|---------------------|
| 1–2 | Landscape + synonyms | 4 |
| 3 | Implementation | 2 |
| 4 | Grey literature | 2 |
| 5 | Video/audio | 2 |
| 6 | Popular science (orientation) | 1 |
| 7–8 | Snowball (2 hops max) | link following |

After each round: dedupe URLs, assign tier, drop content farms.

---

## WebFetch Checklist

When a search result looks promising:

1. Fetch page; confirm topic match (not just keyword spam)
2. Extract: title, author/org, date, canonical URL
3. Note outbound links for snowball queue
4. Assign credibility tier
5. If paywall: record metadata from snippet; offer browser-assisted read only if user opts in

---

## Language Strategy

| Briefing language | Search approach |
|-------------------|-----------------|
| English only | EN queries primary |
| Portuguese (or other) | Run parallel queries in user language + EN for technical topics |
| Mixed | Report in user language; keep original titles in appendix |

Cognitive science and AI discourse is often EN-heavy — always include at least one EN query round unless topic is region-specific.

---

## Snowballing Rules

1. **Hop 1**: From each top-tier A/B source, collect "Further reading", blogrolls, bibliography sections (web links only)
2. **Hop 2**: Repeat for best new A/B finds only
3. **Stop**: No hop 3; diminishing returns and forum drift risk
4. **Do not** snowball into excluded platforms (Reddit, HN, X)

---

## Optional Tooling

If available in the environment (not required):

- `firecrawl-automation` / `tavily-automation` — broader crawl of a known good domain
- `cursor-ide-browser` — paywalled newsletter or interactive doc sites with user present

Default remains `WebSearch` + `WebFetch`.
