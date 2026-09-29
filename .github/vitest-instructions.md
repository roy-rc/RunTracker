---
description: "Guidelines for Vitest tests in the RunTracker React and TypeScript PWA"
applyTo: '**/*.{test,spec}.{js,jsx,ts,tsx}'
---

# Vitest Testing Guidelines

## Test design
- Use Vitest, following the existing project configuration and file naming conventions.
- Cover new behavior, edge cases, and error states; prefer pure unit tests for domain calculations and state transitions.
- For React components, test user-visible behavior with the project's existing Testing Library setup.
- Mock browser APIs and external services at their boundary. Never call live Google APIs or use real GPS in tests.
- Use mocked positions only, and never persist complete GPS tracks in tests.
- Verify that pausing stops both elapsed-time updates and location tracking, and that finishing a session is idempotent.
- Keep tests independent of implementation details and do not change production code solely to make it easier to test.

## Vitest conventions
- Use `vi` APIs for mocks, spies, and timers; do not use Jest APIs such as `jest.mock` or `jest.setTimeout`.
- Restore mocks and timers after each test using the existing project setup.
- Prefer focused assertions for loading, error, empty, retry, and success states.
- Do not add dependencies or assume a test environment that is not already configured.
