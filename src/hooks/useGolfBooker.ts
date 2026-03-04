import { useState, useEffect } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  type User,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { golfBookerApp } from "../lib/firebase";
import type { Booking } from "../types";

// ── Auth ──────────────────────────────────────────────────────────────────────

export type AuthStatus = "loading" | "authenticated" | "error";

export function useGolfBookerAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const auth = getAuth(golfBookerApp);
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        setStatus("authenticated");
      } else {
        const email =
          import.meta.env.VITE_FIREBASE_EMAIL ?? "rdauzet@gmail.com";
        const password = import.meta.env.VITE_FIREBASE_PASSWORD ?? "F@1rn3ss";
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (e) {
          setStatus("error");
          setErrorMsg((e as Error).message);
        }
      }
    });
    return unsub;
  }, []);

  return { user, status, errorMsg };
}

// ── Bookings ──────────────────────────────────────────────────────────────────

export function useBookings(userId: string | null) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    const db = getFirestore(golfBookerApp);
    const q = query(
      collection(db, "bookingRequests"),
      orderBy("createdAt", "desc"),
    );
    return onSnapshot(
      q,
      (snap) =>
        setBookings(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Booking)),
      (err) => setError(err.message),
    );
  }, [userId]);

  return { bookings, error };
}
