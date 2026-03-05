import { useAuth } from "./context/AuthContext";
import { LoginScreen } from "./components/auth/LoginScreen";
import { AppShell } from "./components/layout/AppShell";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-text-secondary text-sm">Loading…</div>
      </div>
    );
  }

  return user ? <AppShell /> : <LoginScreen />;
}
