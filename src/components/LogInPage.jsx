import { useState } from "react";
import Button from "./Button";
import { PASSWORD } from "../data/system";
import bg from "../lib/IWS GMAP.png";

export default function LoginPage({ onLogin, onAttendance }) {
  const [showForm, setShowForm] = useState(false); // false = buttons, true = form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false); // show/hide password text
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!username.trim() || password !== PASSWORD) {
      setError("Enter a username or email and the correct password.");
      return;
    }
    setError("");
    onLogin?.({ username: username.trim() });
  };

  const cancel = () => {
    setShowForm(false);
    setUsername("");
    setPassword("");
    setShow(false);
    setError("");
  };

  const field = "w-full rounded border border-line bg-surface px-2.5 py-2";

  return (
    <div
      className="relative grid min-h-screen place-items-center bg-cover bg-center p-4 pb-50"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 w-[350px] max-w-sm bg-surface/90 rounded-lg border border-line p-6 shadow-lg backdrop-blur-lg">
        <div>
          <h1 className="mb-4 border-b-5 border-amber-600 pb-4 text-center text-5xl font-bold text-emerald-500">
            IMPIG
          </h1>
          <h2 className="pb-2 text-center text-xl font-bold text-muted">
            CONSTRUCTION SUPPLY
          </h2>
          <p className="text-center text-muted">Workflow Management System</p>
        </div>

        {showForm ? (
          /* Sign in form: replaces the two buttons */
          <form onSubmit={submit} className="mt-6">
            <div className="grid gap-3">
              <label className="flex flex-col gap-1">
                Username or email
                <input
                  className={field}
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter username or email"
                  autoComplete="username"
                  autoFocus
                />
              </label>

              <label className="flex flex-col gap-1">
                Password
                <div className="flex gap-2">
                  <input
                    type={show ? "text" : "password"}
                    className={`${field} min-w-0 flex-1`}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter password"
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShow((s) => !s)}
                    aria-pressed={show}
                  >
                    {show ? "Hide" : "Show"}
                  </Button>
                </div>
              </label>
            </div>

            {error && (
              <p role="alert" className="mt-3 mb-0 text-sm text-bad">
                {error}
              </p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={cancel}>
                Cancel
              </Button>
              <Button type="submit" variant="green">
                Sign In
              </Button>
            </div>
          </form>
        ) : (
          /* Sign In / Attendance buttons */
          <div className="mt-6">
            <button
              type="button"
              className="w-full rounded-full bg-emerald-700 px-4 py-2 text-lg font-bold text-white hover:bg-emerald-800"
              onClick={() => setShowForm(true)}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={onAttendance}
              className="mt-4 w-full rounded-full bg-amber-400 px-4 py-2 text-lg font-bold text-surface hover:bg-amber-500"
            >
              Attendance
            </button>
            <p className="mt-4 text-center text-sm text-muted">
              Regular staff don't need an account. Tap Attendance to time in and
              out with your ID.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
