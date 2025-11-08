# Frontend TODOs

Keep it simple, consistent, and reusable.

## Must (Next)
- [x] Add HTTP error interceptor to centralize API errors
  - File: `src/app/shared/http/http-error.interceptor.ts`
  - Wire: provide in `AppModule` with `HTTP_INTERCEPTORS` (multi: true)
- [x] Remove debug logs
  - File: `src/app/meetings/meeting-detail.component.ts` (remove any `console.log`)
- [x] Empty state for notes
  - File: `src/app/meetings/meeting-detail.component.html`
  - Show 'No notes yet' when `!notesLoading && (!notes || notes.length === 0)`
- [x] Prevent duplicate summary generation
  - File: `src/app/meetings/meeting-detail.component.html/.ts`
  - Disable the 'Generate summary' button while `summary?.status === 'pending'` and during polling

## Styling Cleanup
- [ ] Keep Tag colors soft via global class
  - [x] Ensure both `<p-tag>` use `styleClass="tag--soft"`
  - [x] Remove any component-scoped Tag color overrides in `meetings-list.component.css`

## Accessibility
- [ ] Improve error banner semantics
  - File: `src/app/shared/components/error/error.component.html`
  - Add `role="alert"` and `aria-live="polite"`
- [ ] Mark invalid fields for screen readers
  - Files: `meetings-list.component.html`, `meeting-detail.component.html`
  - Bind `aria-invalid="true"` when invalid and add `aria-describedby` to link inputs to their `<p-message>`

## Consistent Copy
- [x] Unify error messages
  - Use: 'Could not load …', 'Could not create …', 'Could not add note', 'Could not start summary'

## Dev Checks
- [x] Lint and fix
  - Run: `cd frontend && npm run lint` (then `npm run lint:fix` as needed)
- [ ] Tests (lightweight)
  - Add specs for: service error -> Toast, submit with empty fields -> `<p-message>` rendered
  - Note: remove unused imports in `meetings-list.component.ts` to clear warnings

## Optional (Nice to Have)
- [ ] Reactive Forms for meetings list + detail note form
- [ ] Tiny `FormError` component wrapping `<p-message>` for reuse
- [ ] Disable actions based on form validity (template or reactive) and show inline summaries
