import { Card } from "../ui/Card";
import { KpiRow } from "../ui/KpiCard";
import { PageHeader } from "../ui/PageHeader";
import { Pill } from "../ui/Pill";
import { StatRow } from "../ui/StatRow";
import { StatusDot } from "../ui/StatusDot";
import { useHitThePinStats } from "../../hooks/useHitThePinStats";

interface Props { scrollY: number }

export function HitThePinPage({ scrollY }: Props) {
  const { data: stats, isLoading } = useHitThePinStats();

  const courses = stats ? stats.courses.toLocaleString() : isLoading ? "…" : "1,660+";
  const reviewPages = stats ? stats.reviewPages.toLocaleString() : isLoading ? "…" : "6,400+";
  const states = stats ? String(stats.states) : isLoading ? "…" : "22";

  return (
    <div>
      <PageHeader title="HitThePin" subtitle="hitthepin.com — AI golf course reviews" />

      <div className="mb-6">
        <KpiRow
          items={[
            { value: courses, label: "Courses", color: "green" },
            { value: reviewPages, label: "Review Pages", color: "blue" },
            { value: states, label: "States", color: "purple" },
            { value: "—", label: "Daily Visitors", color: "cyan" },
            { value: "—", label: "Indexed Pages", color: "yellow" },
          ]}
        />
      </div>

      <div className="flex flex-wrap gap-5 mb-5">
        <Card title="SEO & Indexing" icon="📈" depth={1} scrollY={scrollY}>
          <StatRow label="Google Indexing API">
            <Pill variant="ok">active</Pill>
            <span className="text-text-secondary ml-1.5">200 URLs/day</span>
          </StatRow>
          <StatRow label="Sitemap"><Pill variant="ok">active</Pill></StatRow>
          <StatRow label="Search Console"><Pill variant="ok">configured</Pill></StatRow>
          <StatRow label="Analytics"><Pill variant="ok">GA4 active</Pill></StatRow>
        </Card>

        <Card title="Content — Geoff" icon="✍️" depth={2} scrollY={scrollY}>
          <StatRow label="Status"><Pill variant="ok">running</Pill></StatRow>
          <StatRow label="Schedule">7 AM + 3 PM PT</StatRow>
          <StatRow label="Posts to">Discord #geoff</StatRow>
          <StatRow label="Voice">Snarky golf pundit</StatRow>
        </Card>

        <Card title="Social Accounts" icon="📱" depth={1} scrollY={scrollY}>
          <RowItem status="ok" name="Instagram" detail="@HitThePin_Golf" />
          <RowItem status="ok" name="YouTube" detail="hitthepin.golf.1" />
          <RowItem status="warn" name="X/Twitter" detail="@HitThePin_Golf (read-only)" />
          <RowItem status="ok" name="TikTok" detail="@HitThePinGolf" />
          <RowItem status="error" name="Facebook" detail="needs creation" />
        </Card>

        <Card title="Video Pipeline" icon="🎬" depth={2} scrollY={scrollY}>
          <StatRow label="Voice">Ronald (Cartesia)</StatRow>
          <StatRow label="Series">Weekly news, Top 10s</StatRow>
          <StatRow label="Tools">PIL + ffmpeg + Playwright</StatRow>
          <StatRow label="YouTube OAuth"><Pill variant="ok">configured</Pill></StatRow>
        </Card>

        <Card title="Revenue" icon="💰" depth={1} scrollY={scrollY}>
          <StatRow label="Model">Ads + Affiliate + Premium</StatRow>
          <StatRow label="GolfNow Affiliate"><Pill variant="warn">no ID yet</Pill></StatRow>
          <StatRow label="Ads"><Pill variant="idle">not started</Pill></StatRow>
        </Card>

        <Card title="Infra" icon="🏗️" depth={2} scrollY={scrollY}>
          <StatRow label="Hosting">Vercel</StatRow>
          <StatRow label="Domain">hitthepin.com</StatRow>
          <StatRow label="DB">Supabase</StatRow>
          <StatRow label="Stack">Vite + React + TS + Tailwind</StatRow>
          <StatRow label="Consent">Termly</StatRow>
        </Card>
      </div>

      <Card title="Todos" icon="📋" wide depth={0} scrollY={scrollY}>
        <StatRow label="Sitemap.xml"><span className="text-success">Done</span></StatRow>
        <StatRow label="Google Search Console"><span className="text-success">Configured</span></StatRow>
        <StatRow label="Facebook Page"><span className="text-warn">Retry creation (rate limited)</span></StatRow>
        <StatRow label="GolfNow affiliate ID"><span className="text-warn">Apply for affiliate program</span></StatRow>
        <StatRow label="Daily Visitors"><span className="text-warn">Connect Search Console API for live data</span></StatRow>
      </Card>
    </div>
  );
}

function RowItem({ status, name, detail }: { status: "ok" | "warn" | "error"; name: string; detail: string }) {
  return (
    <div className="flex items-center gap-2.5 py-2 border-b border-border last:border-b-0">
      <StatusDot status={status} />
      <span className="text-sm text-text">{name}</span>
      <span className="text-text-tertiary text-xs ml-auto">{detail}</span>
    </div>
  );
}
