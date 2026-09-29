---
name: runtracker-test-gap-audit
description: Use when assessing whether RunTracker's MVP behavior and regression risks have adequate tests; this is a read-only audit.
---

# RunTracker Test Gap Audit

## Guardrails

- Read-only: do not edit code, add tests, install dependencies, or run commands that write files.
- Inspect the repository's actual source, test configuration, scripts, and existing tests before drawing conclusions. Do not infer package versions or test conventions from project plans alone.
- Treat unmatched files and coverage heuristics as leads, not findings. Confirm each gap against behavior and existing direct or end-to-end coverage.
- Never use live GPS, real coordinates, private route data, or live Google API calls during test inspection or verification.

## Audit priorities

Trace tests for the following MVP risks where the corresponding behavior exists:

- Pure distance, pace, elapsed-time, splits, and checkpoint calculations, including edge cases.
- Run state transitions: start, pause, resume, finish idempotency, and cleanup of timers and geolocation watches.
- Local Dexie persistence, schema changes, reload behavior, and the rule against storing complete GPS tracks.
- Google Routes service boundaries, walking-only routing, and loading, error, empty, and retry states.
- Primary mobile user workflows and the foreground-only GPS limitation.

## Method

1. Establish the actual stack and runner from manifests and config; inspect the package scripts and CI checks.
2. Map each high-risk behavior to its owning implementation and direct tests, then check for higher-level workflow coverage.
3. Separate confirmed missing coverage from indirect or uncertain coverage. Do not equate file coverage or test counts with behavior coverage.
4. Recommend the smallest reliable test level and concrete scenarios/assertions. Prefer unit tests for pure domain rules, component tests for UI behavior, and Playwright for critical user workflows.

## Report

Return a concise, read-only report with scope, checks run, confirmed gaps prioritized by impact, evidence paths, confidence for inferred gaps, and specific test scenarios to add. State what was not inspected or could not be verified; do not claim a full audit after a shallow scan.
