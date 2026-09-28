---
name: open-web-literature-research
description: Guides deep informal literature mapping on the open web (blogs, newsletters, videos, docs, grey reports) for a user-specified topic, excluding academic indexes, with credibility screening and a structured landscape report.
domain: meta-skill
version: "1.0.0"
review_status: ai-generated
dependencies:
  recommended:
    - research-literacy
  optional:
    - deep-bibliographic-research
    - paper-to-skill
---

# Open Web Literature Research

A meta-skill for **deep bibliographic-style research on the open web** — less formal than systematic reviews, focused on how a topic appears in blogs, newsletters, videos, documentation, and grey literature. It delivers a **structured landscape report** with credibility tiers and thematic mapping.

**Complements** `deep-bibliographic-research` (peer-reviewed indexes) and `research-literacy` (exploratory vs. confirmatory framing). Use this skill for practitioner discourse; use the academic skill when citations or papers are required.

---

## Trigger Conditions

Activate this skill when the user:

- Requests an **informal literature map**, **grey literature scan**, or **open-web landscape** on a topic
- Asks what **blogs, newsletters, labs, or docs** say about a subject
- Uses phrases such as:
  - EN: "map the debate on the web", "informal literature review", "what are people writing about X", "practitioner sources"
  - PT: "pesquisa bibliográfica na web", "mapear o debate", "literatura cinzenta", "blogs e newsletters sobre X", "panorama informal", "o que a comunidade diz sobre X"

**Do not activate** when the user wants Scholar, arXiv, OpenAlex, Semantic Scholar, DBLP, or ACL Anthology — use `deep-bibliographic-research` instead.

---

## Out of Scope (Hard Boundary)

| Excluded | Redirect to |
|----------|-------------|
| Google Scholar, DBLP, arXiv, Semantic Scholar, OpenAlex, ACL Anthology | `deep-bibliographic-research` |
| Systematic review / PRISMA / meta-analysis | `deep-bibliographic-research` + `research-literacy` |
| Reddit, Hacker News, X/Twitter, forum threads as discovery channels | Blogs, docs, institutional sources in this skill |
| Treating Wikipedia as a citable core source | Discovery only — see `references/source-taxonomy.md` |

Never query academic APIs "just to fill gaps" while running this skill. Hand off instead — see `references/handoff-to-academic.md`.

---

## Briefing Protocol

Before searching, you MUST:

1. **Focal question** — What should be understood? (debate, practice, history, tooling, controversy)
2. **Audience and use** — Personal exploration, teaching, blog, research project scoping
3. **Time window and languages** — e.g., 2020–2026; EN + PT-BR
4. **Depth** — Quick scan (15–25 core sources) vs. deep map (20–30 core, larger appendix)
5. **Exclusions** — Marketing, content farms, duplicates, off-topic venues

Present the plan to the user and **WAIT for confirmation** before executing searches.

For exploratory vs. confirmatory framing, see `../research-literacy/SKILL.md` — do not impose full PICOS here.

---

## Verification Notice

Open-web content may be outdated, biased, or wrong. Tiers (A/B/C) measure **traceability on the web**, not scientific validity. **The user MUST verify URLs, claims, and dates** before manuscripts, grants, or clinical use. This skill does not replace expert judgment or formal systematic review.

---

## Source Strategy (Summary)

| Channel | Role |
|---------|------|
| Blogs / newsletters | Narrative, positions, practitioner synthesis |
| Video / audio | Talks, interviews, tutorials (use show notes) |
| Documentation / code | Implementable state of the art |
| Institutional grey literature | Reports, white papers (open PDFs) |
| Popular science | Accessible orientation (usually tier C) |
| Wikipedia | **Discovery only** — never a core source |

Full taxonomy: `references/source-taxonomy.md`.

---

## Six-Phase Workflow

### Phase 1 — Briefing

Complete the briefing protocol and confirm with the user.

### Phase 2 — Concept Expansion

Build a concept table (main terms, synonyms, labs/people, tools, anti-terms). Templates: `references/search-strategies.md`.

