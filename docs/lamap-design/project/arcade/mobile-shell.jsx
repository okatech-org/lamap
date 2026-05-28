/* global React */
// LaMap Arcade — Mobile shell + shared UI (Apple Music density direction · Esmeralda palette)

// ─── Phone bezel (390×844) ───
// Inner content is scrollable (overflow-y: auto). Sticky overlays
// (bottom nav, status bar) live outside the scroll area via the `nav` prop.
function Phone({ children, bg = 'app', nav = null }) {
  const cls = bg === 'table' ? 'bg-table' : bg === 'velvet' ? 'bg-velvet' : 'bg-app';
  return (
    <div style={{
      width: 390, height: 844, position: 'relative',
      borderRadius: 50, background: '#000',
      padding: 8,
      boxShadow: '0 30px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.05), 0 0 0 6px rgba(20,20,24,0.95)',
    }}>
      <div style={{
        width: '100%', height: '100%',
        borderRadius: 42, overflow: 'hidden', position: 'relative',
      }}>
        <div className={`${cls} no-scrollbar`} style={{
          position: 'absolute', inset: 0,
          overflowY: 'auto', overflowX: 'hidden',
        }}>{children}</div>
        {nav}
      </div>
    </div>
  );
}

// iOS status bar
function MStatusBar({ time = '21:32', dark = true }) {
  const c = dark ? '#fff' : '#000';
  return (
    <div style={{
      height: 50, padding: '0 28px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      fontFamily: '-apple-system, "SF Pro", system-ui',
      color: c, position: 'relative', zIndex: 40,
    }}>
      <div style={{ fontWeight: 600, fontSize: 16, paddingTop: 12 }}>{time}</div>
      <div style={{
        position: 'absolute', left: '50%', top: 11, transform: 'translateX(-50%)',
        width: 122, height: 34, borderRadius: 20, background: '#000',
      }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingTop: 12 }}>
        <svg width="18" height="11" viewBox="0 0 18 11"><path d="M9 2.5C11.3 2.5 13.4 3.4 14.9 4.9L16 3.8C14.2 2 11.7 0.8 9 0.8C6.3 0.8 3.8 2 2 3.8L3.1 4.9C4.6 3.4 6.7 2.5 9 2.5Z M9 6C10.4 6 11.6 6.5 12.5 7.4L13.6 6.3C12.3 5.1 10.7 4.3 9 4.3C7.3 4.3 5.7 5.1 4.4 6.3L5.5 7.4C6.4 6.5 7.6 6 9 6Z" fill={c}/><circle cx="9" cy="9.7" r="1.3" fill={c}/></svg>
        <svg width="24" height="11" viewBox="0 0 24 11"><rect x="0.5" y="0.5" width="20" height="10" rx="3" stroke={c} strokeOpacity="0.4" fill="none"/><rect x="2" y="2" width="17" height="7" rx="1.5" fill={c}/><rect x="21.5" y="3.5" width="1.5" height="4" rx="0.7" fill={c} fillOpacity="0.5"/></svg>
      </div>
    </div>
  );
}

// ─── Top app bar (compact — back + title + right) ───
function AppBar({ title, onBack = true, right, transparent = false }) {
  return (
    <div style={{
      height: 48, padding: '0 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: transparent ? 'transparent' : 'linear-gradient(180deg, var(--surf-40), transparent)',
      position: 'relative', zIndex: 10,
    }}>
      <div style={{ width: 36, display: 'flex' }}>
        {onBack && (
          <button style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--surf-70)',
            border: '1px solid var(--gold-18)',
            color: 'var(--cream)', cursor: 'pointer', fontSize: 16,
          }}>‹</button>
        )}
      </div>
      <div className="f-display" style={{ fontSize: 15, color: 'var(--cream)' }}>{title}</div>
      <div style={{ width: 36, display: 'flex', justifyContent: 'flex-end' }}>{right}</div>
    </div>
  );
}

