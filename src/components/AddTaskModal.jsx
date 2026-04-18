import { useEffect, useState } from 'react';

const initialForm = {
  title: '',
  description: '',
  priority: 'low',
  dueDate: '',
  reminderEnabled: true,
};

function AddTaskModal({ isOpen, columnTitle, onClose, onSubmit }) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (isOpen) {
      setForm(initialForm);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      return;
    }

    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      dueDate: form.dueDate,
      reminderEnabled: form.reminderEnabled,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#15112e]/35 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[30px] bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#7c7695]">
              Add Task
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[#241c4c]">
              New card in {columnTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4f1fb] text-[#6f6888]"
          >
            ✕
          </button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#3a325f]">Task title</span>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter task title"
              className="w-full rounded-2xl border border-[#ded8ed] bg-[#faf9fd] px-4 py-3 outline-none transition focus:border-[#c7bdef] focus:bg-white"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#3a325f]">
              Description
            </span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe the task"
              className="w-full resize-none rounded-2xl border border-[#ded8ed] bg-[#faf9fd] px-4 py-3 outline-none transition focus:border-[#c7bdef] focus:bg-white"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#3a325f]">Priority</span>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full rounded-2xl border border-[#ded8ed] bg-[#faf9fd] px-4 py-3 outline-none transition focus:border-[#c7bdef] focus:bg-white"
            >
              <option value="low">Low</option>
              <option value="high">High</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#3a325f]">Due date</span>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="w-full rounded-2xl border border-[#ded8ed] bg-[#faf9fd] px-4 py-3 outline-none transition focus:border-[#c7bdef] focus:bg-white"
            />
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-[#ded8ed] bg-[#faf9fd] px-4 py-3">
            <input
              type="checkbox"
              name="reminderEnabled"
              checked={form.reminderEnabled}
              onChange={handleChange}
              className="h-4 w-4 rounded border-[#cfc7e6] text-[#5030e5] focus:ring-[#5030e5]"
            />
            <span className="text-sm font-semibold text-[#3a325f]">
              Enable reminder banner for this task
            </span>
          </label>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-[#ddd7ec] px-5 py-3 font-semibold text-[#645f7c] transition hover:bg-[#f7f4fc]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-[#5030e5] px-5 py-3 font-semibold text-white shadow-card transition hover:bg-[#4627d6]"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTaskModal;
