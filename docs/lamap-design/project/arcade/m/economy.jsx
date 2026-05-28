/* global React, Phone, MStatusBar, AppBar, PageTitle, SectionHeader, Row, RoundIcon, MBottomNav, Embers, GoldDust, Card3D, CardBack3D */

// ─── 4.1 · Shop (Apple-Music dense, but breathing) ───
function MShop() {
  return (
    <Phone bg="app" nav={<MBottomNav active="shop" />}>
      <GoldDust count={10} opacity={0.3} />

      <MStatusBar />

      {/* Header */}
      <div style={{
        padding: '4px 20px 0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div className="f-display" style={{ fontSize: 17, color: 'var(--cream)' }}>Boutique</div>
        <div className="chip" style={{ height: 28 }}>
          <span style={{ color: 'var(--gold-bright)' }}>◆</span>
          <span className="f-display" style={{ fontSize: 12, color: 'var(--gold-bright)' }}>12,480</span>
          <span style={{ fontSize: 14, color: 'var(--gold-bright)', marginLeft: 4 }}>+</span>
        </div>
      </div>

      <PageTitle eyebrow="MAISON BANDI" title="Vedette." />

      {/* Featured hero */}
      <div style={{
        margin: '0 20px 28px', borderRadius: 22, overflow: 'hidden', position: 'relative', height: 200,
        background: 'linear-gradient(135deg, var(--night-3) 0%, var(--night) 60%, var(--abyss) 100%)',
        border: '1px solid var(--gold-25)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 60% 100% at 100% 50%, var(--gold-22) 0%, transparent 60%)',
        }} />
        <Embers count={8} />

        <div style={{ position: 'absolute', right: -10, top: 28, display: 'flex' }}>
          {['emerald', 'gold', 'onyx'].map((skin, i) => (
            <div key={skin} style={{
              transform: `translateX(${i * -30}px) rotate(${(i - 1) * -8}deg) translateY(${i * 6}px)`,
              zIndex: 3 - i,
              filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.6))',
            }}>
              <CardBack3D size="sm" skin={skin} tilt={false} />
            </div>
          ))}
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, padding: 18, maxWidth: 220 }}>
          <div className="chip chip-jade" style={{ height: 20, fontSize: 8 }}>★ ÉDITION LIMITÉE</div>
          <div className="f-display" style={{
            fontSize: 24, color: 'var(--cream)', lineHeight: 0.95, marginTop: 8, fontWeight: 800,
            letterSpacing: '-0.02em',
          }}>Trio des Cercles</div>
          <div className="f-body" style={{ fontSize: 11, color: 'rgba(246,239,223,0.55)', marginTop: 4 }}>
            3 dos signés · −25%
          </div>
          <button className="btn btn-gold" style={{ fontSize: 12, padding: '8px 16px', marginTop: 12 }}>
            ◆ 4,500 K
          </button>
        </div>
      </div>

      {/* Section : Dos de cartes */}
      <SectionHeader title="Dos de cartes" more="Tout voir" />
      <div className="no-scrollbar" style={{
        padding: '0 20px 20px', display: 'flex', gap: 12, overflowX: 'auto',
      }}>
        <ShopBackCard skin="onyx" title="Nuit Charbon" rarity="ÉPIQUE" price="2,200" color="var(--gold)" />
        <ShopBackCard skin="indigo" title="Profondeur" rarity="RARE" price="1,200" color="#5AA3C9" />
        <ShopBackCard skin="bandi" title="Maison Bandi" rarity="LÉGENDE" price="4,800" color="#B58BE2" isNew />
      </div>

      {/* Section : Avatars + cadres */}
      <SectionHeader title="Cadres d'avatar" more="Tout voir" />
      <div className="no-scrollbar" style={{
        padding: '0 20px 20px', display: 'flex', gap: 12, overflowX: 'auto',
      }}>
        <FrameCard title="Cadre Doré" color="var(--gold)" price="900" />
        <FrameCard title="Lauriers" color="var(--jade-glow)" price="1,400" />
        <FrameCard title="Saison 04" color="#B58BE2" price="locked" />
      </div>

      <div style={{ height: 100 }} />
    </Phone>
  );
}

