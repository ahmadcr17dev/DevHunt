import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HeroSection = () => {
  const { user } = useAuth();

  return (
    <section className="relative flex h-dvh flex-col overflow-hidden bg-bg">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 hero-atmosphere" />
        <div className="absolute inset-0 hero-grid" />

        <div className="absolute -right-[18%] top-[-12%] h-[min(72vmin,28rem)] w-[min(72vmin,28rem)] rounded-full bg-accent/25 blur-3xl hero-orb-a sm:-right-[12%] sm:top-[-8%]" />
        <div className="absolute -left-[16%] bottom-[-14%] h-[min(58vmin,22rem)] w-[min(58vmin,22rem)] rounded-full bg-accent-soft blur-3xl hero-orb-b" />
        <div className="absolute right-[6%] top-[20%] hidden h-[min(36vmin,16rem)] w-[min(36vmin,16rem)] rounded-full border border-accent/25 hero-ring sm:block" />
        <div className="absolute right-[12%] top-[26%] hidden h-[min(24vmin,11rem)] w-[min(24vmin,11rem)] rounded-full border border-accent/35 hero-ring-delay md:block" />

        <span className="hero-sparkle absolute left-[18%] top-[28%] h-1.5 w-1.5 rounded-full bg-accent" />
        <span className="hero-sparkle-delay absolute left-[72%] top-[18%] h-2 w-2 rounded-full bg-accent/70" />
        <span className="hero-sparkle-slow absolute left-[58%] top-[68%] h-1 w-1 rounded-full bg-ink/40" />

        <svg
          className="absolute inset-0 hidden h-full w-full sm:block"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="heroLine" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#059669" stopOpacity="0" />
              <stop offset="45%" stopColor="#059669" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="0.12" />
            </linearGradient>
          </defs>
          <path
            d="M80 760 C 320 600, 480 680, 700 500 S 1080 260, 1420 320"
            stroke="url(#heroLine)"
            strokeWidth="2.5"
            className="hero-path"
          />
          <path
            d="M160 820 C 400 660, 560 720, 780 560 S 1140 340, 1400 420"
            stroke="#059669"
            strokeOpacity="0.2"
            strokeWidth="1.5"
            className="hero-path-soft"
          />
          <circle cx="700" cy="500" r="8" fill="#059669" className="hero-path-dot" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto grid h-full w-full max-w-6xl flex-1 grid-cols-1 items-center gap-8 px-4 pb-14 pt-20 sm:px-6 sm:pb-16 sm:pt-24 lg:grid-cols-2 lg:gap-12 lg:px-8">
        <div className="min-w-0">
          <p className="hero-brand font-display font-bold tracking-tight text-ink text-[clamp(2.5rem,10vw,5.5rem)]">
            DevHunt
          </p>

          <div className="mt-3 w-full max-w-md sm:mt-5 sm:max-w-lg">
            <h1 className="hero-fade-2 font-display font-normal leading-snug text-ink text-[clamp(1.25rem,4.2vw,2.25rem)]">
              Find work that fits how you build.
            </h1>
            <p className="hero-fade-3 mt-3 text-muted sm:mt-4 text-[clamp(0.9rem,2.4vw,1.125rem)] leading-relaxed">
              A focused job platform for developers — clear roles, real teams, fewer distractions.
            </p>
          </div>

          <div className="hero-fade-4 mt-7 flex w-full flex-col gap-3 sm:mt-9 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
            <NavLink
              to="/jobspage"
              className="hero-cta-primary inline-flex w-full items-center justify-center rounded-lg bg-accent px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-accent-hover sm:w-auto sm:px-7"
            >
              Browse jobs
            </NavLink>

            {user ? (
              <NavLink
                to="/profile"
                className="hero-cta-secondary inline-flex w-full items-center justify-center rounded-lg border border-border bg-surface/85 px-6 py-3.5 text-sm font-semibold text-ink backdrop-blur-sm transition-all duration-200 hover:border-accent hover:text-accent sm:w-auto sm:px-7"
              >
                Your profile
              </NavLink>
            ) : (
              <NavLink
                to="/register"
                className="hero-cta-secondary inline-flex w-full items-center justify-center rounded-lg border border-border bg-surface/85 px-6 py-3.5 text-sm font-semibold text-ink backdrop-blur-sm transition-all duration-200 hover:border-accent hover:text-accent sm:w-auto sm:px-7"
              >
                Create account
              </NavLink>
            )}
          </div>
        </div>

        {/* Right-side job hunt animation — aligned with copy */}
        <div
          className="hero-job-stage relative mx-auto hidden w-full max-w-md lg:mx-0 lg:block lg:max-w-none"
          aria-hidden="true"
        >
          <div className="hero-search mb-4 flex items-center gap-2 rounded-2xl border border-border/80 bg-surface/90 px-4 py-3 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-md">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-accent hero-search-dot" />
            <span className="hero-type text-sm font-medium text-ink/80">
              React developer jobs
            </span>
            <span className="hero-caret h-4 w-0.5 shrink-0 bg-accent" />
          </div>

          <div className="relative space-y-3">
            <div className="hero-job hero-job-1 rounded-2xl border border-border/70 bg-surface/90 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.1)] backdrop-blur-md">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">
                    Senior Frontend Engineer
                  </p>
                  <p className="mt-1 text-xs text-muted">Remote · React · TypeScript</p>
                </div>
                <span className="hero-match shrink-0 rounded-full bg-accent-soft px-2.5 py-1 text-[10px] font-bold tracking-wide text-accent">
                  98% match
                </span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border/70">
                <div className="hero-progress h-full rounded-full bg-accent" />
              </div>
            </div>

            <div className="hero-job hero-job-2 rounded-2xl border border-border/70 bg-surface/85 p-4 shadow-[0_14px_36px_rgba(15,23,42,0.08)] backdrop-blur-md">
              <p className="truncate text-sm font-semibold text-ink">Backend Engineer</p>
              <p className="mt-1 text-xs text-muted">Hybrid · Node · PostgreSQL</p>
              <div className="mt-3 flex gap-2">
                <span className="rounded-md bg-accent-soft px-2 py-0.5 text-[10px] font-semibold text-accent">
                  Full-time
                </span>
                <span className="rounded-md bg-bg px-2 py-0.5 text-[10px] font-semibold text-muted">
                  $120k+
                </span>
              </div>
            </div>

            <div className="hero-job hero-job-3 rounded-2xl border border-border/60 bg-surface/80 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur-md">
              <p className="truncate text-sm font-semibold text-ink">DevOps Specialist</p>
              <p className="mt-1 text-xs text-muted">On-site · AWS · Kubernetes</p>
            </div>

            <div className="pointer-events-none absolute -left-5 top-14 hero-float-tag rounded-full border border-accent/30 bg-accent px-3 py-1 text-[11px] font-semibold text-white shadow-lg">
              Apply now
            </div>
            <div className="pointer-events-none absolute -right-3 bottom-6 hero-float-tag-delay rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-semibold text-ink shadow-md">
              New role
            </div>
            <div className="pointer-events-none absolute right-4 -top-2 hero-float-tag-slow rounded-full border border-accent/20 bg-accent-soft px-3 py-1 text-[11px] font-semibold text-accent">
              Hiring
            </div>
          </div>
        </div>
      </div>

      <p className="hero-fade-4 relative z-10 pb-3 text-center text-[11px] text-muted/80 sm:pb-4 sm:text-xs">
        &copy; {new Date().getFullYear()} DevHunt
      </p>
    </section>
  );
};

export default HeroSection;
