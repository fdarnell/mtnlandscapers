#!/usr/bin/env python3
"""Stable edit keys + client text overrides, for portal inline editing.

Run this AFTER the site generator and BEFORE stamp_assets.py. It is
idempotent, so running it twice (or running the generator again and re-running
it) is safe.

Two jobs, in this order:

  1. stamp()  — give every editable text element inside <main> a stable
                data-e="<tag>-<n>" key (n counts that tag within <main>).
  2. apply()  — re-apply the client's own wording from content.edits.json.

Why the built HTML and not the generator's source: across the site repos the
copy lives in wholly different places (content.json here, Python literals in
others), but every site ships the same thing — HTML with a <main>. Keying off
the built page is the one addressing scheme that works everywhere, and it is
also what the portal patches when a client saves, so both paths agree.

The hash check in apply() is the safety property. Each stored edit remembers
the hash of the text it replaced; if the generator's output for that key no
longer matches, the edit is STALE and is skipped, not applied. A restructured
page can therefore never land a client's sentence on the wrong block — the
worst case is that their edit stops applying and gets reported.

Deliberately NOT stampable, by construction:
  * anything outside <main> — nav, footer, phone numbers, CTAs, JSON-LD
  * elements holding other block elements (containers, not copy)
  * empty elements, and button/link-only elements
"""
import hashlib
import json
import os
import pathlib
import re

EDITS_FILE = "content.edits.json"

# Elements a client may retype. All non-void, so the close-tag scan below is
# always meaningful.
EDITABLE_TAGS = ("h1", "h2", "h3", "h4", "h5", "h6", "p", "li", "blockquote", "figcaption")

# If the inner HTML holds one of these, the element is a container, not copy.
BLOCK_CHILD_RE = re.compile(
    r"<(?:div|section|article|aside|nav|header|footer|form|table|ul|ol|dl"
    r"|figure|picture|iframe|script|style|h[1-6]|p)[\s>/]",
    re.I,
)

TAG_RE = re.compile(r"<(/?)([a-zA-Z][a-zA-Z0-9]*)((?:[^>\"']|\"[^\"]*\"|'[^']*')*)>")
SKIP_SPANS_RE = re.compile(r"<!--.*?-->|<script\b.*?</script>|<style\b.*?</style>", re.I | re.S)
DATA_E_RE = re.compile(r"\sdata-e=(\"[^\"]*\"|'[^']*')")
MAIN_RE = re.compile(r"<main\b[^>]*>(.*)</main>", re.I | re.S)


def normalize(text: str) -> str:
    """Whitespace-insensitive form used for hashing and comparison.

    Generators move newlines around between runs; that must not orphan a
    client's edit, so only the visible substance is hashed.
    """
    return re.sub(r"\s+", " ", text or "").strip()


def text_hash(inner: str) -> str:
    return hashlib.sha1(normalize(inner).encode("utf-8")).hexdigest()[:16]


def _masked(html_text: str) -> str:
    """Same length as the input, with comment/script/style bodies blanked.

    Offsets stay valid while tag-looking text inside them stops being seen.
    """
    out = list(html_text)
    for m in SKIP_SPANS_RE.finditer(html_text):
        for i in range(m.start(), m.end()):
            out[i] = " "
    return "".join(out)


def _main_span(html_text: str):
    m = MAIN_RE.search(html_text)
    return (m.start(1), m.end(1)) if m else None


def iter_elements(html_text: str):
    """Yield every editable element inside <main>, in document order.

    Each item is a dict with the element's key, its tag, the span of its
    opening tag, and the span of its inner HTML. Ordinals count EVERY
    occurrence of that tag inside <main>, editable or not — so an element that
    becomes (or stops being) editable never renumbers its neighbours.
    """
    span = _main_span(html_text)
    if not span:
        return
    start, end = span
    scan = _masked(html_text)

    counts = {}
    skip_depth = 0
    skip_tag = None

    for m in TAG_RE.finditer(scan, start, end):
        closing, tag, attrs = m.group(1), m.group(2).lower(), m.group(3)

        # A <nav> (breadcrumbs, in-page tables of contents) or an element
        # marked data-noedit takes its whole subtree out of play. Its tags are
        # still COUNTED below, so that marking something un-editable never
        # renumbers the keys of everything after it.
        if skip_tag:
            if tag == skip_tag:
                skip_depth += -1 if closing else 1
                if skip_depth == 0:
                    skip_tag = None
        elif not closing and (tag == "nav" or "data-noedit" in attrs.lower()):
            skip_tag, skip_depth = tag, 1

        if closing or tag not in EDITABLE_TAGS:
            continue

        counts[tag] = counts.get(tag, 0) + 1
        key = f"{tag}-{counts[tag]}"

        if skip_tag:
            continue

        inner_start = m.end()
        inner_end = _find_close(scan, tag, inner_start, end)
        if inner_end is None:
            continue
        inner = html_text[inner_start:inner_end]

        if BLOCK_CHILD_RE.search(inner):
            continue
        if not re.search(r"[A-Za-z0-9]", re.sub(r"<[^>]+>", "", inner)):
            continue
        # A cell holding nothing but a button/link is a control, not copy.
        if re.fullmatch(r"\s*<a\b[^>]*>.*?</a>\s*", inner, re.S):
            continue

        yield {
            "key": key,
            "tag": tag,
            "open_start": m.start(),
            "open_end": m.end(),
            "inner_start": inner_start,
            "inner_end": inner_end,
            "inner": inner,
        }


