type Props = {
  kicker?: string;
  title: string;
  action?: React.ReactNode;
};

export function SectionTitle({ kicker, title, action }: Props) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        marginBottom: 18,
      }}
    >
      <div>
        {kicker && (
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.25em",
              color: "var(--or-2)",
              marginBottom: 6,
            }}
          >
            {kicker}
          </div>
        )}
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 26,
            color: "var(--cream)",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </div>
      </div>
      {action}
    </div>
  );
}
