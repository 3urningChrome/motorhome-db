# Changelog

All notable changes to this playbook are documented in this file.

The format is based on Keep a Changelog and this project follows Semantic Versioning.

## [0.1.0] - 2026-04-05

### Added
- Multi-agent orchestration loop with mandatory Investigate -> Plan -> Develop -> Test -> Code Review flow.
- Preflight self-update rules with bootstrap exception for first-time local setup.
- Specialist agents for Angular, C#/.NET, Python, and OpenInsight.
- Portability rules to keep the playbook standalone-capable when used as a submodule.
- Integration guidance for submodule/subtree/vendor modes.
- Compatibility policy and release/versioning documentation.
- Helper scripts for submodule updates (`scripts/update-submodule.ps1`, `scripts/update-submodule.sh`).
- CI integrity workflow for required files, internal markdown links, and markdown linting.

### Changed
- Testing and documentation standards now require coverage intent for changed behavior and same-iteration documentation sync.
- OpenInsight agent now discovers local conventions first and uses embedded defaults when no local standard exists.
