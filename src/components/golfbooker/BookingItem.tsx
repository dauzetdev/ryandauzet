import { useState, useEffect, useRef } from "react";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { golfBookerApp } from "../../lib/firebase";
import { Pill } from "../ui/Pill";
import { Button } from "../ui/Button";
import type { Booking, PillVariant } from "../../types";

interface LogEntry {
  timestamp: { seconds: number } | number | null;
  level: string;
  message: string;
}

const STATUS_PILL: Record<string, PillVariant> = {
  scheduled: "blue",
  in_progress: "warn",
  completed: "ok",
  failed: "error",
  cancelled: "error",
};

function formatTime(dropTime: string) {
  const [h, m] = (dropTime || "18:55").split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${h12}:${String(m).padStart(2, "0")} ${ap}`;
}

interface Props {
  booking: Booking;
  onEdit: (b: Booking) => void;
}

export function BookingItem({ booking, onEdit }: Props) {
  const [logsOpen, setLogsOpen] = useState(booking.status === "in_progress");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const logBottomRef = useRef<HTMLDivElement>(null);
  const unsubRef = useRef<(() => void) | null>(null);

  const showLogs =
    booking.status === "in_progress" ||
    booking.status === "completed" ||
    booking.status === "failed";

  useEffect(() => {
    if (!logsOpen || !showLogs) return;
    setLogsLoading(true);
    const db = getFirestore(golfBookerApp);
    const logsQ = query(
      collection(db, "bookingRequests", booking.id, "logs"),
      orderBy("timestamp", "asc"),
    );
    unsubRef.current = onSnapshot(logsQ, (snap) => {
      setLogs(snap.docs.map((d) => d.data() as LogEntry));
      setLogsLoading(false);
      setTimeout(() => logBottomRef.current?.scrollIntoView({ block: "nearest" }), 50);
    });
    return () => { unsubRef.current?.(); unsubRef.current = null; };
  }, [logsOpen, booking.id, showLogs]);

  const toggleLogs = () => {
    if (logsOpen) { unsubRef.current?.(); unsubRef.current = null; }
    setLogsOpen((v) => !v);
  };

  const handleCancel = async () => {
    const msg =
      booking.status === "in_progress"
        ? "This booking is currently running. Cancel and stop execution?"
        : "Cancel this booking request?";
    if (!confirm(msg)) return;
    setCancelling(true);
    try {
      const db = getFirestore(golfBookerApp);
      if (booking.status === "in_progress") {
        await updateDoc(doc(db, "bookingRequests", booking.id), {
          status: "cancelled",
          updatedAt: serverTimestamp(),
        });
      } else {
        await deleteDoc(doc(db, "bookingRequests", booking.id));
      }
    } catch (err) {
      alert("Error cancelling: " + (err as Error).message);
      setCancelling(false);
    }
  };

  const targetDate = booking.targetDate
    ? new Date(booking.targetDate + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "short", month: "short", day: "numeric", year: "numeric",
      })
    : "—";
  const dropDate = booking.dropDate
    ? new Date(booking.dropDate + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "short", month: "short", day: "numeric",
      })
    : "—";

  const canEdit =
    booking.status === "scheduled" || booking.status === "in_progress";

  return (
    <div className="border border-border rounded-xl p-4 mb-3 last:mb-0 bg-surface">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm text-text">{targetDate}</span>
          <Pill variant={STATUS_PILL[booking.status] ?? "idle"}>
            {booking.status?.replace("_", " ")}
          </Pill>
        </div>
        <div className="flex gap-1.5">
          {canEdit && (
            <Button size="sm" variant="secondary" onClick={() => onEdit(booking)}>Edit</Button>
          )}
          {canEdit && (
            <Button size="sm" variant="danger" loading={cancelling} onClick={handleCancel}>Cancel</Button>
          )}
        </div>
      </div>

      <div className="text-xs text-text-secondary mb-2">
        Drop: {dropDate} — exec at{" "}
        {booking.dropTime === "now" ? "immediately" : formatTime(booking.dropTime)} PST
      </div>

      {(booking.foursomes ?? []).map((fs, i) => (
        <div key={i} className="py-1.5 border-b border-border last:border-b-0 text-sm">
          <span className="font-medium text-text">{fs.accountOwner}</span>
          <span className="text-text-secondary"> ({fs.account}) at </span>
          <span className="font-medium text-text">{fs.targetTime}</span>
          <span className="text-text-secondary">
            {" — "}
            {fs.players.length ? fs.players.join(", ") : "no players"}
          </span>
        </div>
      ))}

      {showLogs && (
        <div className="mt-3">
          <button
            type="button"
            onClick={toggleLogs}
            className="text-xs text-accent hover:underline bg-transparent border-none cursor-pointer font-[inherit] p-0"
          >
            {logsOpen ? "▼ Hide Logs" : "▶ Show Logs"}
          </button>
          {logsOpen && (
            <div className="mt-2 bg-bg border border-border rounded-xl max-h-48 overflow-y-auto font-mono text-[0.7rem] leading-relaxed p-2">
              {logsLoading && <div className="text-text-secondary">Loading logs…</div>}
              {!logsLoading && logs.length === 0 && (
                <div className="text-text-secondary">No logs yet — waiting for execution…</div>
              )}
              {logs.map((log, i) => {
                const ts = log.timestamp
                  ? new Date(
                      typeof log.timestamp === "object"
                        ? log.timestamp.seconds * 1000
                        : log.timestamp,
                    ).toLocaleTimeString("en-US", {
                      hour: "numeric", minute: "2-digit", second: "2-digit",
                    })
                  : "";
                const color =
                  log.level === "success" ? "text-success"
                    : log.level === "error" ? "text-danger"
                    : log.level === "warning" ? "text-warn"
                    : "text-text";
                return (
                  <div key={i} className={color}>
                    <span className="text-accent">[{ts}]</span> {log.message}
                  </div>
                );
              })}
              <div ref={logBottomRef} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
