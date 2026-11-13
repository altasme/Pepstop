import { useState } from "react";
import { api, errorText } from "../api";
import { AuthShell } from "../brand";

export default function Login({ onDone }: { onDone: () => void }) {
  const [username, setU] = useState(""); const [password, setP] = useState("");
  const [show, setShow] = useState(false); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const [reset, setReset] = useState(false); const [token, setToken] = useState(""); const [next, setNext] = useState(""); const [done, setDone] = useState(false);

  if (reset) {
    return (
      <AuthShell title="Reset administrator password" lead="Password recovery is handled by the developer team. They will give you a one-time reset token. Contact Altaventures to request one.">
        {done ? (
          <div className="stack"><p className="note">Password updated. You can sign in now.</p><button type="button" className="btn pink" onClick={() => { setReset(false); setDone(false); }}>Back to sign in</button></div>
        ) : (
          <form className="stack" onSubmit={async (e) => {
            e.preventDefault(); setErr(""); setBusy(true);
            try { await api("POST", "/reset-password", { token, next }); setDone(true); } catch (x) { setErr(errorText(x)); }
            setBusy(false);
          }}>
            <label className="field"><span>Reset token</span><input value={token} onChange={(e) => setToken(e.target.value)} autoComplete="off" required /></label>
            <label className="field"><span>New password</span><input type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} minLength={10} required /></label>
            {err && <p className="note error" role="alert">{err}</p>}
            <button className="btn pink" disabled={busy}>{busy ? "Saving..." : "Reset password"}</button>
            <button type="button" className="btn ghost" onClick={() => setReset(false)}>Cancel</button>
          </form>
        )}
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Welcome back" lead="Sign in to manage The Pep Stop.">
      <form className="stack" onSubmit={async (e) => {
        e.preventDefault(); setErr(""); setBusy(true);
        try { await api("POST", "/login", { username, password }); onDone(); } catch (x) { setErr(errorText(x)); }
        setBusy(false);
      }}>
        <label className="field"><span>Username</span><input value={username} onChange={(e) => setU(e.target.value)} autoComplete="username" autoCapitalize="none" required /></label>
        <label className="field"><span>Password</span>
          <span className="pw"><input type={show ? "text" : "password"} value={password} onChange={(e) => setP(e.target.value)} autoComplete="current-password" required />
            <button type="button" className="btn ghost sm" aria-pressed={show} onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</button></span>
        </label>
        {err && <p className="note error" role="alert">{err}</p>}
        <button className="btn pink" disabled={busy}>{busy ? "Signing in..." : "Sign In"}</button>
        <button type="button" className="btn ghost" onClick={() => setReset(true)}>Forgot password</button>
      </form>
    </AuthShell>
  );
}
