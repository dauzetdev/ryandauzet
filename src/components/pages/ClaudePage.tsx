interface Props { scrollY: number }

export function ClaudePage({ scrollY: _ }: Props) {
  return (
    <div style={{ margin: "-24px", height: "calc(100vh - 53px)" }}>
      <iframe
        src="/claude-code-stats.html"
        style={{ width: "100%", height: "100%", border: "none", display: "block" }}
        title="Claude Code Stats"
      />
    </div>
  );
}
