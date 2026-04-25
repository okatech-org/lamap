/* global React, Avatar, RankBadge, RANKS, StatusBar, GoldDust, Phone, CardBack, CardFace */

// ───────────────────────────────────────────────
// PROFILE / RANKING — 3 variations
// ───────────────────────────────────────────────

function ProfileMain() {
  return (
    <Phone>
      <StatusBar />
      <div className="bg-deep" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <GoldDust count={10} opacity={0.3} />

        {/* Gradient header */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 320,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(180,68,62,0.4), transparent 60%)',
        }} />

        <div style={{ position: 'absolute', top: 70, left: 20, right: 20, display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ color: 'var(--or-2)', fontSize: 22 }}>←</div>
          <div style={{ color: 'var(--or-2)', fontSize: 18 }}>⋯</div>
        </div>

        <div style={{ position: 'absolute', top: 100, left: 0, right: 0, textAlign: 'center' }}>
          <div style={{ display: 'inline-block', position: 'relative' }}>
            <Avatar initials="EM" size={88} />
            <div style={{
              position: 'absolute', bottom: -10, right: -10, transform: 'scale(0.85)',
            }}>
              <RankBadge rank="Tacticien" size={48} />
            </div>
          </div>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26,
            color: 'var(--cream)', marginTop: 18,
          }}>Emma</div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em',
            color: 'var(--or-2)', marginTop: 4,
          }}>· TACTICIEN ·</div>
        </div>

        {/* Rank progress */}
        <div style={{ position: 'absolute', top: 290, left: 20, right: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--cream)' }}>551 PR</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(245,242,237,0.55)' }}>Maître à 700</div>
          </div>
          <div style={{
            height: 10, borderRadius: 99,
            background: 'rgba(166,130,88,0.15)',
            position: 'relative', overflow: 'hidden',
            border: '1px solid rgba(201,168,118,0.25)',
          }}>
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: '52%',
              background: 'linear-gradient(90deg, #B4443E, #C9A876)',
              boxShadow: '0 0 16px rgba(201,168,118,0.5)',
            }} />
          </div>
        </div>

        {/* Stats row */}
        <div style={{
          position: 'absolute', top: 360, left: 20, right: 20,
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
        }}>
          {[
            { l: 'Victoires', v: '24', s: 'sur 38' },
            { l: 'Win rate', v: '63%', s: '+4 cette semaine' },
            { l: 'Kora', v: '7', s: '×2: 5 · ×4: 2' },
          ].map((s, i) => (
            <div key={i} style={{
              padding: 12, borderRadius: 14,
              background: 'rgba(46,61,77,0.5)',
              border: '1px solid rgba(201,168,118,0.15)',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.15em', color: 'rgba(245,242,237,0.5)' }}>{s.l.toUpperCase()}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--cream)', marginTop: 4 }}>{s.v}</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--or-2)', marginTop: 2 }}>{s.s}</div>
            </div>
          ))}
        </div>

        {/* Recent matches */}
        <div style={{ position: 'absolute', top: 480, left: 20, right: 20 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.25em', color: 'var(--or-2)', marginBottom: 10 }}>5 DERNIÈRES PARTIES</div>
          {[
            { o: 'Le Grand Bandi', r: 'Maître', win: false, pts: -10, kora: false },
            { o: 'Anna K.',        r: 'Tacticien', win: true,  pts: +12, kora: true, mult: '×2' },
            { o: 'Patou237',       r: 'Initié', win: true, pts: +8, kora: false },
            { o: 'Jojo',           r: 'Tacticien', win: false, pts: -9, kora: false },
            { o: 'Mariam',         r: 'Initié', win: true, pts: +10, kora: false },
          ].map((m, i) => (
            <div key={i} style={{
              padding: '10px 12px', marginBottom: 6, borderRadius: 12,
              background: 'rgba(46,61,77,0.4)',
              border: '1px solid rgba(201,168,118,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 6, height: 28, borderRadius: 3,
                  background: m.win ? 'var(--or)' : 'var(--terre-2)',
                }} />
                <div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--cream)' }}>{m.o}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(245,242,237,0.5)' }}>{m.r}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {m.kora && <span style={{ padding: '2px 6px', borderRadius: 6, background: 'var(--or)', color: '#1F1810', fontSize: 9, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>KORA {m.mult}</span>}
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: m.win ? 'var(--or-2)' : '#D4635D' }}>{m.pts > 0 ? '+' : ''}{m.pts}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Phone>
  );
}

