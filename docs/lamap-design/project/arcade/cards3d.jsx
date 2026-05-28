/* global React */
// LaMap Arcade — Card system with 3D tilt + holographic foil
//
// <Card3D rank="7" suit="hearts" size="md" tilt foil />
// <CardBack3D size="md" tilt skin="ember" />

const SUITS = {
  hearts:   { glyph: '♥', color: '#B4443E', name: 'Cœurs'   },
  diamonds: { glyph: '♦', color: '#B4443E', name: 'Carreau' },
  spades:   { glyph: '♠', color: '#0E1320', name: 'Pique'   },
  clubs:    { glyph: '♣', color: '#0E1320', name: 'Trèfle'  },
};

const SIZES = {
  xs: { w: 52,  h: 76,  rad: 6,  rank: 12, pip: 24,  pad: 6,  inset: 4 },
  sm: { w: 76,  h: 110, rad: 9,  rank: 17, pip: 36,  pad: 8,  inset: 6 },
  md: { w: 108, h: 156, rad: 13, rank: 24, pip: 56,  pad: 10, inset: 8 },
  lg: { w: 152, h: 220, rad: 18, rank: 34, pip: 80,  pad: 14, inset: 10 },
  xl: { w: 210, h: 304, rad: 24, rank: 46, pip: 110, pad: 18, inset: 14 },
  xxl:{ w: 300, h: 432, rad: 32, rank: 64, pip: 160, pad: 24, inset: 18 },
};

// SVG pip for clean scaling
function Pip({ suit, size = 64 }) {
  const color = SUITS[suit].color;
  const paths = {
    hearts:   'M32 56 C 6 38 4 22 14 14 C 22 8 30 12 32 18 C 34 12 42 8 50 14 C 60 22 58 38 32 56 Z',
    diamonds: 'M32 6 L58 32 L32 58 L6 32 Z',
    spades:   'M32 6 C 14 22 4 32 4 42 C 4 52 14 56 22 50 C 26 47 28 44 28 44 L 24 58 L 40 58 L 36 44 C 36 44 38 47 42 50 C 50 56 60 52 60 42 C 60 32 50 22 32 6 Z',
    clubs:    'M32 6 C 22 6 16 14 18 22 C 12 18 4 22 4 32 C 4 42 14 44 20 38 C 18 44 22 50 28 50 L 24 58 L 40 58 L 36 50 C 42 50 46 44 44 38 C 50 44 60 42 60 32 C 60 22 52 18 46 22 C 48 14 42 6 32 6 Z',
  };
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{ display: 'block' }}>
      <path d={paths[suit]} fill={color} />
    </svg>
  );
}

// Pure face (no tilt). Use inside Card3D wrapper.
function CardFaceArt({ rank, suit, size = 'md', highlighted = false, foil = false }) {
  const d = SIZES[size];
  const color = SUITS[suit].color;
  const glyph = SUITS[suit].glyph;
  return (
    <div style={{
      width: d.w, height: d.h, borderRadius: d.rad,
      background: 'linear-gradient(180deg, #FBF6E9 0%, #F1E7CC 100%)',
      border: highlighted ? `2px solid var(--gold-bright)` : `1.5px solid var(--gold-deep)`,
      position: 'relative', overflow: 'hidden', flexShrink: 0,
      boxShadow: highlighted
        ? `0 0 0 1px var(--gold), 0 18px 40px rgba(232,200,121,0.35), 0 6px 12px rgba(0,0,0,0.4)`
        : 'var(--shadow-card)',
    }}>
      {/* paper grain */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(circle at 28% 18%, rgba(255,255,255,0.55), transparent 50%),
          radial-gradient(circle at 72% 82%, rgba(180,68,62,0.06), transparent 60%)
        `,
        pointerEvents: 'none',
      }} />
      {/* inner filigrane border */}
      <div style={{
        position: 'absolute', inset: d.inset, borderRadius: Math.max(2, d.rad - 4),
        border: '1px solid rgba(166,130,88,0.35)',
        pointerEvents: 'none',
      }} />
      {/* TL corner */}
      <div style={{
        position: 'absolute', top: d.pad, left: d.pad + 2,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        color, fontFamily: 'var(--font-card)', fontWeight: 700,
        fontSize: d.rank, lineHeight: 0.9, letterSpacing: '-0.02em',
      }}>
        <div>{rank}</div>
        <div style={{ fontSize: d.rank * 0.7, marginTop: 1 }}>{glyph}</div>
      </div>
      {/* center pip */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Pip suit={suit} size={d.pip} />
      </div>
      {/* BR corner inverted */}
      <div style={{
        position: 'absolute', bottom: d.pad, right: d.pad + 2,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        color, fontFamily: 'var(--font-card)', fontWeight: 700,
        fontSize: d.rank, lineHeight: 0.9, letterSpacing: '-0.02em',
        transform: 'rotate(180deg)',
      }}>
        <div>{rank}</div>
        <div style={{ fontSize: d.rank * 0.7, marginTop: 1 }}>{glyph}</div>
      </div>
      {/* foil holo */}
      {foil && (
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            conic-gradient(from 210deg at 50% 50%,
              rgba(232,200,121,0.0) 0%,
              rgba(255,170,150,0.35) 18%,
              rgba(160,200,255,0.30) 36%,
              rgba(232,200,121,0.45) 54%,
              rgba(220,160,210,0.30) 72%,
              rgba(232,200,121,0.0) 100%)`,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
        }} />
      )}
    </div>
  );
}

