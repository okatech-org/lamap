type Props = {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  color?: string;
};

export function StatTile({ label, value, sub, color = "var(--or-2)" }: Props) {
  return (
    <div
      style={{
        padding: 18,
        borderRadius: 14,
        background: "rgba(46,61,77,0.45)",
        border: "1px solid rgba(201,168,118,0.12)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.2em",
          color: "rgba(245,242,237,0.5)",
        }}
      >
        {label.toUpperCase()}
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 32,
          color: "var(--cream)",
          marginTop: 4,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color, marginTop: 2 }}>
          {sub}
        </div>
      )}
    </div>
  );
}
