---
name: runtracker-pwa-playwright
description: Use when verifying RunTracker user workflows in a browser with the project's existing Playwright setup or browser tools.
---

# RunTracker PWA Browser Testing

## Before testing

- Inspect the existing Playwright configuration, test scripts, fixtures, and local server setup first. Reuse them; do not install packages or invent commands.
- If no Playwright runner is configured, report that setup gap and do not claim automated E2E coverage or install it silently. Browser-tool verification is a separate check.
- Use deterministic test data and an isolated browser profile or the repository's existing IndexedDB reset helper.
- Keep the app in the foreground. The MVP does not promise background GPS tracking or offline Google Maps.

## External boundaries and privacy

- Stub Google Routes responses and browser geolocation. Never call live Google APIs, use real GPS, or include real coordinates or private routes in fixtures, screenshots, logs, or reports.
- Use synthetic locations only. Do not persist complete GPS tracks during browser tests.
- Do not expose API keys in test output or screenshots.

## Workflow coverage

- Verify route-planning success and its loading, empty, error, and retry states using stubbed service responses.
- Verify starting, pausing, resuming, and finishing a run; pause must stop the clock and location watch, and repeated finish actions must not duplicate the saved summary.
- Verify saved routes and completed summaries survive a reload where persistence is part of the workflow; confirm no complete track is stored.
- Check the primary mobile viewport and keyboard-accessible controls without treating screenshots as a substitute for behavior assertions.

## Execution and evidence

- Run only the focused browser tests needed for the requested change, using the existing project command and server configuration.
- Capture failure evidence only with synthetic data. Do not leave screenshots, traces, browser profiles, or test data in tracked locations unless the repository already expects those artifacts.
- Report the browser, viewport, flows, and checks actually run. State clearly when credentials, a real device, or an external API were not tested.
