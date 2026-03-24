interface Props { scrollY: number }

export function GolfBookerPage({ scrollY: _ }: Props) {
  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={pageTitle}>GolfBooker</h1>
        <p style={pageSubtitle}>Automated reservation monitoring & booking</p>
      </div>

      {/* Reservation cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 16, marginBottom: 32 }}>
        {/* Delilah Las Vegas */}
        <div style={cardBase}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={cardHeader}><span>🍸</span> Delilah — Las Vegas</div>
            <Pill type="ok">Upcoming</Pill>
          </div>
          <InfoRow label="Date">August 8, 2026</InfoRow>
          <InfoRow label="Time">6:00 PM</InfoRow>
          <InfoRow label="Party Size">4</InfoRow>
          <InfoRow label="Platform">SevenRooms</InfoRow>
          <InfoRow label="Venue">Wynn Las Vegas</InfoRow>
          <div style={noteBox}>
            Reservation confirmed. SevenRooms booking window opens 30 days out. Drop time is typically 9:00 AM PT.
          </div>
        </div>

        {/* Din Tai Fung */}
        <div style={cardBase}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={cardHeader}><span>🥟</span> Din Tai Fung — Santa Clara</div>
            <Pill type="info">Monitoring</Pill>
          </div>
          <InfoRow label="Target Date">March 29, 2026</InfoRow>
          <InfoRow label="Time">6:00 PM</InfoRow>
          <InfoRow label="Party Size">2</InfoRow>
          <InfoRow label="Platform">Yelp Reservations</InfoRow>
          <InfoRow label="Location">Westfield Valley Fair, Santa Clara</InfoRow>
          <div style={noteBox}>
            Monitoring for availability. Yelp Reservations typically opens 2-4 weeks out. Auto-book enabled.
          </div>
        </div>
      </div>

      {/* Booking Notes */}
      <div style={sectionLabel}>Booking Notes</div>
      <div style={{ ...cardBase, padding: 0, overflow: "hidden" }}>
        {[
          { label: "SevenRooms", detail: "Booking window opens 30 days before date. Drop time ~9:00 AM PT. Requires account login." },
          { label: "Yelp Reservations", detail: "2-4 week window. No login required for availability check. Auto-booking uses saved credentials." },
          { label: "Resy", detail: "Varies by venue. Some release same-day, others 14-30 days out. Fastest drops at midnight ET." },
          { label: "OpenTable", detail: "Standard 30-day window. Points system for priority access at select venues." },
        ].map((note, i, arr) => (
          <div key={note.label} style={{
            padding: "14px 20px",
            borderBottom: i < arr.length - 1 ? "1px solid var(--color-border)" : "none",
          }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: "var(--color-text)", marginBottom: 4 }}>{note.label}</div>
            <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>{note.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Helpers ───────────────────────────────────────────────────────────────── */

const pageTitle: React.CSSProperties = {
  fontSize: "1.75rem", fontWeight: 700, color: "var(--color-text)", letterSpacing: "-0.02em",
};
const pageSubtitle: React.CSSProperties = {
  fontSize: 14, color: "var(--color-text-secondary)", marginTop: 4,
};
const cardBase: React.CSSProperties = {
  background: "var(--color-card)", border: "1px solid var(--color-border)",
  borderRadius: 12, padding: "20px 24px", boxShadow: "var(--shadow-card)",
};
const cardHeader: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 8,
  fontWeight: 600, fontSize: 15, color: "var(--color-text)",
};
const sectionLabel: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, letterSpacing: "0.06em",
  textTransform: "uppercase", color: "var(--color-text-secondary)", marginBottom: 12,
};
const noteBox: React.CSSProperties = {
  marginTop: 16, padding: "12px 16px", borderRadius: 8, fontSize: 13,
  background: "var(--color-surface)", color: "var(--color-text-secondary)", lineHeight: 1.5,
};

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "10px 0", borderBottom: "1px solid var(--color-border)", fontSize: 14,
    }}>
      <span style={{ color: "var(--color-text-secondary)" }}>{label}</span>
      <span style={{ color: "var(--color-text)", fontWeight: 500 }}>{children}</span>
    </div>
  );
}

const PILL_STYLES = {
  ok:   { bg: "rgba(22,163,74,0.1)", text: "var(--color-success)" },
  warn: { bg: "rgba(217,119,6,0.1)", text: "var(--color-warn)" },
  info: { bg: "rgba(37,99,235,0.1)", text: "var(--color-accent)" },
};

function Pill({ type, children }: { type: keyof typeof PILL_STYLES; children: React.ReactNode }) {
  const c = PILL_STYLES[type];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: "2px 10px",
      borderRadius: 9999, fontSize: 11, fontWeight: 600, background: c.bg, color: c.text,
    }}>
      {children}
    </span>
  );
}
