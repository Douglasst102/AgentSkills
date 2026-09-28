# Credibility Rubric — Open Web Literature Research

Three tiers for open-web sources. This is **not** peer review — it ranks usefulness and traceability for an informal landscape report.

---

## Tier Definitions

### Tier A — Primary or highly traceable

Sources where claims can be checked against artifacts or official records.

| Criterion | Examples |
|-----------|----------|
| Official documentation | Versioned API/docs, spec (BIDS, W3C) |
| Reproducible artifact | Public repo with code/data matching the post |
| Primary report | Institutional PDF with methods section |
| First-party announcement | Lab/org post describing their own published result (with link to artifact) |

**Report usage**: Anchor core claims; cite for factual statements about tools, specs, releases.

---

### Tier B — Expert practitioner

Named expert or established group; argument is reasoned and externally grounded.

| Criterion | Examples |
|-----------|----------|
| Identified author | CV, affiliation, prior work visible on web |
| Citations outbound | Links to papers, docs, or data (you need not fetch papers in this skill) |
| Methodological transparency | Limitations acknowledged, not only hype |
| Editorial standards | Reputable newsletter with editor or peer blog network |

**Report usage**: Core narrative and debate mapping; cross-check strong claims with another A or B source.

---

### Tier C — Useful explainer (biased or secondary)

Accessible synthesis or opinion; valuable for orientation, risky as sole evidence.

| Criterion | Examples |
|-----------|----------|
| Popular science article | Aeon, magazine feature |
| Vendor application note | EEG equipment "best practices" |
| Tutorial without sources | Clear pedagogy, weak provenance |
| Advocacy piece | Policy position from think tank |

**Report usage**: Label as orientation or perspective; do not build controversial claims on C alone.

---

## Excluded (do not assign a tier — drop)

- Content farms and AI-generated pages with no human editorial oversight
- Pure marketing landing pages
- Forum/social threads (Reddit, HN, X) — out of scope for this skill
- Sources with no date and no identifiable author when making empirical claims

---

## Scoring Workflow

For each candidate URL, answer:

1. **Who** wrote it? (named person or org)
2. **When**? (prefer ≤ briefing window; flag if undated)
3. **What backs it?** (code, spec, report, outbound citations, nothing)
4. **Why might it be biased?** (employer, product, ideology)

Assign tier:

```
IF official spec / repo matches claims     → A
ELIF named expert + outbound grounding      → B
ELIF educational or journalistic, limited grounding → C
ELSE                                        → exclude
```

---

## Evidence Rules for the Report

| Claim type | Minimum support |
|------------|-----------------|
| Factual (tool X supports Y) | 1× A, or 2× B agreeing |
| Controversial / causal | 2× independent A/B with different authors/orgs |
| Opinion / forecast | Label as opinion; 1× B or C sufficient if attributed |
| "Everyone knows" | Not allowed without A/B citation |

---

## Recency and Relevance (ranking within tier)

When selecting **core sources** (15–25), rank by:

1. **Topical fit** to briefing question (highest weight)
2. **Tier** (A > B > C)
3. **Recency** within user date window
4. **Breadth** — prefer sources that cover distinct subtopics
5. **Engagement metrics** (views, likes) — **lowest weight**; never primary

---

## Reporting Tier in Output

In appendix table, include column `tier` with values `A`, `B`, or `C`.

In prose, optionally tag: *(Tier A — official BIDS spec)* on first mention of critical sources.

For Tier C core entries, add one phrase: *orientation only* or *vendor perspective*.

---

## Common Edge Cases

| Situation | Handling |
|-----------|----------|
| Corporate blog announcing paper | B for narrative; note "peer-reviewed work exists — use `deep-bibliographic-research` for paper" |
| Archived blog (404 elsewhere) | Include if content fetched; note `archived` and use Wayback URL if needed |
| Wikipedia | Never tiered in appendix; discovery only |
| Preprint linked from blog | Blog is B; preprint itself is out of scope unless user switches skills |
| Paywalled newsletter | Metadata + summary from abstract/teaser; tier capped at B unless user provides full text |

---

## Verification Notice

Tiers reflect **traceability on the open web**, not scientific truth. The user must verify claims before manuscripts, grants, or clinical decisions.
