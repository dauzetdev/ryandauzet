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

export function GolfBookerTab() {
  const { user, status, errorMsg } = useGolfBookerAuth();
  const { bookings, error: bookingsError } = useBookings(user?.uid ?? null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  const sorted = [...bookings].sort(
    (a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9),
  );

  return (
    <div>
      <PageHeader title="📅 GolfBooker" subtitle="Automated tee-time booking manager" />

      {/* Auth status banner */}
      {status === "loading" && (
        <div className="mb-4 px-4 py-3 bg-warn/10 border border-warn/20 rounded-xl text-sm text-warn">
          Connecting to Firebase…
        </div>
      )}
      {status === "error" && (
        <div className="mb-4 px-4 py-3 bg-danger/10 border border-danger/20 rounded-xl text-sm text-danger">
          Auth failed: {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] max-md:grid-cols-1 gap-4">
        <Card title="New Booking Request" icon="🆕" span2 noHover>
          {status === "authenticated" && user ? (
            <BookingForm
              userId={user.uid}
              editingBooking={editingBooking}
              onClearEdit={() => setEditingBooking(null)}
            />
          ) : (
            <div className="text-muted text-sm text-center py-6">
              {status === "loading" ? "Signing in…" : "Authentication required"}
            </div>
          )}
        </Card>

        <Card title="Booking Requests" icon="📋" span2 noHover>
          {bookingsError && (
            <div className="text-danger text-sm mb-3">{bookingsError}</div>
          )}
          {status !== "authenticated" ? (
            <div className="text-muted text-sm text-center py-6">
              Sign in to view bookings
            </div>
          ) : sorted.length === 0 ? (
            <div className="text-muted text-sm text-center py-6">
              No booking requests yet. Create one above!
            </div>
          ) : (
            sorted.map((b) => (
              <BookingItem key={b.id} booking={b} onEdit={setEditingBooking} />
            ))
          )}
        </Card>
      </div>
    </div>
  );
}
