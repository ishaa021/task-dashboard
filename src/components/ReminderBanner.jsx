function ReminderBanner({ tasks }) {
  if (!tasks.length) {
    return null;
  }

  return (
    <div className="mb-6 rounded-[24px] border border-amber-200 bg-[linear-gradient(135deg,_#fff8df,_#fff3cb)] px-5 py-4 shadow-card">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-amber-700">
            Task reminders
          </p>
          <p className="mt-1 text-base font-medium text-[#5a4b17]">
            {tasks[0].status === 'overdue'
              ? `${tasks[0].title} is overdue.`
              : `${tasks[0].title} is due soon.`}
          </p>
        </div>
        <p className="text-sm text-[#7e6c31]">
          {tasks.length} reminder{tasks.length > 1 ? 's' : ''} need attention.
        </p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {tasks.slice(0, 3).map((task) => (
          <span
            key={task.id}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              task.status === 'overdue'
                ? 'bg-rose-100 text-rose-600'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            {task.title} • due {task.dueDate}
          </span>
        ))}
      </div>
    </div>
  );
}

export default ReminderBanner;
