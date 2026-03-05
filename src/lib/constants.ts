import type { PageDef, ProjectDef } from "../types";

export const PAGES: PageDef[] = [
  { id: "dashboard",    label: "Dashboard",    icon: "grid" },
  { id: "openclaw",     label: "OpenClaw",     icon: "cpu" },
  { id: "hitthepin",    label: "HitThePin",    icon: "flag" },
  { id: "saturdaygame", label: "SaturdayGame", icon: "trophy" },
  { id: "golfbooker",   label: "GolfBooker",   icon: "calendar" },
  { id: "claude",       label: "Claude",       icon: "bot" },
  { id: "settings",     label: "Settings",     icon: "settings" },
];

export const PROJECTS: ProjectDef[] = [
  { id: "openclaw",     label: "OpenClaw",      icon: "🧠", accentHex: "#32ade6", subtitle: "AI Agent Platform" },
  { id: "hitthepin",    label: "HitThePin",     icon: "⛳",  accentHex: "#34c759", subtitle: "Golf Course Reviews & SEO" },
  { id: "saturdaygame", label: "SaturdayGame",  icon: "🏌️", accentHex: "#ff9500", subtitle: "Golf Scoring App" },
  { id: "golfbooker",   label: "GolfBooker",    icon: "📅", accentHex: "#af52de", subtitle: "Reservation Automation" },
  { id: "claude",       label: "Claude Usage",  icon: "🤖", accentHex: "#ff3b30", subtitle: "API Spend & Token Tracking" },
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