### Phase 3 — Parallel Channel Search

Run **3–6+** `WebSearch` rounds by channel (landscape, implementation, grey lit, video, etc.). Use `WebFetch` on promising hits.

**Preferred tools**: `WebSearch`, `WebFetch`  
**Browser MCP**: Only for paywalls or interaction, with user present — no bulk scraping  
**Optional**: `firecrawl-automation`, `tavily-automation` if enabled — not required

Follow query templates and depth tables in `references/search-strategies.md`. Exclude forum/social platforms in queries (`-reddit -twitter`).

### Phase 4 — Screening and Tiering

For each unique URL:

1. Assign **tier A, B, or C** using `references/credibility-rubric.md`
2. Label **include** / **maybe** / **exclude** with reason
3. Deduplicate mirrors (prefer canonical URL)

Strong factual claims in the report need ≥2 independent A/B sources.

### Phase 5 — Snowballing

From top **include** sources (tier A/B, max 15 seeds):

1. Follow "Further reading", blogrolls, and web bibliographies in posts
2. **Maximum 2 hops** — no third hop
3. Do not snowball into excluded platforms

### Phase 6 — Synthesis

Fill `assets/report-template.md` and save as `web-literature-landscape-<topic-slug>.md` in the user's workspace unless another path is specified.

**Core source ranking** (weight in order):

1. Topical relevance
2. Credibility tier (A > B > C)
3. Recency within the briefing window
4. Coverage of distinct subtopics
5. Popularity metrics — **lowest weight**

If peer-reviewed literature is needed, add a **Handoff** section per `references/handoff-to-academic.md`.

---

## Output Format

Deliver a Markdown report containing:

- Executive summary (accessible tone)
- Focal question and scope
- Search strategy (channels, queries, screening counts)
- Thematic map with representative sources
- Ranked core sources with tier and rationale
- Debates and tensions on the web
- Gaps (what the open web does not cover)
- Handoff recommendation to `deep-bibliographic-research` when appropriate
- Appendix: full source table (URL, title, author/org, date, tier, utility)

BibTeX export is **out of scope** for v1.0.

---

## Anti-Patterns

| Anti-pattern | Why it fails | Do instead |
|--------------|--------------|------------|
| Querying Scholar/OpenAlex "lightly" | Blurs skill boundary | Hand off to academic skill |
| Reddit/HN/X as main discovery | Excluded; uneven quality | Blogs, docs, official channels |
| Wikipedia in core list | Not a primary source | Discovery + outbound links only |
| Marketing blogs as tier A | Misleading evidence | Tier C or exclude |
| Hundreds of untriaged links | Noise | 15–25 core + structured appendix |
| Citation count on the web | SEO and hype bias | Tier + relevance first |

---

## Optional Integrations

- **deep-bibliographic-research**: After this report when papers or systematic coverage are needed
- **paper-to-skill**: After academic skill identifies methods papers
- **research-literacy**: When user must separate exploration from confirmatory claims

---

## Resources

| Path | Purpose |
|------|---------|
| `references/source-taxonomy.md` | Source types, quality signals, exclusions |
| `references/search-strategies.md` | Query templates, rounds, operators |
| `references/credibility-rubric.md` | Tiers A/B/C and evidence rules |
| `references/handoff-to-academic.md` | When and how to switch skills |
| `assets/report-template.md` | Final report structure |

---

## Quick Example

**User**: "Faça um panorama informal na web sobre theory of mind em large language models, 2020–2026."

**Agent**:

1. Briefing → confirm focal question, EN+PT queries, quick scan (20 core sources), exclude forums.
2. Build concept table (ToM, mentalizing, BigToM, false belief, etc.).
3. Run parallel WebSearch rounds: newsletters/blogs, Hugging Face/docs, YouTube talks, grey PDFs.
4. WebFetch top hits; assign tiers; dedupe.
5. Snowball from 10 tier-A/B posts (2 hops max).
6. Write `web-literature-landscape-theory-of-mind-llm.md` from the report template.
7. Handoff block: suggest `deep-bibliographic-research` if user needs citable papers.
