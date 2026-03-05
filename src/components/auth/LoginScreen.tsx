import { useState, type FormEvent } from "react";
import { useAuth } from "../../context/AuthContext";

export function LoginScreen() {
  const { login, error: authError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const displayError = error || authError;

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🐦</div>
          <h1 className="text-2xl font-bold text-text">Command Center</h1>
          <p className="text-sm text-text-secondary mt-1">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 shadow-card border border-border">
          {displayError && (
            <div className="mb-4 px-3 py-2.5 bg-danger/10 rounded-xl text-sm text-danger text-center">
              {displayError}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wide">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-xl text-sm text-text placeholder:text-muted outline-none focus:border-accent transition-colors"
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wide">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Password"
              className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-xl text-sm text-text placeholder:text-muted outline-none focus:border-accent transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
