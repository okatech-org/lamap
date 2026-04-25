/* global React */
// LaMap — shared UI primitives

// Floating gold dust particles for the table backdrop
function GoldDust({ count = 18, opacity = 0.6 }) {
  const dots = React.useMemo(() => {
    const seed = (i) => ((i * 9301 + 49297) % 233280) / 233280;
    return Array.from({ length: count }).map((_, i) => ({
      x: seed(i + 1) * 100,
      y: seed(i + 7) * 100,
      size: 2 + seed(i + 13) * 4,
      delay: seed(i + 19) * 6,
      dur: 5 + seed(i + 23) * 5,
    }));
  }, [count]);
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden',
    }}>
      {dots.map((d, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${d.x}%`, top: `${d.y}%`,
          width: d.size, height: d.size, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,118,0.9) 0%, rgba(201,168,118,0) 70%)',
          opacity: opacity,
          animation: `lamap-float ${d.dur}s ease-in-out ${d.delay}s infinite`,
        }} />
      ))}
    </div>
  );
}

// Table backdrop (radial gradient + dust)
function TableBg({ children, dust = true, style = {} }) {
  return (
    <div className="bg-table" style={{
      position: 'absolute', inset: 0, overflow: 'hidden', ...style,
    }}>
      {/* arena ring */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        width: '85%', aspectRatio: 1, transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        border: '1px solid rgba(201, 168, 118, 0.10)',
        boxShadow: 'inset 0 0 80px rgba(0,0,0,0.25)',
      }} />
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        width: '60%', aspectRatio: 1, transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        border: '1px solid rgba(201, 168, 118, 0.08)',
      }} />
      {dust && <GoldDust />}
      {children}
    </div>
  );
}

// Avatar disc with initials
function Avatar({ initials = 'LG', size = 36, ring = true }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg, #C95048, #8E2F2A)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--cream)',
      fontFamily: 'var(--font-display)', fontWeight: 700,
      fontSize: size * 0.36, letterSpacing: '0.04em',
      border: ring ? '1.5px solid rgba(201, 168, 118, 0.55)' : 'none',
      flexShrink: 0,
    }}>{initials}</div>
  );
}

// Manche dots (round indicator: 1..5)
function MancheDots({ current = 1, total = 5, won = [] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
        color: 'rgba(245, 242, 237, 0.55)', letterSpacing: '0.18em',
        marginRight: 6,
      }}>MANCHE</div>
      {Array.from({ length: total }).map((_, i) => {
        const isWon = won.includes(i);
        const isCurrent = i === current;
        const isPast = i < current;
        const bg = isWon
          ? '#C9A876'
          : isCurrent
          ? '#B4443E'
          : isPast
          ? 'rgba(245,242,237,0.5)'
          : 'rgba(245,242,237,0.18)';
        return (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: '50%', background: bg,
            boxShadow: isCurrent ? '0 0 8px rgba(180,68,62,0.6)' : 'none',
          }} />
        );
      })}
    </div>
  );
}

// Rank badge (Elo tier)
const RANKS = [
  { name: 'Apprenti',    short: 'A', color: '#8B95A3', glow: 'rgba(139,149,163,0.5)' },
  { name: 'Initié',      short: 'I', color: '#C9A876', glow: 'rgba(201,168,118,0.6)' },
  { name: 'Tacticien',   short: 'T', color: '#5AA3C9', glow: 'rgba(90,163,201,0.6)' },
  { name: 'Maître',      short: 'M', color: '#C95048', glow: 'rgba(201,80,72,0.65)' },
  { name: 'Grand Bandi', short: 'G', color: '#E8C879', glow: 'rgba(232,200,121,0.7)' },
  { name: 'Légende',     short: 'L', color: '#9D5BD2', glow: 'rgba(157,91,210,0.7)' },
];

function RankBadge({ rank = 'Initié', size = 56, showName = false, points }) {
  const r = RANKS.find(x => x.name === rank) || RANKS[1];
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{
        width: size, height: size,
        position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* hex shield */}
        <svg width={size} height={size} viewBox="0 0 60 64" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <linearGradient id={`rk-${r.short}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={r.color} stopOpacity="1" />
              <stop offset="100%" stopColor={r.color} stopOpacity="0.55" />
            </linearGradient>
          </defs>
          <path
            d="M30 2 L56 16 L56 48 L30 62 L4 48 L4 16 Z"
            fill={`url(#rk-${r.short})`}
            stroke={r.color}
            strokeWidth="1.5"
            style={{ filter: `drop-shadow(0 0 6px ${r.glow})` }}
          />
          <path
            d="M30 6 L52 18 L52 46 L30 58 L8 46 L8 18 Z"
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="0.8"
          />
        </svg>
        <div style={{
          position: 'relative', zIndex: 1,
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: size * 0.42, color: 'rgba(20,26,34,0.85)',
          textShadow: '0 1px 0 rgba(255,255,255,0.3)',
        }}>{r.short}</div>
      </div>
      {showName && (
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 13, color: 'var(--cream)', letterSpacing: '-0.01em',
          }}>{r.name}</div>
          {points != null && (
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10,
              color: r.color, marginTop: 2,
            }}>{points} PR</div>
          )}
        </div>
      )}
    </div>
  );
}

