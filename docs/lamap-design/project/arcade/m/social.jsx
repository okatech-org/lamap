/* global React, Phone, MStatusBar, AppBar, PageTitle, SectionHeader, Row, RoundIcon, Avatar, RankShield, RANK_TIERS, MBottomNav, GoldDust */

// ─── 5.1 · Friends list ───
function MFriends() {
  return (
    <Phone bg="app" nav={<MBottomNav active="social" />}>
      <GoldDust count={8} opacity={0.3} />
      <MStatusBar />

      <div style={{ padding: '4px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="f-display" style={{ fontSize: 17, color: 'var(--cream)' }}>Social</div>
        <button style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'var(--surf-70)', border: '1px solid var(--gold-20)',
          color: 'var(--gold-bright)', cursor: 'pointer', fontSize: 18,
        }}>+</button>
      </div>

      <PageTitle eyebrow="AMIS" title="Tes alliés." />

      {/* Search */}
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{
          padding: '10px 14px', borderRadius: 14,
          background: 'var(--surf-55)',
          border: '1px solid var(--gold-12)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ color: 'var(--gold-50)', fontSize: 14 }}>⌕</span>
          <span className="f-body" style={{ fontSize: 13, color: 'rgba(246,239,223,0.45)' }}>Rechercher par pseudo ou code…</span>
        </div>
      </div>

      {/* Online friends */}
      <SectionHeader title="En ligne · 3" />
      <div style={{
        margin: '0 20px 20px', borderRadius: 18,
        background: 'var(--surf-55)',
        border: '1px solid var(--gold-10)',
      }}>
        <FriendRow name="Le Grand Bandi" initials="LB" rank="G" rating={2387} status="EN MATCH" tone="busy" />
        <FriendRow name="Maestro" initials="MA" rank="L" rating={3711} status="EN LIGNE" tone="online" />
        <FriendRow name="D. Tigre" initials="DT" rank="G" rating={3105} status="EN LIGNE" tone="online" last />
      </div>

      <SectionHeader title="Hors ligne · 4" />
      <div style={{
        margin: '0 20px', borderRadius: 18,
        background: 'var(--surf-55)',
        border: '1px solid var(--gold-10)',
      }}>
        <FriendRow name="P. Glass" initials="PG" rank="L" rating={3902} status="il y a 2 h" tone="off" />
        <FriendRow name="F. Komo" initials="FK" rank="G" rating={2890} status="hier" tone="off" />
        <FriendRow name="A. Mboumba" initials="AM" rank="G" rating={2620} status="il y a 3 j" tone="off" last />
      </div>

      <div style={{ height: 100 }} />
    </Phone>
  );
}

function FriendRow({ name, initials, rank, rating, status, tone, last }) {
  const dotColor = tone === 'online' ? '#5BD27A' : tone === 'busy' ? 'var(--gold)' : 'rgba(246,239,223,0.3)';
  const statusColor = tone === 'online' ? 'var(--accent-text)' : tone === 'busy' ? 'var(--gold-bright)' : 'rgba(246,239,223,0.4)';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 16px',
      borderBottom: last ? 'none' : '0.5px solid var(--gold-08)',
      cursor: 'pointer',
    }}>
      <div style={{ position: 'relative' }}>
        <Avatar initials={initials} size={42} color="jade" />
        <div style={{
          position: 'absolute', bottom: 0, right: 0,
          width: 12, height: 12, borderRadius: '50%',
          background: dotColor, border: '2px solid var(--night)',
        }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="f-display" style={{ fontSize: 14, color: 'var(--cream)' }}>{name}</div>
        <div className="f-mono" style={{ fontSize: 9, color: statusColor, letterSpacing: '0.18em', marginTop: 2 }}>{status}</div>
      </div>
      <RankShield short={rank} size={22} />
      <button style={{
        padding: '6px 10px', borderRadius: 999,
        background: tone === 'online' ? 'var(--gold-18)' : 'var(--surf-60)',
        border: `1px solid ${tone === 'online' ? 'var(--gold-40)' : 'var(--gold-15)'}`,
        color: tone === 'online' ? 'var(--gold-bright)' : 'rgba(246,239,223,0.55)',
        fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 600,
        cursor: 'pointer',
      }}>{tone === 'online' ? 'Défier' : 'Voir'}</button>
    </div>
  );
}

