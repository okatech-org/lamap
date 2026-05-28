/* global React, Phone, MStatusBar, AppBar, PageTitle, SectionHeader, Row, RoundIcon, Avatar, RankShield, RANK_TIERS, MBottomNav, GoldDust, Embers */

// ─── 6.1 · My profile (cleaner) ───
function MProfile() {
  return (
    <Phone bg="app" nav={<MBottomNav active="profile" />}>
      <GoldDust count={10} opacity={0.3} />
      <MStatusBar />

      <div style={{ padding: '4px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="f-display" style={{ fontSize: 17, color: 'var(--cream)' }}>Profil</div>
        <button style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'var(--surf-70)', border: '1px solid var(--gold-20)',
          color: 'var(--cream)', cursor: 'pointer', fontSize: 14,
        }}>⚙</button>
      </div>

      {/* Hero — identity */}
      <div style={{
        margin: '20px 20px 24px', padding: 20, borderRadius: 22,
        background: 'linear-gradient(180deg, var(--surf-85), var(--surf-92))',
        border: '1px solid var(--gold-30)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -30, right: -30, width: 160, height: 160,
          background: 'radial-gradient(circle, var(--accent-25), transparent 70%)',
          filter: 'blur(20px)',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
          <Avatar initials="NK" size={72} color="jade" ring />
          <div style={{ flex: 1 }}>
            <div className="f-display" style={{ fontSize: 22, color: 'var(--cream)', fontWeight: 800 }}>Nkomo K.</div>
            <div className="f-roman" style={{ fontSize: 11, color: 'rgba(246,239,223,0.55)', fontStyle: 'italic', marginTop: 2 }}>
              « le félin du PK5 »
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <RankShield short="M" size={22} />
              <div>
                <span className="f-display" style={{ fontSize: 13, color: 'var(--jade-glow)', fontWeight: 700 }}>Maître</span>
                <span className="f-mono" style={{ fontSize: 10, color: 'var(--gold-bright)', marginLeft: 8 }}>2,138 PR</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div style={{
          marginTop: 18, padding: 14, borderRadius: 14,
          background: 'rgba(6,14,12,0.4)',
          border: '1px solid var(--gold-10)',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6,
        }}>
          <Stat label="Victoires" value="284" />
          <Stat label="Taux" value="61%" tone="gold" />
          <Stat label="Koras" value="12" tone="gold" />
          <Stat label="Streak" value="5" />
        </div>
      </div>

      {/* Sections */}
      <SectionHeader title="Mon parcours" />
      <div style={{
        margin: '0 20px 20px', borderRadius: 18,
        background: 'var(--surf-55)',
        border: '1px solid var(--gold-10)',
      }}>
        <Row
          icon={<RoundIcon>↑</RoundIcon>}
          title="Échelle des rangs"
          subtitle="Maître · 412 PR avant Grand Bandi"
          right={<span className="f-display" style={{ fontSize: 13, color: 'rgba(246,239,223,0.5)' }}>›</span>}
        />
        <Row
          icon={<RoundIcon color="var(--gold-15)" textColor="var(--gold-bright)">★</RoundIcon>}
          title="Passe de saison"
          subtitle="Palier 23 / 50 · 17 j restants"
          right={<span className="f-display" style={{ fontSize: 13, color: 'rgba(246,239,223,0.5)' }}>›</span>}
        />
        <Row
          icon={<RoundIcon color="var(--accent-18)" textColor="var(--accent-text)">⏱</RoundIcon>}
          title="Historique de matchs"
          subtitle="284 parties jouées"
          right={<span className="f-display" style={{ fontSize: 13, color: 'rgba(246,239,223,0.5)' }}>›</span>}
          last
        />
      </div>

      <SectionHeader title="Personnalisation" />
      <div style={{
        margin: '0 20px', borderRadius: 18,
        background: 'var(--surf-55)',
        border: '1px solid var(--gold-10)',
      }}>
        <Row icon={<RoundIcon>◆</RoundIcon>} title="Mes cosmétiques" subtitle="18 / 24 cartes possédées" right={<span style={{ color: 'rgba(246,239,223,0.5)' }}>›</span>} />
        <Row icon={<RoundIcon>☗</RoundIcon>} title="Cadre & avatar" subtitle="Cadre Doré équipé" right={<span style={{ color: 'rgba(246,239,223,0.5)' }}>›</span>} />
        <Row icon={<RoundIcon>◯</RoundIcon>} title="Surnom" subtitle="« le félin du PK5 »" right={<span style={{ color: 'rgba(246,239,223,0.5)' }}>›</span>} last />
      </div>

      <div style={{ height: 100 }} />
    </Phone>
  );
}

function Stat({ label, value, tone = 'neutral' }) {
  const colors = { neutral: 'var(--cream)', gold: 'var(--gold-bright)' };
  return (
    <div>
      <div className="f-mono" style={{ fontSize: 7, color: 'rgba(246,239,223,0.5)', letterSpacing: '0.18em' }}>{label}</div>
      <div className="f-display" style={{ fontSize: 16, color: colors[tone], fontWeight: 800, marginTop: 2 }}>{value}</div>
    </div>
  );
}

// ─── 6.2 · Season pass detailed ───
function MSeason() {
  return (
    <Phone bg="app">
      <Embers count={10} />
      <GoldDust count={14} opacity={0.4} />
      <MStatusBar />
      <AppBar title="Passe de saison" />

      {/* Hero */}
      <div style={{
        margin: '12px 20px 24px', padding: 20, borderRadius: 22,
        background: 'linear-gradient(135deg, var(--gold-22), var(--surf-60))',
        border: '1px solid var(--gold-40)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -30, right: -30, width: 160, height: 160,
          background: 'radial-gradient(circle, var(--gold-35), transparent 70%)',
          filter: 'blur(24px)',
        }} />
        <div className="eyebrow" style={{ marginBottom: 8 }}>SAISON 04</div>
        <div className="f-display" style={{
          fontSize: 32, color: 'var(--cream)', fontWeight: 800,
          letterSpacing: '-0.025em', lineHeight: 1,
        }}>Cercle de Feu</div>
        <div className="f-body" style={{ fontSize: 13, color: 'rgba(246,239,223,0.6)', marginTop: 8 }}>
          17 jours restants · palier 23 / 50
        </div>
        <div style={{ marginTop: 14, height: 6, borderRadius: 99, background: 'var(--gold-15)', overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: '46%',
            background: 'linear-gradient(90deg, var(--gold-deep), var(--gold-bright))',
            boxShadow: '0 0 10px var(--gold-50)',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span className="f-mono" style={{ fontSize: 9, color: 'rgba(246,239,223,0.6)' }}>2,150 / 5,000 XP</span>
          <span className="f-mono" style={{ fontSize: 9, color: 'var(--gold)' }}>+580 XP cette semaine</span>
        </div>
      </div>

      {/* Reward tiers */}
      <SectionHeader title="Tes prochaines récompenses" />
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <TierRow tier={24} label="Dos « Cendre »" sub="Variante émeraude · 1 dos" current xp={5000} />
        <TierRow tier={25} label="500 K · Kora bonus" sub="Récompense monétaire" xp={5500} />
        <TierRow tier={26} label="Cadre « Lauriers »" sub="Cosmétique d'avatar" xp={6000} />
        <TierRow tier={30} label="Titre « Phénix »" sub="Surnom légendaire de saison" xp={8000} hot />
      </div>

      <div style={{ height: 24 }} />
      <div style={{ padding: '0 20px 32px' }}>
        <button className="btn btn-gold" style={{ width: '100%', fontSize: 14, padding: '14px' }}>
          ⭐ Passer au Passe Or — 4,500 K
        </button>
      </div>
    </Phone>
  );
}

function TierRow({ tier, label, sub, xp, current, hot }) {
  return (
    <div style={{
      padding: '14px 16px', borderRadius: 14,
      background: current ? 'linear-gradient(135deg, var(--gold-18), transparent)' : 'var(--surf-55)',
      border: `1px solid ${current ? 'var(--gold-40)' : 'var(--gold-10)'}`,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: current ? 'linear-gradient(180deg, var(--gold-bright), var(--gold-deep))' : 'var(--surf-60)',
        border: `1px solid ${current ? 'var(--gold-70)' : 'var(--gold-15)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 800,
        color: current ? '#1F1810' : 'rgba(246,239,223,0.45)',
      }}>{tier}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span className="f-display" style={{ fontSize: 14, color: 'var(--cream)' }}>{label}</span>
          {hot && <span className="chip chip-ember" style={{ height: 14, fontSize: 7, padding: '0 6px' }}>FINAL</span>}
        </div>
        <div className="f-body" style={{ fontSize: 11, color: 'rgba(246,239,223,0.55)', marginTop: 2 }}>{sub}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        {current ? (
          <div className="f-mono" style={{ fontSize: 9, color: 'var(--gold-bright)', letterSpacing: '0.18em' }}>↑ ICI</div>
        ) : (
          <div className="f-mono" style={{ fontSize: 9, color: 'rgba(246,239,223,0.4)' }}>{xp.toLocaleString('fr-FR')} XP</div>
        )}
      </div>
    </div>
  );
}

// ─── 6.3 · Match history ───
function MHistory() {
  return (
    <Phone bg="app">
      <MStatusBar />
      <AppBar title="" />
      <PageTitle eyebrow="HISTORIQUE" title="Tes matchs." />

      {/* Filters */}
      <div className="no-scrollbar" style={{ padding: '0 20px 16px', display: 'flex', gap: 8, overflowX: 'auto' }}>
        {['Tous', 'Victoires', 'Défaites', 'Koras', 'Classés'].map((t, i) => (
          <button key={t} style={{
            padding: '6px 14px', borderRadius: 999, flexShrink: 0,
            background: i === 0 ? 'linear-gradient(180deg, var(--gold-25), var(--gold-12))' : 'var(--surf-55)',
            border: `1px solid ${i === 0 ? 'var(--gold-50)' : 'var(--gold-12)'}`,
            color: i === 0 ? 'var(--gold-bright)' : 'rgba(246,239,223,0.55)',
            fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 600,
            cursor: 'pointer',
          }}>{t}</button>
        ))}
      </div>

      {/* Today */}
      <SectionHeader title="Aujourd'hui" />
      <div style={{
        margin: '0 20px 20px', borderRadius: 18,
        background: 'var(--surf-55)',
        border: '1px solid var(--gold-10)',
      }}>
        <HistRow opp="Le Grand Bandi" tier="G" won delta="+24 PR" amount="+360 K" kora time="il y a 14 min" />
        <HistRow opp="Maestro" tier="L" won delta="+18 PR" amount="+90 K" time="il y a 1 h" />
        <HistRow opp="P. Glass" tier="L" won={false} delta="−14 PR" amount="−200 K" time="il y a 2 h" last />
      </div>

      <SectionHeader title="Hier" />
      <div style={{
        margin: '0 20px 20px', borderRadius: 18,
        background: 'var(--surf-55)',
        border: '1px solid var(--gold-10)',
      }}>
        <HistRow opp="D. Tigre" tier="G" won delta="+12 PR" amount="+90 K" time="hier 20:42" />
        <HistRow opp="F. Komo" tier="G" won={false} delta="−8 PR" amount="−50 K" time="hier 19:15" last />
      </div>
    </Phone>
  );
}

function HistRow({ opp, tier, won, delta, amount, kora, time, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 16px',
      borderBottom: last ? 'none' : '0.5px solid var(--gold-08)',
      cursor: 'pointer',
    }}>
      <span style={{
        width: 4, height: 36, borderRadius: 99,
        background: won ? 'linear-gradient(180deg, var(--gold-bright), var(--gold-deep))' : 'linear-gradient(180deg, var(--ember), var(--ember-deep))',
      }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="f-display" style={{ fontSize: 13, color: 'var(--cream)' }}>vs {opp}</span>
          {kora && <span className="chip" style={{ height: 14, fontSize: 7, padding: '0 5px' }}>KORA</span>}
        </div>
        <div className="f-body" style={{ fontSize: 11, color: 'rgba(246,239,223,0.5)', marginTop: 2 }}>{time}</div>
      </div>
      <RankShield short={tier} size={18} />
      <div style={{ textAlign: 'right' }}>
        <div className="f-display" style={{
          fontSize: 13, color: won ? 'var(--gold-bright)' : 'var(--chip-ember-color)', fontWeight: 700,
        }}>{amount}</div>
        <div className="f-mono" style={{ fontSize: 9, color: won ? 'var(--accent-text)' : 'var(--chip-ember-color)', marginTop: 1 }}>{delta}</div>
      </div>
    </div>
  );
}

Object.assign(window, { MProfile, MSeason, MHistory });
