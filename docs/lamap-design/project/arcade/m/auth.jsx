/* global React, Phone, MStatusBar, Embers, GoldDust, Smoke, Card3D, CardBack3D */

// ─── 1.1 · Login / Sign-up ───
function MAuth() {
  return (
    <Phone bg="app">
      <Smoke count={3} />
      <Embers count={10} />
      <GoldDust count={14} opacity={0.4} />

      <MStatusBar />

      {/* Logo block — high & centered */}
      <div style={{
        position: 'absolute', top: 140, left: 0, right: 0, textAlign: 'center', zIndex: 5,
      }}>
        <div style={{
          width: 64, height: 64, margin: '0 auto 24px',
          position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, var(--gold-50), var(--gold-08))',
            transform: 'rotate(45deg)', border: '1.5px solid var(--gold)',
          }} />
          <span className="f-display" style={{
            position: 'relative', fontSize: 22, color: 'var(--gold-bright)', fontWeight: 800,
          }}>LM</span>
        </div>
        <div className="f-display" style={{
          fontSize: 44, color: 'var(--cream)', fontWeight: 800,
          letterSpacing: '-0.04em', lineHeight: 0.95,
        }}>La Map<span style={{ color: 'var(--gold)' }}>.</span></div>
        <div className="f-roman" style={{
          fontSize: 13, color: 'rgba(246,239,223,0.55)', marginTop: 8,
          fontStyle: 'italic', letterSpacing: '0.16em',
        }}>fais tomber la main</div>
      </div>

      {/* Floating card behind */}
      <div style={{
        position: 'absolute', top: 360, left: '50%', transform: 'translate(-58%, 0) rotate(-8deg)',
        opacity: 0.6,
      }}>
        <CardBack3D size="md" skin="emerald" tilt={false} />
      </div>
      <div style={{
        position: 'absolute', top: 380, left: '50%', transform: 'translate(-28%, 0) rotate(6deg)',
        opacity: 0.85,
        zIndex: 2,
      }}>
        <Card3D rank="7" suit="hearts" size="md" tilt={false} foil />
      </div>

      {/* CTA stack at bottom */}
      <div style={{
        position: 'absolute', bottom: 56, left: 24, right: 24,
        display: 'flex', flexDirection: 'column', gap: 10, zIndex: 10,
      }}>
        <button className="btn btn-gold" style={{ fontSize: 15, padding: '16px' }}>
          Commencer — création gratuite
        </button>
        <button className="btn btn-dark" style={{ fontSize: 14, padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, whiteSpace: 'nowrap' }}>
          <span style={{ width: 16, height: 16, borderRadius: 3, background: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>G</span>
          Continuer avec Google
        </button>
        <button className="btn btn-dark" style={{ fontSize: 14, padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}></span>
          Continuer avec Apple
        </button>
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <span className="f-body" style={{ fontSize: 13, color: 'rgba(246,239,223,0.55)' }}>
            Déjà inscrit ? <span style={{ color: 'var(--gold-bright)', fontWeight: 600 }}>Connexion</span>
          </span>
        </div>
      </div>

      {/* Fine print */}
      <div style={{
        position: 'absolute', bottom: 18, left: 24, right: 24,
        textAlign: 'center',
      }}>
        <span className="f-body" style={{ fontSize: 10, color: 'rgba(246,239,223,0.35)' }}>
          En continuant, tu acceptes nos <u>CGU</u> · <u>Confidentialité</u>
        </span>
      </div>
    </Phone>
  );
}

// ─── 1.2-1.5 · Onboarding screens (4 steps) ───
function MOnboard1() {
  return <OnboardingScene step={0} />;
}
function MOnboard2() {
  return <OnboardingScene step={1} />;
}
function MOnboard3() {
  return <OnboardingScene step={2} />;
}
function MOnboard4() {
  return <OnboardingScene step={3} />;
}

const ONBOARD_STEPS = [
  {
    eyebrow: 'BIENVENUE',
    title: 'Le jeu des\nmains.',
    body: 'LaMap est un duel de cartes en 5 manches. Seule la dernière main décide qui rafle la mise.',
    art: 'duel',
    cta: 'Continuer',
  },
  {
    eyebrow: 'COMMENT JOUER',
    title: 'Suis la couleur,\nou cède la main.',
    body: 'Si tu as la couleur demandée, tu dois la jouer. Sinon tu défausses et tu perds la main.',
    art: 'rule',
    cta: 'Continuer',
  },
  {
    eyebrow: 'LA RÈGLE D\u2019OR',
    title: 'Le 3 est ton arme secrète.',
    body: 'Gagner la dernière main avec un 3 déclenche une Kora — multiplicateur ×2, ×4 ou ×8 sur tes gains.',
    art: 'kora',
    cta: 'Continuer',
  },
  {
    eyebrow: 'À TOI DE JOUER',
    title: 'Lance une\npartie d\u2019entraînement.',
    body: 'On joue contre une IA, sans mise, pour bien sentir le tempo. Tu peux quitter à tout moment.',
    art: 'play',
    cta: 'Lancer une partie',
  },
];

function OnboardingScene({ step }) {
  const data = ONBOARD_STEPS[step];
  return (
    <Phone bg="app">
      <GoldDust count={10} opacity={0.3} />
      <MStatusBar />

      {/* Skip top-right */}
      <div style={{
        position: 'absolute', top: 58, right: 18, zIndex: 20,
      }}>
        <button className="f-body" style={{
          fontSize: 13, color: 'rgba(246,239,223,0.55)',
          background: 'transparent', border: 'none', cursor: 'pointer',
        }}>Passer</button>
      </div>

      {/* Art zone */}
      <div style={{
        position: 'absolute', top: 90, left: 0, right: 0, height: 360,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <OnboardingArt kind={data.art} />
      </div>

      {/* Copy zone */}
      <div style={{
        position: 'absolute', top: 480, left: 24, right: 24, textAlign: 'center',
      }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>{data.eyebrow}</div>
        <div className="f-display" style={{
          fontSize: 32, color: 'var(--cream)', fontWeight: 800,
          letterSpacing: '-0.03em', lineHeight: 1.05, whiteSpace: 'pre-line',
        }}>{data.title}</div>
        <div className="f-body" style={{
          fontSize: 15, color: 'rgba(246,239,223,0.65)', marginTop: 14,
          lineHeight: 1.55,
        }}>{data.body}</div>
      </div>

      {/* Dots */}
      <div style={{
        position: 'absolute', bottom: 116, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', gap: 6,
      }}>
        {ONBOARD_STEPS.map((_, i) => (
          <div key={i} style={{
            width: i === step ? 22 : 6, height: 6, borderRadius: 99,
            background: i === step ? 'var(--gold-bright)' : 'var(--gold-25)',
            transition: 'width 200ms ease',
          }} />
        ))}
      </div>

      {/* CTA */}
      <div style={{
        position: 'absolute', bottom: 32, left: 24, right: 24,
      }}>
        <button className={step === 3 ? 'btn btn-gold' : 'btn btn-jade'} style={{ width: '100%', fontSize: 15, padding: '16px' }}>
          {data.cta} →
        </button>
      </div>
    </Phone>
  );
}

function OnboardingArt({ kind }) {
  if (kind === 'duel') {
    return (
      <div style={{ position: 'relative', width: 280, height: 320 }}>
        <div style={{ position: 'absolute', top: 20, left: 30, transform: 'rotate(-14deg)', filter: 'drop-shadow(0 16px 30px rgba(0,0,0,0.5))' }}>
          <CardBack3D size="lg" skin="emerald" tilt={false} />
        </div>
        <div style={{ position: 'absolute', top: 80, right: 20, transform: 'rotate(10deg)', filter: 'drop-shadow(0 16px 30px rgba(0,0,0,0.5))' }}>
          <Card3D rank="7" suit="hearts" size="lg" tilt={false} foil />
        </div>
      </div>
    );
  }
  if (kind === 'rule') {
    return (
      <div style={{ position: 'relative', width: 320, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 30 }}>
        <div style={{ filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.5))', transform: 'rotate(-6deg)' }}>
          <Card3D rank="9" suit="hearts" size="md" tilt={false} />
        </div>
        <div className="f-display" style={{ fontSize: 28, color: 'var(--gold)' }}>→</div>
        <div style={{ filter: 'drop-shadow(0 12px 24px var(--gold-40))', transform: 'rotate(4deg)' }}>
          <Card3D rank="10" suit="hearts" size="md" tilt={false} highlighted />
        </div>
      </div>
    );
  }
  if (kind === 'kora') {
    return (
      <div style={{ position: 'relative', width: 280, height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle, var(--gold-32), transparent 70%)',
          filter: 'blur(30px)',
        }} />
        <div style={{
          filter: 'drop-shadow(0 24px 48px var(--gold-50)) drop-shadow(0 0 24px var(--accent-40))',
          animation: 'la-breathe 3s ease-in-out infinite',
        }}>
          <Card3D rank="3" suit="hearts" size="xl" tilt={false} foil highlighted />
        </div>
        <div style={{
          position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)',
          padding: '4px 14px', borderRadius: 99,
          background: 'linear-gradient(180deg, var(--gold-bright), var(--gold-deep))',
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, color: '#1F1810',
          boxShadow: '0 8px 20px var(--gold-40)',
        }}>KORA ×2</div>
      </div>
    );
  }
  // play
  return (
    <div style={{ position: 'relative', width: 320, height: 300 }}>
      <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex' }}>
        {[7, 3, 6, 9, 10].map((r, i) => (
          <div key={i} style={{
            transform: `translateX(${(i - 2) * 12}px) rotate(${(i - 2) * 4}deg) translateY(${Math.abs(i - 2) * 4}px)`,
            marginLeft: i === 0 ? 0 : -50,
            filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.5))',
            zIndex: i,
          }}>
            <Card3D rank={r} suit={['hearts','clubs','spades','diamonds','hearts'][i]} size="md" tilt={false} />
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { MAuth, MOnboard1, MOnboard2, MOnboard3, MOnboard4 });