function ShopBackCard({ skin, title, rarity, price, color, isNew }) {
  return (
    <div style={{
      flexShrink: 0, width: 138, borderRadius: 14, overflow: 'hidden',
      background: 'var(--surf-55)',
      border: `1px solid ${color}30`,
    }}>
      <div style={{
        height: 130, position: 'relative', overflow: 'hidden',
        background: `radial-gradient(ellipse at center, ${color}20, transparent 70%), linear-gradient(180deg, var(--night-3), var(--night-2))`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ transform: 'rotate(-6deg)' }}>
          <CardBack3D size="sm" skin={skin} tilt={false} />
        </div>
        {isNew && (
          <div style={{
            position: 'absolute', top: 8, right: 8,
            padding: '2px 6px', borderRadius: 99,
            background: 'linear-gradient(135deg, var(--ember-bright), var(--ember-deep))',
            fontFamily: 'var(--font-mono)', fontSize: 7, color: 'var(--cream)', letterSpacing: '0.18em',
          }}>NEW</div>
        )}
      </div>
      <div style={{ padding: '10px 12px' }}>
        <div className="f-mono" style={{ fontSize: 7, color, letterSpacing: '0.18em', marginBottom: 4 }}>★ {rarity}</div>
        <div className="f-display" style={{ fontSize: 13, color: 'var(--cream)' }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 4 }}>
          <span style={{ color: 'var(--gold-bright)', fontSize: 10 }}>◆</span>
          <span className="f-display" style={{ fontSize: 12, color: 'var(--gold-bright)', fontWeight: 700 }}>{price}</span>
        </div>
      </div>
    </div>
  );
}

function FrameCard({ title, color, price }) {
  return (
    <div style={{
      flexShrink: 0, width: 138, borderRadius: 14,
      background: 'var(--surf-55)',
      border: `1px solid ${color}30`,
      padding: 12,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
    }}>
      <div style={{ position: 'relative', width: 70, height: 70 }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: `linear-gradient(135deg, ${color}, ${color}40)`,
          border: `2px solid ${color}`,
          boxShadow: `0 0 18px ${color}40`,
        }} />
        <div style={{
          position: 'absolute', inset: 5, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--jade-bright), var(--night-2))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, color: 'var(--cream)',
        }}>NK</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div className="f-display" style={{ fontSize: 12, color: 'var(--cream)' }}>{title}</div>
        {price === 'locked' ? (
          <div className="f-mono" style={{ fontSize: 8, color: 'rgba(246,239,223,0.4)', marginTop: 3 }}>🔒 PALIER 30</div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'center', marginTop: 3 }}>
            <span style={{ color: 'var(--gold-bright)', fontSize: 10 }}>◆</span>
            <span className="f-display" style={{ fontSize: 11, color: 'var(--gold-bright)' }}>{price}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── 4.2 · Card inspection ───
