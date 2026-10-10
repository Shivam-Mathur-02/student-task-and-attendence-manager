# Student Task & Attendance Manager — Development Rules

## 1. Project Integrity

* Follow the agreed repository structure.
* Use React with JavaScript, not TypeScript.
* Do not move or rename files without a clear reason.
* Inspect existing code before modifying it.
* Do not claim a feature is implemented unless it has been verified.
* Keep documentation synchronized with actual decisions.
* Never invent completed work, test results, or project files.

## 2. Time Management

* Target completion time: approximately 10 hours.
* Prioritize the working MVP.
* Build one feature at a time.
* Test each feature immediately after implementation.
* Avoid unnecessary refactoring.
* Reserve time for final testing and production builds.
* Clearly identify incomplete features.

## 3. JavaScript Rules

* Use modern ES6+ syntax.
* Prefer const by default.
* Use let when reassignment is required.
* Avoid var.
* Use meaningful names.
* Keep functions focused.
* Handle errors explicitly.
* Avoid unnecessary dependencies.

## 4. React Rules

* Use functional components.
* Use React hooks appropriately.
* Keep components focused on clear responsibilities.
* Pass data and callbacks through props.
* Do not mutate React state directly.
* Use stable keys for lists.
* Keep reusable components in src/components/.
* Keep page-level components in src/pages/.
* Keep API calls in src/services/api.js.
* Avoid putting the entire application into one component.

## 5. Naming Conventions

React components and component files:
PascalCase

Examples:

* Dashboard.jsx
* Sidebar.jsx
* MainLayout.jsx

Variables and functions:
camelCase

Examples:

* calculateAttendance()
* handleTaskSubmit()

CSS classes:
kebab-case

Examples:

* dashboard-card
* attendance-progress

## 6. Attendance Rules

Attendance percentage:

(attended_classes / total_classes) * 100

Rules:

* Values must be non-negative integers.
* Attended classes cannot exceed total classes.
* If total classes are zero, display 0%.
* Attendance must remain between 0% and 100%.
* The initial warning threshold is 75%.
* Keep the threshold configurable.

## 7. Task Rules

* Every task must have a non-empty title.
* Tasks may be associated with subjects.
* Due dates are optional unless explicitly required.
* Priorities must use consistent values.
* Completion status must be boolean.
* Completed tasks must not count as pending.
* Dashboard statistics must reflect actual task data.

## 8. Assignment Sharing Rules

* Genuine cross-user sharing requires registered user identities and a shared backend.
* Validate that the sender owns or has permission to share the assignment.
* Validate the recipient on the backend.
* Do not expose private assignments to unauthorized users.
* Keep Shared with Me and Shared by Me separate.
* Copying an assignment creates a separately owned task.
* Recipient changes must not modify the sender's original task.
* Do not describe a frontend-only simulation as genuine multi-user sharing.

## 9. Notes Library Rules

* Organize notes by subject and unit.
* Store file metadata separately from file contents.
* Do not store PDF contents in localStorage.
* Validate upload types and sizes on the backend.
* Generate safe storage names.
* Do not trust user-supplied file paths.
* Check permissions for viewing, downloading, and deleting notes.
* Clearly identify upload functionality that is still incomplete.

## 10. Styling Rules

* Keep global styling in src/index.css.
* Follow docs/design.md.
* Use consistent spacing and typography.
* Avoid unnecessary inline styles.
* Maintain readable contrast.
* Support mobile and desktop layouts.
* Avoid horizontal overflow.
* Use semantic HTML and accessible labels.
* Provide accessible names for icon-only buttons.

## 11. API and Backend Rules

* Centralize API calls in src/services/api.js.
* Handle loading, success, empty, and error states.
* Validate input on both frontend and backend.
* Never rely on client-side validation for security.
* Use parameterized SQL statements through JDBC.
* Keep credentials outside frontend code.
* Never commit database credentials.
* Use consistent HTTP status codes and response formats.
* Keep implemented endpoints aligned with docs/architecture.md.

## 12. Git Rules

* Commit at meaningful working milestones.
* Use clear commit messages.
* Never commit .env files, passwords, or database credentials.
* Exclude node_modules/ and dist/.
* Check git status before committing.
* Never reset or overwrite work without understanding the consequences.

## 13. Definition of Done

A feature is complete only when:

1. Its primary workflow works.
2. Inputs are validated.
3. Relevant errors are handled.
4. The UI updates correctly.
5. Persistence has been tested.
6. Access control has been tested where applicable.
7. No obvious regression has been introduced.
8. Relevant lint and build checks pass.
9. Documentation reflects material changes.
