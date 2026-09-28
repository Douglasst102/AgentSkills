---
name: deep-bibliographic-research
description: Guides deep bibliographic research on a user-specified topic across free scholarly indexes (OpenAlex, Semantic Scholar, arXiv, DBLP, ACL Anthology) with optional Google Scholar discovery via assisted browser search, deduplication, citation snowballing, and a structured Markdown synthesis report.
domain: meta-skill
version: "1.0.0"
review_status: ai-generated
dependencies:
  recommended:
    - research-literacy
  optional:
    - paper-to-skill
    - semanticscholar-automation
---

# Deep Bibliographic Research

A meta-skill for conducting **deep bibliographic research** on a user-specified topic. It searches free scholarly indexes in parallel, optionally supplements discovery with assisted Google Scholar browsing, deduplicates records, performs light citation snowballing, and delivers a **structured Markdown report** mapping the literature landscape.

**Complements** `research-literacy` (study planning), `open-web-literature-research` (informal web landscape — blogs, docs, grey literature), and chains naturally into `paper-to-skill` (method extraction from key papers).

---

## Trigger Conditions

Activate this skill when the user:

- Requests a **literature review**, **bibliographic search**, or **state-of-the-art mapping**
- Asks to find papers on a topic across **Scholar, arXiv, OpenAlex, Semantic Scholar, DBLP, or ACL Anthology**
- Uses phrases like "deep literature search", "map the field", "core papers on X", "pesquisa bibliográfica"

---

## Research Planning Protocol

Before executing any search, you MUST:

1. **Clarify the research question** — Topic, PICOS elements (adapted from `research-literacy`), and scope boundaries.
2. **Define search parameters** — Date range, publication types, languages, target domains (cogsci, neuroscience, NLP, CS).
3. **Declare depth** — Exploratory mapping vs. light systematic review.
4. **Set exclusion criteria** — Editorials, commentaries, duplicates, off-topic venues.
5. **Present the search plan to the user and WAIT for confirmation** before querying databases.

For methodological grounding, see `../research-literacy/SKILL.md`.

---

## Verification Notice

Bibliographic metadata from APIs and browsers may be incomplete, outdated, or mismatched. **The user MUST independently verify all citations, DOIs, and claims before use in manuscripts or grants.** This skill does not replace expert consultation or formal systematic review protocols (e.g., PRISMA).

---

## Source Strategy

| Source | Role | Access method |
|--------|------|---------------|
| **OpenAlex** | Primary broad index; citations, concepts, filters | REST API — see `references/api-endpoints.md` |
| **Semantic Scholar** | Abstracts, influence metrics, citation graph | Graph API v1 — see `references/api-endpoints.md` |
| **arXiv** | Recent preprints (CS, ML, neuro, physics) | Atom export API |
| **DBLP** | CS venues, proceedings, author disambiguation | DBLP search API |
| **ACL Anthology** | NLP / computational linguistics | ACL Anthology API v2 |
| **Google Scholar** | Optional discovery supplement | **Assisted browser only** — see `references/scholar-browser-workflow.md` |

### Google Scholar — Critical Rules

- There is **no free official API**. Never automate scraping or bulk extraction.
- Use **cursor-ide-browser** MCP for assisted manual search when the user opts in.
- Extract titles, authors, years, and DOIs from snapshots; **reconcile every Scholar hit** in OpenAlex or Semantic Scholar before including it in the core list.
- Treat Scholar as a **discovery layer**, not the canonical metadata source.

---

## Six-Phase Workflow

### Phase 1 — Planning

1. Complete the briefing (see Research Planning Protocol).
2. Build a **concept table**: main terms, synonyms, abbreviations, related constructs.
3. Draft Boolean-style query strings per source using `references/query-templates.md`.
4. Confirm the plan with the user.

### Phase 2 — Parallel Search

Run searches across all applicable API sources with the adapted queries.

**Preferred execution order:**

1. Run `scripts/search_literature.py` for a consolidated JSON seed (OpenAlex, Semantic Scholar, arXiv, DBLP).
2. Query **ACL Anthology** separately when the topic is NLP/CL-related (`references/api-endpoints.md`).
3. If the user requests Scholar: follow `references/scholar-browser-workflow.md`.

Set `per_page` / `limit` conservatively (20–50 per source on first pass). Increase only if coverage is thin.

