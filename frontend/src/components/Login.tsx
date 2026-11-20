import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

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
  }, []);

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
    "w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted/70 outline-none transition-colors duration-200 focus:border-accent";

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-bg px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 80% 10%, rgba(14,124,123,0.14), transparent 55%), radial-gradient(ellipse 50% 40% at 10% 90%, rgba(231,244,243,0.9), transparent 50%)",
        }}
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-sm sm:p-10">
        <NavLink
          to="/"
          className="font-display text-2xl font-semibold tracking-tight text-ink transition-colors hover:text-accent"
        >
          DevHunt
        </NavLink>

        <h1 className="mt-8 font-display text-3xl font-semibold text-ink">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-muted">
          Log in to continue to your account.
        </p>

        <form className="mt-8 space-y-5" onSubmit={HandleLogin}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-ink" htmlFor="username">
              Username
            </label>
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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-ink" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`${fieldClass} pr-11`}
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-ink cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-warning/30 bg-warning/10 px-4 py-3">
              <p className="text-sm font-medium text-warning">{error}</p>
            </div>
          )}

          {success && (
            <div className="rounded-lg border border-success/30 bg-success/10 px-4 py-3">
              <p className="text-sm font-medium text-success">{success}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-accent py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-accent-hover hover:shadow-[0_8px_24px_rgba(14,124,123,0.25)] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            {submitting ? "Signing in…" : "Login"}
          </button>

          <p className="text-center text-sm text-muted">
            Don&apos;t have an account?{" "}
            <NavLink
              to="/register"
              className="font-semibold text-accent transition-colors hover:text-accent-hover"
            >
              Sign up
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