// ─── 5.2 · Other player profile ───
function MOtherProfile() {
  return (
    <Phone bg="app">
      <GoldDust count={8} opacity={0.3} />
      <MStatusBar />
      <AppBar title="Profil" right={
        <button style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'var(--surf-70)', border: '1px solid var(--gold-18)',
          color: 'var(--cream)', cursor: 'pointer', fontSize: 14,
        }}>⋯</button>
      } />

      {/* Hero */}
      <div style={{
        margin: '12px 20px 24px', padding: 22, borderRadius: 22,
        background: 'linear-gradient(180deg, var(--surf-85), var(--surf-92))',
        border: '1px solid var(--gold-30)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -20, right: -20, width: 140, height: 140,
          background: 'radial-gradient(circle, var(--gold-25), transparent 70%)',
          filter: 'blur(20px)',
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
          <Avatar initials="LB" size={68} color="ember" ring />
          <div style={{ flex: 1 }}>
            <div className="f-display" style={{ fontSize: 20, color: 'var(--cream)', fontWeight: 800 }}>Le Grand Bandi</div>
            <div className="f-roman" style={{ fontSize: 11, color: 'rgba(246,239,223,0.55)', fontStyle: 'italic', marginTop: 2 }}>
              « roi du PK5 »
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
              <RankShield short="G" size={20} />
              <span className="f-display" style={{ fontSize: 12, color: 'var(--gold)' }}>Grand Bandi · 2,387 PR</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
          <button className="btn btn-gold" style={{ flex: 1, fontSize: 13, padding: '11px' }}>⚔ Défier — 100 K</button>
          <button className="btn btn-dark" style={{ flex: 1, fontSize: 13, padding: '11px' }}>+ Ami</button>
        </div>
      </div>

      {/* Stats */}
      <SectionHeader title="Performance" />
      <div style={{
        margin: '0 20px 20px', padding: 14, borderRadius: 14,
        background: 'var(--surf-55)',
        border: '1px solid var(--gold-10)',
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10,
      }}>
        <Stat label="Victoires" value="612" />
        <Stat label="Taux" value="68%" tone="gold" />
        <Stat label="Koras" value="47" tone="gold" />
        <Stat label="Best streak" value="11" />
      </div>

      {/* Mutual */}
      <SectionHeader title="En commun" more="3 amis" />
      <div style={{
        margin: '0 20px', borderRadius: 18,
        background: 'var(--surf-55)',
        border: '1px solid var(--gold-10)',
      }}>
        <Row
          icon={<RoundIcon>⚔</RoundIcon>}
          title="Vous avez joué 4 fois"
          subtitle="Tu mènes 3—1 · dernière partie il y a 14 min"
        />
        <Row
          icon={<RoundIcon color="var(--gold-15)" textColor="var(--gold-bright)">★</RoundIcon>}
          title="Dans le même cercle"
          subtitle="Saison 04 · Cercle de Feu"
          last
        />
      </div>
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

// ─── 5.3 · Leaderboard ───
function MLeaderboard() {
  const [tab, setTab] = React.useState('national');
  return (
    <Phone bg="app">
      <GoldDust count={8} opacity={0.3} />
      <MStatusBar />
      <AppBar title="" />
      <PageTitle eyebrow="CLASSEMENT · SAISON 04" title="Top joueurs." />

      {/* Tabs */}
      <div style={{ padding: '0 20px 16px', display: 'flex', gap: 8 }}>
        {['national', 'mondial', 'amis'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 14px', borderRadius: 999,
            background: tab === t ? 'linear-gradient(180deg, var(--gold-25), var(--gold-12))' : 'var(--surf-55)',
            border: `1px solid ${tab === t ? 'var(--gold-50)' : 'var(--gold-12)'}`,
            color: tab === t ? 'var(--gold-bright)' : 'rgba(246,239,223,0.55)',
            fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', textTransform: 'capitalize',
          }}>{t}</button>
        ))}
      </div>

      {/* Top 3 podium */}
      <div style={{
        margin: '0 20px 20px', padding: '16px 8px', borderRadius: 18,
        background: 'linear-gradient(180deg, var(--gold-15), var(--surf-60))',
        border: '1px solid var(--gold-25)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: 12,
      }}>
        <Podium rank={2} name="P. Glass" initials="PG" rating={3902} tier="L" height={88} />
        <Podium rank={1} name="Le Grand Bandi" initials="LB" rating={4218} tier="L" height={108} winner />
        <Podium rank={3} name="Maestro" initials="MA" rating={3711} tier="L" height={72} />
      </div>

      {/* Rest of list */}
      <div style={{
        margin: '0 20px', borderRadius: 18,
        background: 'var(--surf-55)',
        border: '1px solid var(--gold-10)',
      }}>
        {LEADERS.map((p, i) => (
          <LeadRow key={i} {...p} last={i === LEADERS.length - 1} />
        ))}
      </div>
    </Phone>
  );
}

