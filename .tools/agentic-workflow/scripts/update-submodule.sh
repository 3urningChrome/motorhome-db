#!/usr/bin/env bash
set -euo pipefail

SUBMODULE_PATH="${1:-tools/agentic-workflow}"
BRANCH="${2:-main}"

if [[ ! -d .git ]]; then
  echo "Run this script from the host repository root." >&2
  exit 1
fi

echo "Updating submodule '${SUBMODULE_PATH}' from branch '${BRANCH}'..."

git submodule sync -- "${SUBMODULE_PATH}"
git submodule update --init --remote -- "${SUBMODULE_PATH}"

git -C "${SUBMODULE_PATH}" fetch origin "${BRANCH}"
git -C "${SUBMODULE_PATH}" checkout "origin/${BRANCH}"

git add "${SUBMODULE_PATH}"

echo "Submodule updated. Commit the pointer in the host repo when ready."
