/* global React */
// LaMap — Playing card components
// Face: modern, big central pip + serif numerals in corners
// Back: red leather with gold lozenge pattern (matches screenshots)

const SUIT = {
  hearts:   { glyph: '♥', color: '#B4443E' },
  diamonds: { glyph: '♦', color: '#B4443E' },
  spades:   { glyph: '♠', color: '#1A1A1A' },
  clubs:    { glyph: '♣', color: '#1A1A1A' },
};

// Big SVG pip — sized within the card body
function BigPip({ suit, size = 64 }) {
  const color = SUIT[suit].color;
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

// Card face: corners + giant central pip
function CardFace({ rank, suit, size = 'md' }) {
  const dims = {
    xs: { w: 48,  h: 68,  rank: 11, pip: 22, corner: 6,  pad: 5  },
    sm: { w: 64,  h: 90,  rank: 14, pip: 32, corner: 8,  pad: 7  },
    md: { w: 88,  h: 124, rank: 18, pip: 50, corner: 10, pad: 8  },
    lg: { w: 110, h: 156, rank: 22, pip: 64, corner: 12, pad: 10 },
    xl: { w: 140, h: 198, rank: 28, pip: 84, corner: 14, pad: 12 },
  }[size];
  const color = SUIT[suit].color;
  const glyph = SUIT[suit].glyph;
  return (
    <div className="lamap-card lamap-card-face" style={{
      width: dims.w, height: dims.h,
      borderRadius: dims.corner,
      background: 'linear-gradient(180deg, #FBFAF6 0%, #F2EDE2 100%)',
      border: '1.5px solid rgba(180, 68, 62, 0.85)',
      position: 'relative',
      boxShadow: 'var(--shadow-card)',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      {/* paper texture sheen */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.6) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />
      {/* TL corner */}
      <div style={{
        position: 'absolute', top: dims.pad, left: dims.pad,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        color, fontFamily: 'var(--font-card)', fontWeight: 600,
        fontSize: dims.rank, lineHeight: 1, letterSpacing: '-0.02em',
      }}>
        <div>{rank}</div>
        <div style={{ fontSize: dims.rank * 0.7, marginTop: 1 }}>{glyph}</div>
      </div>
      {/* center pip */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <BigPip suit={suit} size={dims.pip} />
      </div>
      {/* BR corner inverted */}
      <div style={{
        position: 'absolute', bottom: dims.pad, right: dims.pad,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        color, fontFamily: 'var(--font-card)', fontWeight: 600,
        fontSize: dims.rank, lineHeight: 1, letterSpacing: '-0.02em',
        transform: 'rotate(180deg)',
      }}>
        <div>{rank}</div>
        <div style={{ fontSize: dims.rank * 0.7, marginTop: 1 }}>{glyph}</div>
      </div>
    </div>
  );
}

// Card back: red leather + gold lozenge grid + LM monogram
function CardBack({ size = 'md', style = {} }) {
  const dims = {
    xs: { w: 48,  h: 68,  corner: 6,  inset: 4 },
    sm: { w: 64,  h: 90,  corner: 8,  inset: 5 },
    md: { w: 88,  h: 124, corner: 10, inset: 7 },
    lg: { w: 110, h: 156, corner: 12, inset: 8 },
    xl: { w: 140, h: 198, corner: 14, inset: 10 },
  }[size];
  return (
    <div className="lamap-card lamap-card-back" style={{
      width: dims.w, height: dims.h,
      borderRadius: dims.corner,
      background: 'linear-gradient(135deg, #B4443E 0%, #8E2F2A 60%, #6E2520 100%)',
      border: '1.5px solid rgba(0,0,0,0.4)',
      position: 'relative',
      boxShadow: 'var(--shadow-card)',
      overflow: 'hidden',
      flexShrink: 0,
      ...style,
    }}>
      <div style={{
        position: 'absolute', inset: dims.inset,
        borderRadius: Math.max(2, dims.corner - 4),
        border: '1px solid rgba(201, 168, 118, 0.55)',
        background: `
          repeating-linear-gradient(45deg, rgba(201,168,118,0.18) 0 1px, transparent 1px 12px),
          repeating-linear-gradient(-45deg, rgba(201,168,118,0.18) 0 1px, transparent 1px 12px)
        `,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* center diamond ornament */}
        <div style={{
          width: '50%', aspectRatio: '1',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(201,168,118,0.35), rgba(201,168,118,0.1))',
            transform: 'rotate(45deg)',
            border: '1px solid rgba(201,168,118,0.6)',
          }} />
          <div style={{
            position: 'relative', zIndex: 1,
            color: '#C9A876',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: dims.w * 0.22,
            letterSpacing: '-0.04em',
          }}>LM</div>
        </div>
      </div>
    </div>
  );
}

// Flippable wrapper for animation between back and face
function FlipCard({ rank, suit, size = 'md', flipped = false, duration = 600, style = {} }) {
  return (
    <div style={{
      perspective: 1000,
      width: 'auto', display: 'inline-block',
      ...style,
    }}>
      <div style={{
        position: 'relative',
        transformStyle: 'preserve-3d',
        transition: `transform ${duration}ms cubic-bezier(0.4, 0.0, 0.2, 1)`,
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
      }}>
        <div style={{ backfaceVisibility: 'hidden' }}>
          <CardBack size={size} />
        </div>
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
        }}>
          <CardFace rank={rank} suit={suit} size={size} />
        </div>
      </div>
    </div>
  );
}

// Empty placeholder slot (e.g. "?")
function CardSlot({ size = 'md', label = '?' }) {
  const dims = {
    sm: { w: 64,  h: 90,  corner: 8,  font: 22 },
    md: { w: 88,  h: 124, corner: 10, font: 30 },
    lg: { w: 110, h: 156, corner: 12, font: 36 },
  }[size];
  return (
    <div style={{
      width: dims.w, height: dims.h,
      borderRadius: dims.corner,
      border: '2px dashed rgba(201, 168, 118, 0.35)',
      background: 'rgba(46, 61, 77, 0.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'rgba(201, 168, 118, 0.5)',
      fontFamily: 'var(--font-card)', fontWeight: 600, fontSize: dims.font,
    }}>{label}</div>
  );
}

Object.assign(window, { CardFace, CardBack, FlipCard, CardSlot, BigPip, SUIT });
