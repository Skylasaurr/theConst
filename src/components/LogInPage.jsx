import { useState } from "react";
import { DEMO_USER, PASSWORD, users } from "../data/system";
import bg from "../lib/IWS GMAP.png";

function Logo({ large = false }) {
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 220 48" className={large ? "h-12 w-56" : "h-9 w-40"}>
        <path
          d="M60 38 L110 5 L160 38 L145 32 L110 12 L75 32 Z"
          fill="#ffab00"
        />
      </svg>
      <h1
        className={`font-black leading-none tracking-tight text-white ${
          large ? "text-6xl md:text-7xl" : "text-4xl"
        }`}
      >
        IMPIG
      </h1>
      <p
        className={`mt-1 font-bold tracking-wide text-white ${
          large ? "text-lg md:text-2xl" : "text-xs"
        }`}
      >
        CONSTRUCTION SUPPLY
      </p>
    </div>
  );
}

export default function LoginPage({ onLogin, onAttendance, loading }) {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();

    const account = users.find(
      (user) =>
        user.no.toLowerCase() === employeeId.trim().toLowerCase() &&
        DEMO_USER[user.role] === user.id,
    );

    if (!account || password !== PASSWORD) {
      setError("Enter a valid employee ID and password.");
      return;
    }

    setError("");
    onLogin?.(account);
  };

  if (loading) {
    return (
      <div className="impig-loading relative flex min-h-screen items-center justify-center overflow-hidden bg-[#003b2b] text-white">
        <style>{`
          @keyframes bgZoom {
            0% { transform: scale(1); }
            100% { transform: scale(1.13); }
          }

          @keyframes progressMove {
            0% { width: 0%; }
            20% { width: 20%; }
            50% { width: 55%; }
            75% { width: 78%; }
            100% { width: 100%; }
          }

          @keyframes logoFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }

          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(25px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes lightSweep {
            0% { transform: translateX(-120%) skewX(-20deg); }
            100% { transform: translateX(220%) skewX(-20deg); }
          }

          @keyframes glow {
            0%, 100% { opacity: .35; }
            50% { opacity: .8; }
          }

          .loading-bg {
            animation: bgZoom 8s ease-in-out forwards;
          }

          .loading-logo {
            animation: logoFloat 3s ease-in-out infinite, fadeUp 1s ease-out both;
          }

          .loading-title {
            animation: fadeUp 1s .4s ease-out both;
          }

          .loading-progress {
            animation: fadeUp 1s .8s ease-out both;
          }

          .loading-bar {
            animation: progressMove 5.3s ease-in-out forwards;
          }

          .loading-light {
            animation: lightSweep 4s ease-in-out infinite;
          }

          .loading-glow {
            animation: glow 2.5s ease-in-out infinite;
          }
        `}</style>

        {/* Background */}
        <div
          className="loading-bg absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bg})` }}
        />

        <div className="absolute inset-0 bg-[#003b2b]/75" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#002c20]/40 via-transparent to-[#001b13]/90" />

        {/* Moving light effect */}
        <div className="loading-light pointer-events-none absolute -inset-y-20 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Decorative glowing lights */}
        <div className="loading-glow absolute left-[12%] top-[18%] h-40 w-40 rounded-full bg-green-300/10 blur-3xl" />
        <div className="loading-glow absolute bottom-[12%] right-[12%] h-56 w-56 rounded-full bg-amber-400/10 blur-3xl" />

        {/* Loading content */}
        <div className="relative z-10 flex w-full flex-col items-center px-5 text-center">
          <div className="loading-logo">
            <Logo large />
          </div>

          <p className="loading-title mt-5 text-lg italic tracking-wide text-white md:text-2xl">
            Workflow Management System
          </p>

          <div className="loading-progress mt-12 w-80 max-w-[85%]">
            <div className="h-5 overflow-hidden rounded-full bg-white/25 shadow-inner">
              <div className="loading-bar h-full rounded-full bg-gradient-to-r from-[#ff9100] via-[#ffb000] to-[#ffd166] shadow-[0_0_18px_rgba(255,171,0,0.8)]" />
            </div>

            <p className="mt-5 animate-pulse text-sm font-semibold tracking-wide text-white">
              Loading system...
            </p>
          </div>
        </div>

        <p className="absolute bottom-6 z-10 text-xs tracking-wider text-white/70">
          © IMPIG Construction Supply. All rights reserved.
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#edf2ef] p-1 md:h-screen md:overflow-hidden md:p-3">
      <div className="grid min-h-[calc(100vh-8px)] overflow-hidden rounded-2xl bg-white shadow-xl md:h-[calc(100vh-24px)] md:min-h-0 md:grid-cols-[58%_42%]">
        {/* LEFT BRANDING PANEL */}
        <section
          className="relative flex min-h-[430px] flex-col justify-between overflow-hidden bg-cover bg-center p-8 text-white md:min-h-full md:p-12"
          style={{ backgroundImage: `url(${bg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#003d2b]/95 via-[#00452f]/75 to-[#003d2b]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#002e21]/60 via-transparent to-transparent" />

          <div className="relative z-10">
            <Logo />
          </div>

          <div className="relative z-10 my-12 max-w-xl md:my-0">
            <div className="mb-7 h-1.5 w-20 rounded-full bg-[#ffab00]" />

            <p className="mb-5 text-sm font-bold tracking-[0.25em] text-[#ffb300] md:text-base">
              WORKFLOW MANAGEMENT SYSTEM
            </p>

            <h2 className="text-5xl font-extrabold leading-tight md:text-6xl">
              Build Better.
              <br />
              <span className="text-[#ffb300]">Work Smarter.</span>
            </h2>

            <p className="mt-7 max-w-lg text-base leading-8 text-white md:text-lg">
              Manage construction supplies, employee records, attendance, and
              daily business operations in one system.
            </p>
          </div>

          <div className="relative z-10 border-t border-white/30 pt-6">
            <p className="text-sm text-white">
              © IMPIG Construction Supply. All rights reserved.
            </p>
          </div>
        </section>

        {/* RIGHT LOGIN PANEL */}
        <section className="flex items-center justify-center bg-[#f8faf9] px-5 py-10 md:px-8 md:py-4 lg:px-12">
          <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white px-7 py-8 shadow-lg md:px-5 md:py-[clamp(1.5rem,calc(22vh_-_7rem),5rem)]">
            <div className="mb-7 text-center md:mb-3">
              <p className="text-sm font-bold uppercase tracking-widest text-green-800">
                Welcome to IMPIG
              </p>

              <h2 className="mt-2 text-3xl font-extrabold text-[#123c2b] md:mt-3 md:text-4xl">
                Welcome Back!
              </h2>

              <p className="mt-2 text-base text-gray-500 md:mt-3">
                Workflow Management System
              </p>
            </div>

            <form onSubmit={submit} className="space-y-3">
              <input
                className="w-full rounded-xl border border-gray-200 bg-white px-5 py-4 text-gray-800 shadow-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/20 md:py-3"
                value={employeeId}
                onChange={(e) => {
                  setEmployeeId(e.target.value);
                  setError("");
                }}
                placeholder="Employee ID"
                autoComplete="username"
                required
              />

              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  className="w-full rounded-xl border border-gray-200 bg-white px-5 py-4 pr-20 text-gray-800 shadow-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/20 md:py-3"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-green-800"
                >
                  {show ? "Hide" : "Show"}
                </button>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-full bg-[#006333] px-5 py-4 font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#004d28] md:py-3"
              >
                Sign In
              </button>
            </form>

            <button
              type="button"
              onClick={() => onAttendance?.()}
              className="mt-3 w-full rounded-full border-2 border-[#ff9800] bg-[#ffa500] px-5 py-3.5 font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#f39200] md:py-2.5"
            >
              Attendance
            </button>

            <div className="mt-7 rounded-xl border border-green-100 bg-[#f0fbf4] p-4 text-center md:mt-3 md:p-3">
              <p className="text-sm font-bold text-green-900">
                Regular employees
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-600 md:mt-3 md:leading-5">
                Regular staff don't need an account. Tap Attendance to time in
                and out with your ID.
              </p>
            </div>

            <div className="mt-7 text-center md:mt-3">
              <p className="text-xs text-gray-400">
                IMPIG Construction Supply
                <span className="mx-2 text-orange-500">•</span>
                Workflow Management System
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
