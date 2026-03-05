import { useState } from "react";
import { Card } from "../ui/Card";
import { PageHeader } from "../ui/PageHeader";
import { BookingForm } from "../golfbooker/BookingForm";
import { BookingItem } from "../golfbooker/BookingItem";
import { useGolfBookerAuth, useBookings } from "../../hooks/useGolfBooker";
import type { Booking } from "../../types";

const STATUS_ORDER: Record<string, number> = {
  in_progress: 0,
  scheduled: 1,
  completed: 2,
  failed: 3,
  cancelled: 4,
};

interface Props { scrollY: number }

export function GolfBookerPage({ scrollY }: Props) {
  const { user, status, errorMsg } = useGolfBookerAuth();
  const { bookings, error: bookingsError } = useBookings(user?.uid ?? null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  const sorted = [...bookings].sort(
    (a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9),
  );

  return (
    <div>
      <PageHeader title="GolfBooker" subtitle="Automated tee-time booking manager" />

      {status === "loading" && (
        <div className="mb-5 px-4 py-3 bg-warn/8 border border-warn/15 rounded-xl text-sm text-warn">
          Connecting to Firebase…
        </div>
      )}
      {status === "error" && (
        <div className="mb-5 px-4 py-3 bg-danger/8 border border-danger/15 rounded-xl text-sm text-danger">
          Auth failed: {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <Card title="New Booking Request" icon="🆕" noHover depth={1} scrollY={scrollY}>
          {status === "authenticated" && user ? (
            <BookingForm
              userId={user.uid}
              editingBooking={editingBooking}
              onClearEdit={() => setEditingBooking(null)}
            />
          ) : (
            <div className="text-text-secondary text-sm text-center py-6">
              {status === "loading" ? "Signing in…" : "Authentication required"}
            </div>
          )}
        </Card>

        <Card title="Booking Requests" icon="📋" noHover depth={2} scrollY={scrollY}>
          {bookingsError && <div className="text-danger text-sm mb-3">{bookingsError}</div>}
          {status !== "authenticated" ? (
            <div className="text-text-secondary text-sm text-center py-6">Sign in to view bookings</div>
          ) : sorted.length === 0 ? (
            <div className="text-text-secondary text-sm text-center py-6">No booking requests yet. Create one above!</div>
          ) : (
            sorted.map((b) => <BookingItem key={b.id} booking={b} onEdit={setEditingBooking} />)
          )}
        </Card>
      </div>
    </div>
  );
}
