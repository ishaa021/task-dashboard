import { seedBoardState } from '../data/seedData';

const STORAGE_KEY = 'task-dashboard-state';
const LEGACY_STORAGE_KEYS = ['task-dashboard-board'];
const STORAGE_VERSION = 2;
const defaultBoardState = {
  ownerId: null,
  filters: {
    priority: 'all',
    search: '',
  },
  columns: {
    todo: {
      id: 'todo',
      taskIds: [],
    },
    inProgress: {
      id: 'inProgress',
      taskIds: [],
    },
    done: {
      id: 'done',
      taskIds: [],
    },
  },
  tasks: {},
};

function normalizeBoardState(boardState, ownerId = null) {
  if (!boardState) {
    return undefined;
  }

  const rawTasks = boardState.tasks || {};
  const normalizedColumns = {
    todo: {
      ...defaultBoardState.columns.todo,
      ...boardState.columns?.todo,
    },
    inProgress: {
      ...defaultBoardState.columns.inProgress,
      ...boardState.columns?.inProgress,
    },
    done: {
      ...defaultBoardState.columns.done,
      ...boardState.columns?.done,
    },
  };

  const referencedTaskIds = new Set(
    Object.values(normalizedColumns).flatMap((column) => column.taskIds || []),
  );

  const prunedTasks = Object.fromEntries(
    Object.entries(rawTasks).filter(([taskId]) => referencedTaskIds.has(taskId)),
  );

  return {
    ...defaultBoardState,
    ...boardState,
    ownerId,
    filters: {
      ...defaultBoardState.filters,
      ...boardState.filters,
    },
    columns: {
      todo: {
        ...normalizedColumns.todo,
        taskIds: (normalizedColumns.todo.taskIds || []).filter((taskId) => rawTasks[taskId]),
      },
      inProgress: {
        ...normalizedColumns.inProgress,
        taskIds: (normalizedColumns.inProgress.taskIds || []).filter((taskId) => rawTasks[taskId]),
      },
      done: {
        ...normalizedColumns.done,
        taskIds: (normalizedColumns.done.taskIds || []).filter((taskId) => rawTasks[taskId]),
      },
    },
    tasks: prunedTasks,
  };
}

function createSeedBoardState(ownerId) {
  return normalizeBoardState(seedBoardState, ownerId);
}

function readStoredState() {
  LEGACY_STORAGE_KEYS.forEach((key) => window.localStorage.removeItem(key));
  const serializedState = window.localStorage.getItem(STORAGE_KEY);

  if (!serializedState) {
    return null;
  }

  const parsedState = JSON.parse(serializedState);

  if (parsedState?.version === STORAGE_VERSION) {
    return {
      version: STORAGE_VERSION,
      boardsByUser: parsedState.boardsByUser || {},
    };
  }

  if (parsedState?.board) {
    return {
      version: 1,
      legacyBoard: parsedState.board,
    };
  }

  return {
    version: 1,
    legacyBoard: parsedState,
  };
}

export function loadAppState() {
  return undefined;
}

export function loadBoardStateForUser(userId) {
  if (typeof window === 'undefined' || !userId) {
    return createSeedBoardState(userId);
  }

  try {
    const storedState = readStoredState();

    if (!storedState) {
      return createSeedBoardState(userId);
    }

    if (storedState.version === STORAGE_VERSION) {
      return (
        normalizeBoardState(storedState.boardsByUser[userId], userId) || createSeedBoardState(userId)
      );
    }

    return normalizeBoardState(storedState.legacyBoard, userId) || createSeedBoardState(userId);
  } catch (error) {
    console.error('Failed to load board state:', error);
    return createSeedBoardState(userId);
  }
}

export function saveAppState(state) {
  if (typeof window === 'undefined') {
    return;
  }

  const userId = state.auth.currentUser?.id;

  if (!userId || state.board.ownerId !== userId) {
    return;
  }

  try {
    const storedState = readStoredState();
    const boardsByUser = storedState?.version === STORAGE_VERSION ? storedState.boardsByUser : {};

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: STORAGE_VERSION,
        boardsByUser: {
          ...boardsByUser,
          [userId]: state.board,
        },
      }),
    );
  } catch (error) {
    console.error('Failed to save app state:', error);
  }
}
