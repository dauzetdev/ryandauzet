import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--color-text)", letterSpacing: "-0.02em" }}>
          Settings
        </h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", marginTop: 4 }}>
          Preferences & account
        </p>
      </div>

      <div style={{ display: "grid", gap: 16, maxWidth: 480 }}>
        {/* Theme selector */}
        <div style={cardBase}>
          <div style={sectionLabel}>Appearance</div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            {(["light", "dark", "system"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  borderRadius: 8,
                  border: theme === t ? "2px solid var(--color-accent)" : "1px solid var(--color-border)",
                  background: theme === t ? "rgba(37,99,235,0.08)" : "var(--color-surface)",
                  color: theme === t ? "var(--color-accent)" : "var(--color-text-secondary)",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  textTransform: "capitalize",
                  fontFamily: "inherit",
                }}
              >
                {t === "light" ? "☀️" : t === "dark" ? "🌙" : "💻"} {t}
              </button>
            ))}
          </div>
        </div>

        {/* Sign out */}
        <div style={cardBase}>
          <div style={sectionLabel}>Account</div>
          <button
            onClick={logout}
            style={{
              marginTop: 12,
              width: "100%",
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid var(--color-border)",
              background: "var(--color-surface)",
              color: "var(--color-danger)",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s",
              fontFamily: "inherit",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(220,38,38,0.08)";
              e.currentTarget.style.borderColor = "var(--color-danger)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "var(--color-surface)";
              e.currentTarget.style.borderColor = "var(--color-border)";
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

const cardBase: React.CSSProperties = {
  background: "var(--color-card)", border: "1px solid var(--color-border)",
  borderRadius: 12, padding: "20px 24px", boxShadow: "var(--shadow-card)",
};
const sectionLabel: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, letterSpacing: "0.06em",
  textTransform: "uppercase", color: "var(--color-text-secondary)",
};
