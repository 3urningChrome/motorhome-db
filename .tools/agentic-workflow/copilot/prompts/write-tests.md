# Runbook: Write Tests

> **Copy this prompt into Copilot Chat to generate tests for existing code.**  
> Select the file to test in VS Code or reference it by path before sending.

---

```
You are the Testing Agent.
Follow all conventions in /copilot/agents/testing-agent.md and /copilot/00-overview.md.

## Task

Write tests for the following file: `<path/to/file.ts>`

## Requirements

- Use Vitest and @testing-library/react (for components).
- Follow all patterns in /copilot/agents/testing-agent.md.
- Place the test file at `<path/to/__tests__/file.test.ts>`.

## Scope

<Choose one or more, or say "full coverage">
- [ ] Happy path(s)
- [ ] All error cases
- [ ] Edge cases (empty, null, boundary values)
- [ ] Loading / async states (for components and hooks)
- [ ] Full coverage — all of the above

## Additional context

- Is there existing test infrastructure I should match? <yes/no — if yes, reference a test file>
- Are there factories or helpers I should use? <describe or say "create them">
- Are there external dependencies that need mocking? <list them, or say "identify them">

## Steps to follow

1. Read and understand the file being tested — identify all exported functions/components/hooks.
2. List ALL test cases before writing any code:
   - Happy path(s)
   - Each error case
   - Edge cases
   - Async/loading states (for components/hooks)
3. Set up mocks for all external dependencies.
4. Create test factories for any complex data structures.
5. Write the tests following the templates in testing-agent.md.
6. Verify that each test description reads like a specification.
7. Note any gaps in testability and suggest improvements.

## Output format

Provide:
1. A list of all test cases (before any code)
2. The complete test file, ready to copy-paste
3. Any factory files needed
4. Notes on gaps in testability
```

---

## Example usage

Open `src/features/auth/services/AuthService.ts` and send:

```
You are the Testing Agent.
Follow /copilot/agents/testing-agent.md and /copilot/00-overview.md.

Write tests for the selected file.
Place the test file at src/features/auth/services/__tests__/AuthService.test.ts.

Scope: Full coverage — happy path, all error cases, and edge cases.

The database (db) should be mocked using vi.mock.
Use createMockUser from @/test/factories/userFactory if it exists, otherwise create it.
```

---

## Tips

- **Run existing tests first** so you know what's already covered: `pnpm test --coverage`.
- **Ask for the test case list first.** Before writing any code, ask Copilot to "list all the test cases you would write" — this lets you review scope before code is generated.
- **Provide context about external dependencies.** The Testing Agent needs to know what to mock (database, external API, logger, auth).
- **Reference existing test files** to ensure style consistency. For example: "Match the style of `src/features/users/__tests__/UserService.test.ts`."
- **If a function is hard to test,** the Testing Agent will flag it and suggest a refactor — this is a feature, not a bug. Testability is a proxy for good design.

---

## Test Coverage Targets (Reference)

| Code area | Target | Notes |
|---|---|---|
| Service logic | 90%+ | Most important — pure business logic |
| Controllers | 80%+ | Test via integration-style tests with supertest |
| React components | 80%+ | Focus on logic paths, not every CSS class |
| Pure utility functions | 100% | No excuse not to |
| React hooks | 85%+ | Use renderHook from @testing-library/react |
| E2E critical flows | 100% | Login, checkout, core user journey |

---

## Anatomy of a Good Test

```ts
it('<does something> when <condition>', async () => {
  // 1. Arrange — set up the world
  const user = createMockUser({ role: 'admin' });
  mockDb.user.findUnique.mockResolvedValue(user);

  // 2. Act — do the thing
  const result = await UserService.getUser({ id: user.id, requesterId: user.id });

  // 3. Assert — verify the outcome
  expect(result.id).toBe(user.id);
  expect(result.name).toBe(user.name);
});
```

Every test should have exactly these three sections, clearly separated.  
If you can't write a clear "Act" step, the function under test probably does too much.