function MInspect() {
  const [variant, setVariant] = React.useState(2);
  const VARIANTS = [
    { id: 0, label: 'Standard',      sub: 'Base',    rarity: 'COMMUN',     color: '#8A95A3', owned: true },
    { id: 1, label: 'Holographique', sub: 'Foil',    rarity: 'RARE',       color: '#5AA3C9', owned: true },
    { id: 2, label: 'Or fauve',      sub: '24K',     rarity: 'ÉPIQUE',     color: 'var(--gold)', owned: true },
    { id: 3, label: 'Maison Bandi',  sub: 'Légende', rarity: 'LÉGENDAIRE', color: '#B58BE2', owned: false },
  ];
  const v = VARIANTS[variant];

  return (
    <Phone bg="velvet">
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 70% 50% at 50% 30%, ${v.color}30, transparent 60%)`,
      }} />
      <GoldDust count={14} opacity={0.45} />

      <MStatusBar />
      <AppBar title="7 de Cœurs" right={
        <div className="chip" style={{ background: `${v.color}25`, borderColor: `${v.color}80`, color: v.color, height: 24, fontSize: 8 }}>
          ★ {v.rarity}
        </div>
      } />

      {/* Big card */}
      <div style={{
        position: 'absolute', top: 130, left: 0, right: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
      }}>
        <div style={{
          position: 'absolute', top: 30, left: '50%', transform: 'translateX(-50%)',
          width: 240, height: 300, borderRadius: 30,
          background: `radial-gradient(ellipse, ${v.color}40, transparent 70%)`,
          filter: 'blur(30px)',
        }} />
        <div style={{
          filter: `drop-shadow(0 24px 40px ${v.color}50) drop-shadow(0 0 20px rgba(0,0,0,0.5))`,
        }}>
          <Card3D rank="7" suit="hearts" size="xl" tilt foil={variant >= 1} highlighted intensity={14} />
        </div>
        <div style={{ textAlign: 'center', marginTop: 4 }}>
          <div className="f-display" style={{ fontSize: 22, color: 'var(--cream)', fontWeight: 800, letterSpacing: '-0.02em' }}>{v.label}</div>
          <div className="f-roman" style={{ fontSize: 11, color: 'rgba(246,239,223,0.55)', fontStyle: 'italic', marginTop: 2 }}>« {v.sub} »</div>
        </div>
      </div>

      {/* Variants */}
      <div style={{ position: 'absolute', top: 568, left: 0, right: 0 }}>
        <div style={{ padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <div className="f-display" style={{ fontSize: 15, color: 'var(--cream)' }}>Variantes</div>
          <span className="f-mono" style={{ fontSize: 9, color: 'rgba(246,239,223,0.5)' }}>3 / 4</span>
        </div>
        <div className="no-scrollbar" style={{
          display: 'flex', gap: 8, padding: '0 20px 4px', overflowX: 'auto',
        }}>
          {VARIANTS.map((vv, i) => {
            const selected = i === variant;
            return (
              <div key={vv.id} onClick={() => setVariant(i)} style={{
                flexShrink: 0, padding: 8, borderRadius: 12, cursor: 'pointer',
                background: selected ? `linear-gradient(135deg, ${vv.color}30, transparent)` : 'var(--surf-60)',
                border: `1px solid ${selected ? vv.color : 'var(--gold-12)'}`,
                boxShadow: selected ? `0 0 16px ${vv.color}40` : 'none',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                width: 78, transition: 'all 200ms ease',
              }}>
                <div style={{ filter: vv.owned ? 'none' : 'grayscale(1) brightness(0.5)' }}>
                  <Card3D rank="7" suit="hearts" size="xs" tilt={false} foil={i >= 1} />
                </div>
                <div className="f-mono" style={{ fontSize: 7, color: vv.color, letterSpacing: '0.14em' }}>{vv.rarity}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div style={{ position: 'absolute', bottom: 20, left: 18, right: 18, display: 'flex', gap: 8 }}>
        {v.owned ? (
          <button className="btn btn-jade" style={{ flex: 1, fontSize: 13, padding: '13px' }}>✓ Équiper</button>
        ) : (
          <button className="btn btn-gold" style={{ flex: 1, fontSize: 13, padding: '13px' }}>Acheter · ◆ 1,200 K</button>
        )}
      </div>
    </Phone>
  );
}

// ─── 4.3 · Wallet (Kora balance — non-encaissable) ───
function MWallet() {
  return (
    <Phone bg="app" nav={<MBottomNav active="shop" />}>
      <GoldDust count={10} opacity={0.3} />
      <MStatusBar />
      <AppBar title="Mes Kora" />

      {/* Balance hero — pas de retrait : monnaie virtuelle non-encaissable */}
      <div style={{
        margin: '12px 20px 16px', padding: 24, borderRadius: 22,
        background: 'linear-gradient(135deg, var(--gold-22), var(--gold-06))',
        border: '1px solid var(--gold-40)',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 16px 32px rgba(0,0,0,0.4)',
      }}>
        <div style={{
          position: 'absolute', top: -20, right: -20, width: 140, height: 140,
          background: 'radial-gradient(circle, var(--gold-32), transparent 70%)',
          filter: 'blur(24px)',
        }} />
        <div style={{ position: 'relative' }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>SOLDE</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ color: 'var(--gold-bright)', fontSize: 30 }}>◆</span>
            <span className="f-display" style={{ fontSize: 56, color: 'var(--cream)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.9 }}>12 480</span>
            <span className="f-mono" style={{ fontSize: 11, color: 'var(--gold)', marginLeft: 4 }}>KORA</span>
          </div>
          <div className="f-body" style={{ fontSize: 12, color: 'rgba(246,239,223,0.6)', marginTop: 8, lineHeight: 1.5 }}>
            Jetons virtuels pour jouer et acheter des cosmétiques. Non convertibles en argent réel.
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <button className="btn btn-gold" style={{ flex: 1, fontSize: 13, padding: '11px' }}>+ Acheter</button>
            <button className="btn btn-dark" style={{ flex: 1, fontSize: 13, padding: '11px' }}>↗ Offrir</button>
          </div>
        </div>
      </div>

      {/* Gagner gratuitement */}
      <SectionHeader title="Gagner gratuitement" />
      <div style={{
        margin: '0 20px 20px', borderRadius: 18,
        background: 'var(--surf-55)',
        border: '1px solid var(--gold-10)',
      }}>
        <EarnRow
          glyph="◉"
          tone="gold"
          title="Bonus quotidien"
          sub="Jour 4 sur 7 · prochaine récompense +250 K"
          cta="Encaisser"
          ctaTone="gold"
        />
        <EarnRow
          glyph="▶"
          tone="jade"
          title="Pub récompensée"
          sub="3 / 5 disponibles aujourd'hui · cooldown 3 min"
          reward="+150 K"
          cta="Regarder"
          ctaTone="jade"
        />
        <EarnRow
          glyph="⌛"
          tone="neutral"
          title="Recharge anti-fauché"
          sub="Disponible si tu tombes à sec · max 600 K"
          reward="+200 K / 30 min"
          last
        />
      </div>

      {/* Transactions */}
      <SectionHeader title="Mouvements récents" more="Tout voir" />
      <div style={{
        margin: '0 20px', borderRadius: 18,
        background: 'var(--surf-55)',
        border: '1px solid var(--gold-10)',
      }}>
        <TxRow type="win"   title="Victoire vs Le Grand Bandi" sub="il y a 14 min · Kora ×2"     amount="+360" />
        <TxRow type="rake"  title="Rake prélevé (5 %)"          sub="pot 200 K · table Standard" amount="−10" />
        <TxRow type="topup" title="Recharge Airtel Money"       sub="1 000 FCFA · ce matin"     amount="+13 000" />
        <TxRow type="bonus" title="Bonus quotidien · J3"        sub="hier 8h12"                 amount="+200" />
        <TxRow type="loss"  title="Défaite vs P. Glass"          sub="hier · 21:08"              amount="−200" />
        <TxRow type="ad"    title="Pub récompensée"              sub="hier · 18:42"              amount="+150" />
        <TxRow type="cosmetic" title="Achat · Or de Lambaréné"   sub="il y a 2 j"                amount="−2 200" last />
      </div>

      <div style={{ height: 100 }} />
    </Phone>
  );
}

function EarnRow({ glyph, tone, title, sub, reward, cta, ctaTone, last }) {
  const colors = {
    gold: { bg: 'var(--gold-18)',   border: 'var(--gold-40)',   text: 'var(--gold-bright)' },
    jade: { bg: 'var(--accent-18)', border: 'var(--accent-40)', text: 'var(--accent-text)' },
    neutral: { bg: 'var(--surf-60)', border: 'var(--gold-15)',  text: 'rgba(246,239,223,0.7)' },
  }[tone];
  const ctaClass = ctaTone === 'gold' ? 'btn-gold' : ctaTone === 'jade' ? 'btn-jade' : null;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 16px',
      borderBottom: last ? 'none' : '0.5px solid var(--gold-08)',
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: colors.bg, border: `1px solid ${colors.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, color: colors.text, flexShrink: 0,
      }}>{glyph}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="f-display" style={{ fontSize: 13, color: 'var(--cream)', fontWeight: 700 }}>{title}</div>
        <div className="f-body" style={{ fontSize: 11, color: 'rgba(246,239,223,0.55)', marginTop: 2, lineHeight: 1.4 }}>{sub}</div>
      </div>
      {reward && !cta && (
        <span className="f-display" style={{ fontSize: 12, color: colors.text, fontWeight: 700, whiteSpace: 'nowrap' }}>{reward}</span>
      )}
      {cta && (
        <button className={`btn ${ctaClass}`} style={{ fontSize: 11, padding: '7px 12px', flexShrink: 0 }}>{cta}</button>
      )}
    </div>
  );
}

