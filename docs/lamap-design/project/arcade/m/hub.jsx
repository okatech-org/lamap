/* global React, Phone, MStatusBar, AppBar, PageTitle, SectionHeader, Row, RoundIcon, Avatar, MBottomNav, RankShield, Embers, GoldDust, Card3D, CardBack3D */

// ─── 2.1 · Hub d'accueil (Apple Music density) ───
function MHub() {
  return (
    <Phone bg="app" nav={<MBottomNav active="home" />}>
      <GoldDust count={10} opacity={0.3} />

      <MStatusBar />

      {/* Header bar — avatar + balance */}
      <div style={{
        padding: '4px 20px 0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative', zIndex: 10,
      }}>
        <Avatar initials="NK" size={36} color="jade" ring />
        <div className="chip" style={{ height: 28 }}>
          <span style={{ color: 'var(--gold-bright)' }}>◆</span>
          <span className="f-display" style={{ fontSize: 12, color: 'var(--gold-bright)' }}>12,480</span>
        </div>
      </div>

      {/* Big page title */}
      <div style={{ padding: '24px 20px 8px' }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>BONSOIR NKOMO</div>
        <div className="f-display" style={{
          fontSize: 32, color: 'var(--cream)', fontWeight: 800,
          letterSpacing: '-0.025em', lineHeight: 1,
        }}>Une partie<br/>ce soir ?</div>
      </div>

      {/* Hero card — Continue / Quick play */}
      <div style={{
        margin: '12px 20px 24px', borderRadius: 22, overflow: 'hidden',
        background: 'linear-gradient(135deg, var(--jade) 0%, var(--night-2) 60%, var(--abyss) 100%)',
        border: '1px solid var(--gold-25)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.45)',
        position: 'relative', height: 180,
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 70% 100% at 100% 50%, var(--accent-30), transparent 60%)',
        }} />
        {/* Floating card */}
        <div style={{
          position: 'absolute', right: -15, top: 22, transform: 'rotate(8deg)',
          filter: 'drop-shadow(0 14px 28px rgba(0,0,0,0.5))',
        }}>
          <Card3D rank="7" suit="hearts" size="md" tilt={false} foil />
        </div>
        {/* Copy */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, padding: 18, maxWidth: 220 }}>
          <div className="f-mono" style={{ fontSize: 9, color: 'var(--accent-text)', letterSpacing: '0.25em', marginBottom: 6 }}>★ MATCH CLASSÉ</div>
          <div className="f-display" style={{ fontSize: 22, color: 'var(--cream)', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em' }}>Trouve un<br/>adversaire</div>
          <div className="f-body" style={{ fontSize: 11, color: 'rgba(246,239,223,0.6)', marginTop: 6 }}>
            1 247 joueurs · pot moyen 220 K
          </div>
        </div>
        <button style={{
          position: 'absolute', bottom: 18, right: 18,
          width: 44, height: 44, borderRadius: '50%',
          background: 'linear-gradient(180deg, var(--gold-bright), var(--gold-deep))',
          border: 'none', color: '#1F1810', fontWeight: 700, fontSize: 20, cursor: 'pointer',
          boxShadow: '0 8px 18px var(--gold-40)',
        }}>▶</button>
      </div>

      {/* Section — modes */}
      <SectionHeader title="Modes de jeu" more="Voir tous" />
      <div className="no-scrollbar" style={{
        padding: '0 20px 12px', display: 'flex', gap: 10, overflowX: 'auto',
      }}>
        <ModeChip icon="⚔" label="Classé" sub="100 K min" tone="jade" />
        <ModeChip icon="◆" label="Mise libre" sub="dès 50 K" tone="gold" />
        <ModeChip icon="◯" label="Privé" sub="ami / code" tone="neutral" />
        <ModeChip icon="🜂" label="Entraînement" sub="sans mise" tone="neutral" />
      </div>

      {/* Gagner sans payer — bonus quotidien + pub récompensée */}
      <SectionHeader title="Gagne sans payer" />
      <div style={{ padding: '0 20px 12px', display: 'flex', gap: 10 }}>
        <div style={{
          flex: 1, padding: 14, borderRadius: 16,
          background: 'linear-gradient(135deg, var(--gold-22), var(--gold-08))',
          border: '1px solid var(--gold-45)',
          boxShadow: '0 0 18px var(--gold-22)',
          cursor: 'pointer', position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: 10, right: 10,
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--gold-bright)',
            boxShadow: '0 0 8px var(--gold-bright)',
          }} />
          <div className="f-mono" style={{ fontSize: 8, color: 'var(--gold-bright)', letterSpacing: '0.22em' }}>BONUS · JOUR 4</div>
          <div className="f-display" style={{ fontSize: 22, color: 'var(--cream)', fontWeight: 800, marginTop: 6, letterSpacing: '-0.02em' }}>+250 K</div>
          <div className="f-body" style={{ fontSize: 10, color: 'rgba(246,239,223,0.55)', marginTop: 3 }}>Récolte aujourd'hui</div>
        </div>
        <div style={{
          flex: 1, padding: 14, borderRadius: 16,
          background: 'linear-gradient(135deg, var(--accent-18), transparent)',
          border: '1px solid var(--accent-40)',
          cursor: 'pointer', position: 'relative',
        }}>
          <div className="f-mono" style={{ fontSize: 8, color: 'var(--accent-text)', letterSpacing: '0.22em' }}>▶ PUB · 3/5</div>
          <div className="f-display" style={{ fontSize: 22, color: 'var(--cream)', fontWeight: 800, marginTop: 6, letterSpacing: '-0.02em' }}>+150 K</div>
          <div className="f-body" style={{ fontSize: 10, color: 'rgba(246,239,223,0.55)', marginTop: 3 }}>30 sec, paye rien</div>
        </div>
      </div>

      {/* Section — Saison */}
      <div style={{
        margin: '10px 20px 0', padding: 16, borderRadius: 18,
        background: 'var(--surf-55)',
        border: '1px solid var(--gold-10)',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: 'linear-gradient(135deg, var(--gold-bright), var(--gold-deep))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, color: '#1F1810',
        }}>S04</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span className="f-display" style={{ fontSize: 14, color: 'var(--cream)' }}>Cercle de Feu</span>
            <span className="f-mono" style={{ fontSize: 9, color: 'var(--gold)' }}>23/50</span>
          </div>
          <div style={{ marginTop: 6, height: 4, borderRadius: 99, background: 'var(--gold-10)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: '46%',
              background: 'linear-gradient(90deg, var(--gold-deep), var(--gold-bright))',
              boxShadow: '0 0 8px var(--gold-50)',
            }} />
          </div>
          <div className="f-body" style={{ fontSize: 11, color: 'rgba(246,239,223,0.5)', marginTop: 4 }}>17 j restants</div>
        </div>
      </div>

      {/* Bottom spacer for sticky nav */}
      <div style={{ height: 100 }} />
    </Phone>
  );
}

