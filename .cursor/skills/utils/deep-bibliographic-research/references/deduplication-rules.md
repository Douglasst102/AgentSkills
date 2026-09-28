# Deduplication Rules

Merge records from OpenAlex, Semantic Scholar, arXiv, DBLP, ACL Anthology, and optional Google Scholar into a single work list.

---

## Merge Priority (match keys)

Apply in order; stop at first confident match:

| Priority | Key | Normalization |
|----------|-----|---------------|
| 1 | **DOI** | Lowercase; strip `https://doi.org/` prefix |
| 2 | **arXiv ID** | Pattern `YYYY.NNNNN` from `arxiv.org/abs/` or `ArXiv:` external ID |
| 3 | **OpenAlex ID** | `W` + digits from `https://openalex.org/W...` |
| 4 | **Semantic Scholar ID** | `corpusId` or S2 paper hash |
| 5 | **Title + first author + year** | Fuzzy — see below |

---

## Title Normalization

Before fuzzy match:

1. Lowercase
2. Remove punctuation except alphanumeric spaces
3. Collapse whitespace
4. Strip subtitles after colon (optional, if false negatives occur)
5. Remove leading "the", "a"

**Fuzzy match threshold**: ≥90% token overlap or Levenshtein ratio ≥0.92 on normalized titles **and** same publication year (±1 year if preprint → journal version).

---

## Record Merging

When duplicates are found, **keep one canonical record** using richest-metadata rules:

| Field | Resolution |
|-------|------------|
| `title` | Prefer version with proper capitalization |
| `authors` | Prefer longer author list with full names |
| `abstract` | Prefer longest non-empty abstract |
| `year` | Prefer published year over preprint year |
| `venue` | Prefer journal/conference over "arXiv" |
| `doi` | Union — any valid DOI wins |
| `urls` | Union all unique URLs |
| `cited_by_count` | Take maximum across sources |
| `sources` | Union: `["openalex", "s2", "arxiv"]` |

---

## Version Pairs

Treat as **same work** (merge):

- arXiv preprint + published journal article (same title, authors, ±1 year)
- OpenAlex `W...` versions linked by `ids.doi`

Treat as **different works** (do not merge):

- Same authors, different titles
- Review article vs. primary empirical paper
- Tutorial / survey vs. original method paper (unless user wants only one type)

---

## Screening After Dedup

Report counts at each stage:

```
Raw hits (all sources):     N_raw
After deduplication:        N_unique
After title/abstract screen: N_include + N_maybe + N_exclude
After snowball (new only):  N_snowball_new
Final core papers:          N_core
```

---

## Conflict Resolution

| Conflict | Rule |
|----------|------|
| Different DOIs, similar titles | Keep separate; flag for manual review |
| Same DOI, different titles | Trust DOI resolver (Crossref/OpenAlex) |
| Missing year in one source | Fill from other source |
| Author name variants | Accept if first author surname matches |

---

## Exclusion Tags

When marking `exclude`, use standardized reasons:

- `off_topic`
- `wrong_type` (editorial, thesis, blog)
- `duplicate`
- `out_of_date_range`
- `wrong_language`
- `insufficient_metadata`

Store in screening table for transparency in the report appendix.
