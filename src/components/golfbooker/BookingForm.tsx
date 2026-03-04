import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { golfBookerApp } from "../../lib/firebase";
import { ACCOUNT_OWNER_MAP } from "../../lib/constants";
import { FoursomeEditor, type FoursomeState } from "./FoursomeEditor";
import { Button } from "../ui/Button";
import type { Booking } from "../../types";

interface Props {
  userId: string;
  editingBooking: Booking | null;
  onClearEdit: () => void;
}

let nextId = 1;
function makeFoursome(): FoursomeState {
  return { id: nextId++, account: "rdauzet", targetTime: "8:10 AM", players: [] };
}

function formatDropDate(targetDate: string, execTime: string): string {
  const drop = new Date(targetDate + "T00:00:00");
  drop.setDate(drop.getDate() - 8);
  const dropStr = drop.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
  const [h, m] = execTime.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `Drop: ${dropStr} — exec at ${h12}:${String(m).padStart(2, "0")} ${ap} PST`;
}

export function BookingForm({ userId, editingBooking, onClearEdit }: Props) {
  const [targetDate, setTargetDate] = useState("");
  const [execTime, setExecTime] = useState("18:55");
  const [bookNow, setBookNow] = useState(false);
  const [foursomes, setFoursomes] = useState<FoursomeState[]>([makeFoursome()]);
  const [submitting, setSubmitting] = useState(false);

  // Load editing booking into form
  useEffect(() => {
    if (!editingBooking) return;
    setTargetDate(editingBooking.targetDate ?? "");
    const isNow = editingBooking.dropTime === "now";
    setBookNow(isNow);
    setExecTime(isNow ? "18:55" : (editingBooking.dropTime ?? "18:55"));
    setFoursomes(
      (editingBooking.foursomes ?? []).map((fs) => ({
        id: nextId++,
        account: fs.account,
        targetTime: fs.targetTime,
        players: [...fs.players],
      })),
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [editingBooking]);

  const allPlayers = foursomes.flatMap((f) => f.players);

  const updateFoursome = (id: number, patch: Partial<FoursomeState>) =>
    setFoursomes((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));

  const removeFoursome = (id: number) =>
    setFoursomes((prev) => prev.filter((f) => f.id !== id));

  const addFoursome = () => {
    if (foursomes.length >= 4) return;
    setFoursomes((prev) => [...prev, makeFoursome()]);
  };

  const reset = () => {
    setTargetDate("");
    setExecTime("18:55");
    setBookNow(false);
    setFoursomes([makeFoursome()]);
    onClearEdit();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetDate || !foursomes.length) return;
    setSubmitting(true);

    const drop = new Date(targetDate + "T00:00:00");
    drop.setDate(drop.getDate() - 8);

    const docData = {
      userId,
      targetDate,
      dropDate: drop.toISOString().split("T")[0],
      dropTime: bookNow ? "now" : execTime,
      status: bookNow ? "in_progress" : "scheduled",
      foursomes: foursomes.map((fs) => ({
        account: fs.account,
        accountOwner: ACCOUNT_OWNER_MAP[fs.account] ?? fs.account,
        targetTime: fs.targetTime,
        players: [...fs.players],
      })),
      results: [],
      updatedAt: serverTimestamp(),
    };

    try {
      const db = getFirestore(golfBookerApp);
      if (editingBooking) {
        await updateDoc(doc(db, "bookingRequests", editingBooking.id), docData);
      } else {
        await addDoc(collection(db, "bookingRequests"), {
          ...docData,
          createdAt: serverTimestamp(),
        });
      }
      reset();
    } catch (err) {
      alert("Error saving booking: " + (err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const isEditing = !!editingBooking;

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      {isEditing && (
        <div className="mb-4 px-3 py-2.5 bg-accent/10 border border-accent/20 rounded-lg text-sm text-accent flex items-center justify-between">
          <span>Editing booking for {editingBooking?.targetDate}</span>
          <button type="button" onClick={reset} className="text-muted hover:text-text text-xs underline">
            Cancel edit
          </button>
        </div>
      )}

      {/* Target date */}
      <div className="mb-4">
        <label className="block text-xs uppercase tracking-wider text-muted mb-1.5">
          Target Play Date
        </label>
        <input
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          required
          className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text outline-none focus:border-accent transition-[border-color] duration-150"
        />
        {targetDate && (
          <div className="mt-2 text-xs text-cyan px-3 py-2 bg-cyan/[0.08] rounded-lg">
            {formatDropDate(targetDate, execTime)}
          </div>
        )}
      </div>

      {/* Execution time */}
      <div className="mb-4">
        <label className="block text-xs uppercase tracking-wider text-muted mb-1.5">
          Execution Time
        </label>
        <div className="flex gap-2 items-center flex-wrap">
          <input
            type="time"
            value={execTime}
            onChange={(e) => setExecTime(e.target.value)}
            disabled={bookNow}
            className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text outline-none focus:border-accent transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ maxWidth: 140 }}
          />
          <span className="text-xs text-muted">
            {bookNow
              ? "Booking will start immediately upon submission"
              : "PST — when to start the booking attempt"}
          </span>
        </div>
        <label className="flex items-center gap-2 mt-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={bookNow}
            onChange={(e) => setBookNow(e.target.checked)}
            className="w-4 h-4 accent-accent cursor-pointer"
          />
          <span className="text-sm">Book Now</span>
          <span className="text-xs text-muted">— skip scheduling, run immediately</span>
        </label>
      </div>

      {/* Foursomes */}
      <div className="mb-4">
        <label className="block text-xs uppercase tracking-wider text-muted mb-2">
          Foursomes
        </label>
        {foursomes.map((fs, i) => (
          <FoursomeEditor
            key={fs.id}
            foursome={fs}
            index={i}
            showRemove={foursomes.length > 1}
            allPlayers={allPlayers}
            onChange={updateFoursome}
            onRemove={removeFoursome}
          />
        ))}
        {foursomes.length < 4 && (
          <Button type="button" variant="secondary" size="sm" onClick={addFoursome} className="mt-1">
            + Add Foursome
          </Button>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={submitting}
          disabled={!targetDate || foursomes.length === 0}
        >
          {isEditing ? "Update Booking" : bookNow ? "Book Now" : "Schedule Booking"}
        </Button>
      </div>
    </form>
  );
}