function ModeChip({ icon, label, sub, tone = 'neutral' }) {
  const colors = {
    jade:    { bg: 'var(--accent-14)',  border: 'var(--accent-35)',  text: 'var(--accent-text)' },
    gold:    { bg: 'var(--gold-14)', border: 'var(--gold-40)', text: 'var(--gold-bright)' },
    neutral: { bg: 'var(--surf-60)',     border: 'var(--gold-12)', text: 'rgba(246,239,223,0.65)' },
  }[tone];
  return (
    <div style={{
      flexShrink: 0, width: 140,
      padding: 14, borderRadius: 14,
      background: colors.bg, border: `1px solid ${colors.border}`,
    }}>
      <div style={{ fontSize: 24, color: colors.text, marginBottom: 6 }}>{icon}</div>
      <div className="f-display" style={{ fontSize: 14, color: 'var(--cream)' }}>{label}</div>
      <div className="f-body" style={{ fontSize: 11, color: 'rgba(246,239,223,0.5)', marginTop: 2 }}>{sub}</div>
    </div>
  );
}

// ─── 2.2 · Mode select (dedicated screen) ───
function MModeSelect() {
  return (
    <Phone bg="app">
      <GoldDust count={8} opacity={0.3} />

      <MStatusBar />
      <AppBar title="" right={null} />
      <PageTitle eyebrow="JOUER" title="Choisis un mode." />

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <ModeBigCard
          tone="gold"
          eyebrow="CLASSÉ"
          title="Match classé"
          sub="Mise standard 100 K · gagne des PR pour grimper l'échelle."
          stat="2,138 PR — Maître"
        />
        <ModeBigCard
          tone="jade"
          eyebrow="MISE LIBRE"
          title="Mise libre"
          sub="Tu fixes la mise dès 10 K. Pas de PR, juste du Kora."
          stat="Mise minimale 10 K"
        />
        <ModeBigCard
          tone="neutral"
          eyebrow="PRIVÉ"
          title="Partie privée"
          sub="Crée une table, invite un ami avec un code, fixe les règles."
          stat="6 chiffres · code de salon"
        />
        <ModeBigCard
          tone="neutral"
          eyebrow="ENTRAÎNEMENT"
          title="Contre IA"
          sub="Sans mise, sans PR. Pour t'échauffer ou apprendre."
          stat="3 niveaux d'IA"
        />
      </div>
    </Phone>
  );
}

