interface Props { scrollY: number }

export function OpenClawPage({ scrollY: _ }: Props) {
  return (
    <div style={{ margin: "-24px", height: "calc(100vh - 53px)" }}>
      <iframe
        src="https://lobsterboard.hitthepin.com"
        style={{ width: "100%", height: "100%", border: "none", display: "block" }}
        title="LobsterBoard — OpenClaw Dashboard"
      />
    </div>
  );
}
