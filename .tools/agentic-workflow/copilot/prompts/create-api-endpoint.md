# Runbook: Create API Endpoint

> **Copy this prompt into Copilot Chat to generate a new REST API endpoint.**  
> Customise the parts in `<angle brackets>` before sending.

---

```
You are the Backend Agent.
Follow all conventions in /copilot/agents/backend-agent.md and /copilot/00-overview.md.

## Task

Create a new REST API endpoint.

## Requirements

- HTTP method: <GET | POST | PATCH | PUT | DELETE>
- URL path: `/api/<resource-name>[/:id]`
- Resource: `<ResourceName>` (e.g. User, Post, Comment)
- Purpose: <one-sentence description of what this endpoint does>
- Authentication required: <yes | no — if no, explain why>
- Authorisation rules: <who can call this? e.g. "admin only", "user can only access their own data">
- Request body fields: <list the fields with types, or say "ask me">
- Query parameters: <list any filters/pagination params, or "none">
- Success response: <what does it return on success?>
- Error cases: <list known error scenarios, or say "ask me">

## Steps to follow

1. Ask clarifying questions if any requirements above are marked "ask me" or are unclear.
2. Generate the zod validation schema for request body, params, and query.
3. Generate the route definition and add it to the appropriate router file.
4. Generate the controller method (thin — parse input, call service, send response).
5. Generate the service method (fat — business logic, database access, error throwing).
6. Generate the AppError cases for all known failure scenarios.
7. Generate the test file following the conventions in /copilot/agents/testing-agent.md.
8. Generate OpenAPI JSDoc comments on the controller method.
9. List any security considerations specific to this endpoint.

## Output format

Provide the output as separate code blocks, one per file, with the file path as a heading above each block.
Also provide a summary table of all error codes the endpoint can return.
```

---

## Example usage

Fill in the template:
- **Method:** `POST`
- **Path:** `/api/posts`
- **Resource:** `Post`
- **Purpose:** Creates a new blog post for the authenticated user.
- **Auth required:** Yes
- **Authorisation:** Any authenticated user can create a post for themselves.
- **Request body:** `title: string`, `content: string`, `tags?: string[]`, `isPublished?: boolean`
- **Query params:** none
- **Success response:** The created post object, status 201
- **Error cases:** Validation error (400), unauthenticated (401), title already exists for user (409)

---

## What Copilot will produce

1. `server/validators/postValidators.ts` — zod schema for request validation
2. `server/routes/posts.ts` — route registration
3. `server/controllers/PostController.ts` — controller method
4. `server/services/PostService.ts` — service method with business logic
5. `server/routes/__tests__/posts.test.ts` — integration tests
6. OpenAPI JSDoc on the controller
7. Security considerations list

---

## Tips

- Specify `@public` in your requirements if the endpoint doesn't need authentication — Copilot will remove the `authenticate` middleware and apply rate limiting instead.
- If you need pagination on a list endpoint, mention the expected query param format (`?page=1&limit=20&sort=createdAt:desc`).
- If there are complex authorisation rules (e.g. "admins can see all posts, users can only see their own"), describe them fully — the Backend Agent will implement them in the service layer.
- If the endpoint triggers a background job, event, or email, mention it — the agent will add the appropriate call with a `TODO` comment if the integration doesn't exist yet.
