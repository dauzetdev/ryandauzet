import { useQuery } from "@tanstack/react-query";

export interface HostInfo {
  localIp: string;
  publicIp: string;
  hostname: string;
  ssh: { host: string; port: number; user: string };
  vnc: { host: string; port: number };
  currentVersion: string | null;
  latestVersion: string | null;
  updateAvailable: boolean;
}

export function useHostInfo() {
  return useQuery<HostInfo>({
    queryKey: ["host-info"],
    queryFn: async () => {
      const r = await fetch("/api/host-info", { credentials: "same-origin" });
      if (!r.ok) throw new Error(`${r.status}`);
      return r.json();
    },
    refetchInterval: 60_000,
    retry: 1,
  });
}