function TxRow({ type, title, sub, amount, last }) {
  const icons = {
    win:      { glyph: '↑', bg: 'var(--gold-18)',    color: 'var(--gold-bright)' },
    loss:     { glyph: '↓', bg: 'var(--ember-18)',   color: 'var(--chip-ember-color)' },
    topup:    { glyph: '+', bg: 'var(--gold-18)',    color: 'var(--gold-bright)' },
    cosmetic: { glyph: '◆', bg: 'var(--surf-60)',    color: 'rgba(246,239,223,0.6)' },
    rake:     { glyph: '%', bg: 'var(--surf-60)',    color: 'rgba(246,239,223,0.55)' },
    bonus:    { glyph: '◉', bg: 'var(--gold-15)',    color: 'var(--gold-bright)' },
    ad:       { glyph: '▶', bg: 'var(--accent-18)',  color: 'var(--accent-text)' },
  };
  const ic = icons[type];
  const amountColor = amount.startsWith('+') ? 'var(--gold-bright)' : 'var(--chip-ember-color)';
  return (
    <Row
      icon={<RoundIcon color={ic.bg} textColor={ic.color}>{ic.glyph}</RoundIcon>}
      title={title}
      subtitle={sub}
      right={<span className="f-display" style={{ fontSize: 14, color: amountColor, fontWeight: 700 }}>{amount} K</span>}
      last={last}
    />
  );
}

