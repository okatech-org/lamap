/* global React, CardFace, CardBack, FlipCard, CardSlot, Avatar, MancheDots, RankBadge, StatusBar, GoldDust, TableBg, Sparks, Divider, Phone */

// ───────────────────────────────────────────────
// LANDING / AUTH — 3 variations
// ───────────────────────────────────────────────

function LandingHero() {
  // Variation A — fidèle au screenshot mais affiné
  return (
    <Phone>
      <StatusBar time="14:45" />
      <div className="bg-deep" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {/* faded suit motifs */}
        <div style={{
          position: 'absolute', top: 80, left: -20, fontSize: 180, opacity: 0.04,
          color: '#fff', fontFamily: 'serif',
        }}>♥</div>
        <div style={{
          position: 'absolute', top: 220, right: -40, fontSize: 220, opacity: 0.03,
          color: '#fff', fontFamily: 'serif',
        }}>♦</div>
        <div style={{
          position: 'absolute', top: 380, left: 60, fontSize: 60, opacity: 0.05, color: '#fff',
        }}>♠</div>
        <GoldDust count={12} opacity={0.4} />

        {/* Hero */}
        <div style={{
          position: 'absolute', top: 180, left: 0, right: 0,
          textAlign: 'center', padding: '0 32px',
        }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 76, color: 'var(--terre-2)',
            letterSpacing: '-0.04em', lineHeight: 0.9,
          }}>Lamap</div>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 17, fontWeight: 400,
            color: 'rgba(245, 242, 237, 0.85)', marginTop: 18,
            letterSpacing: '-0.005em',
          }}>
            Le duel de cartes <span style={{ color: 'var(--terre-2)', fontWeight: 600, fontStyle: 'italic' }}>épique</span> vous attend
          </div>
          <div style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              padding: '4px 10px', borderRadius: 99, background: 'rgba(201,168,118,0.12)',
              border: '1px solid rgba(201,168,118,0.3)', color: 'var(--or-2)',
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em',
            }}>GARAME · DUEL · KORA</div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ position: 'absolute', left: 24, right: 24, bottom: 220 }}>
          <button className="btn-light" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.13 4.13 0 0 1-1.79 2.71v2.26h2.9c1.7-1.56 2.69-3.87 2.69-6.61z" fill="#4285F4"/><path d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.9-2.26c-.81.54-1.83.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z" fill="#34A853"/><path d="M3.95 10.7A5.41 5.41 0 0 1 3.66 9c0-.59.1-1.16.29-1.7V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l2.99-2.33z" fill="#FBBC05"/><path d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58A9 9 0 0 0 9 0 9 9 0 0 0 .96 4.96l2.99 2.34C4.66 5.17 6.65 3.58 9 3.58z" fill="#EA4335"/></svg>
            Continuer avec Google
          </button>
          <button className="btn-primary" style={{ width: '100%', marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="#fff"><path d="M20 10a10 10 0 1 0-11.56 9.88V12.9H5.9V10h2.54V7.8c0-2.5 1.5-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V10h2.78l-.45 2.9h-2.33v6.98A10 10 0 0 0 20 10z"/></svg>
            Continuer avec Facebook
          </button>
          <div style={{
            textAlign: 'center', marginTop: 18,
            fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(245,242,237,0.45)',
            lineHeight: 1.6,
          }}>
            Devenez maître du Garame.<br/>Affrontez des joueurs, misez votre Kora.
          </div>
        </div>

        {/* Hand of cards peeking from below */}
        <div style={{
          position: 'absolute', bottom: -30, left: 0, right: 0,
          display: 'flex', justifyContent: 'center', gap: 0,
          height: 200, pointerEvents: 'none',
        }}>
          {[
            { rank: 6, suit: 'clubs',    rot: -16, dx: -150 },
            { rank: 6, suit: 'spades',   rot: -8,  dx: -78 },
            { rank: 4, suit: 'hearts',   rot: 0,   dx: 0 },
            { rank: 4, suit: 'clubs',    rot: 8,   dx: 78 },
            { rank: 3, suit: 'hearts',   rot: 16,  dx: 150 },
          ].map((c, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: '50%',
              transform: `translateX(calc(-50% + ${c.dx}px)) rotate(${c.rot}deg) translateY(${Math.abs(c.dx) * 0.15}px)`,
            }}>
              <CardFace rank={c.rank} suit={c.suit} size="lg" />
            </div>
          ))}
        </div>
      </div>
    </Phone>
  );
}

