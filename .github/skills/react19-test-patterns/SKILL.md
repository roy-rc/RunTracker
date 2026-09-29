---
name: react19-test-patterns
description: 'Provides before/after patterns for migrating test files to React 19 compatibility, including act() imports, Simulate removal, and StrictMode call count changes.'
---

# React 19 Test Migration Patterns

Reference for all test file migrations required by React 19.

## Priority Order

Fix test files in this order; each layer depends on the previous:

1. **`act` import**  fix first, it unblocks everything else
2. **`Simulate` → `fireEvent`**  fix immediately after act
3. **Full react-dom/test-utils cleanup**  remove remaining imports
4. **StrictMode effect replay**  verify cleanup and observable behavior
5. **Async act wrapping**  for remaining "not wrapped in act" warnings
6. **Custom render helper**  verify once per codebase, not per test

---

## 1. act() Import Fix

```jsx
// Before  REMOVED in React 19:
import { act } from 'react-dom/test-utils';

// After:
import { act } from 'react';
```

If mixed with other test-utils imports:
```jsx
// Before:
import { act, Simulate, renderIntoDocument } from 'react-dom/test-utils';

// After  split the imports:
import { act } from 'react';
import { fireEvent, render } from '@testing-library/react'; // replaces Simulate + renderIntoDocument
```

---

## 2. Simulate → fireEvent

```jsx
// Before  Simulate REMOVED in React 19:
import { Simulate } from 'react-dom/test-utils';
Simulate.click(element);
Simulate.change(input, { target: { value: 'hello' } });
Simulate.submit(form);
Simulate.keyDown(element, { key: 'Enter', keyCode: 13 });

// After:
import { fireEvent } from '@testing-library/react';
fireEvent.click(element);
fireEvent.change(input, { target: { value: 'hello' } });
fireEvent.submit(form);
fireEvent.keyDown(element, { key: 'Enter', keyCode: 13 });
```

---

## 3. react-dom/test-utils Full API Map

| Old (react-dom/test-utils) | New location |
|---|---|
| `act` | `import { act } from 'react'` |
| `Simulate` | `fireEvent` from `@testing-library/react` |
| `renderIntoDocument` | `render` from `@testing-library/react` |
| `findRenderedDOMComponentWithTag` | `getByRole`, `getByTestId` from RTL |
| `findRenderedDOMComponentWithClass` | `getByRole` or `container.querySelector` |
| `scryRenderedDOMComponentsWithTag` | `getAllByRole` from RTL |
| `isElement`, `isCompositeComponent` | Remove  not needed with RTL |
| `isDOMComponent` | Remove |

---

## 4. StrictMode Effect Replay

React 19 `StrictMode` still runs an extra setup-cleanup-setup cycle for Effects in development when enabled at the root. This is intentional and exposes missing cleanup; do not change expected effect counts on the assumption that React 19 removed this behavior.

- Prefer assertions on user-visible behavior and resource cleanup over exact effect call counts.
- For subscriptions, timers, and geolocation watches, verify cleanup stops or removes the resource before the next setup and on unmount.
- Keep render-phase purity tests separate: StrictMode may call component render logic an extra time in development.
- Run the focused test with the repository's configured Vitest command. Do not use Jest-only flags such as `--watchAll` or `--testPathPattern`.
