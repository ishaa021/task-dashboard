import { useEffect, useMemo, useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import AuthScreen from './components/AuthScreen';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import BoardToolbar from './components/BoardToolbar';
import TaskColumn from './components/TaskColumn';
import AddTaskModal from './components/AddTaskModal';
import ReminderBanner from './components/ReminderBanner';
import {
  selectAuthInitialized,
  selectIsAuthenticated,
  setAuthUser,
} from './features/auth/authSlice';
import {
  addTask,
  hydrateBoard,
  moveTask,
  reorderTasks,
  selectBoardColumns,
  selectBoardFilters,
  selectReminderTasks,
  selectVisibleTasksByColumn,
  updateFilters,
} from './features/board/boardSlice';
import { auth } from './lib/firebase';
import { loadBoardStateForUser } from './utils/localStorage';

const stageMeta = {
  todo: {
    accent: '#5030E5',
    dot: '#5030E5',
    title: 'To Do',
  },
  inProgress: {
    accent: '#F59E0B',
    dot: '#F59E0B',
    title: 'On Progress',
  },
  done: {
    accent: '#8BC48A',
    dot: '#8BC48A',
    title: 'Done',
  },
};

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authInitialized = useSelector(selectAuthInitialized);
  const columns = useSelector(selectBoardColumns);
  const filters = useSelector(selectBoardFilters);
  const visibleTasksByColumn = useSelector(selectVisibleTasksByColumn);
  const reminderTasks = useSelector(selectReminderTasks);
  const [modalColumnId, setModalColumnId] = useState(null);

  const filteredCounts = useMemo(
    () =>
      Object.keys(columns).reduce((acc, columnId) => {
        acc[columnId] = visibleTasksByColumn[columnId]?.length || 0;
        return acc;
      }, {}),
    [columns, visibleTasksByColumn],
  );

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    if (filters.priority !== 'all' || filters.search.trim()) {
      return;
    }

    if (destination.droppableId === source.droppableId) {
      dispatch(
        reorderTasks({
          columnId: source.droppableId,
          startIndex: source.index,
          endIndex: destination.index,
        }),
      );
      return;
    }

    dispatch(
      moveTask({
        sourceColumnId: source.droppableId,
        destinationColumnId: destination.droppableId,
        sourceIndex: source.index,
        destinationIndex: destination.index,
        taskId: draggableId,
      }),
    );
  };

  const handleCreateTask = (taskInput) => {
    if (!modalColumnId) {
      return;
    }

    dispatch(
      addTask({
        columnId: modalColumnId,
        ...taskInput,
      }),
    );
    setModalColumnId(null);
  };

  const dragDisabled =
    filters.priority !== 'all' || Boolean(filters.search.trim());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const mappedUser = user
        ? {
            id: user.uid,
            name: user.displayName || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            location: 'Firebase Auth',
          }
        : null;

      dispatch(
        setAuthUser(mappedUser),
      );
      dispatch(hydrateBoard(loadBoardStateForUser(mappedUser?.id)));
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (!authInitialized) {
    return (
      <div className="min-h-screen bg-[#f6f2ea] p-4 lg:p-6">
        <div className="panel mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1200px] items-center justify-center border-[3px] border-[#4f8fe7] bg-[#fcfbf8]">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8d87a6]">
              Firebase Auth
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.05em] text-[#241c4c]">
              Checking session...
            </h1>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen p-4 lg:p-6">
      <div className="panel mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-[1440px] overflow-hidden border-[3px] border-[#4f8fe7] bg-[#fcfbf8] lg:min-h-[920px]">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header />
          <main className="flex-1 overflow-auto px-5 py-6 sm:px-7 lg:px-10">
            <ReminderBanner tasks={reminderTasks} />
            <BoardToolbar
              filters={filters}
              onFiltersChange={(nextFilters) => dispatch(updateFilters(nextFilters))}
              dragDisabled={dragDisabled}
            />
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="mt-8 grid gap-6 xl:grid-cols-3">
                {Object.values(columns).map((column) => (
                  <TaskColumn
                    key={column.id}
                    column={column}
                    tasks={visibleTasksByColumn[column.id]}
                    count={filteredCounts[column.id]}
                    title={stageMeta[column.id].title}
                    accent={stageMeta[column.id].accent}
                    dot={stageMeta[column.id].dot}
                    onAddTask={() => setModalColumnId(column.id)}
                    canAddTask={column.id === 'todo'}
                    isDragDisabled={dragDisabled}
                  />
                ))}
              </div>
            </DragDropContext>
          </main>
        </div>
      </div>
      <AddTaskModal
        isOpen={Boolean(modalColumnId)}
        columnTitle={modalColumnId ? stageMeta[modalColumnId].title : ''}
        onClose={() => setModalColumnId(null)}
        onSubmit={handleCreateTask}
      />
    </div>
  );
}

export default App;
