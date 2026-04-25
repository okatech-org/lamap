type Props = { initials?: string; size?: number; ring?: boolean };

export function Avatar({ initials = "LG", size = 36, ring = true }: Props) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #C95048, #8E2F2A)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--cream)",
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: size * 0.36,
        letterSpacing: "0.04em",
        border: ring ? "1.5px solid rgba(201, 168, 118, 0.55)" : "none",
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}
