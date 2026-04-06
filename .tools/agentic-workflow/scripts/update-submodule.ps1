param(
  [string]$SubmodulePath = "tools/agentic-workflow",
  [string]$Branch = "main"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path ".git")) {
  throw "Run this script from the host repository root."
}

Write-Host "Updating submodule '$SubmodulePath' from branch '$Branch'..."

git submodule sync -- "$SubmodulePath"
git submodule update --init --remote -- "$SubmodulePath"

git -C "$SubmodulePath" fetch origin "$Branch"
git -C "$SubmodulePath" checkout "origin/$Branch"

git add "$SubmodulePath"

Write-Host "Submodule updated. Commit the pointer in the host repo when ready."