function ProfileLeaderboard() {
  const ranks = [
    { rk: 1, n: 'Maman Africa',   pts: 1842, r: 'Légende',     d: '+12' },
    { rk: 2, n: 'Le Grand Bandi', pts: 1654, r: 'Légende',     d: '+8'  },
    { rk: 3, n: 'Patou237',       pts: 1521, r: 'Grand Bandi', d: '−4'  },
    { rk: 4, n: 'Mariam',         pts: 1402, r: 'Grand Bandi', d: '+15' },
    { rk: 5, n: 'Anna K.',        pts: 1287, r: 'Grand Bandi', d: '+2'  },
  ];
  return (
    <Phone>
      <StatusBar />
      <div className="bg-deep" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <GoldDust count={12} opacity={0.4} />

        <div style={{ position: 'absolute', top: 70, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: 'var(--or-2)', fontSize: 22 }}>←</div>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--cream)',
          }}>Classement</div>
          <div style={{ width: 22 }} />
        </div>

        {/* Filter chips */}
        <div style={{ position: 'absolute', top: 116, left: 20, right: 20, display: 'flex', gap: 8 }}>
          {['Mondial', 'Cameroun', 'Amis'].map((f, i) => (
            <div key={i} style={{
              padding: '8px 14px', borderRadius: 99,
              background: i === 0 ? 'var(--terre)' : 'rgba(46,61,77,0.5)',
              border: i === 0 ? 'none' : '1px solid rgba(201,168,118,0.2)',
              color: i === 0 ? 'var(--cream)' : 'rgba(245,242,237,0.65)',
              fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
            }}>{f}</div>
          ))}
        </div>

        {/* Top 3 podium */}
        <div style={{
          position: 'absolute', top: 180, left: 20, right: 20, height: 200,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 8,
        }}>
          {[
            { rk: 2, n: 'Le Grand Bandi', pts: 1654, h: 130, color: '#8B95A3' },
            { rk: 1, n: 'Maman Africa',   pts: 1842, h: 165, color: '#E8C879' },
            { rk: 3, n: 'Patou237',       pts: 1521, h: 110, color: '#C9722F' },
          ].map((p) => (
            <div key={p.rk} style={{ flex: 1, textAlign: 'center' }}>
              <Avatar initials={p.n.split(' ').map(x => x[0]).join('').slice(0, 2)} size={48} />
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12,
                color: 'var(--cream)', marginTop: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{p.n}</div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, color: p.color, marginTop: 2,
              }}>{p.pts} PR</div>
              <div style={{
                marginTop: 6,
                height: p.h, width: '100%',
                background: `linear-gradient(180deg, ${p.color}80, ${p.color}30)`,
                borderRadius: '6px 6px 0 0',
                border: `1px solid ${p.color}80`,
                borderBottom: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32,
                color: p.color,
                position: 'relative',
                boxShadow: p.rk === 1 ? `0 0 30px ${p.color}80` : 'none',
              }}>{p.rk}</div>
            </div>
          ))}
        </div>

        {/* List */}
        <div style={{ position: 'absolute', top: 410, left: 20, right: 20 }}>
          {ranks.slice(2).map((p) => (
            <div key={p.rk} style={{
              padding: '10px 14px', marginBottom: 6, borderRadius: 12,
              background: 'rgba(46,61,77,0.5)',
              border: '1px solid rgba(201,168,118,0.12)',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 26, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
                color: 'rgba(245,242,237,0.4)', textAlign: 'center',
              }}>{p.rk}</div>
              <Avatar initials={p.n.split(' ').map(x => x[0]).join('').slice(0, 2)} size={32} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--cream)' }}>{p.n}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--or-2)' }}>{p.r}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--cream)' }}>{p.pts}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: p.d.startsWith('+') ? 'var(--or-2)' : '#D4635D' }}>{p.d}</div>
              </div>
            </div>
          ))}

          {/* You */}
          <div style={{
            padding: '12px 14px', marginTop: 12, borderRadius: 12,
            background: 'linear-gradient(180deg, rgba(180,68,62,0.18), rgba(180,68,62,0.05))',
            border: '1.5px solid var(--terre-2)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ width: 26, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--terre-2)', textAlign: 'center' }}>247</div>
            <Avatar initials="EM" size={32} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--cream)' }}>Toi</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--or-2)' }}>Tacticien</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--cream)' }}>551</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--or-2)' }}>+12</div>
            </div>
          </div>
        </div>
      </div>
    </Phone>
  );
}

function ProfileRanks() {
  // V3 — Tableau des rangs (la "ladder")
  return (
    <Phone>
      <StatusBar />
      <div className="bg-deep" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <GoldDust count={10} opacity={0.3} />

        <div style={{ position: 'absolute', top: 70, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: 'var(--or-2)', fontSize: 22 }}>←</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--cream)' }}>L'Échelle</div>
          <div style={{ width: 22 }} />
        </div>

        <div style={{ position: 'absolute', top: 120, left: 20, right: 20, textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.3em', color: 'var(--or-2)',
          }}>VOTRE RANG</div>
          <div style={{ marginTop: 12 }}>
            <RankBadge rank="Tacticien" size={72} showName points={551} />
          </div>
        </div>

        <div style={{ position: 'absolute', top: 320, left: 20, right: 20 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.25em', color: 'var(--or-2)', marginBottom: 12 }}>SIX RANGS, UNE SEULE LÉGENDE</div>
          {RANKS.map((r, i) => {
            const isCurrent = r.name === 'Tacticien';
            const ranges = ['0 – 199', '200 – 399', '400 – 699', '700 – 999', '1000 – 1499', '1500+'];
            return (
              <div key={r.name} style={{
                padding: '10px 14px', marginBottom: 6, borderRadius: 12,
                background: isCurrent ? 'rgba(180,68,62,0.18)' : 'rgba(46,61,77,0.5)',
                border: isCurrent ? '1.5px solid var(--terre-2)' : '1px solid rgba(201,168,118,0.12)',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{ transform: 'scale(0.65)', transformOrigin: 'center', margin: '-8px' }}>
                  <RankBadge rank={r.name} size={48} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--cream)' }}>{r.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: r.color }}>{ranges[i]} PR</div>
                </div>
                {isCurrent && (
                  <div style={{
                    padding: '3px 8px', borderRadius: 99, background: 'var(--terre)',
                    color: 'var(--cream)', fontFamily: 'var(--font-mono)', fontSize: 9,
                    fontWeight: 700, letterSpacing: '0.1em',
                  }}>VOUS</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Phone>
  );
}

Object.assign(window, { ProfileMain, ProfileLeaderboard, ProfileRanks });