// Phone status bar (compressed)
function StatusBar({ time = '14:45', dark = true }) {
  const c = dark ? '#fff' : '#000';
  return (
    <div style={{
      height: 47, padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      fontFamily: '-apple-system, "SF Pro", system-ui',
      color: c, position: 'relative', zIndex: 30,
    }}>
      <div style={{ fontWeight: 600, fontSize: 17, paddingTop: 6 }}>{time}</div>
      <div style={{
        position: 'absolute', left: '50%', top: 11, transform: 'translateX(-50%)',
        width: 124, height: 36, borderRadius: 20, background: '#000',
      }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingTop: 6 }}>
        <svg width="18" height="11" viewBox="0 0 18 11"><path d="M9 2.5C11.3 2.5 13.4 3.4 14.9 4.9L16 3.8C14.2 2 11.7 0.8 9 0.8C6.3 0.8 3.8 2 2 3.8L3.1 4.9C4.6 3.4 6.7 2.5 9 2.5Z M9 6C10.4 6 11.6 6.5 12.5 7.4L13.6 6.3C12.3 5.1 10.7 4.3 9 4.3C7.3 4.3 5.7 5.1 4.4 6.3L5.5 7.4C6.4 6.5 7.6 6 9 6Z" fill={c}/><circle cx="9" cy="9.7" r="1.3" fill={c}/></svg>
        <svg width="24" height="11" viewBox="0 0 24 11"><rect x="0.5" y="0.5" width="20" height="10" rx="3" stroke={c} strokeOpacity="0.4" fill="none"/><rect x="2" y="2" width="17" height="7" rx="1.5" fill={c}/><rect x="21.5" y="3.5" width="1.5" height="4" rx="0.7" fill={c} fillOpacity="0.5"/></svg>
      </div>
    </div>
  );
}

// Confetti / sparks burst (briefly rendered after a victory)
function Sparks({ count = 28, palette = ['#C9A876', '#E8C879', '#B4443E', '#F5F2ED'] }) {
  const items = React.useMemo(() => Array.from({ length: count }).map((_, i) => {
    const a = (i / count) * Math.PI * 2 + Math.random() * 0.4;
    const r = 60 + Math.random() * 80;
    return {
      cx: Math.cos(a) * r,
      cy: Math.sin(a) * r * 0.8 - 40,
      color: palette[i % palette.length],
      delay: Math.random() * 0.2,
      size: 6 + Math.random() * 6,
    };
  }), [count]);
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {items.map((it, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: it.size, height: it.size * 0.4, background: it.color,
          borderRadius: 1,
          animation: `lamap-confetti 1.4s ${it.delay}s cubic-bezier(0.2, 0.7, 0.3, 1) forwards`,
          ['--cx']: `${it.cx}px`,
        }} />
      ))}
    </div>
  );
}

// Section divider with diamond
function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 1, background: 'rgba(201,168,118,0.25)' }} />
      <div style={{
        width: 6, height: 6, background: 'var(--or)',
        transform: 'rotate(45deg)',
      }} />
      <div style={{ flex: 1, height: 1, background: 'rgba(201,168,118,0.25)' }} />
    </div>
  );
}

// Phone shell (for canvas display) — 390x844 iPhone 17 ratio
function Phone({ children, theme = 'deep' }) {
  return (
    <div style={{
      width: 390, height: 844, position: 'relative',
      borderRadius: 50,
      background: '#000',
      padding: 8,
      boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
    }}>
      <div style={{
        width: '100%', height: '100%',
        borderRadius: 42,
        overflow: 'hidden',
        position: 'relative',
        background: theme === 'deep' ? '#0F1620' : '#1F2C3B',
      }}>
        {children}
      </div>
    </div>
  );
}

Object.assign(window, {
  GoldDust, TableBg, Avatar, MancheDots, RankBadge, RANKS,
  StatusBar, Sparks, Divider, Phone,
});
