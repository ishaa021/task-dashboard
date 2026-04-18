import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearAuthError,
  login,
  selectAuth,
  selectAuthLoading,
  signUp,
} from '../features/auth/authSlice';
import { ProjectLogoIcon } from './icons';

const initialForm = {
  name: '',
  email: '',
  password: '',
};

function AuthScreen() {
  const dispatch = useDispatch();
  const { error } = useSelector(selectAuth);
  const loading = useSelector(selectAuthLoading);
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialForm);

  const submitLabel = useMemo(
    () => (mode === 'login' ? 'Login' : 'Create account'),
    [mode],
  );

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setForm(initialForm);
    dispatch(clearAuthError());
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (mode === 'login') {
      dispatch(login({ email: form.email, password: form.password }));
      return;
    }

    dispatch(signUp(form));
  };

  return (
    <div className="min-h-screen bg-[#f6f2ea] p-4 lg:p-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1200px] overflow-hidden rounded-[36px] border-[3px] border-[#4f8fe7] bg-white shadow-soft">
        <div className="hidden flex-1 bg-[radial-gradient(circle_at_top,_rgba(80,48,229,0.18),_transparent_34%),linear-gradient(135deg,_#21184f,_#4e34d6)] p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center gap-3">
            <ProjectLogoIcon className="h-11 w-11" />
            <p className="text-3xl font-extrabold tracking-[-0.05em]">Project M.</p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-white/70">Secure Workspace</p>
            <h1 className="mt-4 max-w-md text-6xl font-extrabold leading-[0.95] tracking-[-0.06em]">
             Manage projects effortlessly with smart reminders & subtasks.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-7 text-white/78">
              Plan, track, and complete your work efficiently with an intuitive project management system designed for productivity.
            </p>
          </div>
          <p className="text-sm text-white/65">Fast, secure access powered by modern authentication.</p>
        </div>

        <div className="flex w-full items-center justify-center bg-[#fcfbf8] p-6 sm:p-10 lg:max-w-[480px]">
          <div className="w-full max-w-md">
            <div className="flex items-center gap-3 lg:hidden">
              <ProjectLogoIcon className="h-10 w-10" />
              <p className="text-3xl font-extrabold tracking-[-0.05em] text-[#241c4c]">
                Project M.
              </p>
            </div>

            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.15em] text-[#8d87a6]">
              Authentication
            </p>
            <h2 className="mt-3 text-4xl font-extrabold tracking-[-0.05em] text-[#241c4c]">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>

            <div className="mt-6 flex rounded-2xl bg-[#f2eefb] p-1">
              <button
                type="button"
                onClick={() => handleModeChange('login')}
                disabled={loading}
                className={`flex-1 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  mode === 'login' ? 'bg-white text-[#281f54] shadow-sm' : 'text-[#7d7695]'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('signup')}
                disabled={loading}
                className={`flex-1 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  mode === 'signup' ? 'bg-white text-[#281f54] shadow-sm' : 'text-[#7d7695]'
                }`}
              >
                Sign up
              </button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              {mode === 'signup' ? (
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#3a325f]">Name</span>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full rounded-2xl border border-[#ded8ed] bg-[#faf9fd] px-4 py-3 outline-none transition focus:border-[#c7bdef] focus:bg-white"
                    placeholder="Enter your name"
                  />
                </label>
              ) : null}

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#3a325f]">Email</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full rounded-2xl border border-[#ded8ed] bg-[#faf9fd] px-4 py-3 outline-none transition focus:border-[#c7bdef] focus:bg-white"
                  placeholder="you@example.com"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#3a325f]">
                  Password
                </span>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full rounded-2xl border border-[#ded8ed] bg-[#faf9fd] px-4 py-3 outline-none transition focus:border-[#c7bdef] focus:bg-white"
                  placeholder="Enter password"
                />
              </label>

              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[#5030e5] px-5 py-3.5 font-semibold text-white shadow-card transition hover:bg-[#4627d6]"
              >
                {loading ? 'Please wait...' : submitLabel}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthScreen;