### Phase 3 — Deduplication

Merge results using `references/deduplication-rules.md`:

1. Match on **DOI** (normalized, lowercase).
2. Else match on **arXiv ID**.
3. Else match on **OpenAlex work ID** or **Semantic Scholar paper ID**.
4. Else fuzzy-match on **normalized title** + first author surname + year.

Keep the richest metadata record when merging. Tag each work with `sources: [...]`.

### Phase 4 — Screening

For each unique work, assign a screening status from title and abstract:

| Status | Criterion |
|--------|-----------|
| **include** | Clearly addresses the research question |
| **maybe** | Tangentially relevant or insufficient abstract |
| **exclude** | Off-topic, wrong type, or duplicate — record reason |

Aim to screen at least **3× the target core-paper count** before snowballing.

### Phase 5 — Snowballing

On the top **include** and **maybe** papers (max 15 seeds):

1. Fetch referenced works and citing works via **OpenAlex** (`referenced_works`, `cited_by_api_url`) or **Semantic Scholar** (`references`, `citations`).
2. Perform **1–2 hops** maximum unless the user requests deeper chaining.
3. Re-run deduplication and screening on snowball candidates.
4. Do not rely on Google Scholar "Cited by" as the sole snowball source.

### Phase 6 — Synthesis

Produce the final report using `assets/report-template.md`. Save as a Markdown file in the user's workspace (e.g., `literature-review-<topic-slug>.md`) unless they specify another path.

**Ranking criteria for core papers** (combine, do not use citations alone):

- Topical relevance to the research question
- Citation count (field-normalized when possible via OpenAlex `cited_by_count`)
- Recency within the user-defined window
- Venue quality / review status (journal vs. preprint)
- Appears across multiple sources or snowball paths

Target **10–25 core papers** unless the user specifies otherwise.

---

## Output Format

Deliver a **structured Markdown report** with:

- Executive summary (5–10 lines)
- Research question and inclusion/exclusion criteria
- Search strategy (queries per source, date filters)
- Thematic map (subtopics + representative papers)
- Core papers (ranked, with 1–2 sentence rationale each)
- Gaps and future directions
- Search limitations (coverage, language bias, Scholar partiality)
- Appendix: reference table (title, year, venue, DOI/URL)

BibTeX export is **out of scope** for v1.0; offer it only if the user explicitly requests a follow-up.

---

## Optional Integrations

- **Composio / Rube**: For heavy Semantic Scholar workloads, delegate to `semanticscholar-automation` when available.
- **paper-to-skill**: After the report, offer to extract methods from 1–3 core papers.
- **WebFetch / curl**: Use when the script is unavailable; follow `references/api-endpoints.md`.

---

## Anti-Patterns

| Anti-pattern | Why it fails | Do instead |
|--------------|--------------|------------|
| Single-source search | Misses field-specific corpora | Query ≥3 APIs + ACL if NLP |
| Scholar scraping | ToS violation, brittle, incomplete metadata | Assisted browser + API reconciliation |
| Citation-only ranking | Rewards old generic reviews | Balance relevance, recency, and citations |
| Skipping briefing | Off-topic results, wasted API calls | Confirm PICOS and date range first |
| No deduplication | Inflated paper counts | Always merge by DOI → ID → title |

---

## Resources

| Path | Purpose |
|------|---------|
| `references/api-endpoints.md` | Endpoints, parameters, rate limits, curl examples |
| `references/query-templates.md` | Query translation per database |
| `references/deduplication-rules.md` | Merge keys and conflict resolution |
| `references/scholar-browser-workflow.md` | Assisted Google Scholar + reconciliation |
| `assets/report-template.md` | Final report structure |
| `scripts/search_literature.py` | Consolidated API search (stdlib Python) |

---

## Quick Example

**User**: "Faça uma pesquisa bibliográfica profunda sobre theory of mind em large language models, 2020–2026."

**Agent**:

1. Briefing → confirm PICOS, English-only, include preprints + peer-reviewed.
2. Run `search_literature.py --query "theory of mind large language models" --from-year 2020 --limit 30`.
3. Query ACL Anthology if NLP-focused papers are underrepresented.
4. Deduplicate, screen, snowball top 10 seeds.
5. Write `literature-review-theory-of-mind-llm.md` from the report template.