function Podium({ rank, name, initials, rating, tier, height, winner }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1 }}>
      <Avatar initials={initials} size={winner ? 56 : 44} color={winner ? 'gold' : 'jade'} ring />
      <div className="f-display" style={{ fontSize: 11, color: 'var(--cream)', fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 90 }}>{name}</div>
      <div className="f-mono" style={{ fontSize: 9, color: 'var(--gold-bright)' }}>{rating}</div>
      <div style={{
        width: 60, height,
        borderRadius: '8px 8px 0 0',
        background: winner
          ? 'linear-gradient(180deg, var(--gold-bright), var(--gold-deep))'
          : 'linear-gradient(180deg, var(--accent-40), var(--accent-20))',
        border: `1px solid ${winner ? 'var(--gold-60)' : 'var(--accent-40)'}`,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 6,
        boxShadow: winner ? '0 -8px 16px var(--gold-30)' : 'none',
      }}>
        <span className="f-display" style={{ fontSize: 18, color: winner ? '#1F1810' : 'var(--cream)', fontWeight: 800 }}>{rank}</span>
      </div>
    </div>
  );
}

const LEADERS = [
  { rank: 4, name: 'D. Tigre',   initials: 'DT', tier: 'G', pr: 3105 },
  { rank: 5, name: 'F. Komo',    initials: 'FK', tier: 'G', pr: 2890 },
  { rank: 6, name: 'A. Mboumba', initials: 'AM', tier: 'G', pr: 2620 },
  { rank: 7, name: 'Mwana',      initials: 'MW', tier: 'M', pr: 2390 },
  { rank: 12, name: 'Nkomo K. — toi', initials: 'NK', tier: 'M', pr: 2138, you: true },
];

function LeadRow({ rank, name, initials, tier, pr, you, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 16px',
      borderBottom: last ? 'none' : '0.5px solid var(--gold-08)',
      background: you ? 'linear-gradient(90deg, var(--gold-10), transparent)' : 'transparent',
    }}>
      <span className="f-mono" style={{ width: 24, fontSize: 11, color: you ? 'var(--gold-bright)' : 'rgba(246,239,223,0.55)', fontWeight: 700 }}>#{rank}</span>
      <Avatar initials={initials} size={32} color={you ? 'gold' : 'jade'} />
      <span className="f-display" style={{ flex: 1, fontSize: 13, color: 'var(--cream)' }}>{name}</span>
      <RankShield short={tier} size={20} />
      <span className="f-mono" style={{ fontSize: 11, color: 'var(--gold-bright)', minWidth: 50, textAlign: 'right' }}>{pr.toLocaleString('fr-FR')}</span>
    </div>
  );
}

