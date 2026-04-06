# Runbook: Refactor File

> **Copy this prompt into Copilot Chat to safely refactor an existing file.**  
> Select the file in VS Code or reference it by path before sending.

---

```
You are the Refactor Agent.
Follow all conventions in /copilot/agents/refactor-agent.md and /copilot/00-overview.md.

## Task

Refactor the following file: `<path/to/file.ts>`

## Requirements

- Preserve all existing behaviour and public APIs.
- Apply the project's coding conventions from /copilot/00-overview.md.
- Follow the refactor rules in /copilot/agents/refactor-agent.md.

## Scope

<Choose one or more of the following, or say "full review">
- [ ] Fix type safety issues (`any` types, missing return types)
- [ ] Apply naming conventions
- [ ] Reduce complexity (early returns, extract functions)
- [ ] Remove duplication
- [ ] Improve error handling
- [ ] Remove banned patterns (see overview)
- [ ] Improve documentation comments
- [ ] Full review — apply all applicable improvements

## Steps to follow

1. Read and understand the file's purpose and public API.
2. List all issues found, categorised as:
   - Always fix (type safety, banned patterns, clear bugs)
   - Safe to fix (readability, naming, complexity)
   - Flag only (architectural, API shape changes, missing tests)
3. Confirm the scope — present the list and wait for approval before proceeding.
4. Apply fixes step-by-step, showing before/after for each significant change.
5. Note any tests that need updating after the refactor.
6. Summarise all changes made and any follow-up actions.

## Output format

Use the refactor summary format from refactor-agent.md:
- Issues Found (categorised)
- Changes Made (before/after for each)
- Tests to Update
- Follow-up Actions
```

---

## Example usage

Highlight `src/features/auth/services/AuthService.ts` in VS Code, then send:

```
You are the Refactor Agent.
Follow /copilot/agents/refactor-agent.md and /copilot/00-overview.md.

Refactor the selected file.

Scope: Fix type safety issues and reduce complexity (early returns, extract functions).

Follow the step-by-step workflow from the agent file.
```

---

## Tips

- **Always run your tests before starting a refactor** so you have a baseline to compare against.
- **Be specific about scope.** A full review on a large file produces a very large diff — it's better to refactor in small, reviewable passes.
- **Tell Copilot what NOT to change.** For example: "Do not change the function signatures — they are part of a public API used by external consumers."
- **Ask for the issues list first.** Before applying any changes, ask Copilot to "just list the issues found" so you can review and approve the scope.
- **One concern per commit.** After each refactor step, commit the change before moving to the next — this makes code review much easier.

---

## Refactor Checklist (Run Before Submitting a PR)

Use this checklist after a refactor to verify nothing was broken:

- [ ] All existing tests still pass (`pnpm test`)
- [ ] No new TypeScript errors (`pnpm tsc --noEmit`)
- [ ] No new lint errors (`pnpm lint`)
- [ ] The public API (exports, function signatures) is unchanged
- [ ] All changes are explained in the PR description
- [ ] No commented-out code was left in
- [ ] No `console.log` statements were left in
- [ ] No `any` types were introduced