function ModeBigCard({ eyebrow, title, sub, stat, tone = 'neutral' }) {
  const styles = {
    gold:    { bg: 'linear-gradient(135deg, var(--gold-18), var(--gold-08))', border: 'var(--gold-40)',  accent: 'var(--gold-bright)' },
    jade:    { bg: 'linear-gradient(135deg, var(--accent-18),  var(--accent-08))',    border: 'var(--accent-40)',   accent: 'var(--accent-text)' },
    neutral: { bg: 'var(--surf-55)',                                                       border: 'var(--gold-12)', accent: 'rgba(246,239,223,0.7)' },
  }[tone];
  return (
    <div style={{
      padding: 18, borderRadius: 18,
      background: styles.bg, border: `1px solid ${styles.border}`,
      display: 'flex', flexDirection: 'column', gap: 4,
      cursor: 'pointer',
    }}>
      <div className="eyebrow" style={{ color: styles.accent, opacity: 1 }}>{eyebrow}</div>
      <div className="f-display" style={{ fontSize: 22, color: 'var(--cream)', fontWeight: 800, marginTop: 4 }}>{title}</div>
      <div className="f-body" style={{ fontSize: 13, color: 'rgba(246,239,223,0.65)', marginTop: 4, lineHeight: 1.4 }}>{sub}</div>
      <div className="f-mono" style={{ fontSize: 10, color: styles.accent, marginTop: 10 }}>{stat}</div>
    </div>
  );
}

// ─── 2.3 · Matchmaking radar ───
function MMatchmaking() {
  return (
    <Phone bg="velvet">
      <GoldDust count={14} opacity={0.5} />

      <MStatusBar />
      <AppBar title="Match classé · 100 K" />

      {/* Player + radar */}
      <div style={{
        position: 'absolute', top: 160, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', alignItems: 'center',
      }}>
        <div style={{ position: 'relative', width: 280, height: 280 }}>
          {/* Concentric pulses */}
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              position: 'absolute', inset: -i * 30,
              borderRadius: '50%',
              border: '1px solid var(--accent-30)',
              animation: `la-pulse ${3 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.6}s`,
            }} />
          ))}
          <div style={{
            position: 'absolute', inset: 70,
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--accent-35), transparent 70%)',
            filter: 'blur(20px)',
          }} />
          {/* Player avatar in center */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          }}>
            <Avatar initials="NK" size={120} color="jade" ring />
          </div>
          {/* Sweep arm */}
          <svg width="280" height="280" style={{
            position: 'absolute', inset: 0,
            animation: 'la-rotate 3s linear infinite',
          }}>
            <defs>
              <linearGradient id="sweep" x1="0.5" y1="0.5" x2="1" y2="0.5">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="100%" stopColor="var(--gold-40)" />
              </linearGradient>
            </defs>
            <path d="M 140 140 L 280 140 A 140 140 0 0 0 220 30 Z" fill="url(#sweep)" />
          </svg>
        </div>
      </div>

      {/* Status */}
      <div style={{
        position: 'absolute', top: 484, left: 0, right: 0, textAlign: 'center',
      }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>RECHERCHE D'ADVERSAIRE</div>
        <div className="f-display" style={{ fontSize: 26, color: 'var(--cream)', fontWeight: 800 }}>00:14</div>
        <div className="f-body" style={{ fontSize: 13, color: 'rgba(246,239,223,0.55)', marginTop: 4 }}>
          On cherche quelqu'un de ton niveau…
        </div>
      </div>

      {/* Match info */}
      <div style={{
        position: 'absolute', top: 600, left: 20, right: 20,
        padding: 14, borderRadius: 14,
        background: 'var(--surf-55)',
        border: '1px solid var(--gold-12)',
        display: 'flex', justifyContent: 'space-around', textAlign: 'center',
      }}>
        <div>
          <div className="f-mono" style={{ fontSize: 9, color: 'rgba(246,239,223,0.5)' }}>MISE</div>
          <div className="f-display" style={{ fontSize: 16, color: 'var(--gold-bright)' }}>100 K</div>
        </div>
        <div style={{ width: 1, background: 'var(--gold-15)' }} />
        <div>
          <div className="f-mono" style={{ fontSize: 9, color: 'rgba(246,239,223,0.5)' }}>POT</div>
          <div className="f-display" style={{ fontSize: 16, color: 'var(--cream)' }}>200 K</div>
        </div>
        <div style={{ width: 1, background: 'var(--gold-15)' }} />
        <div>
          <div className="f-mono" style={{ fontSize: 9, color: 'rgba(246,239,223,0.5)' }}>GAIN</div>
          <div className="f-display" style={{ fontSize: 16, color: 'var(--accent-text)' }}>+180 K</div>
        </div>
      </div>

      {/* Cancel */}
      <div style={{
        position: 'absolute', bottom: 32, left: 20, right: 20,
      }}>
        <button className="btn btn-dark" style={{ width: '100%', fontSize: 14, padding: '14px', borderColor: 'var(--ember-50)', color: 'var(--chip-ember-color)' }}>
          Annuler la recherche
        </button>
      </div>
    </Phone>
  );
}

