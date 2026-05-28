/* global React, Phone, MStatusBar, AppBar, PageTitle, SectionHeader, Row, RoundIcon, Avatar, MBottomNav, RankShield, Embers, GoldDust, Smoke, SparkBurst, Card3D, CardBack3D */

// ─────────────────────────────────────────────────────────────
// Petits utilitaires partagés (typographie + chip Kora)
// ─────────────────────────────────────────────────────────────

function K({ value, size = 14, weight = 800, color = 'var(--cream)' }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 4 }}>
      <span style={{ color: 'var(--gold-bright)', fontSize: size * 0.9 }}>◆</span>
      <span className="f-display" style={{ fontSize: size, color, fontWeight: weight }}>{value}</span>
    </span>
  );
}

function fmt(n) { return n.toLocaleString('fr-FR').replace(/,/g, ' '); }

// ─── 2.5 · Lobby des tables (Découverte / Standard / VIP) ─────
function MTables() {
  const balance = 2480;
  const TIERS = [
    {
      id: 'd', name: 'Découverte', mise: 50, min: 200,
      players: '1 482', tone: 'jade', glyph: '◯',
      kicker: 'Pour s\'amuser',
      sub: 'Tables douces — risque limité, idéal pour apprendre.',
    },
    {
      id: 's', name: 'Standard', mise: 200, min: 800,
      players: '628', tone: 'gold', glyph: '◆',
      kicker: 'Le cœur du jeu',
      sub: 'Où ça joue vraiment. Mises sérieuses, pots qui montent.',
    },
    {
      id: 'v', name: 'VIP', mise: 1000, min: 4000,
      players: '94', tone: 'amber', glyph: '★',
      kicker: 'Pour les gros',
      sub: 'Réservé aux soldes confortables. Statut & prestige.',
    },
  ];

  return (
    <Phone bg="app">
      <GoldDust count={10} opacity={0.3} />
      <MStatusBar />

      <div style={{ padding: '4px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'var(--surf-70)', border: '1px solid var(--gold-20)',
          color: 'var(--cream)', cursor: 'pointer', fontSize: 14,
        }}>‹</button>
        <div className="chip" style={{ height: 28 }}>
          <span style={{ color: 'var(--gold-bright)' }}>◆</span>
          <span className="f-display" style={{ fontSize: 12, color: 'var(--gold-bright)' }}>{fmt(balance)}</span>
          <span style={{ fontSize: 14, color: 'var(--gold-bright)', marginLeft: 4 }}>+</span>
        </div>
      </div>

      <PageTitle eyebrow="MISE LIBRE" title={'Choisis ta\ntable.'} />

      <div className="f-body" style={{ padding: '0 20px 18px', fontSize: 13, color: 'rgba(246,239,223,0.6)', lineHeight: 1.5 }}>
        La mise est antéposée à chaque main. 5 % de rake sur le pot.
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {TIERS.map(t => {
          const locked = balance < t.min;
          const accent = t.tone === 'amber' ? 'var(--gold-bright)'
                       : t.tone === 'gold'  ? 'var(--gold-bright)'
                       : 'var(--accent-text)';
          const bg = t.tone === 'amber'
            ? 'linear-gradient(135deg, var(--gold-25), var(--gold-08))'
            : t.tone === 'gold'
            ? 'linear-gradient(135deg, var(--gold-15), transparent)'
            : 'var(--surf-55)';
          const border = t.tone === 'amber' ? 'var(--gold-50)'
                       : t.tone === 'gold'  ? 'var(--gold-25)'
                       : 'var(--gold-12)';

          return (
            <div key={t.id} style={{
              padding: 16, borderRadius: 18,
              background: bg, border: `1px solid ${locked ? 'var(--gold-10)' : border}`,
              opacity: locked ? 0.6 : 1, position: 'relative',
              boxShadow: t.tone === 'amber' ? '0 0 20px var(--gold-22)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 14, flexShrink: 0,
                  background: locked ? 'var(--surf-70)' : `linear-gradient(135deg, ${accent}40, ${accent}10)`,
                  border: `1px solid ${locked ? 'var(--gold-15)' : accent + '60'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, color: locked ? 'rgba(246,239,223,0.4)' : accent,
                }}>{locked ? '🔒' : t.glyph}</div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span className="f-display" style={{ fontSize: 19, color: 'var(--cream)', fontWeight: 800, letterSpacing: '-0.01em' }}>{t.name}</span>
                    <span className="f-mono" style={{ fontSize: 9, color: 'rgba(246,239,223,0.45)' }}>· {t.kicker}</span>
                  </div>
                  <div className="f-body" style={{ fontSize: 12, color: 'rgba(246,239,223,0.55)', marginTop: 4, lineHeight: 1.45 }}>{t.sub}</div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 12 }}>
                    <div>
                      <div className="f-mono" style={{ fontSize: 7, color: 'rgba(246,239,223,0.5)', letterSpacing: '0.18em' }}>MISE / MAIN</div>
                      <K value={fmt(t.mise)} size={15} color={accent} />
                    </div>
                    <div style={{ width: 1, height: 22, background: 'var(--gold-12)' }} />
                    <div>
                      <div className="f-mono" style={{ fontSize: 7, color: 'rgba(246,239,223,0.5)', letterSpacing: '0.18em' }}>SOLDE MIN.</div>
                      <K value={fmt(t.min)} size={15} color="var(--cream)" />
                    </div>
                    <div style={{ width: 1, height: 22, background: 'var(--gold-12)' }} />
                    <div>
                      <div className="f-mono" style={{ fontSize: 7, color: 'rgba(246,239,223,0.5)', letterSpacing: '0.18em' }}>JOUEURS</div>
                      <div className="f-display" style={{ fontSize: 14, color: 'var(--cream)' }}>{t.players}</div>
                    </div>
                  </div>
                </div>
              </div>

              {locked && (
                <div style={{
                  marginTop: 12, padding: '8px 12px', borderRadius: 10,
                  background: 'var(--ember-12)', border: '1px solid var(--ember-30)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                }}>
                  <span className="f-body" style={{ fontSize: 11, color: 'var(--chip-ember-color)' }}>
                    Il te manque <K value={fmt(t.min - balance)} size={11} color="var(--chip-ember-color)" weight={700} />
                  </span>
                  <span className="f-mono" style={{ fontSize: 9, color: 'var(--gold-bright)', cursor: 'pointer' }}>RECHARGER ›</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ padding: '24px 20px 32px' }}>
        <div className="f-mono" style={{ fontSize: 9, color: 'rgba(246,239,223,0.4)', letterSpacing: '0.15em', textAlign: 'center', lineHeight: 1.6 }}>
          KORA · ×2 SI 3 SUR LE DERNIER PLI  ·  ×4 SUR DOUBLE-KORA
        </div>
      </div>
    </Phone>
  );
}

// ─── 4.5 · « Plus de Kora » — Rebuy (moment clé de monétisation) ─────
function MRebuy() {
  return (
    <Phone bg="velvet">
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 70% 50% at 50% 25%, var(--gold-22), transparent 60%)',
      }} />
      <GoldDust count={14} opacity={0.45} />
      <Embers count={8} />
      <MStatusBar />

      <div style={{ position: 'absolute', top: 58, right: 18, zIndex: 30 }}>
        <button style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'var(--surf-60)', border: '1px solid var(--gold-25)',
          color: 'var(--cream)', cursor: 'pointer', fontSize: 14, backdropFilter: 'blur(8px)',
        }}>✕</button>
      </div>

      {/* Header */}
      <div style={{ padding: '40px 24px 0', textAlign: 'center' }}>
        <div style={{
          width: 72, height: 72, margin: '0 auto 18px', position: 'relative',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, var(--gold-bright), var(--gold) 50%, var(--gold-deep) 100%)',
          border: '2px solid var(--gold-40)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 32px var(--gold-50), inset 0 1px 0 rgba(255,255,255,0.45)',
          animation: 'la-breathe 3s ease-in-out infinite',
        }}>
          <span style={{ fontSize: 30, color: '#1F1810' }}>◆</span>
        </div>
        <div className="eyebrow" style={{ marginBottom: 8 }}>SOLDE BAS</div>
        <div className="f-display" style={{
          fontSize: 32, color: 'var(--cream)', fontWeight: 800,
          letterSpacing: '-0.025em', lineHeight: 1,
        }}>Tu touches le fond.</div>
        <div className="f-body" style={{ fontSize: 13, color: 'rgba(246,239,223,0.65)', marginTop: 10, lineHeight: 1.5 }}>
          Il te reste <K value="180" size={13} color="var(--gold-bright)" weight={700} /> — trop juste pour une table Standard.
        </div>
      </div>

      {/* 3 options */}
      <div style={{ padding: '28px 20px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Pub (gratuit, immédiat) */}
        <RebuyOption
          tone="jade"
          glyph="▶"
          eyebrow="GRATUIT · IMMÉDIAT"
          title="Regarde une pub"
          sub="3 sur 5 disponibles aujourd'hui"
          reward="+150 K"
          cta="Lancer"
          featured
        />
        {/* Acheter (premium) */}
        <RebuyOption
          tone="gold"
          glyph="◆"
          eyebrow="LE PLUS RAPIDE"
          title="Acheter des Kora"
          sub="Dès 100 FCFA · paiement mobile money"
          reward="dès 1 000 K"
          cta="Boutique"
        />
        {/* Attendre (free, slow) */}
        <RebuyOption
          tone="neutral"
          glyph="⌛"
          eyebrow="DANS 28 MIN"
          title="Attendre la recharge"
          sub="Recharge gratuite anti-fauché · max 600 K"
          reward="+200 K"
          cta="Patienter"
        />
      </div>

      {/* Reassurance */}
      <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24, textAlign: 'center' }}>
        <div className="f-body" style={{ fontSize: 11, color: 'rgba(246,239,223,0.45)', lineHeight: 1.55 }}>
          Tu peux toujours rejouer à <span style={{ color: 'var(--accent-text)' }}>Découverte</span> sans rien dépenser.
        </div>
      </div>
    </Phone>
  );
}

function RebuyOption({ tone, glyph, eyebrow, title, sub, reward, cta, featured }) {
  const styles = {
    jade:    { bg: 'linear-gradient(135deg, var(--accent-25), var(--accent-08))', border: 'var(--accent-45)', accent: 'var(--accent-text)', cta: 'btn-jade' },
    gold:    { bg: 'linear-gradient(135deg, var(--gold-25), var(--gold-08))',     border: 'var(--gold-50)',   accent: 'var(--gold-bright)', cta: 'btn-gold' },
    neutral: { bg: 'var(--surf-65)',                                              border: 'var(--gold-15)',   accent: 'rgba(246,239,223,0.7)', cta: 'btn-dark' },
  }[tone];

  return (
    <div style={{
      padding: 14, borderRadius: 16,
      background: styles.bg, border: `1px solid ${styles.border}`,
      display: 'flex', alignItems: 'center', gap: 14,
      boxShadow: featured ? '0 0 24px var(--accent-35)' : 'none',
      cursor: 'pointer', position: 'relative',
    }}>
      <div style={{
        width: 46, height: 46, borderRadius: 12, flexShrink: 0,
        background: `${styles.accent}22`,
        border: `1px solid ${styles.accent}55`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, color: styles.accent,
      }}>{glyph}</div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="f-mono" style={{ fontSize: 8, color: styles.accent, letterSpacing: '0.22em' }}>{eyebrow}</div>
        <div className="f-display" style={{ fontSize: 15, color: 'var(--cream)', fontWeight: 700, marginTop: 2 }}>{title}</div>
        <div className="f-body" style={{ fontSize: 11, color: 'rgba(246,239,223,0.55)', marginTop: 3, lineHeight: 1.4 }}>{sub}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
        <div className="f-display" style={{ fontSize: 13, color: styles.accent, fontWeight: 800, whiteSpace: 'nowrap' }}>{reward}</div>
        <button className={`btn ${styles.cta}`} style={{ fontSize: 11, padding: '7px 12px' }}>{cta}</button>
      </div>
    </div>
  );
}

// ─── 4.6 · Pub récompensée (interstitiel) ─────────────────────
function MAdReward() {
  return (
    <Phone bg="velvet">
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #0A0E14 0%, #050608 100%)',
      }} />
      <MStatusBar />

      {/* Top bar with countdown */}
      <div style={{
        position: 'absolute', top: 60, left: 18, right: 18,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 20,
      }}>
        <div className="chip" style={{
          height: 26, background: 'rgba(0,0,0,0.6)', borderColor: 'rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.8)',
        }}>
          <span>PUB · {16}s</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.18)',
            color: '#fff', fontSize: 12, cursor: 'pointer',
          }}>🔊</button>
          <button style={{
            padding: '6px 10px', borderRadius: 99,
            background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.18)',
            color: 'rgba(255,255,255,0.5)', fontSize: 11, cursor: 'pointer',
            fontFamily: 'var(--font-mono)', letterSpacing: '0.12em',
          }}>SKIP 6s</button>
        </div>
      </div>

      {/* Mock ad creative — generic */}
      <div style={{
        position: 'absolute', top: 120, left: 24, right: 24, height: 540,
        borderRadius: 24, overflow: 'hidden',
        background: 'linear-gradient(135deg, #FF6B35 0%, #C73E1D 60%, #6B1B0A 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: 28, boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
      }}>
        <div>
          <div style={{
            display: 'inline-block', padding: '4px 10px', borderRadius: 99,
            background: 'rgba(255,255,255,0.18)', color: '#fff',
            fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em',
          }}>SPONSORISÉ</div>
        </div>
        <div style={{
          width: '100%', height: 220, borderRadius: 16,
          background: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0 8px, transparent 8px 16px), rgba(255,255,255,0.04)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.55)',
          letterSpacing: '0.18em',
        }}>VIDÉO · 30s</div>
        <div>
          <div className="f-display" style={{ fontSize: 32, color: '#fff', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>
            Marque<br/>partenaire.
          </div>
          <button style={{
            marginTop: 18, padding: '12px 22px', borderRadius: 99,
            background: '#fff', color: '#C73E1D', border: 'none',
            fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 800, cursor: 'pointer',
          }}>Découvrir →</button>
        </div>
      </div>

      {/* Reward preview at bottom */}
      <div style={{
        position: 'absolute', bottom: 24, left: 18, right: 18, zIndex: 20,
        padding: 14, borderRadius: 14,
        background: 'rgba(0,0,0,0.65)',
        border: '1px solid var(--gold-40)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: 'radial-gradient(circle at 30% 30%, var(--gold-bright), var(--gold-deep))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, color: '#1F1810',
          boxShadow: '0 0 16px var(--gold-40)',
        }}>◆</div>
        <div style={{ flex: 1 }}>
          <div className="f-mono" style={{ fontSize: 8, color: 'var(--gold-bright)', letterSpacing: '0.22em' }}>RÉCOMPENSE EN ATTENTE</div>
          <div className="f-display" style={{ fontSize: 16, color: 'var(--cream)', fontWeight: 800, marginTop: 2 }}>+150 Kora</div>
        </div>
        <div className="f-mono" style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', textAlign: 'right' }}>
          3 / 5<br/><span style={{ fontSize: 8 }}>AUJOURD'HUI</span>
        </div>
      </div>
    </Phone>
  );
}

// ─── 4.7 · Bonus quotidien (streak 7 jours) ────────────────────
function MDailyBonus() {
  const DAYS = [
    { d: 1, k: 100,  done: true },
    { d: 2, k: 150,  done: true },
    { d: 3, k: 200,  done: true },
    { d: 4, k: 250,  today: true },
    { d: 5, k: 300 },
    { d: 6, k: 400 },
    { d: 7, k: 600, big: true },
  ];

  return (
    <Phone bg="velvet">
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 50% at 50% 30%, var(--gold-22), transparent 60%)',
      }} />
      <Embers count={12} />
      <GoldDust count={18} opacity={0.5} />
      <MStatusBar />

      <div style={{ position: 'absolute', top: 58, right: 18, zIndex: 30 }}>
        <button style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'var(--surf-60)', border: '1px solid var(--gold-25)',
          color: 'var(--cream)', cursor: 'pointer', fontSize: 14, backdropFilter: 'blur(8px)',
        }}>✕</button>
      </div>

      {/* Header */}
      <div style={{ padding: '40px 24px 0', textAlign: 'center' }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>BONUS QUOTIDIEN · JOUR 4</div>
        <div className="f-display" style={{
          fontSize: 32, color: 'var(--cream)', fontWeight: 800,
          letterSpacing: '-0.025em', lineHeight: 1,
        }}>Bien revenu.</div>
        <div className="f-body" style={{ fontSize: 13, color: 'rgba(246,239,223,0.65)', marginTop: 10, lineHeight: 1.5 }}>
          Encore 3 jours pour décrocher le gros lot du dimanche.
        </div>
      </div>

      {/* Today's big reward */}
      <div style={{ padding: '24px 24px 0', textAlign: 'center' }}>
        <div style={{
          margin: '0 auto', width: 180, height: 180, position: 'relative',
        }}>
          <div style={{
            position: 'absolute', inset: -20,
            background: 'radial-gradient(circle, var(--gold-35), transparent 65%)',
            filter: 'blur(20px)',
          }} />
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, var(--gold-bright), var(--gold) 45%, var(--gold-deep) 100%)',
            border: '3px solid var(--gold-bright)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
            boxShadow: '0 20px 50px var(--gold-50), inset 0 2px 0 rgba(255,255,255,0.45)',
            animation: 'la-breathe 3s ease-in-out infinite',
          }}>
            <div className="f-display" style={{ fontSize: 46, color: '#1F1810', fontWeight: 800, lineHeight: 0.9, letterSpacing: '-0.04em' }}>+250</div>
            <div className="f-mono" style={{ fontSize: 11, color: '#3A2810', letterSpacing: '0.22em', marginTop: 2 }}>KORA</div>
          </div>
        </div>
      </div>

      {/* 7-day calendar */}
      <div style={{
        margin: '36px 18px 0', padding: '12px 14px', borderRadius: 18,
        background: 'rgba(0,0,0,0.35)',
        border: '1px solid var(--gold-18)',
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <span className="f-mono" style={{ fontSize: 9, color: 'var(--gold)', letterSpacing: '0.22em' }}>SÉRIE EN COURS</span>
          <span className="f-display" style={{ fontSize: 12, color: 'var(--gold-bright)' }}>3 jours</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {DAYS.map(d => (
            <div key={d.d} style={{
              flex: d.big ? 1.6 : 1, aspectRatio: d.big ? 'auto' : '1', borderRadius: 10,
              minHeight: 56,
              background: d.done
                ? 'linear-gradient(180deg, var(--accent-25), var(--accent-08))'
                : d.today
                ? 'linear-gradient(180deg, var(--gold-bright), var(--gold-deep))'
                : d.big
                ? 'linear-gradient(180deg, var(--gold-15), transparent)'
                : 'var(--surf-65)',
              border: `1px solid ${d.done ? 'var(--accent-45)' : d.today ? 'var(--gold-bright)' : d.big ? 'var(--gold-40)' : 'var(--gold-12)'}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
              position: 'relative',
              boxShadow: d.today ? '0 0 18px var(--gold-50)' : 'none',
            }}>
              <div className="f-mono" style={{
                fontSize: 8, letterSpacing: '0.18em',
                color: d.today ? '#1F1810' : d.done ? 'var(--accent-text)' : 'rgba(246,239,223,0.5)',
              }}>J{d.d}</div>
              <div className="f-display" style={{
                fontSize: d.big ? 14 : 12, fontWeight: 800,
                color: d.today ? '#1F1810' : d.done ? 'var(--cream)' : d.big ? 'var(--gold-bright)' : 'rgba(246,239,223,0.6)',
              }}>{d.k}</div>
              {d.done && (
                <span style={{ position: 'absolute', top: 3, right: 4, color: 'var(--accent-text)', fontSize: 9 }}>✓</span>
              )}
              {d.big && !d.today && (
                <span className="f-mono" style={{ fontSize: 6, color: 'var(--gold-bright)', letterSpacing: '0.18em' }}>★</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ position: 'absolute', bottom: 28, left: 20, right: 20 }}>
        <button className="btn btn-gold" style={{ width: '100%', fontSize: 15, padding: '15px' }}>
          Encaisser +250 K
        </button>
        <div className="f-mono" style={{ textAlign: 'center', fontSize: 8, color: 'rgba(246,239,223,0.4)', letterSpacing: '0.18em', marginTop: 10 }}>
          UN JOUR MANQUÉ = SÉRIE REMISE À ZÉRO
        </div>
      </div>
    </Phone>
  );
}

// ─── 4.8 · Recharge mobile money (saisie) ─────────────────────
function MMobileMoney() {
  const [op, setOp] = React.useState('airtel');
  return (
    <Phone bg="app">
      <GoldDust count={6} opacity={0.25} />
      <MStatusBar />
      <AppBar title="Recharge" />

      {/* Step indicator */}
      <div style={{ padding: '0 20px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <StepDot label="Pack" done />
        <StepLine />
        <StepDot label="Paiement" active />
        <StepLine muted />
        <StepDot label="Confirmation" />
      </div>

      <PageTitle eyebrow="ÉTAPE 2 / 3" title="Mobile Money." />

      {/* Pack récap */}
      <div style={{
        margin: '0 20px 20px', padding: 14, borderRadius: 14,
        background: 'linear-gradient(135deg, var(--gold-18), transparent)',
        border: '1px solid var(--gold-30)',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: 'var(--gold-22)', border: '1px solid var(--gold-40)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, color: 'var(--gold-bright)',
        }}>◆◆◆</div>
        <div style={{ flex: 1 }}>
          <div className="f-mono" style={{ fontSize: 8, color: 'var(--gold)', letterSpacing: '0.22em' }}>PACK POPULAIRE</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 2 }}>
            <K value="13 000" size={20} color="var(--gold-bright)" />
            <span className="chip chip-jade" style={{ height: 14, fontSize: 7, padding: '0 5px' }}>+30%</span>
          </div>
        </div>
        <span className="f-display" style={{ fontSize: 14, color: 'var(--cream)', fontWeight: 700 }}>1 000 F</span>
      </div>

      {/* Opérateur */}
      <SectionHeader title="Opérateur" />
      <div style={{ padding: '0 20px 18px', display: 'flex', gap: 10 }}>
        <OpCard id="airtel" name="Airtel Money" color="#E20613" active={op === 'airtel'} onClick={() => setOp('airtel')} />
        <OpCard id="moov"   name="Moov Money"   color="#0089D0" active={op === 'moov'}   onClick={() => setOp('moov')} />
      </div>

      {/* Numéro */}
      <SectionHeader title="Numéro" />
      <div style={{ padding: '0 20px 18px' }}>
        <div style={{
          padding: '14px 16px', borderRadius: 14,
          background: 'var(--surf-65)',
          border: '1px solid var(--gold-25)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span className="f-mono" style={{ fontSize: 13, color: 'var(--gold-bright)' }}>+241</span>
          <span style={{ width: 1, height: 18, background: 'var(--gold-22)' }} />
          <span className="f-display" style={{ fontSize: 17, color: 'var(--cream)', letterSpacing: '0.05em' }}>06 12 34 56</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 11, color: 'rgba(246,239,223,0.5)', cursor: 'pointer' }}>✎</span>
        </div>
        <div className="f-body" style={{ fontSize: 11, color: 'rgba(246,239,223,0.5)', marginTop: 8, lineHeight: 1.5 }}>
          Tu vas recevoir un code USSD pour valider — ça prend moins de 10 secondes.
        </div>
      </div>

      {/* Récap */}
      <div style={{
        margin: '0 20px 16px', padding: 14, borderRadius: 12,
        background: 'rgba(0,0,0,0.25)',
        border: '1px solid var(--gold-10)',
      }}>
        <RecapRow label="Pack" value="13 000 K" />
        <RecapRow label="Frais opérateur" value="0 F" tone="muted" />
        <RecapRow label="À payer" value="1 000 FCFA" big />
      </div>

      <div style={{ position: 'absolute', bottom: 28, left: 20, right: 20 }}>
        <button className="btn btn-gold" style={{ width: '100%', fontSize: 15, padding: '15px' }}>
          Payer 1 000 F · Recevoir 13 000 K
        </button>
        <div className="f-mono" style={{ textAlign: 'center', fontSize: 8, color: 'rgba(246,239,223,0.4)', letterSpacing: '0.18em', marginTop: 10 }}>
          PAIEMENT SÉCURISÉ · AUCUN STOCKAGE
        </div>
      </div>
    </Phone>
  );
}

function StepDot({ label, done, active }) {
  const color = done ? 'var(--accent-text)' : active ? 'var(--gold-bright)' : 'rgba(246,239,223,0.4)';
  const bg = done ? 'var(--accent-25)' : active ? 'var(--gold-22)' : 'var(--surf-65)';
  const border = done ? 'var(--accent-45)' : active ? 'var(--gold-50)' : 'var(--gold-12)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{
        width: 22, height: 22, borderRadius: '50%',
        background: bg, border: `1px solid ${border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10, color,
        boxShadow: active ? '0 0 12px var(--gold-40)' : 'none',
      }}>{done ? '✓' : ''}</div>
      <span className="f-mono" style={{ fontSize: 7, color, letterSpacing: '0.18em' }}>{label}</span>
    </div>
  );
}
function StepLine({ muted }) {
  return <div style={{ flex: 1, height: 1, background: muted ? 'var(--gold-10)' : 'var(--accent-30)', alignSelf: 'flex-start', marginTop: 11 }} />;
}

function OpCard({ name, color, active, onClick }) {
  return (
    <div onClick={onClick} style={{
      flex: 1, padding: 16, borderRadius: 14, cursor: 'pointer',
      background: active ? `linear-gradient(135deg, ${color}25, transparent)` : 'var(--surf-55)',
      border: `1.5px solid ${active ? color : 'var(--gold-12)'}`,
      boxShadow: active ? `0 0 16px ${color}40` : 'none',
      display: 'flex', flexDirection: 'column', gap: 10,
      position: 'relative', transition: 'all 200ms ease',
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: 8,
        background: color, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 800,
      }}>{name[0]}</div>
      <div className="f-display" style={{ fontSize: 13, color: 'var(--cream)' }}>{name}</div>
      {active && (
        <span style={{
          position: 'absolute', top: 10, right: 12,
          width: 18, height: 18, borderRadius: '50%',
          background: color, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10,
        }}>✓</span>
      )}
    </div>
  );
}
function RecapRow({ label, value, tone, big }) {
  const color = tone === 'muted' ? 'rgba(246,239,223,0.45)' : 'var(--cream)';
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      padding: big ? '8px 0 0' : '4px 0',
      borderTop: big ? '0.5px solid var(--gold-15)' : 'none',
      marginTop: big ? 6 : 0,
    }}>
      <span className="f-body" style={{ fontSize: big ? 13 : 11, color: big ? 'var(--cream)' : 'rgba(246,239,223,0.6)' }}>{label}</span>
      <span className="f-display" style={{ fontSize: big ? 18 : 12, color: big ? 'var(--gold-bright)' : color, fontWeight: big ? 800 : 600 }}>{value}</span>
    </div>
  );
}

// ─── 4.9 · Recharge réussie (animation de crédit) ─────────────
function MTopupSuccess() {
  return (
    <Phone bg="velvet">
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 70% 60% at 50% 40%, var(--gold-25), transparent 60%)',
      }} />
      <Embers count={20} />
      <GoldDust count={28} opacity={0.7} />
      <SparkBurst count={26} />
      <MStatusBar />

      {/* Big check */}
      <div style={{
        position: 'absolute', top: 130, left: 0, right: 0, textAlign: 'center', zIndex: 5,
      }}>
        <div style={{
          width: 88, height: 88, margin: '0 auto 22px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, var(--accent-text), var(--jade-glow) 40%, var(--jade) 100%)',
          border: '3px solid var(--accent-text)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 36px var(--accent-50), inset 0 2px 0 rgba(255,255,255,0.4)',
          animation: 'la-breathe 2.8s ease-in-out infinite',
        }}>
          <span style={{ fontSize: 44, color: 'var(--cream)', fontWeight: 800 }}>✓</span>
        </div>

        <div className="eyebrow" style={{ marginBottom: 8 }}>PAIEMENT VALIDÉ · 1 000 FCFA</div>
        <div className="f-display" style={{
          fontSize: 36, color: 'var(--cream)', fontWeight: 800,
          letterSpacing: '-0.03em', lineHeight: 1,
        }}>+13 000<br/>Kora.</div>
        <div className="f-roman" style={{
          fontSize: 13, color: 'rgba(246,239,223,0.6)', marginTop: 12,
          fontStyle: 'italic', letterSpacing: '0.14em',
        }}>crédités à l'instant — bonne partie</div>
      </div>

      {/* Balance new */}
      <div style={{
        position: 'absolute', top: 480, left: 24, right: 24, zIndex: 6,
        padding: 18, borderRadius: 18,
        background: 'rgba(0,0,0,0.4)',
        border: '1px solid var(--gold-30)',
        backdropFilter: 'blur(10px)',
      }}>
        <div className="eyebrow" style={{ fontSize: 9, marginBottom: 10 }}>NOUVEAU SOLDE</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ color: 'var(--gold-bright)', fontSize: 22 }}>◆</span>
          <span className="f-display" style={{ fontSize: 38, color: 'var(--cream)', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 0.95 }}>25 480</span>
          <span className="f-mono" style={{ fontSize: 10, color: 'var(--gold)', marginLeft: 4 }}>K</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
          <span className="f-body" style={{ fontSize: 11, color: 'rgba(246,239,223,0.5)' }}>avant</span>
          <span className="f-mono" style={{ fontSize: 11, color: 'rgba(246,239,223,0.5)', textDecoration: 'line-through' }}>12 480 K</span>
          <span className="f-mono" style={{ fontSize: 11, color: 'var(--accent-text)' }}>→ +13 000 K</span>
        </div>
      </div>

      {/* CTAs */}
      <div style={{ position: 'absolute', bottom: 32, left: 20, right: 20, display: 'flex', flexDirection: 'column', gap: 10, zIndex: 10 }}>
        <button className="btn btn-gold" style={{ width: '100%', fontSize: 15, padding: '15px' }}>
          Trouver une table →
        </button>
        <button className="btn btn-dark" style={{ width: '100%', fontSize: 13, padding: '12px' }}>
          ↗ Reçu par mail
        </button>
      </div>
    </Phone>
  );
}

// ─── 8.1 · Tournois (liste) ─────────────────────────────────────
function MTournaments() {
  const [tab, setTab] = React.useState('real');
  return (
    <Phone bg="app" nav={<MBottomNav active="play" />}>
      <GoldDust count={10} opacity={0.3} />
      <MStatusBar />

      <div style={{ padding: '4px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="f-display" style={{ fontSize: 17, color: 'var(--cream)' }}>Tournois</div>
        <span className="f-mono" style={{ fontSize: 9, color: 'var(--gold-bright)', cursor: 'pointer', letterSpacing: '0.18em' }}>⌖ MES INSCRIPTIONS</span>
      </div>

      <PageTitle eyebrow="GAGNE DU VRAI · OU DU PRESTIGE" title={'Tournois\nen cours.'} />

      {/* Tabs */}
      <div style={{ padding: '0 20px 18px', display: 'flex', gap: 8 }}>
        {[
          { id: 'real', label: 'Lots réels', hint: 'gratuit' },
          { id: 'kora', label: 'Buy-in Kora', hint: 'engagés' },
        ].map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: '10px 12px', borderRadius: 14,
              background: active ? 'linear-gradient(180deg, var(--gold-22), var(--gold-08))' : 'var(--surf-55)',
              border: `1px solid ${active ? 'var(--gold-50)' : 'var(--gold-12)'}`,
              color: active ? 'var(--gold-bright)' : 'rgba(246,239,223,0.55)',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
              cursor: 'pointer',
              display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start',
            }}>
              <span>{t.label}</span>
              <span className="f-mono" style={{ fontSize: 8, letterSpacing: '0.18em', opacity: 0.7 }}>{t.hint}</span>
            </button>
          );
        })}
      </div>

      {tab === 'real' ? <RealPrizesList /> : <KoraBuyinList />}

      <div style={{ height: 100 }} />
    </Phone>
  );
}

function RealPrizesList() {
  return (
    <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <TourneyCard
        kicker="ENTRÉE GRATUITE"
        title="Coupe du Vendredi"
        prize="Forfait data 5 000 F"
        prizeIcon="📶"
        countdown="2 j 14 h"
        slots="248 / 512"
        tone="hot"
        featured
      />
      <TourneyCard
        kicker="ENTRÉE GRATUITE"
        title="Tournoi de la Maison"
        prize="Crédit téléphone 2 000 F"
        prizeIcon="📞"
        countdown="14 h 22 min"
        slots="312 / 512"
        tone="warm"
      />
      <TourneyCard
        kicker="GRAND TOURNOI MENSUEL"
        title="Le Bandi d'Or"
        prize="Smartphone milieu de gamme"
        prizeIcon="📱"
        countdown="27 jours"
        slots="48 / 64"
        tone="gold"
      />
      <div style={{
        padding: 12, borderRadius: 12,
        background: 'rgba(0,0,0,0.25)',
        border: '1px dashed var(--gold-18)',
      }}>
        <div className="f-mono" style={{ fontSize: 9, color: 'var(--gold)', letterSpacing: '0.18em', marginBottom: 6 }}>★ LÉGAL</div>
        <div className="f-body" style={{ fontSize: 11, color: 'rgba(246,239,223,0.6)', lineHeight: 1.5 }}>
          Tous nos tournois sont à entrée gratuite avec lot fixe. Aucune cagnotte alimentée par les mises — ce n'est pas un jeu d'argent.
        </div>
      </div>
    </div>
  );
}

function KoraBuyinList() {
  return (
    <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <TourneyCard
        kicker="BUY-IN 500 K"
        title="Sit & Go · Express"
        prize="≈ 7 200 K au gagnant"
        prizeIcon="◆"
        countdown="démarre quand 8 joueurs"
        slots="5 / 8"
        tone="jade"
        koraEntry="500 K"
      />
      <TourneyCard
        kicker="BUY-IN 2 000 K"
        title="Tournoi du Soir"
        prize="≈ 28 800 K au gagnant"
        prizeIcon="◆"
        countdown="ce soir 21h00"
        slots="42 / 64"
        tone="gold"
        koraEntry="2 000 K"
      />
      <TourneyCard
        kicker="BUY-IN 10 000 K"
        title="Cercle des Bandi"
        prize="≈ 144 000 K + cadre"
        prizeIcon="★"
        countdown="dimanche 20h"
        slots="12 / 32"
        tone="amber"
        koraEntry="10 000 K"
        featured
      />
    </div>
  );
}

function TourneyCard({ kicker, title, prize, prizeIcon, countdown, slots, tone, featured, koraEntry }) {
  const styles = {
    hot:   { bg: 'linear-gradient(135deg, var(--ember-15), transparent)', border: 'var(--ember-45)', accent: 'var(--chip-ember-color)' },
    warm:  { bg: 'linear-gradient(135deg, var(--gold-15), transparent)',  border: 'var(--gold-30)',  accent: 'var(--gold-bright)' },
    gold:  { bg: 'linear-gradient(135deg, var(--gold-22), var(--gold-06))', border: 'var(--gold-50)', accent: 'var(--gold-bright)' },
    jade:  { bg: 'linear-gradient(135deg, var(--accent-18), transparent)', border: 'var(--accent-40)', accent: 'var(--accent-text)' },
    amber: { bg: 'linear-gradient(135deg, var(--gold-30), var(--gold-08))', border: 'var(--gold-60)', accent: 'var(--gold-bright)' },
  }[tone];

  return (
    <div style={{
      padding: 16, borderRadius: 16,
      background: styles.bg, border: `1px solid ${styles.border}`,
      boxShadow: featured ? '0 0 22px var(--gold-25)' : 'none',
      cursor: 'pointer', position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14, flexShrink: 0,
          background: `${styles.accent}25`, border: `1px solid ${styles.accent}60`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22,
        }}>{prizeIcon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="f-mono" style={{ fontSize: 8, color: styles.accent, letterSpacing: '0.22em' }}>{kicker}</div>
          <div className="f-display" style={{ fontSize: 17, color: 'var(--cream)', fontWeight: 800, marginTop: 2, letterSpacing: '-0.01em' }}>{title}</div>
          <div className="f-body" style={{ fontSize: 12, color: 'rgba(246,239,223,0.7)', marginTop: 3 }}>
            <span style={{ color: styles.accent, fontWeight: 600 }}>Lot ·</span> {prize}
          </div>
        </div>
        {featured && (
          <span className="chip chip-ember" style={{ height: 18, fontSize: 8, padding: '0 8px' }}>★ HOT</span>
        )}
      </div>

      <div style={{
        marginTop: 14, padding: '8px 12px', borderRadius: 10,
        background: 'rgba(0,0,0,0.3)',
        border: '1px solid var(--gold-08)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div>
            <div className="f-mono" style={{ fontSize: 7, color: 'rgba(246,239,223,0.5)', letterSpacing: '0.18em' }}>DÉPART</div>
            <div className="f-display" style={{ fontSize: 12, color: 'var(--cream)' }}>{countdown}</div>
          </div>
          <div style={{ width: 1, height: 18, background: 'var(--gold-12)' }} />
          <div>
            <div className="f-mono" style={{ fontSize: 7, color: 'rgba(246,239,223,0.5)', letterSpacing: '0.18em' }}>INSCRITS</div>
            <div className="f-display" style={{ fontSize: 12, color: 'var(--cream)' }}>{slots}</div>
          </div>
        </div>
        <button style={{
          padding: '7px 14px', borderRadius: 99,
          background: `linear-gradient(180deg, ${styles.accent}, ${styles.accent}80)`,
          border: 'none', cursor: 'pointer',
          fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 800,
          color: tone === 'amber' || tone === 'gold' ? '#1F1810' : '#fff',
          whiteSpace: 'nowrap',
        }}>{koraEntry ? `${koraEntry} ›` : "S'inscrire"}</button>
      </div>
    </div>
  );
}

// ─── 8.2 · Tournoi détail (gratuit · lot réel) ─────────────────
function MTournamentDetail() {
  return (
    <Phone bg="velvet">
      <Embers count={10} />
      <GoldDust count={14} opacity={0.4} />
      <MStatusBar />
      <AppBar title="Coupe du Vendredi" right={
        <button style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'var(--surf-70)', border: '1px solid var(--gold-18)',
          color: 'var(--cream)', cursor: 'pointer', fontSize: 14,
        }}>↗</button>
      } />

      {/* Prize hero */}
      <div style={{
        margin: '8px 20px 20px', padding: 22, borderRadius: 22,
        background: 'linear-gradient(135deg, var(--ember-20), var(--gold-15) 60%, transparent)',
        border: '1px solid var(--ember-45)',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
      }}>
        <div style={{
          position: 'absolute', top: -30, right: -30, width: 180, height: 180,
          background: 'radial-gradient(circle, var(--gold-32), transparent 70%)',
          filter: 'blur(28px)',
        }} />
        <div className="eyebrow" style={{ marginBottom: 10, color: 'var(--chip-ember-color)', position: 'relative' }}>★ LOT FIXE · GARANTI</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, position: 'relative' }}>
          <div style={{
            width: 80, height: 80, borderRadius: 18,
            background: 'linear-gradient(135deg, var(--gold-bright), var(--gold-deep))',
            border: '2px solid var(--gold)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 38,
            boxShadow: '0 0 32px var(--gold-40), inset 0 1px 0 rgba(255,255,255,0.4)',
          }}>📶</div>
          <div style={{ flex: 1 }}>
            <div className="f-display" style={{ fontSize: 24, color: 'var(--cream)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>
              Forfait<br/>data 5 000 F
            </div>
            <div className="f-body" style={{ fontSize: 11, color: 'rgba(246,239,223,0.6)', marginTop: 6 }}>
              Crédit téléphone Airtel ou Moov, livré sous 24 h
            </div>
          </div>
        </div>
      </div>

      {/* Countdown */}
      <div style={{
        margin: '0 20px 16px', padding: 14, borderRadius: 14,
        background: 'var(--surf-65)',
        border: '1px solid var(--gold-18)',
        display: 'flex', justifyContent: 'space-around', textAlign: 'center',
      }}>
        {[{n: '02', l: 'JOURS'}, {n: '14', l: 'HEURES'}, {n: '32', l: 'MIN'}].map((it, i) => (
          <React.Fragment key={it.l}>
            {i > 0 && <div className="f-display" style={{ fontSize: 22, color: 'var(--gold-40)' }}>:</div>}
            <div>
              <div className="f-display" style={{ fontSize: 28, color: 'var(--cream)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>{it.n}</div>
              <div className="f-mono" style={{ fontSize: 8, color: 'var(--gold)', letterSpacing: '0.22em', marginTop: 4 }}>{it.l}</div>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Format */}
      <SectionHeader title="Format" />
      <div style={{
        margin: '0 20px 16px', padding: 14, borderRadius: 14,
        background: 'var(--surf-55)',
        border: '1px solid var(--gold-10)',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
      }}>
        <KV label="Entrée" value="GRATUITE" tone="jade" />
        <KV label="Inscrits" value="248 / 512" />
        <KV label="Élimination" value="Directe" />
        <KV label="Bonus de mise" value="Sans" />
      </div>

      {/* Legal callout */}
      <div style={{
        margin: '0 20px 18px', padding: 12, borderRadius: 12,
        background: 'var(--accent-12)',
        border: '1px solid var(--accent-30)',
      }}>
        <div className="f-mono" style={{ fontSize: 8, color: 'var(--accent-text)', letterSpacing: '0.22em', marginBottom: 4 }}>★ POURQUOI C'EST LÉGAL</div>
        <div className="f-body" style={{ fontSize: 11, color: 'rgba(246,239,223,0.7)', lineHeight: 1.5 }}>
          Entrée gratuite + lot fixe à l'avance — pas de pari, pas de cagnotte alimentée par les joueurs.
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 28, left: 20, right: 20 }}>
        <button className="btn btn-gold" style={{ width: '100%', fontSize: 15, padding: '15px' }}>
          S'inscrire gratuitement →
        </button>
      </div>
    </Phone>
  );
}

function KV({ label, value, tone = 'neutral' }) {
  const colors = { neutral: 'var(--cream)', jade: 'var(--accent-text)', gold: 'var(--gold-bright)' };
  return (
    <div>
      <div className="f-mono" style={{ fontSize: 7, color: 'rgba(246,239,223,0.5)', letterSpacing: '0.18em' }}>{label}</div>
      <div className="f-display" style={{ fontSize: 14, color: colors[tone], fontWeight: 700, marginTop: 3 }}>{value}</div>
    </div>
  );
}

// ─── 8.3 · Offrir des Kora à un ami ────────────────────────────
function MGiftKora() {
  const [amount, setAmount] = React.useState(500);
  const AMOUNTS = [100, 500, 1000, 2000];
  const friends = [
    { name: 'Le Grand Bandi', initials: 'LB', sub: 'En match', tone: 'gold' },
    { name: 'Maestro',        initials: 'MA', sub: 'En ligne', tone: 'jade' },
    { name: 'D. Tigre',       initials: 'DT', sub: 'En ligne', tone: 'jade' },
  ];
  const selected = friends[0];

  return (
    <Phone bg="app">
      <GoldDust count={10} opacity={0.3} />
      <MStatusBar />
      <AppBar title="Offrir des Kora" />

      <PageTitle eyebrow="CADEAU EN KORA" title={'Fais plaisir.'} />

      {/* Friend picker */}
      <SectionHeader title="Pour qui ?" />
      <div className="no-scrollbar" style={{ padding: '0 20px 18px', display: 'flex', gap: 10, overflowX: 'auto' }}>
        {friends.map((f, i) => (
          <div key={f.name} style={{
            flexShrink: 0, width: 96, padding: 12, borderRadius: 14,
            background: i === 0 ? 'linear-gradient(135deg, var(--gold-22), transparent)' : 'var(--surf-55)',
            border: `1px solid ${i === 0 ? 'var(--gold-50)' : 'var(--gold-12)'}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            cursor: 'pointer', position: 'relative',
          }}>
            <Avatar initials={f.initials} size={44} color={f.tone} ring={i === 0} />
            <div className="f-display" style={{ fontSize: 11, color: 'var(--cream)', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 80 }}>{f.name}</div>
            <div className="f-mono" style={{ fontSize: 7, color: 'rgba(246,239,223,0.5)', letterSpacing: '0.16em' }}>{f.sub}</div>
            {i === 0 && (
              <span style={{
                position: 'absolute', top: 8, right: 8,
                width: 16, height: 16, borderRadius: '50%',
                background: 'var(--gold-bright)', color: '#1F1810',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 800,
              }}>✓</span>
            )}
          </div>
        ))}
        <div style={{
          flexShrink: 0, width: 96, borderRadius: 14,
          background: 'var(--surf-55)', border: '1px dashed var(--gold-18)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          color: 'rgba(246,239,223,0.5)', cursor: 'pointer',
        }}>
          <div style={{ fontSize: 22 }}>+</div>
          <div className="f-mono" style={{ fontSize: 8, letterSpacing: '0.18em', marginTop: 4 }}>AUTRE</div>
        </div>
      </div>

      {/* Amount picker */}
      <SectionHeader title="Montant" />
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          {AMOUNTS.map(a => {
            const active = a === amount;
            return (
              <button key={a} onClick={() => setAmount(a)} style={{
                padding: '14px', borderRadius: 14,
                background: active ? 'linear-gradient(135deg, var(--gold-22), var(--gold-06))' : 'var(--surf-55)',
                border: `1.5px solid ${active ? 'var(--gold-50)' : 'var(--gold-12)'}`,
                color: 'var(--cream)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16,
              }}>
                <span style={{ color: 'var(--gold-bright)' }}>◆</span>
                {fmt(a)}
              </button>
            );
          })}
        </div>
        <div style={{
          padding: 14, borderRadius: 14,
          background: 'var(--surf-60)', border: '1px solid var(--gold-12)',
        }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>UN PETIT MOT (OPTIONNEL)</div>
          <div className="f-roman" style={{ fontSize: 13, color: 'rgba(246,239,223,0.6)', fontStyle: 'italic' }}>
            « Tiens, pour ta prochaine Kora »
          </div>
        </div>
      </div>

      {/* Récap */}
      <div style={{
        margin: '0 20px', padding: 14, borderRadius: 14,
        background: 'rgba(0,0,0,0.3)',
        border: '1px solid var(--gold-12)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className="f-body" style={{ fontSize: 12, color: 'rgba(246,239,223,0.55)' }}>Tu envoies</span>
          <K value={fmt(amount)} size={18} color="var(--gold-bright)" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 4 }}>
          <span className="f-body" style={{ fontSize: 12, color: 'rgba(246,239,223,0.55)' }}>Solde après envoi</span>
          <K value={fmt(12480 - amount)} size={13} color="var(--cream)" weight={600} />
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 28, left: 20, right: 20 }}>
        <button className="btn btn-gold" style={{ width: '100%', fontSize: 15, padding: '15px' }}>
          Envoyer à {selected.name.split(' ')[0]} →
        </button>
        <div className="f-mono" style={{ textAlign: 'center', fontSize: 8, color: 'rgba(246,239,223,0.4)', letterSpacing: '0.18em', marginTop: 10 }}>
          MAX 5 000 K / JOUR · ANTI-FRAUDE
        </div>
      </div>
    </Phone>
  );
}

