import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Draggable } from '@hello-pangea/dnd';
import AvatarStack from './AvatarStack';
import {
  ActivityIcon,
  CheckSquareIcon,
  ClockIcon,
  CommentBubbleIcon,
  DotsIcon,
  FileIcon,
  TrashIcon,
  UserPlusIcon,
} from './icons';
import {
  addAssignee,
  addComment,
  addSubtask,
  deleteSubtask,
  deleteTask,
  toggleSubtask,
} from '../features/board/boardSlice';

const badgeStyles = {
  low: 'bg-[#fff2e7] text-[#d58d49]',
  high: 'bg-[#ffe8ea] text-[#d8727d]',
  completed: 'bg-[#dbf5dd] text-[#68b266]',
};

const badgeLabels = {
  low: 'Low',
  high: 'High',
  completed: 'Completed',
};

function TaskCard({ task, index, isDragDisabled }) {
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubtaskFormOpen, setIsSubtaskFormOpen] = useState(false);
  const [isCommentFormOpen, setIsCommentFormOpen] = useState(false);
  const [isAssigneeFormOpen, setIsAssigneeFormOpen] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [subtaskTitle, setSubtaskTitle] = useState('');
  const [commentText, setCommentText] = useState('');
  const [assigneeCode, setAssigneeCode] = useState('');
  const menuRef = useRef(null);
  const subtasks = task.subtasks || [];
  const activityLog = task.activityLog || [];
  const completedSubtasks = subtasks.filter((item) => item.completed).length;

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('mousedown', handleOutsideClick);
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const dueDateTone = !task.dueDate
    ? 'text-[#8f8aa3]'
    : new Date(task.dueDate) < new Date(new Date().toDateString())
      ? 'text-rose-600'
      : 'text-amber-600';

  const formatActivityTime = (value) =>
    new Date(value).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <Draggable draggableId={task.id} index={index} isDragDisabled={isDragDisabled}>
      {(provided, snapshot) => (
        <article
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`rounded-[24px] bg-white p-5 shadow-card transition ${
            snapshot.isDragging ? 'rotate-[1deg] shadow-2xl' : ''
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <span
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                badgeStyles[task.priority] || badgeStyles.low
              }`}
            >
              {badgeLabels[task.priority] || 'Low'}
            </span>
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setIsMenuOpen((current) => !current);
                }}
                className="text-[#6f6987]"
              >
                <DotsIcon className="h-4 w-4" />
              </button>
              {isMenuOpen ? (
                <div className="absolute right-0 top-7 z-20 w-44 rounded-2xl border border-[#e7e1f0] bg-white p-2 shadow-card">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubtaskFormOpen(true);
                      setIsCommentFormOpen(false);
                      setIsAssigneeFormOpen(false);
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-[#4d4667] transition hover:bg-[#f6f3fb]"
                  >
                    <CheckSquareIcon className="h-4 w-4" />
                    Add subtask
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCommentFormOpen(true);
                      setIsSubtaskFormOpen(false);
                      setIsAssigneeFormOpen(false);
                      setIsMenuOpen(false);
                    }}
                    className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-[#4d4667] transition hover:bg-[#f6f3fb]"
                  >
                    <CommentBubbleIcon className="h-4 w-4" />
                    Add comment
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAssigneeFormOpen(true);
                      setIsSubtaskFormOpen(false);
                      setIsCommentFormOpen(false);
                      setIsMenuOpen(false);
                    }}
                    className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-[#4d4667] transition hover:bg-[#f6f3fb]"
                  >
                    <UserPlusIcon className="h-4 w-4" />
                    Add assignee
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsActivityOpen((current) => !current);
                      setIsMenuOpen(false);
                    }}
                    className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-[#4d4667] transition hover:bg-[#f6f3fb]"
                  >
                    <ActivityIcon className="h-4 w-4" />
                    Activity log
                  </button>
                  <button
                    type="button"
                    onClick={() => dispatch(deleteTask({ taskId: task.id }))}
                    className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Delete task
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <h3 className="mt-4 text-[27px] font-bold leading-none tracking-[-0.04em] text-[#2b2353]">
            {task.title}
          </h3>
          <p className="mt-3 text-sm leading-5 text-[#8f8aa3]">{task.description}</p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold">
            {task.dueDate ? (
              <span className={`flex items-center gap-1.5 ${dueDateTone}`}>
                <ClockIcon className="h-4 w-4" />
                Due {task.dueDate}
              </span>
            ) : null}
            <span className="flex items-center gap-1.5 text-[#6d56f8]">
              <CheckSquareIcon className="h-4 w-4" />
              {completedSubtasks}/{subtasks.length} subtasks
            </span>
          </div>

          {isSubtaskFormOpen ? (
            <form
              className="mt-4 flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                if (!subtaskTitle.trim()) {
                  return;
                }
                dispatch(addSubtask({ taskId: task.id, title: subtaskTitle.trim() }));
                setSubtaskTitle('');
                setIsSubtaskFormOpen(false);
              }}
            >
              <input
                value={subtaskTitle}
                onChange={(event) => setSubtaskTitle(event.target.value)}
                placeholder="New subtask"
                className="min-w-0 flex-1 rounded-xl border border-[#ddd7ec] bg-[#faf9fd] px-3 py-2 text-sm outline-none focus:border-[#c7bdef] focus:bg-white"
              />
              <button
                type="submit"
                className="rounded-xl bg-[#5030e5] px-3 py-2 text-sm font-semibold text-white"
              >
                Add
              </button>
            </form>
          ) : null}

          {isCommentFormOpen ? (
            <form
              className="mt-3 flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                if (!commentText.trim()) {
                  return;
                }
                dispatch(addComment({ taskId: task.id, comment: commentText.trim() }));
                setCommentText('');
                setIsCommentFormOpen(false);
              }}
            >
              <input
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder="Add a comment"
                className="min-w-0 flex-1 rounded-xl border border-[#ddd7ec] bg-[#faf9fd] px-3 py-2 text-sm outline-none focus:border-[#c7bdef] focus:bg-white"
              />
              <button
                type="submit"
                className="rounded-xl bg-[#5030e5] px-3 py-2 text-sm font-semibold text-white"
              >
                Save
              </button>
            </form>
          ) : null}

          {isAssigneeFormOpen ? (
            <form
              className="mt-3 flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                if (!assigneeCode.trim()) {
                  return;
                }
                dispatch(addAssignee({ taskId: task.id, assignee: assigneeCode.trim() }));
                setAssigneeCode('');
                setIsAssigneeFormOpen(false);
              }}
            >
              <input
                value={assigneeCode}
                onChange={(event) => setAssigneeCode(event.target.value)}
                placeholder="Initials e.g. PK"
                className="min-w-0 flex-1 rounded-xl border border-[#ddd7ec] bg-[#faf9fd] px-3 py-2 text-sm uppercase outline-none focus:border-[#c7bdef] focus:bg-white"
                maxLength={2}
              />
              <button
                type="submit"
                className="rounded-xl bg-[#5030e5] px-3 py-2 text-sm font-semibold text-white"
              >
                Assign
              </button>
            </form>
          ) : null}

          {subtasks.length ? (
            <div className="mt-4 space-y-2 rounded-2xl bg-[#faf9fd] p-3">
              {subtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  className="flex items-center justify-between gap-2 rounded-xl bg-white px-3 py-2"
                >
                  <label className="flex min-w-0 items-center gap-2">
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() =>
                        dispatch(toggleSubtask({ taskId: task.id, subtaskId: subtask.id }))
                      }
                      className="h-4 w-4 rounded border-[#cfc7e6] text-[#5030e5] focus:ring-[#5030e5]"
                    />
                    <span
                      className={`truncate text-sm ${
                        subtask.completed ? 'text-[#9b96af] line-through' : 'text-[#4d4667]'
                      }`}
                    >
                      {subtask.title}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      dispatch(deleteSubtask({ taskId: task.id, subtaskId: subtask.id }))
                    }
                    className="text-rose-500 transition hover:text-rose-600"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : null}

          {isActivityOpen ? (
            <div className="mt-4 rounded-2xl border border-[#ece7f2] bg-[#fcfbff] p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7d7695]">
                  Activity Log
                </p>
                <button
                  type="button"
                  onClick={() => setIsActivityOpen(false)}
                  className="text-xs font-semibold text-[#6d56f8]"
                >
                  Hide
                </button>
              </div>
              <div className="mt-3 space-y-3">
                {activityLog.length ? (
                  activityLog.map((entry) => (
                    <div key={entry.id} className="rounded-xl bg-white px-3 py-2 shadow-sm">
                      <p className="text-sm font-medium text-[#4d4667]">{entry.message}</p>
                      <p className="mt-1 text-xs text-[#948faa]">
                        {formatActivityTime(entry.timestamp)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[#8f8aa3]">No activity captured yet.</p>
                )}
              </div>
            </div>
          ) : null}

          <div className="mt-5 flex items-center justify-between gap-3">
            <AvatarStack people={task.assignees} size="sm" />

            <div className="flex items-center gap-3 text-xs font-medium text-[#8f8aa3] sm:text-sm">
              <span className="flex items-center gap-1.5">
                <CommentBubbleIcon className="h-4 w-4" />
                {task.comments} comments
              </span>
              <span className="flex items-center gap-1.5">
                <FileIcon className="h-4 w-4" />
                {task.files} files
              </span>
            </div>
          </div>
        </article>
      )}
    </Draggable>
  );
}

export default TaskCard;