function LandingArcade() {
  // Variation B — plus arcade/épique : grande typo, fond saturé, tagline forte
  return (
    <Phone>
      <StatusBar time="14:45" />
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 30%, #6E2520 0%, #2E3D4D 50%, #0F1620 100%)',
      }}>
        <GoldDust count={20} opacity={0.5} />

        {/* Vertical text "VS" rays */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `repeating-conic-gradient(from 0deg at 50% 35%, transparent 0deg, transparent 20deg, rgba(201,168,118,0.04) 20deg, rgba(201,168,118,0.04) 22deg)`,
          mixBlendMode: 'screen',
        }} />

        {/* Two cards crossing each other */}
        <div style={{
          position: 'absolute', top: 90, left: '50%', transform: 'translateX(-50%)',
          width: 220, height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            position: 'absolute', transform: 'rotate(-14deg) translateX(-30px)',
            filter: 'drop-shadow(0 12px 30px rgba(0,0,0,0.5))',
          }}>
            <CardFace rank={3} suit="hearts" size="xl" />
          </div>
          <div style={{
            position: 'absolute', transform: 'rotate(14deg) translateX(30px)',
            filter: 'drop-shadow(0 12px 30px rgba(0,0,0,0.5))',
          }}>
            <CardFace rank={10} suit="clubs" size="xl" />
          </div>
          {/* VS coin */}
          <div style={{
            position: 'absolute', zIndex: 2,
            width: 56, height: 56, borderRadius: '50%',
            background: 'radial-gradient(circle, #E8C879, #A68258)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid #6E5536',
            boxShadow: '0 0 30px rgba(232, 200, 121, 0.5), inset 0 -2px 8px rgba(0,0,0,0.3)',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18,
            color: '#1F1810', letterSpacing: '0.02em',
          }}>VS</div>
        </div>

        <div style={{ position: 'absolute', top: 410, left: 0, right: 0, textAlign: 'center', padding: '0 24px' }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.32em', color: 'var(--or-2)', marginBottom: 14,
          }}>BIENVENUE DANS L'ARÈNE</div>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 64, color: 'var(--cream)',
            letterSpacing: '-0.05em', lineHeight: 0.92,
          }}>LAMAP</div>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 400,
            color: 'rgba(245,242,237,0.7)', marginTop: 10,
          }}>Le Garame, version duel mondial.</div>
        </div>

        <div style={{ position: 'absolute', left: 24, right: 24, bottom: 80 }}>
          <button className="btn-primary" style={{ width: '100%', fontSize: 17, padding: '16px 24px' }}>
            Entrer dans l'arène →
          </button>
          <div style={{
            display: 'flex', gap: 10, marginTop: 10,
          }}>
            <button className="btn-ghost" style={{ flex: 1, fontSize: 14, padding: '11px 16px' }}>
              Google
            </button>
            <button className="btn-ghost" style={{ flex: 1, fontSize: 14, padding: '11px 16px' }}>
              Facebook
            </button>
          </div>
          <div style={{
            textAlign: 'center', marginTop: 20,
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em',
            color: 'rgba(245,242,237,0.4)',
          }}>4 217 JOUEURS EN LIGNE</div>
        </div>
      </div>
    </Phone>
  );
}

function LandingEditorial() {
  // Variation C — éditorial, calme, cartes héroïques
  return (
    <Phone>
      <StatusBar time="14:45" />
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden',
        background: 'linear-gradient(180deg, #1F2C3B 0%, #0F1620 100%)',
      }}>
        <GoldDust count={14} opacity={0.45} />

        <div style={{ position: 'absolute', top: 70, left: 24, right: 24 }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.3em',
            color: 'var(--or-2)', marginBottom: 8,
          }}>· LE JEU DES BANDIS ·</div>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 600,
            fontSize: 56, color: 'var(--cream)',
            letterSpacing: '-0.045em', lineHeight: 0.92,
          }}>Cinq mains.<br/>Une seule<br/>compte.</div>
        </div>

        {/* Single hero card */}
        <div style={{
          position: 'absolute', top: 320, left: '50%', transform: 'translateX(-50%)',
          filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.6))',
        }}>
          <div style={{ transform: 'rotate(-6deg)' }}>
            <CardFace rank={3} suit="hearts" size="xl" />
          </div>
          <div style={{
            position: 'absolute', top: -16, right: -34,
            padding: '4px 10px', borderRadius: 99,
            background: 'var(--or)',
            color: '#1F1810', fontFamily: 'var(--font-mono)',
            fontSize: 10, fontWeight: 700, letterSpacing: '0.15em',
            transform: 'rotate(8deg)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          }}>KORA ×2</div>
        </div>

        <div style={{ position: 'absolute', left: 24, right: 24, bottom: 60 }}>
          <button className="btn-primary" style={{ width: '100%' }}>Commencer</button>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
            marginTop: 18,
          }}>
            <a style={{ color: 'rgba(245,242,237,0.6)', fontFamily: 'var(--font-body)', fontSize: 13 }}>Google</a>
            <span style={{ color: 'rgba(245,242,237,0.2)' }}>·</span>
            <a style={{ color: 'rgba(245,242,237,0.6)', fontFamily: 'var(--font-body)', fontSize: 13 }}>Facebook</a>
            <span style={{ color: 'rgba(245,242,237,0.2)' }}>·</span>
            <a style={{ color: 'rgba(245,242,237,0.6)', fontFamily: 'var(--font-body)', fontSize: 13 }}>Email</a>
          </div>
        </div>
      </div>
    </Phone>
  );
}

Object.assign(window, { LandingHero, LandingArcade, LandingEditorial });
