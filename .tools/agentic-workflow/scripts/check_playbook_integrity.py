#!/usr/bin/env python3
"""Basic integrity checks for the playbook repository.

Checks:
- Required files exist
- Internal markdown links point to existing files
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

REQUIRED_FILES = [
    ".github/copilot-instructions.md",
    ".gitignore",
    "copilot/00-overview.md",
    "copilot/agents/orchestrator.md",
    "copilot/agents/research-agent.md",
    "copilot/agents/planning-agent.md",
    "copilot/agents/code-review-agent.md",
    "copilot/agents/red-team-agent.md",
    "copilot/agents/memory-stack-agent.md",
    "copilot/agents/testing-agent.md",
    "copilot/agents/docs-agent.md",
    "copilot/agents/language-bootstrap-agent.md",
    "scripts/CATALOG.md",
    "README.md",
    "CHANGELOG.md",
    "VERSION",
]

MD_LINK_RE = re.compile(r"\[[^\]]+\]\(([^)]+)\)")
FENCE_RE = re.compile(r"```.*?```", re.DOTALL)


def check_required_files() -> list[str]:
    errors: list[str] = []
    for rel in REQUIRED_FILES:
        if not (ROOT / rel).exists():
            errors.append(f"Missing required file: {rel}")
    return errors


def markdown_files() -> list[Path]:
    return [
        p
        for p in ROOT.rglob("*.md")
        if ".git" not in p.parts and "node_modules" not in p.parts
    ]


def remove_fenced_blocks(text: str) -> str:
    return FENCE_RE.sub("", text)


def is_external(target: str) -> bool:
    lower = target.lower()
    return lower.startswith("http://") or lower.startswith("https://") or lower.startswith("mailto:")


def check_internal_links() -> list[str]:
    errors: list[str] = []
    for md_file in markdown_files():
        text = remove_fenced_blocks(md_file.read_text(encoding="utf-8", errors="ignore"))
        for match in MD_LINK_RE.finditer(text):
            target = match.group(1).strip()
            if not target or is_external(target):
                continue
            if target.startswith("#"):
                continue

            path_part = target.split("#", 1)[0]
            # Skip pure anchors or intentional command text.
            if not path_part:
                continue

            resolved = (md_file.parent / path_part).resolve()
            if not resolved.exists():
                rel_src = md_file.relative_to(ROOT)
                errors.append(f"Broken internal link in {rel_src}: {target}")
    return errors


def main() -> int:
    errors = []
    errors.extend(check_required_files())
    errors.extend(check_internal_links())

    if errors:
        print("Integrity check failed:")
        for e in errors:
            print(f"- {e}")
        return 1

    print("Integrity check passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