// ─── 5.4 · Notifications ───
function MNotifications() {
  return (
    <Phone bg="app">
      <MStatusBar />
      <AppBar title="" right={
        <span className="f-body" style={{ fontSize: 12, color: 'var(--gold-bright)', cursor: 'pointer' }}>Tout lu</span>
      } />
      <PageTitle eyebrow="INBOX" title="Notifications." />

      {/* Today */}
      <SectionHeader title="Aujourd'hui" />
      <div style={{
        margin: '0 20px 20px', borderRadius: 18,
        background: 'var(--surf-55)',
        border: '1px solid var(--gold-10)',
      }}>
        <NotifRow
          unread
          icon={<RoundIcon color="var(--gold-18)" textColor="var(--gold-bright)">⚔</RoundIcon>}
          title="Le Grand Bandi te défie"
          sub="Match privé · mise 200 K · il y a 4 min"
          right={
            <div style={{ display: 'flex', gap: 6 }}>
              <button style={{ padding: '5px 8px', borderRadius: 99, background: 'var(--accent-18)', border: '1px solid var(--accent-40)', color: 'var(--accent-text)', fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 600, cursor: 'pointer' }}>✓</button>
              <button style={{ padding: '5px 8px', borderRadius: 99, background: 'var(--ember-15)', border: '1px solid var(--ember-30)', color: 'var(--chip-ember-color)', fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 600, cursor: 'pointer' }}>✕</button>
            </div>
          }
        />
        <NotifRow
          unread
          icon={<RoundIcon color="var(--accent-18)" textColor="var(--accent-text)">★</RoundIcon>}
          title="Nouveau palier de saison atteint"
          sub="Palier 23 — Tu débloques un cadre doré"
        />
        <NotifRow
          icon={<RoundIcon color="var(--gold-15)">◆</RoundIcon>}
          title="Recharge confirmée"
          sub="+3 000 K crédités · 2 500 FCFA"
          last
        />
      </div>

      {/* This week */}
      <SectionHeader title="Cette semaine" />
      <div style={{
        margin: '0 20px', borderRadius: 18,
        background: 'var(--surf-55)',
        border: '1px solid var(--gold-10)',
      }}>
        <NotifRow
          icon={<RoundIcon color="var(--surf-60)" textColor="rgba(246,239,223,0.6)">◯</RoundIcon>}
          title="Maestro suit ton profil"
          sub="il y a 2 j"
        />
        <NotifRow
          icon={<RoundIcon color="var(--surf-60)" textColor="rgba(246,239,223,0.6)">⚠</RoundIcon>}
          title="Mise à jour des règles"
          sub="Le 10♠ reste exclu — clarification"
          last
        />
      </div>
    </Phone>
  );
}

function NotifRow({ icon, title, sub, right, last, unread }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 16px',
      borderBottom: last ? 'none' : '0.5px solid var(--gold-08)',
      position: 'relative',
    }}>
      {unread && (
        <span style={{
          position: 'absolute', left: 6, top: '50%', transform: 'translateY(-50%)',
          width: 5, height: 5, borderRadius: '50%', background: 'var(--accent-text)',
        }} />
      )}
      {icon}
      <div style={{ flex: 1 }}>
        <div className="f-body" style={{ fontSize: 13, color: 'var(--cream)', fontWeight: 500 }}>{title}</div>
        <div className="f-body" style={{ fontSize: 11, color: 'rgba(246,239,223,0.55)', marginTop: 2 }}>{sub}</div>
      </div>
      {right}
    </div>
  );
}

Object.assign(window, { MFriends, MOtherProfile, MLeaderboard, MNotifications });
