# compatibility policy

This playbook is designed to run as:
- A standalone repository
- A git submodule inside another repository
- A git subtree copy inside another repository

## host requirements

Minimum requirements for host repositories:
- Git available for normal update flows (submodule/subtree)
- Markdown rendering support (for instructions and docs)
- GitHub Actions support if CI integrity checks are used

Optional but recommended:
- VS Code with GitHub Copilot Chat
- Shell support for helper scripts (`pwsh` on Windows, `bash` on Unix-like systems)

## portability guarantees

This repository guarantees:
- No runtime dependency on sibling repositories or fixed absolute machine paths
- Agent behavior derived from local repository conventions first
- Embedded default conventions when local standards are absent

## non-goals

This repository does not guarantee:
- Full local agent orchestration from GitHub web/mobile editors
- Automatic host-repo-specific adaptation without local convention discovery

## integration modes

| Mode | Supported | Notes |
|---|---|---|
| Git submodule | Yes (recommended) | Strongest pinning and upgrade traceability |
| Git subtree | Yes | Good fallback when teams avoid submodules |
| Vendored snapshot | Yes (fallback) | Highest drift risk; use with explicit update cadence |

## update compatibility

- Non-breaking instruction updates: patch/minor releases
- Behavior or workflow contract changes: major releases
- Host repos should pin to tags and upgrade deliberately
