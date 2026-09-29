# RunTracker Copilot Instructions

## Project

RunTracker is a personal mobile-first PWA for planning and running routes.
The MVP has no backend, authentication, synchronization, social features,
background notifications, or offline Google Maps.

## Stack

- React
- TypeScript with strict mode
- Vite
- Dexie and IndexedDB
- Google Maps JavaScript API
- Google Routes API
- vite-plugin-pwa
- Vitest
- Playwright

## Architecture

- Keep domain logic independent from React and Google APIs.
- Use feature-oriented modules.
- Keep external APIs behind typed services.
- Prefer pure functions for distance, pace, time, and checkpoint logic.
- Do not put business logic directly in JSX components.

## Data privacy

- Do not persist the complete GPS track.
- Store routes and completed session summaries locally.
- Do not add a backend, analytics, telemetry, or cloud synchronization.
- Do not log coordinates, API keys, or private route data.

## Google APIs

- Use Google Maps to display data returned by Google Routes.
- Use walking routes only for the MVP.
- Do not add Places, Geocoding, Roads, or unrelated Google APIs.
- Never hardcode secrets.
- Preserve loading, error, empty, and retry states.

## GPS

- The user must be informed that GPS distance and pace are approximate.
- The app must work with the app open and in the foreground.
- Pausing must stop the clock and GPS tracking.
- Finishing a session must be idempotent.

## Testing

- Use Vitest as the test framework.
- Write tests for all new features and bug fixes.
- Cover edge cases and error handling.
- Do not change production code to make testing easier; adapt tests instead.
- For domain logic (Haversine, pace, splits, checkpoint detection), prefer pure functions and unit tests.
- For React components, use Testing Library patterns compatible with React 18/19.
- Do not persist complete GPS tracks in tests; use mocked positions only.

## Quality

- Add or update tests for every domain behavior.
- Run lint, typecheck, unit tests, and build after significant changes.
- Do not introduce dependencies without explaining why they are needed.
- Before modifying architecture, inspect the existing code and summarize the impact.
