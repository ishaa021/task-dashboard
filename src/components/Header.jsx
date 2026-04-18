import { useDispatch, useSelector } from 'react-redux';
import AvatarStack from './AvatarStack';
import {
  logout,
  selectAuthLoading,
  selectCurrentUser,
} from '../features/auth/authSlice';
import { BellIcon, CalendarIcon, ChevronDownIcon, MessageIcon, SearchIcon } from './icons';

function Header() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const authLoading = useSelector(selectAuthLoading);

  return (
    <header className="border-b border-[#ebe6f2] bg-white/75 px-5 py-4 backdrop-blur sm:px-7 lg:px-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <label className="relative flex min-w-0 flex-1 items-center">
            <SearchIcon className="pointer-events-none absolute left-4 h-5 w-5 text-[#9e99af]" />
            <input
              type="text"
              placeholder="Search for anything..."
              className="w-full rounded-2xl border border-transparent bg-[#f5f4f8] py-3 pl-12 pr-4 text-sm text-[#29234d] outline-none transition placeholder:text-[#a19db2] focus:border-[#d9d1ef] focus:bg-white"
            />
          </label>
        </div>

        <div className="flex items-center justify-between gap-4 lg:justify-end">
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="icon-button">
              <CalendarIcon className="h-5 w-5" />
            </button>
            <button className="icon-button">
              <MessageIcon className="h-5 w-5" />
            </button>
            <button className="icon-button relative">
              <BellIcon className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500" />
            </button>
          </div>

          <div className="hidden h-10 w-px bg-[#ece7f2] sm:block" />

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-[#241c4c]">
                {currentUser?.name || 'Palak Jain'}
              </p>
              <p className="text-xs text-[#8b86a0]">
                {currentUser?.location || 'Rajasthan, India'}
              </p>
            </div>
            <AvatarStack people={[currentUser?.name?.slice(0, 2).toUpperCase() || 'PJ']} size="sm" />
            <button className="text-[#8f8aa4]">
              <ChevronDownIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => dispatch(logout())}
              disabled={authLoading}
              className="rounded-xl border border-[#e8e4f1] px-3 py-2 text-xs font-semibold text-[#6f6987] transition hover:border-[#d3cbec] hover:text-[#4f46e5]"
            >
              {authLoading ? '...' : 'Logout'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
