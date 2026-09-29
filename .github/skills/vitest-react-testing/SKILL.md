---
name: vitest-react-testing
description: Use when writing or reviewing Vitest tests for RunTracker's TypeScript domain logic, React UI, browser APIs, persistence, or Google service boundaries.
---

# RunTracker Vitest Testing

## Scope

Use the repository's installed Vitest and existing test environment. Do not assume package versions, setup files, scripts, or add dependencies without checking the project first.

## Domain tests

- Keep distance, pace, elapsed-time, splits, and checkpoint behavior in pure unit tests where possible.
- Cover boundaries, invalid inputs, rounding, and state transitions.
- Use deterministic timestamps and mocked positions; never persist complete GPS tracks.

## React tests

- Test user-visible behavior with the existing React Testing Library setup.
- Prefer accessible roles and labels and realistic user interactions.
- Cover loading, error, empty, retry, and success states when present.
- Test pause/resume and finish behavior through the UI or owning abstraction, including that pause stops both time and location updates and finish is idempotent.

## Boundaries and cleanup

- Use `vi` APIs, not Jest APIs. Mock geolocation and Google services at their boundary; never make live API calls or use actual location data in tests.
- Use the existing IndexedDB test setup for Dexie tests. Do not introduce a new database mock or dependency without a demonstrated need.
- Restore mocks, timers, subscriptions, and geolocation watches during cleanup.
- React 19 StrictMode can replay Effects in development. Assert observable behavior and correct cleanup rather than brittle raw call counts.
- Follow the configured runner command and test-file naming from the repository; do not assume Jest CLI options.
