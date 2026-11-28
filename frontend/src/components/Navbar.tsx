import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiLogOut, FiUser, FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showConfirmPanel, setShowConfirmPanel] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const ConfirmLogOut = () => {
    logout();
    setShowConfirmPanel(false);
    setMobileOpen(false);
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive ? "text-accent" : "text-muted hover:text-ink"
    }`;

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 border-b border-border bg-surface/90 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <NavLink
            to="/"
            className="font-display text-xl font-semibold tracking-tight text-ink transition-colors duration-200 hover:text-accent"
          >
            DevHunt
          </NavLink>

          <div className="hidden items-center gap-8 md:flex">
            <NavLink to="/jobspage" className={linkClass}>
              Jobs
            </NavLink>

            {user ? (
              <div className="flex items-center gap-4">
                <NavLink
                  to="/profile"
                  className="flex items-center gap-2 text-sm font-medium text-muted transition-colors duration-200 hover:text-ink"
                >
                  <FiUser size={16} />
                  <span className="max-w-32 truncate">{user.username}</span>
                </NavLink>
                <button
                  type="button"
                  onClick={() => setShowConfirmPanel(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted transition-all duration-200 hover:border-accent hover:text-accent cursor-pointer"
                >
                  <FiLogOut size={14} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <NavLink
                  to="/login"
                  className="text-sm font-medium text-muted transition-colors duration-200 hover:text-ink"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="rounded-lg bg-accent px-3.5 py-1.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-hover"
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-border p-2 text-ink md:hidden cursor-pointer"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </nav>

        {mobileOpen && (
          <div className="border-t border-border bg-surface px-4 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              <NavLink
                to="/jobspage"
                className="text-sm font-medium text-ink"
                onClick={() => setMobileOpen(false)}
              >
                Jobs
              </NavLink>
              {user ? (
                <>
                  <NavLink
                    to="/profile"
                    className="text-sm font-medium text-muted"
                    onClick={() => setMobileOpen(false)}
                  >
                    Profile
                  </NavLink>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      setShowConfirmPanel(true);
                    }}
                    className="text-left text-sm font-medium text-muted cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className="text-sm font-medium text-muted"
                    onClick={() => setMobileOpen(false)}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="text-sm font-medium text-accent"
                    onClick={() => setMobileOpen(false)}
                  >
                    Register
                  </NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {showConfirmPanel && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-lg">
            <h2 className="font-display text-xl font-semibold text-ink">
              Sign Out?
            </h2>
            <p className="mt-2 text-sm text-muted">
              You will be logged out of your DevHunt account.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={ConfirmLogOut}
                className="flex-1 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-hover cursor-pointer"
              >
                Logout
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmPanel(false)}
                className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted transition-colors duration-200 hover:text-ink cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
