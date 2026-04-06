# Agentic-Workflow

Structured Copilot agents and workflow instructions for running development tasks through a consistent multi-agent pipeline.

## Integration strategy

This repository is intended to be portable and standalone-capable when consumed by other repositories.

- Default recommendation: git submodule
- Alternate option: git subtree
- Fallback option: vendored snapshot copy

Detailed guidance is available in [docs/integration-options.md](docs/integration-options.md).

Additional governance docs:
- [docs/compatibility-policy.md](docs/compatibility-policy.md)
- [docs/versioning-and-releases.md](docs/versioning-and-releases.md)
- [CHANGELOG.md](CHANGELOG.md)

## Submodule behaviour

This repository is designed to be used as a standalone repo or as a git submodule inside other repositories.

When it is active, the first action on every prompt is a **preflight self-update**:
- Fetch the latest `main` from `origin`
- Update this checkout to the newest `origin/main` when it is behind
- Stop and report a blocker if the update cannot be completed safely

The rest of the agent workflow only begins after that sync succeeds, so prompt handling always runs from the latest version of this playbook.

## Remote editing (GitHub web/mobile)

You can edit playbook files remotely using GitHub web/mobile and open pull requests, but full local agent orchestration does not run in that environment.

For operationally significant changes, use local VS Code (or Codespaces) before merge so preflight, test, and review stages can execute end-to-end.
