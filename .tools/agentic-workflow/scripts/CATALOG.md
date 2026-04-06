# Scripts Catalog

> **Purpose:** Machine- and AI-readable manifest of every script in `/scripts/`.
> Agents must read this file to discover available scripts before creating new ones.
> Every script addition or removal must update this catalog in the same commit.

---

## check_playbook_integrity.py

- **Purpose:** Validates that all required playbook files exist and that internal markdown links resolve to real files.
- **Language:** Python 3
- **Depends on:** None
- **Depended on by:** CI workflow (GitHub Actions)
- **Inputs:** None (reads repo root automatically via `Path(__file__).parents[1]`)
- **Outputs:** Exit code 0 (pass) or 1 (fail); error messages to stdout
- **Safe to run in CI:** Yes
- **Idempotent:** Yes

---

## update-submodule.ps1

- **Purpose:** Updates the agentic-workflow submodule to the latest commit on a specified branch in a host repository.
- **Language:** PowerShell 5.1+
- **Depends on:** Git CLI
- **Depended on by:** Host repository maintainers (manual or CI use)
- **Inputs:** `-SubmodulePath` (default `tools/agentic-workflow`), `-Branch` (default `main`)
- **Outputs:** Console status messages; stages the submodule pointer in the host repo index
- **Safe to run in CI:** Yes
- **Idempotent:** Yes

---

## update-submodule.sh

- **Purpose:** Bash equivalent of `update-submodule.ps1` — updates the agentic-workflow submodule to the latest commit on a specified branch.
- **Language:** Bash
- **Depends on:** Git CLI
- **Depended on by:** Host repository maintainers (manual or CI use)
- **Inputs:** `$1` = submodule path (default `tools/agentic-workflow`), `$2` = branch (default `main`)
- **Outputs:** Console status messages; stages the submodule pointer in the host repo index
- **Safe to run in CI:** Yes
- **Idempotent:** Yes
