# Runbook: Generate Component

> **Copy this prompt into Copilot Chat to generate a new React component.**  
> Customise the parts in `<angle brackets>` before sending.

---

```
You are the Frontend Agent.
Follow all conventions in /copilot/agents/frontend-agent.md and /copilot/00-overview.md.

## Task

Generate a new React component called `<ComponentName>`.

## Requirements

- Feature: `<feature-name>` (maps to /src/features/<feature-name>/components/)
- Purpose: <one-sentence description of what this component does>
- Props it receives: <list the props, or say "ask me">
- States it must handle: loading | error | empty | <any other states>
- Data source: <"receives data as props" | "fetches its own data using React Query">
- Reusable across features: <yes | no>

## Steps to follow

1. Ask clarifying questions if any requirements above are marked "ask me" or are unclear.
2. Generate the TypeScript props interface.
3. Generate the component following the template in frontend-agent.md.
4. Generate a loading skeleton variant (if the component displays async data).
5. Generate the test file following the conventions in /copilot/agents/testing-agent.md.
6. Generate JSDoc comments on the component and each prop.
7. List any accessibility improvements, edge cases, or follow-up suggestions.

## Output format

Provide the output as separate code blocks, one per file, with the file path as a heading above each block.
```

---

## Example usage

Paste the prompt above and fill in:
- **ComponentName:** `UserProfileCard`
- **Feature:** `user-profiles`
- **Purpose:** Displays a user's avatar, name, job title, and a link to their full profile.
- **Props:** `user: User`, `isLoading?: boolean`, `onViewProfile: (userId: string) => void`
- **States:** loading, error, data present
- **Data source:** receives data as props
- **Reusable:** yes

---

## What Copilot will produce

1. `src/features/user-profiles/components/UserProfileCard.tsx` — the component
2. `src/features/user-profiles/components/UserProfileCardSkeleton.tsx` — loading state
3. `src/features/user-profiles/components/__tests__/UserProfileCard.test.tsx` — tests
4. JSDoc on all exported members
5. Suggestions for accessibility, edge cases, and improvements

---

## Tips

- If you want a list component that renders multiple instances of this component, mention it in the prompt.
- If the component needs to integrate with a specific Zustand store or React Query hook, mention it.
- If you already have a similar component to use as a style reference, tell Copilot which file to match.
- Copilot will follow the patterns in `frontend-agent.md` exactly — if you want to deviate, say so explicitly.
