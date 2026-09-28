# Source Taxonomy — Open Web Literature Research

Types of sources in scope for this skill, quality signals, and red flags. **Out of scope**: academic indexes (Scholar, OpenAlex, etc.), forums, and social networks — see `handoff-to-academic.md`.

---

## In-Scope Source Types

### 1. Blogs and newsletters

| Role | Use when |
|------|----------|
| Narrative synthesis, practitioner takes, lab updates, debate mapping | You need *how the field talks about X* on the open web |

**Quality signals**

- Named author with verifiable affiliation or track record
- Dated posts with revision notes when updated
- Outbound links to primary material (papers, code, datasets) — even if you do not fetch papers in this skill
- Clear distinction between opinion and reported fact

**Red flags**

- Anonymous or opaque authorship
- Heavy affiliate / product placement without disclosure
- Republished press releases with no added analysis
- Generic SEO articles with no specific claims or examples

**Example venues (not exhaustive)**

- Substack newsletters (domain-specific science/tech writing)
- University lab blogs, corporate research blogs (e.g., DeepMind, Anthropic, Meta AI blog archives)
- Individual researcher blogs with methodological depth

---

### 2. Video and audio

| Role | Use when |
|------|----------|
| Talks, interviews, tutorials, conference recordings | Spoken explanations, demos, or historical context matter |

**Quality signals**

- Speaker identity and institution/org stated
- Linked slides, paper list, or transcript in description or show notes
- Hosted on official channels (lab, conference, publisher) vs. re-upload farms

**Red flags**

- Clickbait titles with no substantive content in notes
- Audio-only hype with no references in show notes

**Capture in report**: URL, title, speaker, date, **tier** (from `credibility-rubric.md`), one-line takeaway. Prefer show-note links for snowballing.

---

### 3. Technical documentation and code artifacts

| Role | Use when |
|------|----------|
| Implementable state of the art, APIs, reproducible workflows | Topic has a tools/code dimension |

**Quality signals**

- Official docs (versioned), maintained README, model cards with limitations stated
- Changelog, issue tracker activity, license clarity
- Examples that run or cite evaluation benchmarks

**Red flags**

- Abandoned repos with no maintenance and no community fork
- Docs that contradict the codebase without explanation

**Examples**: project docs sites, GitHub README/wiki, Hugging Face model/dataset cards, framework guides (PyTorch, PsychoPy, BIDS).

---

### 4. Institutional grey literature

| Role | Use when |
|------|----------|
| Policy, funding landscape, industry surveys, government science reports | Context beyond individual blogs |

**Quality signals**

- Issuing organization named, publication date, PDF metadata
- Methodology section for surveys (sample, limitations)
- DOI or stable URL

**Red flags**

- Advocacy dressed as research without methods
- Undated PDFs on vendor sites

**Examples**: NIH/NSF reports, OECD, EU AI Act summaries from official bodies, major lab annual reports (when methodological).

---

### 5. Popular science and long-form journalism

| Role | Use when |
|------|----------|
| Accessible bridge for orientation | Audience is non-specialist or you need narrative framing |

**Quality signals**

- Staff science journalists or writers who interview primary researchers
- Fact-checking culture (major outlets, magazines with science desks)
- Links to primary literature in article (for user follow-up, not for this skill to mine academically)

**Red flags**

- Sensational headlines, single-study hype
- Confusing correlation and causation without caveat

**Examples**: Aeon, Quanta, Nautilus, Nature/news features (web articles, not journal papers as primary objects).

---

### 6. Wikipedia and wikis (discovery only)

| Role | Use when |
|------|----------|
| Term discovery, alternate names, outbound link harvesting | **First pass only** |

**Rules**

- Never list Wikipedia as a **core source** in the final report
- Use it to build concept tables and find linked primary-ish web resources
- Prefer Wikidata/Wikipedia **references section** URLs as snowball seeds

---

## Explicitly Excluded (this skill)

| Category | Why excluded | Alternative |
|----------|--------------|-------------|
| Google Scholar, OpenAlex, Semantic Scholar, arXiv, DBLP, ACL Anthology | Academic index workflow | `deep-bibliographic-research` |
| Reddit, Hacker News, X/Twitter, Mastodon threads | Forum/social discovery | Blogs and official docs |
| Quora, Stack Overflow (as primary corpus) | Q&A format, uneven quality | Official docs; SO only for *one* technical error if docs silent |
| Content farms (eHow-style, AI-slop aggregators) | Low signal | Exclude |

---

## Domain Hints — Cognitive Science & Neuroscience

Use these as **search seeds**, not endorsements. Verify each hit with the credibility rubric.

| Subdomain | Useful open-web channels |
|-----------|---------------------------|
| Computational cogsci / ACT-R | CMU ACT-R page, lab blogs, software docs, tutorial repos |
| Neuroimaging methods | BIDS spec, FSL/SPM/AFNI docs, Nilearn, OHBM educational posts |
| EEG/ERP | mne-python docs, ERP CORE resources, vendor application notes (tier B/C) |
| ML + cognition | Distill.pub (archived), lab blogs, conference talk pages (NeurIPS blog track) |
| Philosophy of mind / AI | Aeon, IAI, long-form interviews on official channels |
| Industry AI safety / alignment | Org blogs (Anthropic, OpenAI, DeepMind) — label advocacy vs. research |

**Note**: Distill and similar are **web publications**, not journal indexes — include when relevant. LessWrong and similar **forums** remain excluded.

---

## Deduplication (lightweight)

When the same essay appears on multiple URLs (Medium cross-post, newsletter mirror):

1. Prefer **canonical URL** (author's own site or newsletter original)
2. Prefer **newest dated** version if content differs
3. Tag `mirrors: [url, ...]` in working notes; one row in appendix

---

## Screening Labels (working set)

| Label | Meaning |
|-------|---------|
| **include** | Core or strong supporting source |
| **maybe** | Useful but tier C or tangential |
| **exclude** | Off-topic, duplicate, or failed quality bar — note reason |

Reason codes: `off_topic`, `duplicate`, `marketing`, `content_farm`, `no_author`, `stale`, `wrong_type` (e.g., forum link).
