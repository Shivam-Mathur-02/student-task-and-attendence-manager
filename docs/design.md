# Student Task & Attendance Manager — UI Design Specification

## 1. Design Goal

Create a modern, clear, responsive academic dashboard for managing subjects, attendance, tasks, shared assignments, and unit-wise study notes.

## 2. Design Principles

* Prioritize clarity and fast navigation.
* Use consistent spacing and typography.
* Prefer simple, readable cards.
* Make important academic status easy to identify.
* Avoid unnecessary animations and decorative clutter.
* Support keyboard and touch interaction.

## 3. Color Palette

Primary:
#4F46E5

Primary Hover:
#4338CA

Page Background:
#F8FAFC

Card Background:
#FFFFFF

Primary Text:
#0F172A

Secondary Text:
#64748B

Border:
#E2E8F0

Success:
#16A34A

Warning:
#D97706

Danger:
#DC2626

Use these values as the initial design tokens in src/index.css.

## 4. Application Layout

### Desktop

* Sidebar on the left.
* Main content area on the right.
* Page heading near the top.
* Responsive dashboard card grid.
* Consistent borders, radii, and spacing.

### Mobile

* Collapsible sidebar or mobile navigation.
* Vertically stacked dashboard cards.
* Forms that fit the viewport.
* Responsive tables or card layouts.
* No unnecessary horizontal scrolling.

## 5. Main Navigation

Primary navigation:

1. Dashboard
2. Subjects
3. Attendance
4. Tasks & Assignments
5. Notes Library
6. Profile

Tasks & Assignments includes:

* My Tasks
* Shared with Me
* Shared by Me

Use Lucide React icons consistently.

The active route must be visually distinct.

## 6. Dashboard

Display:

* Welcome heading.
* Total subjects.
* Overall attendance.
* Pending tasks.
* Completed tasks.
* Attendance overview by subject.
* Upcoming tasks.
* Low-attendance warnings.

Dashboard statistics must be calculated from actual application data.

## 7. Subjects Page

Display:

* Subject name.
* Attendance summary.
* Relevant actions.

Include:

* Add Subject button.
* Subject list or card grid.
* Validation messages.
* Empty state.
* Confirmation for destructive actions when related records may be affected.

## 8. Attendance Page

Display:

* Subject name.
* Attended classes.
* Total classes.
* Attendance percentage.
* Progress bar.
* Low-attendance warning.

Use both progress indicators and text labels.

## 9. Tasks and Assignments

### My Tasks

Display:

* Task title.
* Subject.
* Due date.
* Priority.
* Completion status.

Provide actions to create, complete, and delete tasks.

### Shared by Me

Display:

* Assignment title.
* Recipient.
* Sharing information where available.

### Shared with Me

Display:

* Assignment title.
* Sender.
* Subject.
* Relevant details.
* Copy to My Tasks action.

Make it clear that copying an assignment creates an independent task.

Do not imply that cross-account sharing works until the backend supports it.

## 10. Notes Library

Use a folder and breadcrumb pattern:

Notes Library → Subject → Unit → Notes

Display:

* Subject name.
* Unit name.
* Note title.
* Original filename.
* File type and size when available.
* Upload date when available.
* View or download action.
* Delete action when authorized.

Provide:

* An upload action.
* Empty states for subjects and units without notes.
* Clear success and error messages.
* Search controls if time permits.

The interface must not imply that file uploads work until actual storage and retrieval have been implemented.

## 11. Forms and Feedback

* Every input must have a visible label.
* Place validation messages near relevant inputs.
* Prevent invalid submissions.
* Show loading states where necessary.
* Provide success and error feedback.
* Confirm destructive actions.
* Make empty states helpful.

## 12. Accessibility

* Use semantic HTML.
* Label form controls.
* Provide accessible names for icon-only buttons.
* Maintain readable contrast.
* Support keyboard navigation.
* Make focus indicators visible.
* Do not communicate status through color alone.

## 13. Responsive Testing

Test at approximately:

* Mobile: 375px
* Tablet: 768px
* Desktop: 1280px

## 14. Acceptance Criteria

* Navigation works consistently.
* The active page is identifiable.
* Dashboard cards align correctly.
* Forms are usable.
* Attendance warnings are understandable.
* Notes can be navigated by subject and unit.
* Shared assignment views distinguish sender and recipient.
* Empty, loading, success, and error states are handled where relevant.
* The application does not claim functionality that has not been implemented.
