import { useQuery } from "@tanstack/react-query";
import { getFirestore, collection, getCountFromServer } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import { saturdayGameApp } from "../lib/firebase";

interface SaturdayGameStats {
  users: number;
  rounds: number;
}

async function fetchStats(): Promise<SaturdayGameStats> {
  if (!saturdayGameApp) throw new Error("VITE_SG_FIREBASE_API_KEY not set");

  // Anonymous auth for Firestore access
  const auth = getAuth(saturdayGameApp);
  if (!auth.currentUser) await signInAnonymously(auth);

  const db = getFirestore(saturdayGameApp);
  const [usersSnap, roundsSnap] = await Promise.all([
    getCountFromServer(collection(db, "users")),
    getCountFromServer(collection(db, "rounds")),
  ]);

  return {
    users: usersSnap.data().count,
    rounds: roundsSnap.data().count,
  };
}

export function useSaturdayGameStats() {
  return useQuery({
    queryKey: ["saturdaygame-stats"],
    queryFn: fetchStats,
    enabled: !!import.meta.env.VITE_SG_FIREBASE_API_KEY,
    staleTime: 5 * 60_000,
    retry: 1,
  });
}
