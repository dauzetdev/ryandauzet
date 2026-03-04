import type { Tab } from "../types";

export const TABS: Tab[] = [
  { id: "home", label: "Home" },
  { id: "hitthepin", label: "HitThePin" },
  { id: "saturdaygame", label: "SaturdayGame" },
  { id: "golfbooker", label: "GolfBooker" },
  { id: "claude", label: "Claude Usage" },
  { id: "openclaw", label: "OpenClaw" },
];

export const PLAYERS = [
  "Adrian Sosa",
  "Alan Kirchick",
  "Ali Miri",
  "Andrew Buchanan",
  "Anthony McGrogan",
  "Ashton Dauzet",
  "Ben Stein",
  "Brian Kenyon",
  "Cary Law",
  "Casey Dauzet",
  "Chris DelVillaggio",
  "Clay Johnson",
  "Edward Sramaty",
  "Eric Kirchick",
  "Jeff Ramirez",
  "Jerry Chi",
  "John Clark",
  "John Domingue",
  "Katrine Davie",
  "Kennedy Dauzet",
  "Kim D'Angelo",
  "Michael Gilley",
  "Michael Trudeau",
  "Mike Saviage",
  "Oliver Landine",
  "Paul Ludgate",
  "Peter Contini",
  "Peter Davie",
  "Randy Zimmer",
  "Ryan Dauzet",
  "Ryan Faries",
  "Sean Meeks",
  "Tim D'Angelo",
  "Tony Cannestra",
];

export const ACCOUNTS = [
  { value: "rdauzet", label: "Ryan (rdauzet)" },
  { value: "jerrychi", label: "Jerry (jerrychi)" },
  { value: "00452", label: "Ben (00452)" },
  { value: "cdauzet", label: "Casey (cdauzet)" },
] as const;

export const ACCOUNT_OWNER_MAP: Record<string, string> = {
  rdauzet: "Ryan",
  jerrychi: "Jerry",
  "00452": "Ben",
  cdauzet: "Casey",
};

export const TIME_PRESETS = [
  "8:10 AM",
  "8:20 AM",
  "8:30 AM",
  "9:30 AM",
  "9:40 AM",
];

export const DEFAULT_WIDGET_IDS = [
  "claude-cost",
  "gb-bookings",
  "oc-vitals",
  "htp-seo",
  "htp-todos",
  "oc-crons",
];

export interface WidgetDef {
  name: string;
  source: string;
  desc: string;
}

export const WIDGETS: Record<string, WidgetDef> = {
  "htp-kpis": {
    name: "HitThePin KPIs",
    source: "HitThePin",
    desc: "Course count, pages, states",
  },
  "htp-seo": {
    name: "SEO Status",
    source: "HitThePin",
    desc: "Indexing, sitemap, console",
  },
  "htp-todos": {
    name: "HitThePin Todos",
    source: "HitThePin",
    desc: "Outstanding tasks",
  },
  "htp-socials": {
    name: "Social Accounts",
    source: "HitThePin",
    desc: "IG, YouTube, X, TikTok status",
  },
  "sg-status": {
    name: "SaturdayGame Status",
    source: "SaturdayGame",
    desc: "App platform & backend",
  },
  "gb-bookings": {
    name: "Active Bookings",
    source: "GolfBooker",
    desc: "Upcoming reservation targets",
  },
  "gb-crons": {
    name: "Booking Crons",
    source: "GolfBooker",
    desc: "Reservation monitoring jobs",
  },
  "claude-cost": {
    name: "30-Day Cost",
    source: "Claude",
    desc: "Total spend & tokens",
  },
  "claude-daily": {
    name: "Daily Spend Chart",
    source: "Claude",
    desc: "Spend over last 9 days",
  },
  "claude-sessions": {
    name: "Session Budgets",
    source: "Claude",
    desc: "Token usage per session",
  },
  "oc-vitals": {
    name: "System Vitals",
    source: "OpenClaw",
    desc: "Gateway, sessions, agents",
  },
  "oc-channels": {
    name: "Channels",
    source: "OpenClaw",
    desc: "Connected messaging channels",
  },
  "oc-crons": {
    name: "All Cron Jobs",
    source: "OpenClaw",
    desc: "Status of all scheduled jobs",
  },
};
