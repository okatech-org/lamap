/* global React, Phone, MStatusBar, AppBar, PageTitle, SectionHeader, Row, RoundIcon, Avatar, GoldDust, Card3D */

// ─── 7.1 · Rules & glossary ───
function MRules() {
  return (
    <Phone bg="app">
      <GoldDust count={8} opacity={0.3} />
      <MStatusBar />
      <AppBar title="" />
      <PageTitle eyebrow="GUIDE · RÈGLES" title="Comment\non joue." />

      <div className="f-body" style={{ padding: '0 20px 24px', fontSize: 14, color: 'rgba(246,239,223,0.65)', lineHeight: 1.55 }}>
        LaMap est un duel en 5 manches. Seule la dernière main décide qui gagne le pot.
      </div>

      {/* Hierarchy visual */}
      <div style={{
        margin: '0 20px 24px', padding: 18, borderRadius: 18,
        background: 'var(--surf-55)',
        border: '1px solid var(--gold-12)',
      }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>HIÉRARCHIE DES CARTES</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
          {[3,4,5,6,7,8,9,10].map((r, i) => (
            <div key={r} style={{
              width: 32, height: 44, borderRadius: 6,
              background: i === 7 ? 'linear-gradient(180deg, var(--gold-bright), var(--gold-deep))' : 'var(--surf-70)',
              border: `1px solid ${i === 7 ? 'var(--gold)' : 'var(--gold-18)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-card)', fontWeight: 700, fontSize: 18,
              color: i === 7 ? '#1F1810' : 'rgba(246,239,223,0.7)',
            }}>{r}</div>
          ))}
        </div>
        <div className="f-body" style={{ fontSize: 12, color: 'rgba(246,239,223,0.55)', marginTop: 10, lineHeight: 1.5 }}>
          Le <span style={{ color: 'var(--gold-bright)' }}>10</span> est la plus forte. Le <span style={{ color: 'var(--cream)' }}>3</span> est la plus faible — mais c'est l'arme à Kora.
        </div>
      </div>

      {/* Rules cards */}
      <SectionHeader title="Le déroulé" />
      <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <RuleBlock n="01" title="Distribution" body="Chaque joueur reçoit 5 cartes. Pas de pioche." />
        <RuleBlock n="02" title="La main" body="Celui qui a « la main » joue le premier. Il choisit la couleur du tour." />
        <RuleBlock n="03" title="Suivre la couleur" body="Si tu as la couleur demandée, tu DOIS la jouer. La carte la plus haute prend la main." />
        <RuleBlock n="04" title="Pas de couleur ?" body="Tu défausses une carte de ton choix. Tu cèdes automatiquement la main." />
        <RuleBlock n="05" title="Le tour 5 décide" body="Seul qui gagne la 5ᵉ manche remporte le pot. Les autres manches ne comptent pas… sauf pour la Kora." highlight />
      </div>

      {/* Glossary */}
      <SectionHeader title="Glossaire" />
      <div style={{
        margin: '0 20px 24px', borderRadius: 18,
        background: 'var(--surf-55)',
        border: '1px solid var(--gold-10)',
      }}>
        <GlossRow term="KORA" def="Gagner la dernière manche avec un 3 — multiplicateur ×2." />
        <GlossRow term="DOUBLE KORA" def="Gagner les manches 4 ET 5 avec des 3 — ×4." />
        <GlossRow term="TRIPLE KORA" def="Manches 3, 4 ET 5 avec des 3 — ×8 (rare)." highlight />
        <GlossRow term="BANDI" def="Victoire éclatante. Surnom de la légende du PK5." />
        <GlossRow term="POT" def="Total des mises. 90% au gagnant, 10% à la plateforme." last />
      </div>
    </Phone>
  );
}

function RuleBlock({ n, title, body, highlight }) {
  return (
    <div style={{
      padding: '14px 16px', borderRadius: 14,
      background: highlight ? 'linear-gradient(135deg, var(--gold-18), transparent)' : 'var(--surf-55)',
      border: `1px solid ${highlight ? 'var(--gold-40)' : 'var(--gold-10)'}`,
      display: 'flex', gap: 12, alignItems: 'flex-start',
    }}>
      <div className="f-mono" style={{
        width: 28, fontSize: 11, color: highlight ? 'var(--gold-bright)' : 'var(--gold-60)',
        fontWeight: 700, letterSpacing: '0.1em', flexShrink: 0,
      }}>{n}</div>
      <div style={{ flex: 1 }}>
        <div className="f-display" style={{ fontSize: 14, color: 'var(--cream)' }}>{title}</div>
        <div className="f-body" style={{ fontSize: 12, color: 'rgba(246,239,223,0.65)', marginTop: 3, lineHeight: 1.5 }}>{body}</div>
      </div>
    </div>
  );
}

function GlossRow({ term, def, highlight, last }) {
  return (
    <div style={{
      padding: '12px 16px',
      borderBottom: last ? 'none' : '0.5px solid var(--gold-08)',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div className="f-display" style={{
        width: 100, fontSize: 12, color: highlight ? 'var(--gold-bright)' : 'var(--cream)',
        fontWeight: 800, letterSpacing: '0.04em',
      }}>{term}</div>
      <div className="f-body" style={{ flex: 1, fontSize: 12, color: 'rgba(246,239,223,0.6)', lineHeight: 1.5 }}>{def}</div>
    </div>
  );
}

// ─── 7.2 · Settings ───
function MSettings() {
  return (
    <Phone bg="app">
      <MStatusBar />
      <AppBar title="" />
      <PageTitle eyebrow="RÉGLAGES" title="Paramètres." />

      {/* Account hero */}
      <div style={{
        margin: '0 20px 20px', padding: 14, borderRadius: 16,
        background: 'var(--surf-55)',
        border: '1px solid var(--gold-12)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <Avatar initials="NK" size={48} color="jade" />
        <div style={{ flex: 1 }}>
          <div className="f-display" style={{ fontSize: 15, color: 'var(--cream)' }}>Nkomo K.</div>
          <div className="f-body" style={{ fontSize: 11, color: 'rgba(246,239,223,0.55)', marginTop: 2 }}>nkomo@gmail · vérifié</div>
        </div>
        <span className="f-display" style={{ fontSize: 14, color: 'rgba(246,239,223,0.5)' }}>›</span>
      </div>

      <SectionHeader title="Compte" />
      <SettingsGroup>
        <SetRow icon="◯" title="Pseudo" right="Nkomo K." />
        <SetRow icon="✉" title="Adresse e-mail" right="nkomo@gmail" />
        <SetRow icon="☎" title="Téléphone" right="+241 ··· 4892" />
        <SetRow icon="🛡" title="Mot de passe & 2FA" right="Activé" tone="jade" last />
      </SettingsGroup>

      <SectionHeader title="Préférences" />
      <SettingsGroup>
        <SetRow icon="🔊" title="Effets sonores" toggle on />
        <SetRow icon="♪" title="Musique" toggle off />
        <SetRow icon="📳" title="Vibration au coup" toggle on />
        <SetRow icon="🌍" title="Langue" right="Français" last />
      </SettingsGroup>

      <SectionHeader title="Confidentialité" />
      <SettingsGroup>
        <SetRow icon="👁" title="Profil visible aux inconnus" toggle on />
        <SetRow icon="⌖" title="Apparaître dans le classement" toggle on />
        <SetRow icon="✉" title="Messages d'inconnus" toggle off last />
      </SettingsGroup>

      <SectionHeader title="Économie" />
      <SettingsGroup>
        <SetRow icon="◆" title="Plafond de mise par partie" right="500 K" />
        <SetRow icon="⌛" title="Limite de session" right="2 h / jour" />
        <SetRow icon="🚫" title="Auto-exclusion" right="Désactivée" tone="muted" last />
      </SettingsGroup>

      <SectionHeader title="Support & légal" />
      <SettingsGroup>
        <SetRow icon="?" title="Aide & FAQ" />
        <SetRow icon="✉" title="Nous contacter" />
        <SetRow icon="§" title="CGU · Confidentialité" last />
      </SettingsGroup>

      <div style={{ padding: '20px 20px 40px' }}>
        <button style={{
          width: '100%', padding: '14px', borderRadius: 999,
          background: 'transparent',
          border: '1px solid var(--ember-45)',
          color: 'var(--chip-ember-color)', fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600,
          cursor: 'pointer',
        }}>Se déconnecter</button>
        <div className="f-mono" style={{ textAlign: 'center', fontSize: 9, color: 'rgba(246,239,223,0.35)', marginTop: 16 }}>
          LAMAP ARCADE · v3.0.0
        </div>
      </div>
    </Phone>
  );
}

function SettingsGroup({ children }) {
  return (
    <div style={{
      margin: '0 20px 20px', borderRadius: 18,
      background: 'var(--surf-55)',
      border: '1px solid var(--gold-10)',
    }}>{children}</div>
  );
}

function SetRow({ icon, title, right, tone = 'neutral', toggle, on, last }) {
  const rightColors = { neutral: 'rgba(246,239,223,0.5)', jade: 'var(--accent-text)', muted: 'rgba(246,239,223,0.35)' };
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 16px',
      borderBottom: last ? 'none' : '0.5px solid var(--gold-08)',
      cursor: 'pointer',
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: 8,
        background: 'var(--surf-60)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'rgba(246,239,223,0.7)', fontSize: 14,
        flexShrink: 0,
      }}>{icon}</div>
      <span className="f-body" style={{ flex: 1, fontSize: 13, color: 'var(--cream)' }}>{title}</span>
      {toggle ? (
        <div style={{
          width: 36, height: 22, borderRadius: 99,
          background: on ? 'linear-gradient(180deg, var(--jade-glow), var(--jade))' : 'var(--surf-70)',
          border: `1px solid ${on ? 'var(--accent-50)' : 'var(--gold-18)'}`,
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: 2, left: on ? 16 : 2,
            width: 16, height: 16, borderRadius: '50%',
            background: 'var(--cream)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
            transition: 'left 200ms ease',
          }} />
        </div>
      ) : (
        <>
          <span className="f-body" style={{ fontSize: 12, color: rightColors[tone] }}>{right}</span>
          <span style={{ color: 'rgba(246,239,223,0.4)', fontSize: 14 }}>›</span>
        </>
      )}
    </div>
  );
}

Object.assign(window, { MRules, MSettings });
