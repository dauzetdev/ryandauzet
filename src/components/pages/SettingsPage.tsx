import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { Card } from "../ui/Card";
import { PageHeader } from "../ui/PageHeader";
import { StatRow } from "../ui/StatRow";
import { ThemeToggle } from "../ui/ThemeToggle";
import { StatusDot } from "../ui/StatusDot";
import { useVitals } from "../../hooks/useVitals";

export function SettingsPage() {
  const { resolved } = useTheme();
  const { user } = useAuth();
  const { data: vitals, error: vitalsError } = useVitals();

  return (
    <div>
      <PageHeader title="Settings" subtitle="Preferences and connection status" />

      <div className="flex flex-wrap gap-5">
        <Card title="Appearance" icon="🎨">
          <div className="mb-4">
            <div className="text-sm text-text-secondary mb-3">Color Mode</div>
            <ThemeToggle />
          </div>
          <StatRow label="Active theme">{resolved === "dark" ? "Dark" : "Light"}</StatRow>
        </Card>

        <Card title="Connections" icon="🔗">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">OpenClaw Gateway</span>
              <div className="flex items-center gap-1.5">
                <StatusDot status={!vitalsError ? "ok" : "error"} />
                <span className="text-text">{!vitalsError ? "Connected" : "Unreachable"}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Firebase (GolfBooker)</span>
              <div className="flex items-center gap-1.5">
                <StatusDot status="ok" />
                <span className="text-text">Connected</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Claude API</span>
              <div className="flex items-center gap-1.5">
                <StatusDot status="ok" />
                <span className="text-text">Connected</span>
              </div>
            </div>
          </div>
        </Card>

        <Card title="User" icon="👤">
          <StatRow label="Email">{user?.email ?? "—"}</StatRow>
          <StatRow label="UID">{user?.uid ? user.uid.slice(0, 12) + "…" : "—"}</StatRow>
          <StatRow label="Provider">{user?.providerData?.[0]?.providerId ?? "email"}</StatRow>
        </Card>

        <Card title="System" icon="🖥️">
          <StatRow label="Version">{vitals?.version ?? "—"}</StatRow>
          <StatRow label="Host">{vitals?.host?.machine ?? "—"}</StatRow>
          <StatRow label="Node">{vitals?.host?.node ?? "—"}</StatRow>
        </Card>
      </div>
    </div>
  );
}
