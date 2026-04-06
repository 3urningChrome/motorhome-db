# versioning and releases

This repository follows Semantic Versioning.

## version file

The canonical version is stored in `VERSION`.

## release tag format

Use annotated tags:
- `vMAJOR.MINOR.PATCH`
- Example: `v0.1.0`

## release process

1. Update playbook files.
2. Update `CHANGELOG.md`.
3. Update `VERSION`.
4. Open and merge pull request.
5. Create annotated tag from main:

`git tag -a vX.Y.Z -m "Release vX.Y.Z"`

6. Push tag:

`git push origin vX.Y.Z`

## version bump guidance

- Patch: documentation clarifications and non-behavioral fixes.
- Minor: additive agent capabilities and non-breaking workflow enhancements.
- Major: breaking behavior changes to orchestration or agent contracts.
