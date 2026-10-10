# Student Task & Attendance Manager — Architecture

## 1. Architecture Overview

The application follows a client-server architecture.

The React frontend communicates with a Java backend through HTTP requests. The backend validates requests, applies business rules, and accesses MySQL through JDBC.

This document describes the intended architecture. It does not imply that every component has already been implemented.

## 2. Technology Stack

### Frontend

* React
* JavaScript (ES6+)
* Vite
* React Router
* CSS
* Fetch API
* Lucide React

### Backend

* Java
* Jakarta Servlets
* Apache Tomcat
* JDBC
* Maven

### Database

* MySQL

### Development Tools

* Visual Studio Code
* Git
* GitHub
* Postman
* MySQL Workbench

## 3. High-Level Architecture

Browser
|
v
React Frontend
|
v
HTTP Requests
|
v
Java Servlets
|
v
JDBC
|
v
MySQL Database

The backend returns responses to the frontend, which updates the UI.

## 4. Repository Structure

The frontend is initialized at the project root. Preserve this structure unless a deliberate change is required.

student-task-manager/
|
|-- docs/
|   |-- product.md
|   |-- architecture.md
|   |-- rules.md
|   |-- design.md
|
|-- public/
|
|-- src/
|   |-- assets/
|   |
|   |-- components/
|   |   |-- Navbar.jsx
|   |   |-- Sidebar.jsx
|   |   |-- StatCard.jsx
|   |
|   |-- layouts/
|   |   |-- MainLayout.jsx
|   |
|   |-- pages/
|   |   |-- Dashboard.jsx
|   |   |-- Subjects.jsx
|   |   |-- Attendance.jsx
|   |   |-- Tasks.jsx
|   |   |-- Profile.jsx
|   |
|   |-- services/
|   |   |-- api.js
|   |
|   |-- App.jsx
|   |-- main.jsx
|   |-- index.css
|
|-- index.html
|-- package.json
|-- vite.config.js
|-- .gitignore

The backend will be added separately when backend initialization begins.

backend/
|
|-- pom.xml
|-- src/
|-- main/
|-- java/
|-- webapp/

Additional frontend files, such as NotesLibrary.jsx or SharedAssignments.jsx, may be introduced when required. Update this document when the actual structure changes.

## 5. Frontend Responsibilities

### components/

Contains reusable UI components.

Examples:

* Navbar.jsx
* Sidebar.jsx
* StatCard.jsx

### layouts/

Contains shared layouts used across application pages.

Example:

* MainLayout.jsx

### pages/

Contains page-level components.

Examples:

* Dashboard.jsx
* Subjects.jsx
* Attendance.jsx
* Tasks.jsx
* Profile.jsx

Additional pages may be introduced for notes and shared assignments.

### services/

Contains API communication logic.

Example:

* api.js

### App.jsx

Defines application routes.

### main.jsx

Initializes the React application.

### index.css

Contains global styles, design tokens, and shared CSS rules.

## 6. Main Data Entities

### Student

* student_id
* name
* email

Authentication must be implemented before these records can be treated as verified identities.

### Subject

* subject_id
* student_id
* subject_name

### Attendance

* attendance_id
* subject_id
* total_classes
* attended_classes

### Task

* task_id
* owner_student_id
* subject_id
* title
* description
* due_date
* priority
* completed

### Assignment Share

* share_id
* task_id
* shared_by_student_id
* shared_with_student_id
* shared_at

A share records the relationship between an assignment and its recipient.

When the recipient copies an assignment, create a separate task owned by the recipient.

The recipient's completion status and personal deadline must remain independent of the original task.

### Note Folder

* folder_id
* owner_student_id
* subject_id
* parent_folder_id
* folder_name
* folder_type

The folder hierarchy supports subject and unit organization.

### Note

* note_id
* owner_student_id
* folder_id
* title
* original_filename
* storage_key
* mime_type
* file_size
* created_at

The exact database schema and foreign-key relationships must be finalized before writing SQL migrations.

## 7. Planned API Endpoints

These endpoints are planned contracts, not evidence of implemented backend functionality.

### Subjects

GET /api/subjects

POST /api/subjects

DELETE /api/subjects/{id}

### Attendance

GET /api/attendance

PUT /api/attendance/{subjectId}

### Tasks

GET /api/tasks

POST /api/tasks

PUT /api/tasks/{id}

DELETE /api/tasks/{id}

### Assignment Sharing

POST /api/tasks/{id}/shares

GET /api/shares/sent

GET /api/shares/received

POST /api/shares/{shareId}/copy

### Notes

GET /api/note-folders

POST /api/note-folders

GET /api/notes

POST /api/notes

GET /api/notes/{id}/download

DELETE /api/notes/{id}

The endpoints must be implemented before the frontend depends on them.

## 8. File Storage

MySQL stores note metadata.

Uploaded file contents should be stored in controlled server-side storage or an explicitly selected object-storage service.

The database should reference a generated storage key rather than trusting a user-supplied filesystem path.

The backend must validate access before allowing a file to be viewed or downloaded.

Do not store PDF contents in browser localStorage.

## 9. Security and Ownership

* Validate identity and authorization on the backend.
* Prevent access to another user's private tasks or notes.
* Validate assignment-sharing permissions.
* Use parameterized JDBC statements.
* Keep database credentials out of frontend code and Git.
* Validate uploaded file types and sizes.
* Generate safe storage filenames.
* Do not rely on frontend checks for security.

## 10. Development Sequence

1. Verify the React application and Git repository.
2. Maintain project documentation.
3. Build the application layout and navigation.
4. Implement the dashboard.
5. Implement subjects, attendance, and tasks.
6. Implement the Notes Library.
7. Implement assignment sharing.
8. Create the Java backend and MySQL schema.
9. Connect the frontend through services/api.js.
10. Test persistence, authorization, validation, and errors.
11. Run lint and production build checks.

## 11. Source of Truth

The actual repository and verified command outputs determine what exists.

This document records the intended architecture. Update it when implementation decisions change.

Never claim that a component, endpoint, database, or feature exists until it has been verified.