// Card back art (no tilt). Skins: emerald | gold | onyx | jade | ember | indigo | bandi
function CardBackArt({ size = 'md', skin = 'emerald' }) {
  const d = SIZES[size];
  const SKINS = {
    emerald: {
      bg: 'linear-gradient(135deg, #2C7A5C 0%, #1B4A3A 55%, #0A1814 100%)',
      stroke: 'rgba(232,200,121,0.55)',
      monoColor: '#E8C879',
    },
    gold: {
      bg: 'linear-gradient(135deg, #C9A876 0%, #8B6E40 60%, #4D3A1E 100%)',
      stroke: 'rgba(255,240,200,0.55)',
      monoColor: '#1F1810',
    },
    onyx: {
      bg: 'linear-gradient(135deg, #1F1F22 0%, #111114 60%, #050507 100%)',
      stroke: 'rgba(232,200,121,0.55)',
      monoColor: '#E8C879',
    },
    jade: {
      bg: 'linear-gradient(135deg, #3FA877 0%, #1B4A3A 60%, #0E2620 100%)',
      stroke: 'rgba(232,200,121,0.5)',
      monoColor: '#E8C879',
    },
    ember: {
      bg: 'linear-gradient(135deg, #C04A44 0%, #8E2F2A 55%, #4F1814 100%)',
      stroke: 'rgba(232,200,121,0.55)',
      monoColor: '#E8C879',
    },
    indigo: {
      bg: 'linear-gradient(135deg, #2E3D4D 0%, #182230 60%, #0A0F1A 100%)',
      stroke: 'rgba(232,200,121,0.45)',
      monoColor: '#E8C879',
    },
    bandi: {
      bg: 'linear-gradient(135deg, #1A1014 0%, #2A1620 60%, #0A050A 100%)',
      stroke: 'rgba(232,200,121,0.6)',
      monoColor: '#E8C879',
    },
  };
  const s = SKINS[skin] || SKINS.emerald;
  return (
    <div style={{
      width: d.w, height: d.h, borderRadius: d.rad,
      background: s.bg,
      border: '1.5px solid rgba(0,0,0,0.5)',
      position: 'relative', overflow: 'hidden', flexShrink: 0,
      boxShadow: 'var(--shadow-card)',
    }}>
      {/* leather grain */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          repeating-linear-gradient(0deg, rgba(0,0,0,0.06) 0 1px, transparent 1px 3px),
          repeating-linear-gradient(90deg, rgba(0,0,0,0.06) 0 1px, transparent 1px 3px)
        `,
        opacity: 0.6,
        mixBlendMode: 'multiply',
      }} />
      {/* gold filigree inner frame with lozenge weave */}
      <div style={{
        position: 'absolute', inset: d.inset, borderRadius: Math.max(2, d.rad - 4),
        border: `1px solid ${s.stroke}`,
        background: `
          repeating-linear-gradient(45deg,  ${s.stroke.replace('0.55','0.15').replace('0.6','0.15').replace('0.45','0.12')} 0 1px, transparent 1px 14px),
          repeating-linear-gradient(-45deg, ${s.stroke.replace('0.55','0.15').replace('0.6','0.15').replace('0.45','0.12')} 0 1px, transparent 1px 14px)
        `,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* central monogram lozenge */}
        <div style={{
          width: '52%', aspectRatio: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(232,200,121,0.35), rgba(232,200,121,0.08))',
            transform: 'rotate(45deg)',
            border: `1px solid ${s.stroke}`,
          }} />
          <div style={{
            position: 'relative', zIndex: 1, color: s.monoColor,
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: d.w * 0.24, letterSpacing: '-0.05em',
            textShadow: '0 1px 0 rgba(0,0,0,0.25)',
          }}>LM</div>
        </div>
      </div>
      {/* top sheen */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 30%)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

// 3D wrapper that tracks mouse and applies tilt + dynamic shine
function Card3D({
  rank, suit, size = 'md', tilt = true, foil = false, highlighted = false,
  intensity = 14, onClick, style = {},
}) {
  const ref = React.useRef(null);
  const [tx, setTx] = React.useState({ rx: 0, ry: 0, mx: 50, my: 50, hover: false });
  function move(e) {
    if (!tilt) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    setTx({
      rx: (0.5 - y) * intensity,
      ry: (x - 0.5) * intensity,
      mx: x * 100, my: y * 100, hover: true,
    });
  }
  function leave() { setTx({ rx: 0, ry: 0, mx: 50, my: 50, hover: false }); }
  const d = SIZES[size];

  return (
    <div ref={ref} onMouseMove={move} onMouseLeave={leave} onClick={onClick}
      style={{
        width: d.w, height: d.h, perspective: 1100,
        cursor: onClick ? 'pointer' : 'default',
        flexShrink: 0,
        ...style,
      }}>
      <div style={{
        width: '100%', height: '100%', position: 'relative',
        transformStyle: 'preserve-3d',
        transform: `rotateX(${tx.rx}deg) rotateY(${tx.ry}deg) translateZ(0) scale(${tx.hover ? 1.04 : 1})`,
        transition: 'transform 250ms cubic-bezier(0.2, 0.8, 0.3, 1.1)',
      }}>
        <CardFaceArt rank={rank} suit={suit} size={size} highlighted={highlighted} foil={foil} />
        {/* dynamic gloss highlight */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: d.rad,
          background: `radial-gradient(circle 80% at ${tx.mx}% ${tx.my}%, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0) 50%)`,
          pointerEvents: 'none', mixBlendMode: 'soft-light',
          opacity: tx.hover ? 1 : 0.5,
        }} />
        {/* foil dynamic prism band */}
        {foil && (
          <div style={{
            position: 'absolute', inset: 0, borderRadius: d.rad,
            background: `linear-gradient(${100 + tx.ry * 3}deg,
              transparent 30%,
              rgba(160,200,255,0.45) 45%,
              rgba(255,200,140,0.5) 50%,
              rgba(220,160,210,0.45) 55%,
              transparent 70%)`,
            mixBlendMode: 'color-dodge',
            pointerEvents: 'none', opacity: tx.hover ? 0.9 : 0.5,
          }} />
        )}
        {/* edge bevel */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: d.rad,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.3)',
          pointerEvents: 'none',
        }} />
      </div>
    </div>
  );
}

function CardBack3D({ size = 'md', tilt = true, intensity = 12, skin = 'emerald', style = {}, onClick }) {
  const ref = React.useRef(null);
  const [tx, setTx] = React.useState({ rx: 0, ry: 0, mx: 50, my: 50, hover: false });
  function move(e) {
    if (!tilt) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    setTx({ rx: (0.5 - y) * intensity, ry: (x - 0.5) * intensity, mx: x * 100, my: y * 100, hover: true });
  }
  function leave() { setTx({ rx: 0, ry: 0, mx: 50, my: 50, hover: false }); }
  const d = SIZES[size];

  return (
    <div ref={ref} onMouseMove={move} onMouseLeave={leave} onClick={onClick} style={{
      width: d.w, height: d.h, perspective: 1100, cursor: onClick ? 'pointer' : 'default',
      flexShrink: 0, ...style,
    }}>
      <div style={{
        width: '100%', height: '100%', position: 'relative',
        transformStyle: 'preserve-3d',
        transform: `rotateX(${tx.rx}deg) rotateY(${tx.ry}deg) scale(${tx.hover ? 1.03 : 1})`,
        transition: 'transform 250ms cubic-bezier(0.2, 0.8, 0.3, 1.1)',
      }}>
        <CardBackArt size={size} skin={skin} />
        <div style={{
          position: 'absolute', inset: 0, borderRadius: d.rad,
          background: `radial-gradient(circle 70% at ${tx.mx}% ${tx.my}%, rgba(255,220,170,0.25) 0%, rgba(0,0,0,0) 50%)`,
          pointerEvents: 'none', mixBlendMode: 'screen',
        }} />
      </div>
    </div>
  );
}

// 3D flippable card (face/back)
function FlipCard3D({ rank, suit, size = 'md', flipped = false, skin = 'emerald', duration = 600 }) {
  const d = SIZES[size];
  return (
    <div style={{ width: d.w, height: d.h, perspective: 1100 }}>
      <div style={{
        width: '100%', height: '100%', position: 'relative',
        transformStyle: 'preserve-3d',
        transition: `transform ${duration}ms cubic-bezier(0.4, 0.0, 0.2, 1)`,
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
      }}>
        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden' }}>
          <CardBackArt size={size} skin={skin} />
        </div>
        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          <CardFaceArt rank={rank} suit={suit} size={size} />
        </div>
      </div>
    </div>
  );
}

function CardSlot({ size = 'md', label = '?' }) {
  const d = SIZES[size];
  return (
    <div style={{
      width: d.w, height: d.h, borderRadius: d.rad,
      border: '1.5px dashed rgba(232,200,121,0.32)',
      background: 'rgba(232,200,121,0.04)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'rgba(232,200,121,0.45)',
      fontFamily: 'var(--font-card)', fontWeight: 700,
      fontSize: d.rank * 1.6, flexShrink: 0,
    }}>{label}</div>
  );
}

Object.assign(window, { Card3D, CardBack3D, FlipCard3D, CardFaceArt, CardBackArt, CardSlot, Pip, SUITS, SIZES });
