import { useQuery } from "@tanstack/react-query";
import { getFirestore, collection, getCountFromServer } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import { saturdayGameApp } from "../lib/firebase";

interface SaturdayGameStats {
  users: number;
  rounds: number;
  tournaments: number;
  groups: number;
}

async function fetchStats(): Promise<SaturdayGameStats> {
  if (!saturdayGameApp) throw new Error("VITE_SG_FIREBASE_API_KEY not set");

  // Anonymous auth satisfies isSignedIn() in Firestore rules
  const auth = getAuth(saturdayGameApp);
  if (!auth.currentUser) await signInAnonymously(auth);

  const db = getFirestore(saturdayGameApp);
  const [usersSnap, roundsSnap, tournamentsSnap, groupsSnap] = await Promise.all([
    getCountFromServer(collection(db, "users")),
    getCountFromServer(collection(db, "scoreSessions")),
    getCountFromServer(collection(db, "tournaments")),
    getCountFromServer(collection(db, "groups")),
  ]);

  return {
    users: usersSnap.data().count,
    rounds: roundsSnap.data().count,
    tournaments: tournamentsSnap.data().count,
    groups: groupsSnap.data().count,
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
