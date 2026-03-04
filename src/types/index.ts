export type TabId =
  | "home"
  | "hitthepin"
  | "saturdaygame"
  | "golfbooker"
  | "claude"
  | "openclaw";

export interface Tab {
  id: TabId;
  label: string;
}

export type PillVariant =
  | "ok"
  | "warn"
  | "error"
  | "idle"
  | "blue"
  | "purple";

export interface Widget {
  name: string;
  source: string;
  desc: string;
}

export interface Booking {
  id: string;
  userId: string;
  targetDate: string;
  dropDate: string;
  dropTime: string;
  status: "scheduled" | "in_progress" | "completed" | "failed" | "cancelled";
  foursomes: Foursome[];
  results: unknown[];
  createdAt: unknown;
  updatedAt: unknown;
}

export interface Foursome {
  account: string;
  accountOwner: string;
  targetTime: string;
  players: string[];
}

export interface Session {
  key?: string;
  displayName?: string;
  totalTokens?: number;
  model?: string;
  updatedAt?: number;
}
