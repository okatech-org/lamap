/* global React */
// LaMap Arcade — atmospheric particles only

// ─── Ember particles (small sparks rising from below) ───
function Embers({ count = 18 }) {
  const items = React.useMemo(() => {
    const seed = (i) => ((i * 9301 + 49297) % 233280) / 233280;
    return Array.from({ length: count }).map((_, i) => ({
      x: seed(i + 1) * 100,
      delay: seed(i + 5) * 6,
      dur: 3 + seed(i + 11) * 4,
      size: 2 + seed(i + 17) * 3,
      dx: (seed(i + 23) - 0.5) * 40,
      hue: seed(i + 29),
    }));
  }, [count]);
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {items.map((p, i) => (
        <div key={i} style={{
          position: 'absolute', left: `${p.x}%`, bottom: -10,
          width: p.size, height: p.size, borderRadius: '50%',
          background: p.hue < 0.5
            ? 'radial-gradient(circle, #FFE1AB 0%, var(--gold-60) 60%, transparent 100%)'
            : 'radial-gradient(circle, #FFCB7A 0%, rgba(212,80,72,0.55) 60%, transparent 100%)',
          ['--dx']: `${p.dx}px`,
          animation: `la-ember ${p.dur}s ${p.delay}s linear infinite`,
          filter: 'blur(0.4px)',
        }} />
      ))}
    </div>
  );
}

// ─── Gold dust (slow drifting motes) ───
function GoldDust({ count = 20, opacity = 0.45 }) {
  const items = React.useMemo(() => {
    const seed = (i) => ((i * 9301 + 49297) % 233280) / 233280;
    return Array.from({ length: count }).map((_, i) => ({
      x: seed(i + 1) * 100,
      y: seed(i + 7) * 100,
      size: 1.5 + seed(i + 13) * 3,
      delay: seed(i + 19) * 8,
      dur: 6 + seed(i + 23) * 6,
    }));
  }, [count]);
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {items.map((d, i) => (
        <div key={i} style={{
          position: 'absolute', left: `${d.x}%`, top: `${d.y}%`,
          width: d.size, height: d.size, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,225,170,0.9) 0%, transparent 70%)',
          opacity, animation: `la-float ${d.dur}s ease-in-out ${d.delay}s infinite`,
        }} />
      ))}
    </div>
  );
}

// ─── Soft drifting smoke ───
function Smoke({ count = 4 }) {
  const items = React.useMemo(() => Array.from({ length: count }).map((_, i) => ({
    x: 10 + i * 22 + (i % 2) * 8,
    y: 30 + (i % 3) * 15,
    size: 220 + (i * 40),
    delay: i * 1.2,
    dur: 18 + i * 2,
  })), [count]);
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {items.map((s, i) => (
        <div key={i} style={{
          position: 'absolute', left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size, borderRadius: '50%',
          background: 'radial-gradient(circle, var(--accent-10) 0%, transparent 60%)',
          animation: `la-float ${s.dur}s ease-in-out ${s.delay}s infinite`,
          filter: 'blur(20px)',
        }} />
      ))}
    </div>
  );
}

// ─── Sparks burst ───
function SparkBurst({ count = 32 }) {
  const items = React.useMemo(() => Array.from({ length: count }).map((_, i) => {
    const a = (i / count) * Math.PI * 2;
    const r = 70 + (((i * 9301 + 49297) % 233280) / 233280) * 140;
    return {
      tx: Math.cos(a) * r,
      ty: Math.sin(a) * r,
      color: ['var(--gold)','#FFD897','var(--jade-glow)','#F6EFDF'][i % 4],
      delay: (i % 6) * 0.04,
      size: 5 + (i % 4) * 2,
    };
  }), [count]);
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {items.map((s, i) => (
        <div key={i} style={{
          position: 'absolute', width: s.size, height: s.size * 0.4,
          background: s.color, borderRadius: 1,
          animation: `la-confetti 1.8s ${s.delay}s cubic-bezier(0.2, 0.7, 0.3, 1) forwards`,
          ['--tx']: `${s.tx}px`,
          ['--ty']: `${s.ty}px`,
        }} />
      ))}
    </div>
  );
}

// inject confetti keyframe once
if (typeof document !== 'undefined' && !document.getElementById('__la-confetti-style')) {
  const style = document.createElement('style');
  style.id = '__la-confetti-style';
  style.textContent = `
@keyframes la-confetti {
  0%   { transform: translate(0,0) rotate(0deg); opacity: 1; }
  100% { transform: translate(var(--tx,0), var(--ty,0)) rotate(540deg); opacity: 0; }
}
`;
  document.head.appendChild(style);
}

Object.assign(window, { Embers, GoldDust, Smoke, SparkBurst });
