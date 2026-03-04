import { initializeApp } from "firebase/app";

// GolfBooker Firebase (credentials move to env vars; fallback to hardcoded for dev)
export const golfBookerApp = initializeApp(
  {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "AIzaSyD_oA0v7g750449MFwd-ygfMSYTDtQtLb8",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "golfbooker-6f274.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "golfbooker-6f274",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "golfbooker-6f274.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "524210219463",
    appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "1:524210219463:ios:7c7c34ba9daf6b0f3b91e2",
  },
  "golfbooker",
);

// SaturdayGame Firebase — requires VITE_SG_FIREBASE_API_KEY env var
export const saturdayGameApp = import.meta.env.VITE_SG_FIREBASE_API_KEY
  ? initializeApp(
      {
        apiKey: import.meta.env.VITE_SG_FIREBASE_API_KEY,
        authDomain: "saturdaygame-10f98.firebaseapp.com",
        projectId: "saturdaygame-10f98",
        storageBucket: "saturdaygame-10f98.appspot.com",
      },
      "saturdaygame",
    )
  : null;