// ─── 2.4 · Private lobby (room with code) ───
function MPrivateLobby() {
  return (
    <Phone bg="app">
      <GoldDust count={10} opacity={0.3} />

      <MStatusBar />
      <AppBar title="Salon privé" right={<button style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surf-70)', border: '1px solid var(--gold-18)', color: 'var(--cream)', fontSize: 14, cursor: 'pointer' }}>⋯</button>} />

      <PageTitle eyebrow="CODE DU SALON" title="K7T-892" action={
        <button className="chip chip-jade">↗ Partager</button>
      } />

      <div className="f-body" style={{ padding: '0 20px 20px', fontSize: 13, color: 'rgba(246,239,223,0.6)', lineHeight: 1.5 }}>
        Envoie ce code à un ami pour qu'il rejoigne la table. La partie démarre dès que vous êtes deux.
      </div>

      {/* Players seats */}
      <div style={{
        margin: '0 20px 20px', padding: 20, borderRadius: 20,
        background: 'linear-gradient(180deg, var(--surf-85), var(--surf-92))',
        border: '1px solid var(--gold-18)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
          <Seat name="Nkomo K." initials="NK" pr={2138} ready />
          <div className="f-display" style={{ fontSize: 18, color: 'var(--gold)' }}>VS</div>
          <SeatEmpty />
        </div>
      </div>

      {/* Settings */}
      <SectionHeader title="Réglages de la partie" />
      <div style={{
        margin: '0 20px 20px', borderRadius: 18,
        background: 'var(--surf-55)',
        border: '1px solid var(--gold-10)',
      }}>
        <Row title="Mise par joueur" right={<span className="f-display" style={{ fontSize: 14, color: 'var(--gold-bright)' }}>100 K ›</span>} />
        <Row title="Manches gagnantes" subtitle="Standard : 5 manches, dernière compte" right={<span className="f-display" style={{ fontSize: 14, color: 'var(--cream)' }}>5 ›</span>} />
        <Row title="Temps par tour" right={<span className="f-display" style={{ fontSize: 14, color: 'var(--cream)' }}>30 s ›</span>} last />
      </div>

      <div style={{ position: 'absolute', bottom: 32, left: 20, right: 20 }}>
        <button className="btn btn-gold" style={{ width: '100%', fontSize: 15, padding: '15px' }} disabled>
          En attente d'un joueur…
        </button>
      </div>
    </Phone>
  );
}

function Seat({ name, initials, pr, ready }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1 }}>
      <Avatar initials={initials} size={64} color="jade" ring />
      <div className="f-display" style={{ fontSize: 14, color: 'var(--cream)' }}>{name}</div>
      <div className="f-mono" style={{ fontSize: 9, color: 'var(--gold-bright)' }}>{pr} PR</div>
      {ready && (
        <div className="chip chip-jade" style={{ height: 20, fontSize: 8, padding: '0 8px' }}>✓ PRÊT</div>
      )}
    </div>
  );
}

function SeatEmpty() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1 }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        border: '1.5px dashed var(--gold-30)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--gold-40)', fontSize: 22,
      }}>?</div>
      <div className="f-display" style={{ fontSize: 14, color: 'rgba(246,239,223,0.5)' }}>En attente…</div>
      <div className="f-mono" style={{ fontSize: 9, color: 'rgba(246,239,223,0.4)' }}>—</div>
    </div>
  );
}

Object.assign(window, { MHub, MModeSelect, MMatchmaking, MPrivateLobby });
