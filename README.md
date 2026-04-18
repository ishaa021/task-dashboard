# Task Management Dashboard

This project is a responsive task management dashboard built with React, Vite, Tailwind CSS, Redux Toolkit, Firebase Authentication, and Local Storage persistence. The implementation is based on the provided dashboard-style Figma reference and focuses on matching the intended layout while keeping the code modular and maintainable.

## Approach

The app is structured around a small set of reusable UI components and a centralized Redux store.

- `App.jsx` coordinates authentication state, board rendering, drag-and-drop, and modal flow.
- Presentational concerns are split into focused components such as `Header`, `Sidebar`, `BoardToolbar`, `TaskColumn`, `TaskCard`, `ReminderBanner`, and `AddTaskModal`.
- Board data is managed in `src/features/board/boardSlice.js` using Redux Toolkit reducers and selectors.
- Authentication is managed in `src/features/auth/authSlice.js` using Firebase Authentication.
- Board state is persisted in Local Storage through `src/utils/localStorage.js`.


## Functionality Implemented

- Firebase email/password sign up and login
- Three task columns: `To Do`, `On Progress`, and `Done`
- Add new tasks from the dashboard
- Move tasks between columns with drag and drop
- Reorder tasks within the same column
- Filter tasks by priority
- Search tasks by title and description
- Task details such as due date, subtasks, comments, assignees, and activity log
- Reminder banner for due and overdue tasks
- Per-user board persistence with Local Storage

## State Management

Redux Toolkit is used for application state.

- `auth` slice stores the authenticated user, loading state, and auth errors
- `board` slice stores filters, columns, and tasks
- Selectors derive filtered tasks and reminder tasks
- The Redux store subscribes to changes and saves the board state to Local Storage for the current authenticated user

Only the board data is persisted locally, and it is scoped per authenticated Firebase user. Authentication is handled by Firebase session state.

## Assumptions

- The provided design is the visual target, but some micro-details such as exact spacing, illustration assets, and certain icon behaviors may be interpreted if the Figma does not define them fully.
- New tasks are created in the `To Do` flow of the board experience.
- A task moved to `Done` should behave like a completed task in the UI.
- Local Storage is used only for per-user board persistence, not as a replacement for backend storage.
- Firebase Authentication is expected to be configured by the reviewer before login/signup is tested.
- The dashboard is intended as a frontend assignment project, so task data is seeded locally and then persisted in the browser per signed-in user.

## Project Structure

```text
src/
  app/
    store.js
  components/
    AddTaskModal.jsx
    AuthScreen.jsx
    BoardToolbar.jsx
    Header.jsx
    ReminderBanner.jsx
    Sidebar.jsx
    TaskCard.jsx
    TaskColumn.jsx
  data/
    seedData.js
  features/
    auth/
      authSlice.js
    board/
      boardSlice.js
  lib/
    firebase.js
  utils/
    localStorage.js
```

## How To Run Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment variables

Create a `.env` file in the project root and add your Firebase configuration:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Enable Firebase Authentication

In your Firebase project:

- Open Firebase Console
- Go to `Authentication`
- Enable `Email/Password` sign-in

### 4. Start the development server

```bash
npm run dev
```

Open the local URL shown by Vite, typically:

```text
http://localhost:5173
```

## Build For Production

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Notes

- Board state is stored under the browser Local Storage key `task-dashboard-state`.
- Saved board data is namespaced per authenticated Firebase user so each account keeps its own dashboard tasks.
- Legacy stale board storage is cleaned up automatically, and older single-board saved data is migrated to the current signed-in user.
- The project uses `@hello-pangea/dnd` for drag-and-drop compatibility with the current React setup.

