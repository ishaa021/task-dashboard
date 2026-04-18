import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { PlusIcon } from './icons';

function TaskColumn({
  column,
  tasks,
  title,
  count,
  accent,
  dot,
  onAddTask,
  canAddTask,
  isDragDisabled,
}) {
  return (
    <section className="rounded-[26px] bg-[#f3f3f5] p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: dot }} />
          <h2 className="text-lg font-bold text-[#2b2353]">{title}</h2>
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#e7e7ea] px-1.5 text-xs font-semibold text-[#7a768f]">
            {count}
          </span>
        </div>

        {canAddTask ? (
          <button
            type="button"
            onClick={onAddTask}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ebe7ff] text-[#6d56f8] transition hover:bg-[#ddd5ff]"
            aria-label={`Add task to ${title}`}
          >
            <PlusIcon className="h-3.5 w-3.5" />
          </button>
        ) : (
          <div className="h-7 w-7" aria-hidden="true" />
        )}
      </div>

      <div className="mt-4 h-1 rounded-full" style={{ backgroundColor: accent }} />

      <Droppable droppableId={column.id} isDropDisabled={isDragDisabled}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`mt-5 min-h-[240px] space-y-4 rounded-3xl transition ${
              snapshot.isDraggingOver ? 'bg-white/50 p-2' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} isDragDisabled={isDragDisabled} />
            ))}
            {provided.placeholder}
            {!tasks.length ? (
              <div className="rounded-[22px] border border-dashed border-[#d6d0e6] bg-white/80 px-4 py-10 text-center text-sm text-[#918ca5]">
                No tasks match the active filters here.
              </div>
            ) : null}
          </div>
        )}
      </Droppable>
    </section>
  );
}

export default TaskColumn;
