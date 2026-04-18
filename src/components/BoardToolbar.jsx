import AvatarStack from './AvatarStack';
import {
  ChevronDownIcon,
  DotsIcon,
  FilterIcon,
  LinkIcon,
  MenuIcon,
  PencilIcon,
  PlusIcon,
  ShareIcon,
} from './icons';

function BoardToolbar({ filters, onFiltersChange, dragDisabled }) {
  return (
    <section>
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-extrabold tracking-[-0.05em] text-[#1d1646] sm:text-6xl">
              Mobile App
            </h1>
            <div className="flex items-center gap-2">
              <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#efeaff] text-[#6d56f8]">
                <PencilIcon className="h-4 w-4" />
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#efeaff] text-[#6d56f8]">
                <LinkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="section-button pr-3">
              <FilterIcon className="h-4 w-4" />
              <select
                value={filters.priority}
                onChange={(event) => onFiltersChange({ priority: event.target.value })}
                className="bg-transparent text-sm outline-none"
              >
                <option value="all">All priorities</option>
                <option value="low">Low</option>
                <option value="high">High</option>
                <option value="completed">Completed</option>
              </select>
             
            </div>

            <label className="section-button cursor-text pr-3">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
              >
                <circle cx="11" cy="11" r="6.5" />
                <path d="M16 16L21 21" />
              </svg>
              <input
                type="text"
                value={filters.search}
                onChange={(event) => onFiltersChange({ search: event.target.value })}
                placeholder="Search tasks"
                className="w-32 bg-transparent text-sm outline-none placeholder:text-[#908aa6] sm:w-40"
              />
            </label>

            <button className="section-button">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
              >
                <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
                <path d="M8 3V7M16 3V7M3.5 10.5H20.5" />
              </svg>
              Today
              <ChevronDownIcon className="h-4 w-4" />
            </button>
          </div>

          {dragDisabled ? (
            <p className="mt-3 text-sm text-[#8b84a1]">
              Drag and drop is paused while a filter is active so task order stays predictable.
            </p>
          ) : null}
        </div>

        <div className="flex flex-col items-start gap-5 xl:items-end">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-[#6955f5] transition hover:bg-[#f3efff]">
              <PlusIcon className="h-4 w-4" />
              Invite
            </button>
            <AvatarStack people={['AN', 'RK', 'DM', 'SP', 'GT']} extraCount={2} />
          </div>

          <div className="flex items-center gap-3">
            <button className="section-button">
              <ShareIcon className="h-4 w-4" />
              Share
            </button>
            <div className="h-9 w-px bg-[#e7e1f0]" />
            <button className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#5030e5] text-white shadow-card">
              <MenuIcon className="h-5 w-5" />
            </button>
            <button className="icon-button">
              <DotsIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BoardToolbar;