// ─── Big editorial page title (Apple-Music style) ───
function PageTitle({ eyebrow, title, action }) {
  return (
    <div style={{ padding: '8px 20px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      <div>
        {eyebrow && <div className="eyebrow" style={{ marginBottom: 6 }}>{eyebrow}</div>}
        <div className="f-display" style={{ fontSize: 30, color: 'var(--cream)', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1 }}>
          {title}
        </div>
      </div>
      {action}
    </div>
  );
}

// ─── Section header (used inside scrollable content) ───
function SectionHeader({ title, more, style = {} }) {
  return (
    <div style={{
      padding: '8px 20px 8px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      ...style,
    }}>
      <div className="f-display" style={{ fontSize: 17, color: 'var(--cream)', fontWeight: 700, letterSpacing: '-0.01em' }}>{title}</div>
      {more && <span className="f-body" style={{ fontSize: 13, color: 'var(--gold-bright)', cursor: 'pointer' }}>{more}</span>}
    </div>
  );
}

// ─── List row (clean, Apple Music feel) ───
function Row({ icon, title, subtitle, right, onClick, last = false }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '12px 20px',
      borderBottom: last ? 'none' : '0.5px solid var(--gold-10)',
      cursor: onClick ? 'pointer' : 'default',
    }}>
      {icon}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="f-body" style={{ fontSize: 14, color: 'var(--cream)', fontWeight: 500 }}>{title}</div>
        {subtitle && <div className="f-body" style={{ fontSize: 12, color: 'rgba(246,239,223,0.55)', marginTop: 2 }}>{subtitle}</div>}
      </div>
      {right}
    </div>
  );
}

// ─── Round icon container ───
function RoundIcon({ children, color = 'var(--accent-18)', textColor = 'var(--accent-text)', size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: textColor, fontSize: size * 0.42,
      flexShrink: 0,
    }}>{children}</div>
  );
}

// ─── Avatar (clean, no ring noise unless requested) ───
function Avatar({ initials = 'NK', size = 36, ring = false, color = 'jade' }) {
  const bg = color === 'gold'
    ? 'linear-gradient(135deg, var(--gold-bright), var(--gold-deep))'
    : color === 'ember'
    ? 'linear-gradient(135deg, var(--ember-bright), var(--ember-deep))'
    : 'linear-gradient(135deg, var(--jade-bright), var(--jade-deep))';
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      color: color === 'gold' ? '#1F1810' : 'var(--cream)',
      fontFamily: 'var(--font-display)', fontWeight: 700,
      fontSize: size * 0.36, letterSpacing: '0.04em',
      border: ring ? '1.5px solid var(--gold-45)' : 'none',
      flexShrink: 0,
    }}>{initials}</div>
  );
}

