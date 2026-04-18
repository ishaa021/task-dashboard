import {
  FolderIcon,
  GridIcon,
  MessageIcon,
  ProjectLogoIcon,
  SettingsIcon,
  UsersIcon,
} from './icons';

const navItems = [
  { label: 'Home', icon: GridIcon },
  { label: 'Messages', icon: MessageIcon },
  { label: 'Tasks', icon: FolderIcon },
  { label: 'Members', icon: UsersIcon },
  { label: 'Settings', icon: SettingsIcon },
];

const projects = [
  { name: 'Mobile App', color: 'bg-[#8bc48a]', active: true },
  { name: 'Website Redesign', color: 'bg-[#f59e0b]' },
  { name: 'Design System', color: 'bg-[#c9b8ff]' },
  { name: 'Wireframes', color: 'bg-[#60a5fa]' },
];

function Sidebar() {
  return (
    <aside className="hidden w-[270px] shrink-0 border-r border-[#e8e3ef] bg-white/70 xl:flex xl:flex-col">
      <div className="flex items-center justify-between px-7 py-7">
        <div className="flex items-center gap-3">
          <ProjectLogoIcon className="h-10 w-10 shrink-0" />
          <div>
            <p className="text-[29px] font-extrabold leading-none tracking-[-0.05em] text-[#23194c]">
              Project M.
            </p>
          </div>
        </div>
        <button className="text-2xl text-[#a3a0b5]">&laquo;</button>
      </div>

      <nav className="px-5">
        <ul className="space-y-1">
          {navItems.map(({ label, icon: Icon }) => (
            <li key={label}>
              <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-[15px] font-medium text-[#7a768f] transition hover:bg-[#f5f2fb] hover:text-[#30265d]">
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-6 mt-6 border-t border-[#ece7f2]" />

      <div className="flex-1 px-6 py-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#8d89a4]">
            My Projects
          </p>
          <button className="flex h-6 w-6 items-center justify-center rounded-lg border border-[#ddd8eb] text-[#7d7896]">
            +
          </button>
        </div>

        <ul className="space-y-1.5">
          {projects.map((project) => (
            <li key={project.name}>
              <button
                className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-[15px] font-semibold transition ${
                  project.active
                    ? 'bg-[#f0ecff] text-[#2e2658]'
                    : 'text-[#7a768f] hover:bg-[#f6f3fb]'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className={`h-2.5 w-2.5 rounded-full ${project.color}`} />
                  {project.name}
                </span>
                {project.active ? <span className="text-xl">…</span> : null}
              </button>
            </li>
          ))}
        </ul>

        <div className="relative mt-10 rounded-[26px] bg-[#f7f3ea] px-5 pb-5 pt-8 text-center shadow-card">
          <div className="absolute left-1/2 top-0 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#fff7d5] shadow-lg shadow-amber-100">
            <span className="text-2xl">💡</span>
          </div>
          <h3 className="text-base font-bold text-[#332b5e]">Thoughts Time</h3>
          <p className="mt-2 text-sm leading-5 text-[#8a839f]">
            We don’t have any notice for you, till then you can share your thoughts with
            your peers.
          </p>
          <button className="mt-5 w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#332b5e] shadow-sm transition hover:bg-[#fdfcff]">
            Write a message
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
