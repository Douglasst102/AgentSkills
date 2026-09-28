# Literature Review: {TOPIC_TITLE}

**Date**: {YYYY-MM-DD}  
**Skill**: deep-bibliographic-research v1.0.0  
**Review type**: {exploratory | light systematic}

---

## Executive Summary

{5–10 sentences: what the field looks like, dominant approaches, 2–3 landmark findings, main gaps.}

---

## Research Question

**Primary question**: {user's research question}

### PICOS

| Element | Definition |
|---------|------------|
| **P**opulation | {e.g., adults, LLMs, both} |
| **I**ntervention/Exposure | {construct of interest} |
| **C**omparison | {if applicable} |
| **O**utcome | {measured outcomes} |
| **S**tudy design | {included designs} |

### Inclusion Criteria

- {criterion 1}
- {criterion 2}

### Exclusion Criteria

- {criterion 1}
- {criterion 2}

---

## Search Strategy

### Sources Queried

| Source | Queried | Query / filter | Raw hits |
|--------|---------|----------------|----------|
| OpenAlex | Yes/No | `{query}` | {n} |
| Semantic Scholar | Yes/No | `{query}` | {n} |
| arXiv | Yes/No | `{search_query}` | {n} |
| DBLP | Yes/No | `{query}` | {n} |
| ACL Anthology | Yes/No | `{query}` | {n} |
| Google Scholar | Yes/No | `{query}` | {n} |

### Deduplication Summary

| Stage | Count |
|-------|-------|
| Raw hits (all sources) | {n} |
| Unique after dedup | {n} |
| Included | {n} |
| Maybe | {n} |
| Excluded | {n} |
| Snowball additions (new) | {n} |

### Snowballing

- Seed papers: {n}
- Hops: {1–2}
- Method: OpenAlex / Semantic Scholar citation graph

---

## Thematic Map

### Theme 1: {name}

{2–3 sentences describing this thread.}

**Representative works**:

1. {Author et al., Year} — {one-line contribution}
2. ...

### Theme 2: {name}

{...}

### Theme 3: {name}

{...}

---

## Core Papers

Ranked by relevance, influence, and recency. Target 10–25 entries.

| Rank | Citation | Rationale | Sources |
|------|----------|-----------|---------|
| 1 | {Author (Year). Title. Venue.} | {why core} | openalex, s2 |
| 2 | | | |
| ... | | | |

### Detailed Notes (top 5)

#### 1. {Short title}

- **Contribution**: ...
- **Methods**: ...
- **Limitations**: ...
- **Link**: {DOI or URL}

{Repeat for ranks 2–5.}

---

## Gaps and Future Directions

1. {Gap — what is missing or under-studied}
2. {Gap}
3. {Suggested future work}

---

## Limitations of This Search

- **Coverage**: {which domains/databases may under-represent the topic}
- **Language bias**: {e.g., English-only}
- **Google Scholar**: {if used — reconciliation rate; unverified stubs}
- **API failures**: {any sources that failed}
- **Not a formal systematic review**: Screening was single-pass unless otherwise noted.

---

## Appendix: Full Reference Table

| # | Year | Authors | Title | Venue | DOI/URL | Screen | Sources |
|---|------|---------|-------|-------|---------|--------|---------|
| 1 | | | | | | include | openalex, s2 |
| 2 | | | | | | maybe | arxiv |
| ... | | | | | | | |

---

## Suggested Next Steps

- [ ] Verify DOIs and metadata before citing in a manuscript
- [ ] Extract methods from core papers using `paper-to-skill`
- [ ] Narrow to a formal systematic review if required (PRISMA)
