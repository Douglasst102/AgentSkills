#!/usr/bin/env python3
"""
Consolidated literature search across free scholarly APIs.

Sources: OpenAlex, Semantic Scholar, arXiv, DBLP
Output: JSON array of normalized work records (stdout or file)

Usage:
    python search_literature.py --query "theory of mind language models"
    python search_literature.py --query "..." --from-year 2020 --limit 25 --output results.json
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from typing import Any

USER_AGENT = "MultSkills-DeepBibliographicResearch/1.0 (mailto:research@example.com)"
ATOM_NS = {"atom": "http://www.w3.org/2005/Atom"}


def fetch_json(url: str, headers: dict[str, str] | None = None, delay: float = 0) -> Any:
    if delay:
        time.sleep(delay)
    req_headers = {"User-Agent": USER_AGENT, "Accept": "application/json"}
    if headers:
        req_headers.update(headers)
    req = urllib.request.Request(url, headers=req_headers)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def fetch_text(url: str, delay: float = 0) -> str:
    if delay:
        time.sleep(delay)
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode("utf-8")


def normalize_doi(doi: str | None) -> str | None:
    if not doi:
        return None
    d = doi.strip().lower()
    for prefix in ("https://doi.org/", "http://doi.org/", "doi:"):
        if d.startswith(prefix):
            d = d[len(prefix) :]
    return d or None


def normalize_title(title: str | None) -> str:
    if not title:
        return ""
    t = re.sub(r"[^\w\s]", " ", title.lower())
    return re.sub(r"\s+", " ", t).strip()


def reconstruct_openalex_abstract(inv_index: dict | None) -> str | None:
    if not inv_index:
        return None
    words: list[str] = []
    for word, positions in inv_index.items():
        for pos in positions:
            while len(words) <= pos:
                words.append("")
            words[pos] = word
    return " ".join(words).strip() or None


def make_record(
    *,
    title: str,
    year: int | None = None,
    authors: list[str] | None = None,
    abstract: str | None = None,
    doi: str | None = None,
    arxiv_id: str | None = None,
    openalex_id: str | None = None,
    s2_id: str | None = None,
    venue: str | None = None,
    url: str | None = None,
    cited_by_count: int | None = None,
    source: str,
) -> dict[str, Any]:
    return {
        "title": title,
        "year": year,
        "authors": authors or [],
        "abstract": abstract,
        "doi": normalize_doi(doi),
        "arxiv_id": arxiv_id,
        "openalex_id": openalex_id,
        "s2_id": s2_id,
        "venue": venue,
        "url": url,
        "cited_by_count": cited_by_count,
        "sources": [source],
        "title_normalized": normalize_title(title),
    }


def search_openalex(query: str, from_year: int | None, limit: int, mailto: str) -> list[dict[str, Any]]:
    params: dict[str, str] = {
        "search": query,
        "per_page": str(min(limit, 50)),
        "mailto": mailto,
    }
    if from_year:
        params["filter"] = f"from_publication_date:{from_year}-01-01"
    url = "https://api.openalex.org/works?" + urllib.parse.urlencode(params)
    data = fetch_json(url)
    records: list[dict[str, Any]] = []
    for work in data.get("results", []):
        oa_id = work.get("id", "").rsplit("/", 1)[-1]
        authors = [
            (a.get("author") or {}).get("display_name", "")
            for a in work.get("authorships", [])
        ]
        authors = [a for a in authors if a]
        loc = work.get("primary_location") or {}
        source_info = loc.get("source") or {}
        records.append(
            make_record(
                title=work.get("display_name") or work.get("title") or "Untitled",
                year=work.get("publication_year"),
                authors=authors,
                abstract=reconstruct_openalex_abstract(work.get("abstract_inverted_index")),
                doi=work.get("doi", "").replace("https://doi.org/", "") if work.get("doi") else None,
                openalex_id=oa_id,
                venue=source_info.get("display_name"),
                url=work.get("doi") or work.get("id"),
                cited_by_count=work.get("cited_by_count"),
                source="openalex",
            )
        )
    return records


def search_semantic_scholar(query: str, limit: int) -> list[dict[str, Any]]:
    fields = "title,year,authors,abstract,externalIds,citationCount,url,publicationVenue"
    params = urllib.parse.urlencode({"query": query, "limit": str(min(limit, 100)), "fields": fields})
    url = f"https://api.semanticscholar.org/graph/v1/paper/search?{params}"
    data = fetch_json(url, delay=1.0)
    records: list[dict[str, Any]] = []
    for paper in data.get("data", []):
        ext = paper.get("externalIds") or {}
        venue_info = paper.get("publicationVenue") or {}
        authors = [a.get("name", "") for a in paper.get("authors", []) if a.get("name")]
        records.append(
            make_record(
                title=paper.get("title") or "Untitled",
                year=paper.get("year"),
                authors=authors,
                abstract=paper.get("abstract"),
                doi=ext.get("DOI"),
                arxiv_id=ext.get("ArXiv"),
                s2_id=paper.get("paperId"),
                venue=venue_info.get("name"),
                url=paper.get("url"),
                cited_by_count=paper.get("citationCount"),
                source="semantic_scholar",
            )
        )
    return records


def search_arxiv(query: str, limit: int) -> list[dict[str, Any]]:
    # Convert plain query to arXiv all: field search
    arxiv_q = f'all:"{query}"' if " " in query else f"all:{query}"
    params = urllib.parse.urlencode(
        {
            "search_query": arxiv_q,
            "start": "0",
            "max_results": str(min(limit, 50)),
            "sortBy": "relevance",
            "sortOrder": "descending",
        }
    )
    url = f"http://export.arxiv.org/api/query?{params}"
    xml_text = fetch_text(url, delay=3.0)
    root = ET.fromstring(xml_text)
    records: list[dict[str, Any]] = []
    for entry in root.findall("atom:entry", ATOM_NS):
        title_el = entry.find("atom:title", ATOM_NS)
        summary_el = entry.find("atom:summary", ATOM_NS)
        published_el = entry.find("atom:published", ATOM_NS)
        id_el = entry.find("atom:id", ATOM_NS)
        title = (title_el.text or "").strip().replace("\n", " ") if title_el is not None else "Untitled"
        abstract = (summary_el.text or "").strip().replace("\n", " ") if summary_el is not None else None
        year = None
        if published_el is not None and published_el.text:
            year = int(published_el.text[:4])
        arxiv_id = None
        url = id_el.text.strip() if id_el is not None and id_el.text else None
        if url:
            m = re.search(r"arxiv\.org/abs/([^/]+)$", url)
            if m:
                arxiv_id = m.group(1)
        authors = [
            (a.find("atom:name", ATOM_NS).text or "").strip()
            for a in entry.findall("atom:author", ATOM_NS)
        ]
        authors = [a for a in authors if a]
        records.append(
            make_record(
                title=title,
                year=year,
                authors=authors,
                abstract=abstract,
                arxiv_id=arxiv_id,
                venue="arXiv",
                url=url,
                source="arxiv",
            )
        )
    return records


def search_dblp(query: str, limit: int) -> list[dict[str, Any]]:
    params = urllib.parse.urlencode({"q": query, "format": "json", "h": str(min(limit, 50))})
    url = f"https://dblp.org/search/publ/api?{params}"
    data = fetch_json(url, delay=0.5)
    records: list[dict[str, Any]] = []
    hits = (data.get("result") or {}).get("hits") or {}
    hit_list = hits.get("hit") or []
    if isinstance(hit_list, dict):
        hit_list = [hit_list]
    for hit in hit_list:
        info = hit.get("info") or {}
        authors_raw = info.get("authors") or {}
        author_list = authors_raw.get("author") or []
        if isinstance(author_list, str):
            author_list = [author_list]
        records.append(
            make_record(
                title=info.get("title") or "Untitled",
                year=int(info.get("year")) if info.get("year") else None,
                authors=author_list,
                doi=info.get("doi"),
                venue=info.get("venue"),
                url=info.get("ee") or info.get("url"),
                source="dblp",
            )
        )
    return records


def merge_key(record: dict[str, Any]) -> str:
    if record.get("doi"):
        return f"doi:{record['doi']}"
    if record.get("arxiv_id"):
        return f"arxiv:{record['arxiv_id']}"
    if record.get("openalex_id"):
        return f"openalex:{record['openalex_id']}"
    if record.get("s2_id"):
        return f"s2:{record['s2_id']}"
    return f"title:{record.get('title_normalized', '')}:{record.get('year', '')}"


def merge_records(records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    merged: dict[str, dict[str, Any]] = {}
    for rec in records:
        key = merge_key(rec)
        if key not in merged:
            merged[key] = rec.copy()
            continue
        existing = merged[key]
        existing["sources"] = sorted(set(existing.get("sources", []) + rec.get("sources", [])))
        for field in ("abstract", "doi", "arxiv_id", "openalex_id", "s2_id", "venue", "url"):
            if not existing.get(field) and rec.get(field):
                existing[field] = rec[field]
        if rec.get("authors") and len(rec["authors"]) > len(existing.get("authors", [])):
            existing["authors"] = rec["authors"]
        if rec.get("cited_by_count") and (existing.get("cited_by_count") or 0) < rec["cited_by_count"]:
            existing["cited_by_count"] = rec["cited_by_count"]
    return list(merged.values())


def main() -> int:
    parser = argparse.ArgumentParser(description="Search free scholarly APIs and output merged JSON.")
    parser.add_argument("--query", "-q", required=True, help="Search query string")
    parser.add_argument("--from-year", type=int, default=None, help="Minimum publication year")
    parser.add_argument("--limit", "-n", type=int, default=25, help="Max results per source")
    parser.add_argument("--output", "-o", default=None, help="Output JSON file (default: stdout)")
    parser.add_argument("--mailto", default="research@example.com", help="Email for OpenAlex polite pool")
    parser.add_argument(
        "--sources",
        default="openalex,semantic_scholar,arxiv,dblp",
        help="Comma-separated sources to query",
    )
    args = parser.parse_args()

    enabled = {s.strip().lower() for s in args.sources.split(",")}
    all_records: list[dict[str, Any]] = []
    errors: list[str] = []

    if "openalex" in enabled:
        try:
            all_records.extend(search_openalex(args.query, args.from_year, args.limit, args.mailto))
        except (urllib.error.URLError, json.JSONDecodeError, TimeoutError) as e:
            errors.append(f"openalex: {e}")

    if "semantic_scholar" in enabled or "s2" in enabled:
        try:
            all_records.extend(search_semantic_scholar(args.query, args.limit))
        except (urllib.error.URLError, json.JSONDecodeError, TimeoutError) as e:
            errors.append(f"semantic_scholar: {e}")

    if "arxiv" in enabled:
        try:
            all_records.extend(search_arxiv(args.query, args.limit))
        except (urllib.error.URLError, ET.ParseError, TimeoutError) as e:
            errors.append(f"arxiv: {e}")

    if "dblp" in enabled:
        try:
            all_records.extend(search_dblp(args.query, args.limit))
        except (urllib.error.URLError, json.JSONDecodeError, TimeoutError) as e:
            errors.append(f"dblp: {e}")

    merged = merge_records(all_records)
    if args.from_year:
        merged = [r for r in merged if r.get("year") is None or r["year"] >= args.from_year]

    output = {
        "query": args.query,
        "from_year": args.from_year,
        "raw_count": len(all_records),
        "unique_count": len(merged),
        "errors": errors,
        "works": merged,
    }

    text = json.dumps(output, indent=2, ensure_ascii=False)
    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(text)
        print(f"Wrote {len(merged)} unique works to {args.output}", file=sys.stderr)
    else:
        print(text)
    return 0 if not errors or merged else 1


if __name__ == "__main__":
    sys.exit(main())