def _find_close(scan: str, tag: str, pos: int, limit: int):
    """Offset of the matching </tag>, counting nested same-name opens."""
    depth = 1
    for m in TAG_RE.finditer(scan, pos, limit):
        if m.group(2).lower() != tag:
            continue
        if m.group(1):
            depth -= 1
            if depth == 0:
                return m.start()
        elif not m.group(3).rstrip().endswith("/"):
            depth += 1
    return None


def stamp_html(html_text: str) -> str:
    """Add or refresh data-e keys. Returns the new HTML."""
    edits = []
    for el in iter_elements(html_text):
        open_tag = html_text[el["open_start"]:el["open_end"]]
        stripped = DATA_E_RE.sub("", open_tag)
        # Insert right after the tag name so the attribute order is stable.
        new_tag = re.sub(
            r"^<([a-zA-Z][a-zA-Z0-9]*)",
            lambda m: f'<{m.group(1)} data-e="{el["key"]}"',
            stripped,
            count=1,
        )
        if new_tag != open_tag:
            edits.append((el["open_start"], el["open_end"], new_tag))

    for start, end, new_tag in reversed(edits):
        html_text = html_text[:start] + new_tag + html_text[end:]
    return html_text


def apply_html(html_text: str, page_edits: dict):
    """Apply one page's overrides. Returns (html, applied, stale).

    `stale` holds the keys whose recorded original no longer matches what the
    generator produced — those are skipped so the fresh copy wins.
    """
    if not page_edits:
        return html_text, [], []

    applied, stale, patches = [], [], []
    for el in iter_elements(html_text):
        edit = page_edits.get(el["key"])
        if not edit:
            continue
        want = edit.get("origHash")
        have = text_hash(el["inner"])
        # Already carrying the client's wording (a re-run over patched HTML).
        if normalize(el["inner"]) == normalize(edit.get("html", "")):
            applied.append(el["key"])
            continue
        if want and want != have:
            stale.append({"key": el["key"], "expected": want, "found": have})
            continue
        patches.append((el["inner_start"], el["inner_end"], edit.get("html", "")))
        applied.append(el["key"])

    for start, end, new_inner in reversed(patches):
        html_text = html_text[:start] + new_inner + html_text[end:]
    return html_text, applied, stale


def page_path_for(root: str, url_path: str):
    """Map a site URL path to the file that serves it, or None.

    Handles both layouts in the repos: flat `<slug>.html` (this site) and
    directory `<slug>/index.html` (skyline and friends).
    """
    slug = (url_path or "/").strip("/")
    if not slug:
        candidates = ["index.html"]
    else:
        candidates = [f"{slug}.html", os.path.join(slug, "index.html")]
    for rel in candidates:
        full = os.path.join(root, rel)
        if os.path.isfile(full):
            return full
    return None


def url_path_for(root: str, file_path: str) -> str:
    rel = os.path.relpath(file_path, root).replace(os.sep, "/")
    if rel == "index.html":
        return "/"
    if rel.endswith("/index.html"):
        return "/" + rel[: -len("/index.html")]
    return "/" + rel[: -len(".html")]


def html_files(root: str):
    skip = {".git", "node_modules", "__pycache__", "seo-baseline", "screenshots", "docs"}
    for path in sorted(pathlib.Path(root).rglob("*.html")):
        if skip & set(path.relative_to(root).parts):
            continue
        yield str(path)


def load_edits(root: str) -> dict:
    path = os.path.join(root, EDITS_FILE)
    if not os.path.isfile(path):
        return {}
    try:
        with open(path, encoding="utf-8") as fh:
            return (json.load(fh) or {}).get("edits", {}) or {}
    except (OSError, ValueError) as exc:
        print(f"  !! {EDITS_FILE} unreadable ({exc}) — no client edits applied")
        return {}


def stamp(root: str) -> int:
    changed = 0
    for path in html_files(root):
        with open(path, encoding="utf-8") as fh:
            original = fh.read()
        stamped = stamp_html(original)
        if stamped != original:
            with open(path, "w", encoding="utf-8") as fh:
                fh.write(stamped)
            changed += 1
    print(f"edit keys stamped ({changed} page{'' if changed == 1 else 's'} updated)")
    return changed


def apply(root: str):
    edits = load_edits(root)
    if not edits:
        return 0, []

    total, all_stale = 0, []
    for url_path, page_edits in edits.items():
        path = page_path_for(root, url_path)
        if not path:
            all_stale.append({"page": url_path, "key": "*", "reason": "page not found"})
            continue
        with open(path, encoding="utf-8") as fh:
            original = fh.read()
        patched, applied, stale = apply_html(original, page_edits)
        missing = set(page_edits) - set(applied) - {s["key"] for s in stale}
        for key in sorted(missing):
            all_stale.append({"page": url_path, "key": key, "reason": "key not on page"})
        for s in stale:
            all_stale.append({"page": url_path, "key": s["key"], "reason": "source copy changed"})
        if patched != original:
            with open(path, "w", encoding="utf-8") as fh:
                fh.write(patched)
        total += len(applied)

    print(f"client edits applied: {total}")
    for s in all_stale:
        print(f"  !! STALE {s['page']} {s['key']} — {s['reason']} (client wording NOT applied)")
    return total, all_stale


def main(root: str):
    stamp(root)
    apply(root)


if __name__ == "__main__":
    main(os.path.dirname(os.path.abspath(__file__)))
