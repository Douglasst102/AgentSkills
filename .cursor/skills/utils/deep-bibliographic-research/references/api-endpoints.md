# API Endpoints Reference

Free scholarly APIs used by `deep-bibliographic-research`. Prefer `scripts/search_literature.py` for OpenAlex, Semantic Scholar, arXiv, and DBLP; use the sections below for ACL Anthology and manual debugging.

**Polite access**: Set a descriptive `User-Agent` or `mailto=` parameter (OpenAlex) so providers can contact you if needed.

---

## OpenAlex

**Base**: `https://api.openalex.org`

| Operation | Endpoint | Notes |
|-----------|----------|-------|
| Search works | `GET /works?search={query}` | Full-text search |
| Filter works | `GET /works?filter=...` | Combine with `search` |
| Single work | `GET /works/{id}` | ID = DOI URL or `W1234567890` |
| Cited-by | From work object: `cited_by_api_url` | Follow URL for citing papers |

**Common filters** (comma-separate in `filter=`):

- `from_publication_date:2020-01-01`
- `to_publication_date:2026-12-31`
- `type:article` | `type:preprint`
- `concepts.id:C123456789` (concept from search)

**Example**:

```bash
curl -s "https://api.openalex.org/works?search=theory%20of%20mind%20language%20models&filter=from_publication_date:2020-01-01&per_page=25&mailto=research@example.com"
```

**Response fields to extract**: `id`, `doi`, `title`, `publication_year`, `authorships`, `primary_location`, `abstract_inverted_index`, `cited_by_count`, `referenced_works`.

**Rate limit**: ~10 requests/second with `mailto=`; be conservative without it.

---

## Semantic Scholar (Graph API v1)

**Base**: `https://api.semanticscholar.org/graph/v1`

| Operation | Endpoint |
|-----------|----------|
| Paper search | `GET /paper/search?query={q}&limit={n}` |
| Paper details | `GET /paper/{paperId}?fields=...` |
| References | `GET /paper/{paperId}/references` |
| Citations | `GET /paper/{paperId}/citations` |

**Required header**: `User-Agent: YourProject/1.0 (contact@example.com)`

**Search example**:

```bash
curl -s -H "User-Agent: MultSkills/1.0 (research@example.com)" \
  "https://api.semanticscholar.org/graph/v1/paper/search?query=theory+of+mind+LLM&limit=25&fields=title,year,authors,abstract,externalIds,citationCount,url"
```

**Paper ID**: Use `DOI:10.xxxx/...`, `ArXiv:xxxx.xxxxx`, `CorpusId:...`, or S2 hash ID.

**Rate limit**: 1 request/second on public API; add delays between calls in scripts.

---

## arXiv

**Base**: `http://export.arxiv.org/api/query`

| Parameter | Description |
|-----------|-------------|
| `search_query` | arXiv query syntax |
| `start` | Offset (0-based) |
| `max_results` | Max 2000 per request |
| `sortBy` | `relevance`, `lastUpdatedDate`, `submittedDate` |
| `sortOrder` | `descending`, `ascending` |

**Query syntax examples**:

- `all:"theory of mind" AND all:"language model"`
- `cat:cs.CL AND abs:theory+of+mind`
- `ti:"theory of mind"`

**Example**:

```bash
curl -s "http://export.arxiv.org/api/query?search_query=all:%22theory+of+mind%22+AND+all:%22large+language+model%22&start=0&max_results=25&sortBy=relevance"
```

**Response**: Atom XML. Extract `id` (arXiv ID), `title`, `summary`, `published`, `author`, `link[@title="pdf"]`.

**Rate limit**: Max 1 request per 3 seconds; avoid concurrent requests.

---

## DBLP

**Base**: `https://dblp.org/search/publ/api`

| Parameter | Description |
|-----------|-------------|
| `q` | Search query |
| `format` | `json` or `xml` |
| `h` | Max hits (default 30, max ~1000) |

**Example**:

```bash
curl -s "https://dblp.org/search/publ/api?q=theory+of+mind+language+model&format=json&h=25"
```

**Response fields**: `result.hits.hit[].info` — `title`, `authors`, `year`, `venue`, `doi`, `ee` (electronic edition URL).

**Notes**: Best for CS venues; weak on biomedical cogsci. Combine with OpenAlex for coverage.

---

## ACL Anthology (API v2)

**Base**: `https://aclanthology.org/api/v2`

| Operation | Endpoint |
|-----------|----------|
| Search papers | `GET /papers/search?q={query}` |
| Paper by ID | `GET /papers/{anthology_id}` |

**Example**:

```bash
curl -s "https://aclanthology.org/api/v2/papers/search?q=theory+of+mind"
```

**When to use**: NLP, computational linguistics, dialogue, LLM evaluation in ACL venues. Skip if the topic is purely behavioral neuroscience with no CL overlap.

**Response**: JSON with `results` array — extract `title`, `year`, `authors`, `doi`, `url`, `abstract`.

---

## Snowballing via APIs

### OpenAlex — references from a work

```bash
# Get work with referenced_works IDs, then fetch each or use /works?filter=ids.openalex:W1|W2|...
curl -s "https://api.openalex.org/works/W2741809800?mailto=research@example.com"
```

### OpenAlex — cited-by

Use `cited_by_api_url` from the work object directly.

### Semantic Scholar — references / citations

```bash
curl -s -H "User-Agent: MultSkills/1.0" \
  "https://api.semanticscholar.org/graph/v1/paper/DOI:10.18653/v1/2020.acl-main.1/references?fields=title,year,externalIds&limit=50"
```

---

## Error Handling

| HTTP code | Action |
|-----------|--------|
| 429 | Back off 3–10 s; reduce `per_page` |
| 404 | Record not found — try alternate ID (DOI vs title search) |
| 5xx | Retry once after 5 s; skip source if persistent |

Log which sources failed in the report **Limitations** section.
