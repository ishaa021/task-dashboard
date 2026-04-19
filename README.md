# Task Management Dashboard

This project is a responsive task management dashboard built with React, Vite, Tailwind CSS, Redux Toolkit, Firebase Authentication, and Local Storage persistence. The implementation is based on the provided dashboard-style Figma reference and focuses on matching the intended layout while keeping the code modular and maintainable.

## Live Demo

https://your-deployed-link.vercel.app

## Watch the demo here:

https://drive.google.com/file/d/18Tqf9cyes4av9OnCscT1dcGxycv1ktDJ/view?usp=sharing


## Approach

The app is structured around a small set of reusable UI components and a centralized Redux store.

- `App.jsx` coordinates authentication state, board rendering, drag-and-drop, and modal flow.
- Presentational concerns are split into focused components such as `Header`, `Sidebar`, `BoardToolbar`, `TaskColumn`, `TaskCard`, `ReminderBanner`, and `AddTaskModal`.
- Board data is managed in `src/features/board/boardSlice.js` using Redux Toolkit reducers and selectors.
- Authentication is managed in `src/features/auth/authSlice.js` using Firebase Authentication.
- Board state is persisted in Local Storage through `src/utils/localStorage.js`.

## Architecture Overview

The application follows a unidirectional data flow:

User Action → Component → Dispatch Action → Redux Slice → Store Update → UI Re-render → Local Storage Persistence

- Components handle UI and user interaction
- Redux (boardSlice) handles business logic and state updates
- Selectors derive filtered and computed data
- Local Storage persists per-user board data


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
- Delete tasks with immediate UI update and state synchronization


## Assumptions

- The provided design is the visual target, but some micro-details such as exact spacing, illustration assets, and certain icon behaviors may be interpreted if the Figma does not define them fully.
- New tasks are created in the `To Do` flow of the board experience.
- A task moved to `Done` should behave like a completed task in the UI.
- Local Storage is used only for per-user board persistence, not as a replacement for backend storage.
- Firebase Authentication is expected to be configured by the reviewer before login/signup is tested.
- The dashboard is intended as a frontend assignment project, so task data is seeded locally and then persisted in the browser per signed-in user.


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


