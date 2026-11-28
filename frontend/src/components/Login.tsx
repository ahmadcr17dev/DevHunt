import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { FiEye, FiEyeOff, FiArrowLeft, FiUser, FiLock } from "react-icons/fi";

const Login = () => {
  const navigate = useNavigate();
  const { login, error, success, ClearMessage, loadingUser, user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    ClearMessage();
  }, [ClearMessage]);

  useEffect(() => {
    if (!loadingUser && user) {
      if (!user.isProfileCompleted) navigate("/profilecompleted", { replace: true });
      else if (user.role === "employer") navigate("/employer", { replace: true });
      else navigate("/jobspage", { replace: true });
    }
  }, [loadingUser, user, navigate]);

  const HandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const HandleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) return;

    setSubmitting(true);
    try {
      const loggedInUser = await login(formData);
      if (!loggedInUser.isProfileCompleted) {
        navigate("/profilecompleted");
      } else if (loggedInUser.role === "employer") {
        navigate("/employer");
      } else {
        navigate("/jobspage");
      }
    } catch {
      // error message comes from AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass =
    "auth-field w-full rounded-xl border border-border/80 bg-bg/40 py-3 pl-11 pr-4 text-sm text-ink outline-none transition-all duration-200 placeholder:text-muted/55 hover:border-accent/40 focus:border-accent focus:bg-surface focus:ring-4 focus:ring-accent/15 sm:rounded-2xl sm:py-3.5 sm:pl-12 sm:text-base";

  return (
    <div className="auth-shell relative flex min-h-dvh bg-bg">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 auth-atmosphere" />
        <div className="absolute inset-0 auth-grid opacity-40 sm:opacity-50" />
        <div className="auth-orb-a absolute -left-24 -top-28 size-64 rounded-full bg-accent/20 blur-3xl sm:-left-16 sm:-top-20 sm:size-80" />
        <div className="auth-orb-b absolute -bottom-28 -right-20 size-56 rounded-full bg-accent-soft blur-3xl sm:-bottom-24 sm:-right-12 sm:size-72" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-center px-3 py-6 sm:px-6 sm:py-8 md:px-8 lg:grid-cols-2 lg:gap-6 lg:px-8 lg:py-8 xl:gap-10 xl:px-10">
        <aside className="auth-aside relative hidden flex-col justify-between self-stretch py-8 lg:flex xl:py-12">
          <NavLink
            to="/"
            className="auth-fade-1 inline-flex w-fit font-display text-2xl font-bold tracking-tight text-ink transition-colors hover:text-accent xl:text-3xl"
          >
            DevHunt
          </NavLink>

          <div className="max-w-md">
            <p className="auth-fade-2 font-display text-3xl font-semibold leading-tight text-ink capitalize xl:text-4xl">
              Pick Up Where Your Next Role Begins.
            </p>
            <p className="auth-fade-3 mt-3 text-sm leading-relaxed text-muted xl:mt-4 xl:text-base">
              Sign in to browse focused developer jobs, manage applications, and keep your profile ready for teams that build.
            </p>

            <div className="auth-fade-4 mt-6 hidden space-y-2.5 xl:mt-8 xl:block xl:space-y-3">
              <div className="auth-chip flex items-center gap-3 rounded-2xl border border-border/80 bg-surface/70 px-4 py-3 backdrop-blur-sm">
                <span className="auth-pulse-dot size-2 rounded-full bg-accent" />
                <span className="text-sm font-medium text-ink">Curated roles, less noise</span>
              </div>
              <div className="auth-chip-delay flex items-center gap-3 rounded-2xl border border-border/80 bg-surface/70 px-4 py-3 backdrop-blur-sm">
                <span className="auth-pulse-dot size-2 rounded-full bg-accent" />
                <span className="text-sm font-medium text-ink">Built for developers & employers</span>
              </div>
            </div>
          </div>

          <p className="auth-fade-4 text-xs text-muted/80">
            &copy; {new Date().getFullYear()} DevHunt
          </p>
        </aside>

        <main className="flex w-full items-center justify-center py-2 sm:py-4 md:py-6">
          <div className="auth-panel relative flex w-full max-w-sm flex-col rounded-2xl border border-border/70 bg-surface/95 shadow-xl backdrop-blur-xl sm:max-w-md sm:rounded-3xl sm:shadow-2xl md:max-w-lg">
            <div className="auth-panel-accent" aria-hidden="true" />

            <div className="auth-panel-body flex flex-1 flex-col justify-between">
              <div>
                <NavLink
                  to="/"
                  className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-accent lg:hidden"
                >
                  <FiArrowLeft size={16} />
                  Back to home
                </NavLink>

                <NavLink
                  to="/"
                  className="font-display text-xl font-bold tracking-tight text-ink transition-colors hover:text-accent sm:text-2xl lg:hidden"
                >
                  DevHunt
                </NavLink>

                <div className="auth-fade-2 mt-3 sm:mt-4 lg:mt-0">
                  <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                    Account access
                  </p>
                  <h1 className="mt-1.5 font-display text-2xl font-semibold text-ink sm:mt-2 sm:text-3xl md:text-4xl">
                    Welcome Back
                  </h1>
                  <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted sm:mt-2 sm:text-base">
                    Log in to continue to your DevHunt account.
                  </p>
                </div>
              </div>

              <form
                className="auth-fade-3 auth-form mt-5 flex flex-col gap-3.5 sm:mt-7 sm:gap-5 md:mt-8"
                onSubmit={HandleLogin}
              >
                <div className="flex flex-col gap-1.5 sm:gap-2">
                  <label className="block text-sm font-medium text-ink" htmlFor="username">
                    Username
                  </label>
                  <div className="relative">
                    <FiUser
                      className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted sm:left-4"
                      size={16}
                    />
                    <input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      className={fieldClass}
                      name="username"
                      value={formData.username}
                      onChange={HandleChange}
                      minLength={7}
                      maxLength={15}
                      required
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 sm:gap-2">
                  <label className="block text-sm font-medium text-ink" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <FiLock
                      className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted sm:left-4"
                      size={16}
                    />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className={`${fieldClass} pr-11 sm:pr-12`}
                      name="password"
                      value={formData.password}
                      onChange={HandleChange}
                      minLength={8}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded-lg p-1 text-muted transition-colors hover:bg-accent-soft hover:text-accent sm:right-3.5"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="auth-alert rounded-xl border border-warning/30 bg-warning/10 px-3 py-2.5 sm:rounded-2xl sm:px-4 sm:py-3">
                    <p className="text-sm font-medium text-warning">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="auth-alert rounded-xl border border-success/30 bg-success/10 px-3 py-2.5 sm:rounded-2xl sm:px-4 sm:py-3">
                    <p className="text-sm font-medium text-success">{success}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="auth-submit relative mt-0.5 w-full cursor-pointer overflow-hidden rounded-xl bg-accent py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60 sm:mt-1 sm:rounded-2xl sm:py-3.5 sm:text-base"
                >
                  <span className="relative z-10">
                    {submitting ? "Signing in…" : "Sign in"}
                  </span>
                </button>
              </form>

              <p className="auth-fade-4 mt-5 text-center text-sm text-muted sm:mt-7 md:mt-8">
                Don&apos;t have an account?{" "}
                <NavLink
                  to="/register"
                  className="font-semibold text-accent transition-colors hover:text-accent-hover"
                >
                  Create one
                </NavLink>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Login;
