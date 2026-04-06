# integration options for this playbook

This document explains how to consume this repository from other projects.

## quick recommendation

Use a git submodule by default.

Choose a git subtree when host teams strongly prefer a single-repo workflow and do not want to manage submodule pointers.

Use a vendored copy only when host environments cannot access git metadata.

## option comparison

| Option | Best for | Update model | Pros | Cons |
|---|---|---|---|---|
| Git submodule | Teams that want strict version pinning with explicit upgrades | Host repo updates a submodule commit pointer | Clear version control, easy rollback, no file duplication in host history | Requires submodule-aware workflows |
| Git subtree | Teams that want all files in one repository without submodule commands | Pull and squash updates from upstream | Simpler host cloning, no detached submodule state | Harder to track exact upstream commit, larger host history |
| Vendored copy | Environments without reliable git/submodule support | Manual or scripted copy updates | Works anywhere, no git dependency in host | Most drift risk, weakest upgrade traceability |

## submodule workflow (recommended)

Add:

`git submodule add <repo-url> tools/agentic-workflow`

Pin to a known commit/tag and commit the pointer in the host repo.
Use release tags from this playbook to keep upgrades deliberate and auditable.

Upgrade:

`git submodule update --remote -- tools/agentic-workflow`

Or use the helper script from your host repo root:

`pwsh tools/agentic-workflow/scripts/update-submodule.ps1`

Then commit the updated pointer in the host repository.

## subtree workflow

Add:

`git subtree add --prefix tools/agentic-workflow <repo-url> main --squash`

Upgrade:

`git subtree pull --prefix tools/agentic-workflow <repo-url> main --squash`

## submodule constraint inheritance (important)

When this playbook is added as a submodule, **the host repo must explicitly inherit the agentic workflow constraints**. VS Code applies Copilot Instructions based on the workspace root it detects. The host repo's root is the workspace root, not the submodule's root.

**Why this matters:**
- Without explicit delegation, host repo prompts will not automatically use the orchestrator, agent routing, or mandatory workflow loop
- All the agentic governance will be bypassed
- The host repo will respond as a generic AI assistant to every prompt

**How to set it up — two required files:**

> **Why two files?** VS Code Copilot Chat automatically loads only one file by itself: `.github/copilot-instructions.md` from the workspace root. A passive directive like "fetch from submodule" is frequently skipped by the AI. The `.vscode/settings.json` entry below is what reliably causes VS Code to load the submodule instructions file into Copilot's context automatically, without relying on the AI taking a tool-call action.

**File 1 — `.vscode/settings.json`** (add to host repo; create if it does not exist):

```json
{
  "github.copilot.chat.codeGeneration.instructions": [
    {
      "file": "./tools/agentic-workflow/.github/copilot-instructions.md"
    }
  ]
}
```

If `tools/agentic-workflow` is not the path where you added the submodule, adjust accordingly.

**File 2 — `.github/copilot-instructions.md`** in the host repo root:

```markdown
# Copilot Instructions — Host Repository

> These instructions are automatically applied to every GitHub Copilot Chat session in this workspace.

---

## REQUIRED FIRST ACTION — read the submodule instructions

Before responding to any prompt, use your file reading tool to read this exact file:

`./tools/agentic-workflow/.github/copilot-instructions.md`

Then apply ALL rules, agents, and workflow loops from that file as if they were written here.
Do NOT skip this step. Do NOT proceed with any response until you have read that file.

When those instructions reference paths like `/copilot/` or `/agents/`, resolve them
relative to `./tools/agentic-workflow/`.

---

## Additional host-specific rules (if any)

Add your own constraints here. Examples:
- Domain-specific agents or behaviors
- Host-specific tool restrictions
- Host-specific file naming conventions

(If no host-specific rules are needed, this section can be omitted.)

---

## Agent roster

Refer to `./tools/agentic-workflow/copilot/00-overview.md` section 9 for the full agent roster.

```

**After adding both files:**
1. Commit them: `git add .vscode/settings.json .github/copilot-instructions.md && git commit -m "Wire agentic workflow orchestration"`
2. Restart VS Code (or reload the window) so the settings.json change takes effect
3. Start a new Copilot Chat session — the submodule instructions will be loaded into context automatically via the settings.json entry, and the `copilot-instructions.md` will reinforce the read as a required first action

**Verification:**
- Start a new Copilot Chat session in the host repo
- The first thing it should do is attempt a preflight git sync on the host repo (not the submodule), targeting the remote default branch via `origin/HEAD` (so both `main` and `master` repos work)
- If it does not, check that the submodule path in settings.json matches where you actually added the submodule

## remote-only editing (GitHub web/mobile) reality check

The full agent workflow does not execute in the GitHub web or mobile file editor. Those experiences can edit files and open pull requests, but they do not run local Copilot chat orchestration, local terminal checks, or local preflight sync logic.

What still works remotely:
- Editing instruction files and docs
- Opening pull requests
- Running GitHub Actions checks on pull requests

What does not work remotely by itself:
- Local agent routing/execution loop
- Local terminal-driven preflight sync and verification

Recommended approach for remote edits:
1. Keep remote edits limited to docs/instructions when possible.
2. Require CI checks on pull requests.
3. Validate behaviour in a full local or Codespaces session before merge when operational logic changes.

## changes that improve all integration modes

1. Add release tags (for example `v0.1.0`, `v0.2.0`) so hosts can pin stable versions.
2. Add a changelog that summarizes breaking vs non-breaking instruction changes.
3. Add a compatibility policy section (what host repo assumptions are required).
4. Use helper scripts for host repos:
   - `scripts/update-submodule.ps1`
   - `scripts/update-submodule.sh`
5. Use CI checks for playbook integrity:
   - Required files exist
   - Internal links resolve
   - Markdown linting (`.github/workflows/playbook-integrity.yml`)
6. Optionally publish this repo as a template snapshot for vendored-copy consumers.
