import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HeroSection = () => {
  const { user } = useAuth();

  return (
    <section className="relative min-h-screen overflow-hidden bg-bg">
      {/* Full-bleed atmosphere */}
      <div
        className="pointer-events-none absolute inset-0 hero-atmosphere"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(11, 31, 51, 0.06) 1px, transparent 0)",
          backgroundSize: "28px 28px",
          maskImage:
            "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <p className="hero-fade-1 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl md:text-6xl lg:text-7xl">
          DevHunt
        </p>

        <h1 className="hero-fade-2 mt-5 max-w-2xl font-display text-2xl font-medium leading-snug text-ink sm:text-3xl md:text-4xl">
          Find work that fits how you build.
        </h1>

        <p className="hero-fade-3 mt-4 max-w-md text-base leading-relaxed text-muted sm:text-lg">
          A focused job platform for developers — clear roles, real teams, fewer distractions.
        </p>

        <div className="hero-fade-4 mt-10 flex flex-wrap items-center gap-3">
          <NavLink
            to="/jobspage"
            className="inline-flex items-center justify-center rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-accent-hover hover:shadow-[0_8px_24px_rgba(14,124,123,0.25)]"
          >
            Browse jobs
          </NavLink>

          {user ? (
            <NavLink
              to="/profile"
              className="inline-flex items-center justify-center rounded-lg border border-border bg-surface px-6 py-3 text-sm font-semibold text-ink transition-all duration-200 hover:border-accent hover:text-accent"
            >
              Your profile
            </NavLink>
          ) : (
            <NavLink
              to="/register"
              className="inline-flex items-center justify-center rounded-lg border border-border bg-surface px-6 py-3 text-sm font-semibold text-ink transition-all duration-200 hover:border-accent hover:text-accent"
            >
              Create account
            </NavLink>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