// ─── 8.4 · Pass VIP / abonnement ───────────────────────────────
function MVIP() {
  return (
    <Phone bg="velvet">
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 50% at 50% 20%, var(--gold-22), transparent 60%)',
      }} />
      <Embers count={10} />
      <GoldDust count={16} opacity={0.5} />
      <MStatusBar />

      <div style={{ position: 'absolute', top: 58, right: 18, zIndex: 30 }}>
        <button style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'var(--surf-60)', border: '1px solid var(--gold-25)',
          color: 'var(--cream)', cursor: 'pointer', fontSize: 14, backdropFilter: 'blur(8px)',
        }}>✕</button>
      </div>

      {/* Crest */}
      <div style={{ padding: '52px 24px 0', textAlign: 'center' }}>
        <div style={{
          width: 88, height: 88, margin: '0 auto 20px', position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 20,
            background: 'linear-gradient(135deg, var(--gold-bright), var(--gold) 50%, var(--gold-deep))',
            transform: 'rotate(45deg)', border: '2px solid var(--gold)',
            boxShadow: '0 0 40px var(--gold-50), inset 0 2px 0 rgba(255,255,255,0.4)',
          }} />
          <span className="f-display" style={{ position: 'relative', fontSize: 32, color: '#1F1810', fontWeight: 800, letterSpacing: '-0.04em' }}>VIP</span>
        </div>
        <div className="eyebrow" style={{ marginBottom: 8 }}>CERCLE DES BANDI</div>
        <div className="f-display" style={{
          fontSize: 36, color: 'var(--cream)', fontWeight: 800,
          letterSpacing: '-0.03em', lineHeight: 1,
        }}>Pass VIP.</div>
        <div className="f-body" style={{ fontSize: 13, color: 'rgba(246,239,223,0.65)', marginTop: 10, lineHeight: 1.55, maxWidth: 280, margin: '10px auto 0' }}>
          Le statut, la classe, et un mois entier de privilèges. Annulable quand tu veux.
        </div>
      </div>

      {/* Perks */}
      <div style={{
        margin: '28px 20px 0', padding: '8px 4px', borderRadius: 18,
        background: 'rgba(0,0,0,0.35)',
        border: '1px solid var(--gold-25)',
        backdropFilter: 'blur(10px)',
      }}>
        <Perk glyph="★" title="Badge VIP partout" sub="Pseudo doré, vu par tout le monde" />
        <Perk glyph="🚫" title="Aucune pub" sub="Plus jamais de vidéo entre deux mains" />
        <Perk glyph="◆" title="Bonus quotidien ×1,5" sub="150 → 900 K selon le streak" />
        <Perk glyph="⚔" title="Accès tables VIP illimité" sub="Même si solde temporairement bas" />
        <Perk glyph="◯" title="Cosmétiques exclusifs" sub="2 dos par saison réservés aux VIP" last />
      </div>

      {/* Plans */}
      <div style={{ padding: '20px 20px 0', display: 'flex', gap: 10 }}>
        <PlanCard period="MENSUEL" price="1 500 F" sub="résiliable" />
        <PlanCard period="ANNUEL" price="12 000 F" sub="2 mois offerts" featured />
      </div>

      {/* CTA */}
      <div style={{ position: 'absolute', bottom: 28, left: 20, right: 20 }}>
        <button className="btn btn-gold" style={{ width: '100%', fontSize: 15, padding: '15px' }}>
          Activer · 12 000 F / an
        </button>
        <div className="f-mono" style={{ textAlign: 'center', fontSize: 8, color: 'rgba(246,239,223,0.4)', letterSpacing: '0.18em', marginTop: 10 }}>
          ESSAI 7 JOURS GRATUIT  ·  SANS ENGAGEMENT
        </div>
      </div>
    </Phone>
  );
}