// ─── Compact manche reel ───
function MMancheReel({ current = 0, won = [], lost = [] }) {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {Array.from({ length: 5 }).map((_, i) => {
        const isWon = won.includes(i);
        const isLost = lost.includes(i);
        const isCurrent = i === current;
        const decisive = i === 4;
        let bg, border;
        if (isWon) { bg = 'linear-gradient(180deg, var(--gold-bright), var(--gold-deep))'; border = 'var(--gold)'; }
        else if (isLost) { bg = 'linear-gradient(180deg, var(--ember-deep), #2E0F0D)'; border = 'var(--ember-50)'; }
        else if (isCurrent) { bg = 'linear-gradient(180deg, var(--jade-glow), var(--jade))'; border = 'var(--jade-glow)'; }
        else { bg = 'var(--surface)'; border = 'var(--hairline)'; }
        return (
          <div key={i} style={{
            width: decisive ? 16 : 11, height: decisive ? 16 : 11,
            borderRadius: '50%', background: bg, border: `1.2px solid ${border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: isCurrent ? 'la-pulse 2s ease-in-out infinite' : 'none',
          }}>
            {decisive && (
              <span style={{
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 8,
                color: isCurrent || isWon ? '#06150F' : 'var(--gold)',
              }}>★</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Rank shield (kept from earlier, palette-neutral) ───
const RANK_TIERS = {
  A: { name: 'Apprenti',    color: '#8A95A3', glow: 'rgba(138,149,163,0.5)' },
  I: { name: 'Initié',      color: '#C9A876', glow: 'rgba(201,168,118,0.6)' },
  T: { name: 'Tacticien',   color: '#5AA3C9', glow: 'rgba(90,163,201,0.6)' },
  M: { name: 'Maître',      color: 'var(--jade-glow)', glow: 'var(--accent-70)' },
  G: { name: 'Grand Bandi', color: 'var(--gold)', glow: 'rgba(232,200,121,0.75)' },
  L: { name: 'Légende',     color: '#B58BE2', glow: 'rgba(181,139,226,0.7)' },
};

function RankShield({ short = 'I', size = 60 }) {
  const r = RANK_TIERS[short] || RANK_TIERS.I;
  return (
    <div style={{ width: size, height: size * (64/60), position: 'relative', flexShrink: 0 }}>
      <svg width={size} height={size * (64/60)} viewBox="0 0 60 64" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <linearGradient id={`rks-${short}-${size}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={r.color} stopOpacity="1" />
            <stop offset="100%" stopColor={r.color} stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <path
          d="M30 2 L56 16 L56 48 L30 62 L4 48 L4 16 Z"
          fill={`url(#rks-${short}-${size})`}
          stroke={r.color} strokeWidth="1.5"
          style={{ filter: `drop-shadow(0 0 6px ${r.glow})` }}
        />
        <path d="M30 6 L52 18 L52 46 L30 58 L8 46 L8 18 Z"
          fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontWeight: 800,
        fontSize: size * 0.42, color: 'rgba(20,26,34,0.85)',
        textShadow: '0 1px 0 rgba(255,255,255,0.3)',
      }}>{short}</div>
    </div>
  );
}

// ─── Bottom tab bar (clean, jade tint) ───
function MBottomNav({ active = 'home' }) {
  const items = [
    { id: 'home',    label: 'Accueil', icon: '⌂' },
    { id: 'social',  label: 'Social',  icon: '◯' },
    { id: 'play',    label: 'Jouer',   icon: '▶', primary: true },
    { id: 'shop',    label: 'Boutique', icon: '◆' },
    { id: 'profile', label: 'Profil',  icon: '☗' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
      padding: '8px 16px 22px',
      background: 'linear-gradient(0deg, var(--surf-92) 60%, var(--surf-60) 100%)',
      borderTop: '0.5px solid var(--gold-12)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      zIndex: 30,
    }}>
      {items.map(it => {
        const isActive = it.id === active;
        if (it.primary) {
          return (
            <button key={it.id} style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, var(--gold-bright), var(--gold) 40%, var(--gold-deep) 100%)',
              border: '2px solid var(--gold-50)',
              boxShadow: '0 8px 20px var(--gold-40), inset 0 1px 0 rgba(255,255,255,0.4)',
              color: '#1F1810', fontSize: 18, fontFamily: 'var(--font-display)', fontWeight: 800, cursor: 'pointer',
              marginTop: -22,
              animation: 'la-breathe 2.8s ease-in-out infinite',
            }}>{it.icon}</button>
          );
        }
        return (
          <button key={it.id} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            color: isActive ? 'var(--gold-bright)' : 'rgba(246,239,223,0.45)',
            padding: '4px 10px',
          }}>
            <span style={{ fontSize: 18 }}>{it.icon}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.15em' }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Compact player plate (for match) ───
function MPlate({ name, initials, rank, rating, side = 'left', state = 'idle' }) {
  const isLeft = side === 'left';
  return (
    <div style={{
      display: 'flex', flexDirection: isLeft ? 'row' : 'row-reverse',
      alignItems: 'center', gap: 10,
      padding: '6px 12px 6px 6px', borderRadius: 99,
      background: 'linear-gradient(180deg, var(--surf-92), var(--surf-92))',
      border: `1px solid ${state === 'turn' ? 'var(--gold-55)' : 'var(--gold-18)'}`,
      boxShadow: state === 'turn' ? '0 0 24px var(--gold-30)' : '0 8px 18px rgba(0,0,0,0.5)',
    }}>
      <div style={{ position: 'relative' }}>
        <Avatar initials={initials} size={36} color={state === 'turn' ? 'gold' : 'jade'} ring />
        {rank && (
          <div style={{ position: 'absolute', bottom: -3, right: -4 }}>
            <RankShield short={rank} size={16} />
          </div>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: isLeft ? 'flex-start' : 'flex-end' }}>
        <div className="f-display" style={{ fontSize: 13, fontWeight: 800, color: 'var(--cream)', lineHeight: 1 }}>{name}</div>
        <div className="f-mono" style={{ fontSize: 9, color: 'var(--gold-bright)' }}>{rating} PR</div>
      </div>
    </div>
  );
}

Object.assign(window, {
  Phone, MStatusBar, AppBar, PageTitle, SectionHeader, Row, RoundIcon,
  Avatar, MMancheReel, RankShield, RANK_TIERS, MBottomNav, MPlate,
});
