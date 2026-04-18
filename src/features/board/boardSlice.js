import { createSelector, createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { seedBoardState } from '../../data/seedData';

const normalizeTask = (task, columnId = task.columnId) => {
  const resolvedColumnId = columnId || 'todo';
  const resolvedPriority = task.priority || 'low';
  const basePriority =
    task.basePriority || (resolvedPriority === 'completed' ? 'low' : resolvedPriority);

  return {
    ...task,
    columnId: resolvedColumnId,
    priority: resolvedColumnId === 'done' ? 'completed' : basePriority,
    basePriority,
    dueDate: task.dueDate || '',
    reminderEnabled: Boolean(task.reminderEnabled),
    comments: typeof task.comments === 'number' ? task.comments : 0,
    files: typeof task.files === 'number' ? task.files : 0,
    assignees: Array.isArray(task.assignees) ? task.assignees : [],
    subtasks: Array.isArray(task.subtasks) ? task.subtasks : [],
    activityLog: Array.isArray(task.activityLog) ? task.activityLog : [],
  };
};

const initialState = {
  ownerId: null,
  ...seedBoardState,
  tasks: Object.fromEntries(
    Object.entries(seedBoardState.tasks).map(([taskId, task]) => [
      taskId,
      normalizeTask(task, task.columnId),
    ]),
  ),
};

const columnTitles = {
  todo: 'To Do',
  inProgress: 'On Progress',
  done: 'Done',
};

const createActivityEntry = ({ type, message, meta = {} }) => ({
  id: uuidv4(),
  type,
  message,
  meta,
  timestamp: new Date().toISOString(),
});

const ensureTaskShape = (task) => {
  if (!task.basePriority) {
    task.basePriority = task.priority === 'completed' ? 'low' : task.priority || 'low';
  }

  if (!task.subtasks) {
    task.subtasks = [];
  }

  if (!task.activityLog) {
    task.activityLog = [];
  }
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    hydrateBoard(state, action) {
      return {
        ...action.payload,
        tasks: Object.fromEntries(
          Object.entries(action.payload.tasks || {}).map(([taskId, task]) => [
            taskId,
            normalizeTask(task, task.columnId),
          ]),
        ),
      };
    },
    updateFilters(state, action) {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    addTask: {
      reducer(state, action) {
        const { columnId, task } = action.payload;
        ensureTaskShape(task);
        state.tasks[task.id] = task;
        state.columns[columnId].taskIds.unshift(task.id);
      },
      prepare({ columnId, title, description, priority, dueDate, reminderEnabled }) {
        const id = uuidv4();
        const normalizedPriority = priority || 'low';
        const commentsMap = {
          low: 0,
          high: 0,
          completed: 0,
        };
        const filesMap = {
          low: 0,
          high: 0,
          completed: 0,
        };

        return {
          payload: {
            columnId,
            task: {
              id,
              title,
              description,
              priority: normalizedPriority,
              basePriority: normalizedPriority,
              comments: commentsMap[normalizedPriority] ?? 5,
              files: filesMap[normalizedPriority] ?? 1,
              assignees: ['AB', 'RS'],
              columnId,
              dueDate: dueDate || '',
              reminderEnabled: Boolean(reminderEnabled),
              subtasks: [],
              activityLog: [
                createActivityEntry({
                  type: 'task-created',
                  message: `Task created in ${columnTitles[columnId]}.`,
                }),
              ],
            },
          },
        };
      },
    },
    deleteTask(state, action) {
      const { taskId } = action.payload;
      const task = state.tasks[taskId];

      if (!task) {
        return;
      }

      state.columns[task.columnId].taskIds = state.columns[task.columnId].taskIds.filter(
        (id) => id !== taskId,
      );
      delete state.tasks[taskId];
    },
    addSubtask: {
      reducer(state, action) {
        const { taskId, subtask } = action.payload;

        if (!state.tasks[taskId]) {
          return;
        }

        ensureTaskShape(state.tasks[taskId]);
        state.tasks[taskId].subtasks.unshift(subtask);
        state.tasks[taskId].activityLog.unshift(
          createActivityEntry({
            type: 'subtask-added',
            message: `Added subtask "${subtask.title}".`,
          }),
        );
      },
      prepare({ taskId, title }) {
        return {
          payload: {
            taskId,
            subtask: {
              id: uuidv4(),
              title,
              completed: false,
            },
          },
        };
      },
    },
    toggleSubtask(state, action) {
      const { taskId, subtaskId } = action.payload;
      const subtask = state.tasks[taskId]?.subtasks.find((item) => item.id === subtaskId);

      if (subtask) {
        subtask.completed = !subtask.completed;
        ensureTaskShape(state.tasks[taskId]);
        state.tasks[taskId].activityLog.unshift(
          createActivityEntry({
            type: 'subtask-status',
            message: `${subtask.completed ? 'Completed' : 'Reopened'} subtask "${
              subtask.title
            }".`,
          }),
        );
      }
    },
    deleteSubtask(state, action) {
      const { taskId, subtaskId } = action.payload;

      if (!state.tasks[taskId]) {
        return;
      }

      const subtask = state.tasks[taskId].subtasks.find((item) => item.id === subtaskId);
      state.tasks[taskId].subtasks = state.tasks[taskId].subtasks.filter(
        (item) => item.id !== subtaskId,
      );
      ensureTaskShape(state.tasks[taskId]);
      state.tasks[taskId].activityLog.unshift(
        createActivityEntry({
          type: 'subtask-deleted',
          message: `Deleted subtask "${subtask?.title || 'Untitled'}".`,
        }),
      );
    },
    addComment(state, action) {
      const { taskId, comment } = action.payload;
      const task = state.tasks[taskId];

      if (!task) {
        return;
      }

      ensureTaskShape(task);
      task.comments += 1;
      task.activityLog.unshift(
        createActivityEntry({
          type: 'comment-added',
          message: `Comment added: "${comment}".`,
        }),
      );
    },
    addAssignee(state, action) {
      const { taskId, assignee } = action.payload;
      const task = state.tasks[taskId];

      if (!task) {
        return;
      }

      ensureTaskShape(task);
      const normalizedAssignee = assignee.toUpperCase().slice(0, 2);

      if (!normalizedAssignee || task.assignees.includes(normalizedAssignee)) {
        return;
      }

      task.assignees.push(normalizedAssignee);
      task.activityLog.unshift(
        createActivityEntry({
          type: 'assignee-added',
          message: `${normalizedAssignee} was added as an assignee.`,
        }),
      );
    },
    reorderTasks(state, action) {
      const { columnId, startIndex, endIndex } = action.payload;
      const taskIds = [...state.columns[columnId].taskIds];
      const [removed] = taskIds.splice(startIndex, 1);
      taskIds.splice(endIndex, 0, removed);
      state.columns[columnId].taskIds = taskIds;
    },
    moveTask(state, action) {
      const {
        sourceColumnId,
        destinationColumnId,
        sourceIndex,
        destinationIndex,
      } = action.payload;

      const sourceTaskIds = [...state.columns[sourceColumnId].taskIds];
      const destinationTaskIds =
        sourceColumnId === destinationColumnId
          ? sourceTaskIds
          : [...state.columns[destinationColumnId].taskIds];

      const [movedTaskId] = sourceTaskIds.splice(sourceIndex, 1);
      destinationTaskIds.splice(destinationIndex, 0, movedTaskId);

      state.columns[sourceColumnId].taskIds = sourceTaskIds;
      state.columns[destinationColumnId].taskIds = destinationTaskIds;
      ensureTaskShape(state.tasks[movedTaskId]);
      state.tasks[movedTaskId].columnId = destinationColumnId;
      state.tasks[movedTaskId].activityLog.unshift(
        createActivityEntry({
          type: 'status-updated',
          message: `Status changed from ${columnTitles[sourceColumnId]} to ${columnTitles[destinationColumnId]}.`,
        }),
      );

      state.tasks[movedTaskId].priority =
        destinationColumnId === 'done' ? 'completed' : state.tasks[movedTaskId].basePriority;
    },
  },
});