function Perk({ glyph, title, sub, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 14px',
      borderBottom: last ? 'none' : '0.5px solid var(--gold-10)',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 10,
        background: 'var(--gold-15)',
        border: '1px solid var(--gold-30)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, color: 'var(--gold-bright)',
        flexShrink: 0,
      }}>{glyph}</div>
      <div style={{ flex: 1 }}>
        <div className="f-display" style={{ fontSize: 13, color: 'var(--cream)', fontWeight: 700 }}>{title}</div>
        <div className="f-body" style={{ fontSize: 11, color: 'rgba(246,239,223,0.55)', marginTop: 2, lineHeight: 1.4 }}>{sub}</div>
      </div>
    </div>
  );
}

function PlanCard({ period, price, sub, featured }) {
  return (
    <div style={{
      flex: 1, padding: 14, borderRadius: 14,
      background: featured ? 'linear-gradient(135deg, var(--gold-25), var(--gold-08))' : 'var(--surf-55)',
      border: `1.5px solid ${featured ? 'var(--gold-50)' : 'var(--gold-15)'}`,
      boxShadow: featured ? '0 0 18px var(--gold-30)' : 'none',
      cursor: 'pointer', position: 'relative',
    }}>
      {featured && (
        <div style={{
          position: 'absolute', top: -8, right: 12,
          padding: '2px 8px', borderRadius: 99,
          background: 'linear-gradient(180deg, var(--gold-bright), var(--gold-deep))',
          fontFamily: 'var(--font-mono)', fontSize: 7, color: '#1F1810', letterSpacing: '0.18em', fontWeight: 800,
        }}>★ MEILLEURE</div>
      )}
      <div className="f-mono" style={{ fontSize: 9, color: featured ? 'var(--gold-bright)' : 'rgba(246,239,223,0.5)', letterSpacing: '0.22em' }}>{period}</div>
      <div className="f-display" style={{ fontSize: 22, color: 'var(--cream)', fontWeight: 800, marginTop: 4, letterSpacing: '-0.01em' }}>{price}</div>
      <div className="f-body" style={{ fontSize: 10, color: 'rgba(246,239,223,0.55)', marginTop: 2 }}>{sub}</div>
    </div>
  );
}

Object.assign(window, {
  MTables, MRebuy, MAdReward, MDailyBonus, MMobileMoney, MTopupSuccess,
  MTournaments, MTournamentDetail, MGiftKora, MVIP,
});
