import { Card } from "../ui/Card";
import { KpiRow } from "../ui/KpiRow";
import { Pill } from "../ui/Pill";
import { StatRow } from "../ui/StatRow";
import { useHitThePinStats } from "../../hooks/useHitThePinStats";

export function HitThePinTab() {
  const { data: stats, isLoading } = useHitThePinStats();

  const courses = stats ? stats.courses.toLocaleString() : isLoading ? "…" : "1,660+";
  const reviewPages = stats ? stats.reviewPages.toLocaleString() : isLoading ? "…" : "6,400+";
  const states = stats ? String(stats.states) : isLoading ? "…" : "22";

  return (
    <div>
      <h1 className="text-xl font-bold mb-1">⛳ HitThePin</h1>
      <div className="text-sm text-muted mb-5">
        hitthepin.com — AI golf course reviews
      </div>

      <div className="mb-4">
        <KpiRow
          items={[
            { value: courses, label: "Courses", color: "green" },
            { value: reviewPages, label: "Review Pages", color: "accent" },
            { value: states, label: "States", color: "purple" },
            { value: "—", label: "Daily Visitors", color: "cyan" },
            { value: "—", label: "Indexed Pages", color: "yellow" },
          ]}
        />
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] max-md:grid-cols-1 gap-4 mb-4">
        <Card title="SEO & Indexing" icon="📈">
          <StatRow label="Google Indexing API">
            <Pill variant="ok">active</Pill>
            <span className="text-muted ml-1.5">200 URLs/day</span>
          </StatRow>
          <StatRow label="Sitemap">
            <Pill variant="ok">active</Pill>
          </StatRow>
          <StatRow label="Search Console">
            <Pill variant="ok">configured</Pill>
          </StatRow>
          <StatRow label="Analytics">
            <Pill variant="ok">GA4 active</Pill>
          </StatRow>
        </Card>

        <Card title="Content — Geoff" icon="✍️">
          <StatRow label="Status">
            <Pill variant="ok">running</Pill>
          </StatRow>
          <StatRow label="Schedule">7 AM + 3 PM PT</StatRow>
          <StatRow label="Posts to">Discord #geoff</StatRow>
          <StatRow label="Voice">Snarky golf pundit</StatRow>
        </Card>

        <Card title="Social Accounts" icon="📱">
          <RowItem color="green" name="Instagram" detail="@HitThePin_Golf" />
          <RowItem color="green" name="YouTube" detail="hitthepin.golf.1" />
          <RowItem
            color="yellow"
            name="X/Twitter"
            detail="@HitThePin_Golf (read-only)"
          />
          <RowItem color="green" name="TikTok" detail="@HitThePinGolf" />
          <RowItem color="red" name="Facebook" detail="needs creation" />
        </Card>

        <Card title="Video Pipeline" icon="🎬">
          <StatRow label="Voice">Ronald (Cartesia)</StatRow>
          <StatRow label="Series">Weekly news, Top 10s</StatRow>
          <StatRow label="Tools">PIL + ffmpeg + Playwright</StatRow>
          <StatRow label="YouTube OAuth">
            <Pill variant="ok">configured</Pill>
          </StatRow>
        </Card>

        <Card title="Revenue" icon="💰">
          <StatRow label="Model">Ads + Affiliate + Premium</StatRow>
          <StatRow label="GolfNow Affiliate">
            <Pill variant="warn">no ID yet</Pill>
          </StatRow>
          <StatRow label="Ads">
            <Pill variant="idle">not started</Pill>
          </StatRow>
        </Card>

        <Card title="Infra" icon="🏗️">
          <StatRow label="Hosting">Vercel</StatRow>
          <StatRow label="Domain">hitthepin.com</StatRow>
          <StatRow label="DB">Supabase</StatRow>
          <StatRow label="Stack">Vite + React + TS + Tailwind</StatRow>
          <StatRow label="Consent">Termly</StatRow>
        </Card>
      </div>

      <Card title="Todos" icon="📋" wide>
        <StatRow label="✅ Sitemap.xml">
          <span className="text-muted">Done</span>
        </StatRow>
        <StatRow label="✅ Google Search Console">
          <span className="text-muted">Configured</span>
        </StatRow>
        <StatRow label="🟡 Facebook Page">
          Retry creation (rate limited)
        </StatRow>
        <StatRow label="🟡 GolfNow affiliate ID">
          Apply for affiliate program
        </StatRow>
        <StatRow label="🟡 Daily Visitors">
          Connect Search Console API for live data
        </StatRow>
      </Card>
    </div>
  );
}

function RowItem({
  color,
  name,
  detail,
}: {
  color: string;
  name: string;
  detail: string;
}) {
  const dotColor =
    color === "green"
      ? "bg-success"
      : color === "yellow"
        ? "bg-warn"
        : "bg-danger";
  return (
    <div className="flex items-center gap-2.5 py-2 border-b border-border last:border-b-0">
      <div className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
      <span className="text-sm">{name}</span>
      <span className="text-muted text-xs ml-auto">{detail}</span>
    </div>
  );
}