// ─── 4.4 · Top-up / recharge ───
function MTopUp() {
  return (
    <Phone bg="app">
      <GoldDust count={8} opacity={0.3} />
      <MStatusBar />
      <AppBar title="Acheter des Kora" />

      <PageTitle eyebrow="MOBILE MONEY · CARTE" title={'Choisis ton\npack.'} />

      <div className="f-body" style={{ padding: '0 20px 20px', fontSize: 13, color: 'rgba(246,239,223,0.6)', lineHeight: 1.5 }}>
        Plus le pack est gros, meilleur est le taux. Crédité immédiatement.
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <PackRow icon="◆"    amount="1 000"  price="100 FCFA"   rate="10 K / F"  label="Dépannage" />
        <PackRow icon="◆◆"   amount="6 000"  price="500 FCFA"   rate="12 K / F"  label="Petit pack" />
        <PackRow icon="◆◆◆"  amount="13 000" price="1 000 FCFA" rate="13 K / F"  label="Moyen pack" tag="Populaire" featured />
        <PackRow icon="★"    amount="35 000" price="2 500 FCFA" rate="14 K / F"  label="Grand pack" tag="Meilleure offre" best />
        <PackRow icon="★★"   amount="80 000" price="5 000 FCFA" rate="16 K / F"  label="Pour les gros" />
      </div>

      <div style={{ padding: '20px 20px 16px' }}>
        <div className="f-body" style={{ fontSize: 11, color: 'rgba(246,239,223,0.45)', lineHeight: 1.55 }}>
          Paiement via Airtel Money, Moov Money ou carte. Les Kora sont des jetons virtuels, non convertibles en argent réel.
        </div>
      </div>
    </Phone>
  );
}

function PackRow({ icon, amount, price, rate, label, tag, featured, best }) {
  const accentBg = best
    ? 'linear-gradient(135deg, var(--gold-30), var(--gold-08))'
    : featured
    ? 'linear-gradient(135deg, var(--gold-22), var(--gold-06))'
    : 'var(--surf-55)';
  const borderColor = best ? 'var(--gold-60)' : featured ? 'var(--gold-50)' : 'var(--gold-12)';
  return (
    <div style={{
      padding: '14px 16px', borderRadius: 16,
      background: accentBg,
      border: `1px solid ${borderColor}`,
      boxShadow: (best || featured) ? `0 0 22px ${best ? 'var(--gold-30)' : 'var(--gold-22)'}` : 'none',
      display: 'flex', alignItems: 'center', gap: 14,
      cursor: 'pointer', position: 'relative',
    }}>
      {tag && (
        <div style={{
          position: 'absolute', top: -8, right: 16,
          padding: '2px 10px', borderRadius: 99,
          background: best
            ? 'linear-gradient(135deg, var(--ember-bright), var(--ember-deep))'
            : 'linear-gradient(135deg, var(--gold-bright), var(--gold-deep))',
          fontFamily: 'var(--font-mono)', fontSize: 8,
          color: best ? '#fff' : '#1F1810', letterSpacing: '0.18em', fontWeight: 700,
        }}>{tag.toUpperCase()}</div>
      )}
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: 'var(--gold-15)', border: '1px solid var(--gold-30)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, color: 'var(--gold-bright)', letterSpacing: '-0.05em',
      }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span className="f-display" style={{ fontSize: 22, color: 'var(--cream)', fontWeight: 800 }}>{amount}</span>
          <span className="f-mono" style={{ fontSize: 10, color: 'var(--gold)' }}>KORA</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
          <span className="f-body" style={{ fontSize: 11, color: 'rgba(246,239,223,0.55)' }}>{label}</span>
          <span style={{ width: 2, height: 2, borderRadius: '50%', background: 'var(--gold-30)' }} />
          <span className="f-mono" style={{ fontSize: 9, color: 'var(--gold)', letterSpacing: '0.14em' }}>{rate}</span>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div className="f-display" style={{ fontSize: 14, color: (best || featured) ? 'var(--gold-bright)' : 'var(--cream)', fontWeight: 700 }}>{price}</div>
        <div className="f-mono" style={{ fontSize: 9, color: 'rgba(246,239,223,0.4)', marginTop: 2 }}>›</div>
      </div>
    </div>
  );
}

Object.assign(window, { MShop, MInspect, MWallet, MTopUp });