export const {
  addAssignee,
  addComment,
  addTask,
  addSubtask,
  deleteSubtask,
  deleteTask,
  hydrateBoard,
  moveTask,
  reorderTasks,
  toggleSubtask,
  updateFilters,
} = boardSlice.actions;

export const selectBoard = (state) => state.board;
export const selectBoardColumns = (state) => state.board.columns;
export const selectBoardTasks = (state) => state.board.tasks;
export const selectBoardFilters = (state) => state.board.filters;

export const selectVisibleTasksByColumn = createSelector(
  [selectBoardColumns, selectBoardTasks, selectBoardFilters],
  (columns, tasks, filters) => {
    const searchValue = filters.search.trim().toLowerCase();

    return Object.keys(columns).reduce((acc, columnId) => {
      const visibleTasks = columns[columnId].taskIds
        .map((taskId) => {
          const task = tasks[taskId];

          if (!task) {
            return task;
          }

          return {
            ...task,
            subtasks: task.subtasks || [],
            activityLog: task.activityLog || [],
          };
        })
        .filter((task) => {
          if (!task) {
            return false;
          }

          const matchesPriority =
            filters.priority === 'all' ? true : task.priority === filters.priority;
          const matchesSearch = searchValue
            ? `${task.title} ${task.description}`.toLowerCase().includes(searchValue)
            : true;

          return matchesPriority && matchesSearch;
        });

      acc[columnId] = visibleTasks;
      return acc;
    }, {});
  },
);

const startOfDay = (dateValue) => {
  const date = new Date(dateValue);
  date.setHours(0, 0, 0, 0);
  return date;
};

export const selectReminderTasks = createSelector([selectBoardTasks], (tasks) => {
  const today = startOfDay(new Date());

  return Object.values(tasks)
    .filter((task) => task.reminderEnabled && task.dueDate)
    .map((task) => {
      const dueDate = startOfDay(task.dueDate);
      const daysUntilDue = Math.round((dueDate - today) / (1000 * 60 * 60 * 24));

      return {
        ...task,
        daysUntilDue,
        status:
          daysUntilDue < 0 ? 'overdue' : daysUntilDue <= 1 ? 'dueSoon' : 'upcoming',
      };
    })
    .filter((task) => task.status !== 'upcoming')
    .sort((first, second) => first.daysUntilDue - second.daysUntilDue);
});

export default boardSlice.reducer;
