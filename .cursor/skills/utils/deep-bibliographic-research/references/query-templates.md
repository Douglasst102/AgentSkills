# Query Templates

Translate a natural-language research question into source-specific query strings. Start from a **concept table**, then build queries per database.

---

## Step 1 — Concept Table

| Concept | Preferred term | Synonyms | Abbreviations |
|---------|----------------|----------|---------------|
| (main) | | | |
| (related) | | | |

**Example** (theory of mind + LLMs):

| Concept | Preferred | Synonyms |
|---------|-----------|----------|
| ToM | theory of mind | mentalizing, mindreading, false belief |
| LLM | large language model | foundation model, GPT, chatbot |

---

## Step 2 — Core Query String

Build a **base query** in plain language, then adapt:

```
(theory of mind OR mentalizing OR "false belief") AND ("large language model" OR LLM OR chatbot)
```

---

## OpenAlex

**Search parameter**: URL-encode the base query for `search=`.

**With date filter**:

```
/works?search={encoded_query}&filter=from_publication_date:2020-01-01,to_publication_date:2026-12-31&per_page=25&mailto={email}
```

**Type filter** (optional):

- Articles only: `filter=type:article`
- Include preprints: `filter=type:article|type:preprint`

**Concept filter** (when topic maps to OpenAlex concept):

1. Search concepts: `/concepts?search=cognitive+psychology`
2. Add `filter=concepts.id:C41008148`

---

## Semantic Scholar

Plain query string (S2 handles synonyms less explicitly — include synonyms in query):

```
theory of mind mentalizing large language model LLM
```

**Fields to request**:

```
fields=title,year,authors,abstract,externalIds,citationCount,url,publicationVenue
```

---

## arXiv

Use `search_query` with field prefixes:

| Prefix | Field |
|--------|-------|
| `ti:` | Title |
| `abs:` | Abstract |
| `all:` | All fields |
| `cat:` | Category |

**Template**:

```
all:"theory of mind" AND all:"language model"
```

**Category restrictions** (optional):

```
(cat:cs.CL OR cat:cs.AI OR cat:q-bio.NC) AND abs:theory+of+mind
```

**Recent work bias**: `sortBy=submittedDate&sortOrder=descending`

---

## DBLP

Simple keyword query (no Boolean operators in basic API):

```
theory of mind language model
```

For author-focused search use `/search/author/api` instead.

---

## ACL Anthology

Natural-language `q` parameter:

```
theory of mind language model
```

Add venue/year filters manually during screening (API v2 search returns mixed years).

---

## Google Scholar (browser)

Scholar supports Boolean in the search box:

```
"theory of mind" ("large language model" OR LLM)
```

**Filters to apply in UI** (assisted browser):

- Since year: {from_year}
- Sort by relevance, then review "Cited by" for landmark papers

Always reconcile hits via OpenAlex/S2 — see `scholar-browser-workflow.md`.

---

## Query Iteration Log

Record each iteration in the final report:

| Round | Source | Query | Hits (raw) | Notes |
|-------|--------|-------|------------|-------|
| 1 | OpenAlex | ... | 142 | Too broad |
| 2 | OpenAlex | ... + filter type | 38 | Used for screening |

Stop iterating when additional queries yield mostly duplicates of already-screened works.
