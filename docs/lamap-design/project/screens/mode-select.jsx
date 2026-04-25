/* global React, RankBadge, RANKS, Avatar, StatusBar, GoldDust, Phone, CardBack */

// ───────────────────────────────────────────────
// MODE SELECT — 3 variations
// ───────────────────────────────────────────────

function ModeFidele() {
  // V1 — basé sur ton screenshot, affiné
  return (
    <Phone>
      <StatusBar />
      <div className="bg-deep" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <GoldDust count={10} opacity={0.3} />
        {/* top bar */}
        <div style={{
          position: 'absolute', top: 47, left: 0, right: 0,
          padding: '14px 20px', display: 'flex', justifyContent: 'space-between',
          borderBottom: '1px solid rgba(201,168,118,0.12)',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--or-2)',
          }}>
            <svg width="18" height="20" viewBox="0 0 18 20" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M9 2 C 5 2 3 4 3 9 V 13 L 1 16 H 17 L 15 13 V 9 C 15 4 13 2 9 2 Z" />
              <path d="M7 17 C 7 18 8 19 9 19 C 10 19 11 18 11 17" />
            </svg>
          </div>
          <div style={{
            color: 'var(--or-2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="10" cy="10" r="2.5" />
              <path d="M10 1 v 3 M10 16 v 3 M1 10 h 3 M16 10 h 3 M3.5 3.5 l 2 2 M14.5 14.5 l 2 2 M3.5 16.5 l 2 -2 M14.5 5.5 l 2 -2" />
            </svg>
          </div>
        </div>

        <div style={{ position: 'absolute', top: 130, left: 0, right: 0, textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 36, color: 'var(--cream)',
            letterSpacing: '-0.03em',
          }}>Choisir un mode</div>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 15,
            color: 'rgba(245,242,237,0.55)', marginTop: 6,
          }}>Comment voulez-vous jouer ?</div>
        </div>

        <div style={{ position: 'absolute', top: 230, left: 20, right: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Classé — selected */}
          <div style={{
            padding: 18,
            background: 'linear-gradient(180deg, rgba(166,130,88,0.15), rgba(166,130,88,0.05))',
            border: '1.5px solid var(--or)',
            borderRadius: 18,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, right: 0,
              width: 100, height: 100,
              background: 'radial-gradient(circle, rgba(232,200,121,0.25), transparent 70%)',
            }} />
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 12,
                background: 'linear-gradient(135deg, #C9A876, #6E5536)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.3), 0 4px 12px rgba(166,130,88,0.4)',
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1F1810" strokeWidth="2">
                  <path d="M6 4 H 18 V 9 C 18 12 16 14 12 14 C 8 14 6 12 6 9 Z" fill="#1F1810" fillOpacity="0.15"/>
                  <path d="M4 5 V 7 C 4 9 5 10 6 10" />
                  <path d="M20 5 V 7 C 20 9 19 10 18 10" />
                  <path d="M9 14 L 9 19 H 15 L 15 14" />
                  <path d="M7 20 H 17" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontWeight: 700,
                    fontSize: 22, color: 'var(--cream)',
                  }}>Mode Classé</div>
                  <div style={{ transform: 'scale(0.7)', transformOrigin: 'left' }}>
                    <RankBadge rank="Tacticien" size={32} />
                  </div>
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)', fontSize: 13,
                  color: 'rgba(245,242,237,0.65)', marginTop: 4,
                }}>
                  Gratuit · Affecte votre classement · <span style={{ color: 'var(--or-2)', fontWeight: 600 }}>551 PR</span>
                </div>
                <div style={{
                  marginTop: 12,
                  fontFamily: 'var(--font-body)', fontSize: 13,
                  color: 'rgba(245,242,237,0.78)', lineHeight: 1.7,
                }}>
                  <div>✓ Matchmaking par rang</div>
                  <div>✓ Progression compétitive</div>
                  <div>✓ Sans mise d'argent</div>
                </div>
              </div>
            </div>
            <button className="btn-primary" style={{ width: '100%', marginTop: 14 }}>
              Jouer en Classé
            </button>
          </div>

          {/* Mode IA */}
          <div style={{
            padding: 18,
            background: 'rgba(46,61,77,0.45)',
            border: '1px solid rgba(201,168,118,0.18)',
            borderRadius: 18,
          }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 12,
                background: 'rgba(46,61,77,0.8)',
                border: '1px solid rgba(201,168,118,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--or-2)',
              }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="5" y="5" width="14" height="14" rx="2" />
                  <rect x="9" y="9" width="6" height="6" />
                  <path d="M5 9 H 2 M5 15 H 2 M22 9 H 19 M22 15 H 19 M9 5 V 2 M15 5 V 2 M9 22 V 19 M15 22 V 19" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700,
                  fontSize: 22, color: 'var(--cream)',
                }}>Mode IA</div>
                <div style={{
                  fontFamily: 'var(--font-body)', fontSize: 13,
                  color: 'rgba(245,242,237,0.55)', marginTop: 4,
                }}>Entraînement · Sans classement</div>
                <div style={{
                  marginTop: 12,
                  fontFamily: 'var(--font-body)', fontSize: 13,
                  color: 'rgba(245,242,237,0.7)', lineHeight: 1.7,
                }}>
                  <div>✓ Pratiquez sans risque</div>
                  <div>✓ 3 niveaux de difficulté</div>
                  <div>✓ N'affecte pas votre classement</div>
                </div>
              </div>
            </div>
            <button className="btn-light" style={{ width: '100%', marginTop: 14 }}>
              S'entraîner
            </button>
          </div>
        </div>

        <div style={{
          position: 'absolute', bottom: 30, left: 0, right: 0, textAlign: 'center',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            color: 'rgba(245,242,237,0.65)',
            fontFamily: 'var(--font-body)', fontSize: 14,
          }}>
            ← Retour
          </div>
        </div>
      </div>
    </Phone>
  );
}

function ModeArene() {
  // V2 — Style "carte de jeu" : chaque mode = une carte qu'on choisit, gros visuel
  const modes = [
    {
      key: 'ranked', label: 'Classé', sub: 'Compétitif',
      icon: '♔', stats: '551 PR · Tacticien',
      cta: 'Affronter', color: '#B4443E', accent: '#C9A876',
    },
    {
      key: 'ai', label: 'IA', sub: 'Entraînement',
      icon: '◆', stats: '3 niveaux',
      cta: 'S\'entraîner', color: '#465D74', accent: '#5A7A96',
    },
    {
      key: 'wager', label: 'Mise', sub: 'Duel à enjeu',
      icon: '◉', stats: 'Bientôt — Beta', locked: true,
      cta: 'Rejoindre la liste', color: '#6E5536', accent: '#C9A876',
    },
  ];
  return (
    <Phone>
      <StatusBar />
      <div className="bg-deep" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <GoldDust count={10} opacity={0.3} />

        <div style={{ position: 'absolute', top: 100, left: 24, right: 24 }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.3em',
            color: 'var(--or-2)',
          }}>ÉTAPE 1 / 2</div>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 38, color: 'var(--cream)',
            letterSpacing: '-0.035em', marginTop: 6, lineHeight: 1,
          }}>Choisis ton<br/>arène.</div>
        </div>

        <div style={{ position: 'absolute', top: 250, left: 20, right: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {modes.map(m => (
            <div key={m.key} style={{
              position: 'relative',
              padding: '18px 18px 18px 90px',
              borderRadius: 18, minHeight: 96,
              background: `linear-gradient(110deg, ${m.color}26 0%, rgba(46,61,77,0.4) 60%)`,
              border: `1px solid ${m.accent}40`,
              overflow: 'hidden',
              opacity: m.locked ? 0.7 : 1,
            }}>
              {/* big icon */}
              <div style={{
                position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                width: 60, height: 60, borderRadius: 14,
                background: `radial-gradient(circle, ${m.color}, ${m.color}aa)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: m.accent, fontSize: 30,
                boxShadow: `inset 0 -2px 6px rgba(0,0,0,0.4), 0 4px 16px ${m.color}55`,
                fontFamily: 'var(--font-display)', fontWeight: 700,
              }}>{m.icon}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <div style={{
                      fontFamily: 'var(--font-display)', fontWeight: 700,
                      fontSize: 22, color: 'var(--cream)',
                    }}>{m.label}</div>
                    {m.locked && (
                      <div style={{
                        padding: '2px 8px', borderRadius: 99,
                        background: 'rgba(0,0,0,0.4)',
                        color: 'var(--or-2)',
                        fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.15em',
                      }}>BIENTÔT</div>
                    )}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-body)', fontSize: 12,
                    color: 'rgba(245,242,237,0.55)', marginTop: 2,
                  }}>{m.sub}</div>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 11,
                    color: m.accent, marginTop: 8, letterSpacing: '0.04em',
                  }}>{m.stats}</div>
                </div>
                {!m.locked && (
                  <div style={{
                    color: m.accent, fontSize: 22, fontFamily: 'var(--font-display)',
                  }}>→</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Phone>
  );
}

function ModeMinimal() {
  // V3 — minimal, focus sur la stat du joueur en haut
  return (
    <Phone>
      <StatusBar />
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden',
        background: '#0F1620',
      }}>
        <div style={{ position: 'absolute', top: 70, left: 20, right: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar initials="EM" size={40} />
              <div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 600,
                  fontSize: 15, color: 'var(--cream)',
                }}>Emma · Tacticien</div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--or-2)',
                }}>551 PR · 12W 4L</div>
              </div>
            </div>
            <div style={{
              width: 36, height: 36, borderRadius: 99,
              background: 'rgba(166,130,88,0.12)', border: '1px solid rgba(201,168,118,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--or-2)', fontFamily: 'var(--font-display)', fontSize: 18,
            }}>⚙</div>
          </div>
        </div>

        <div style={{ position: 'absolute', top: 160, left: 20, right: 20, textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 30, color: 'var(--cream)', letterSpacing: '-0.03em',
          }}>Comment voulez-vous<br/>jouer aujourd'hui ?</div>
        </div>

        <div style={{ position: 'absolute', top: 290, left: 20, right: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { l: 'Classé', s: 'Affronter au niveau Tacticien', c: '#B4443E', big: true },
            { l: 'IA', s: 'Pratiquer sans pression', c: 'transparent' },
            { l: 'Mise', s: 'Bientôt — Duel à enjeu Kora', c: 'transparent', locked: true },
          ].map((it, i) => (
            <div key={i} style={{
              padding: '16px 18px', borderRadius: 14,
              background: it.big ? 'linear-gradient(180deg, #C95048 0%, #A93934 100%)' : 'rgba(255,255,255,0.04)',
              border: it.big ? 'none' : '1px solid rgba(255,255,255,0.08)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              opacity: it.locked ? 0.55 : 1,
            }}>
              <div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700,
                  fontSize: 19, color: 'var(--cream)',
                }}>{it.l}</div>
                <div style={{
                  fontFamily: 'var(--font-body)', fontSize: 13,
                  color: it.big ? 'rgba(255,255,255,0.85)' : 'rgba(245,242,237,0.55)',
                  marginTop: 2,
                }}>{it.s}</div>
              </div>
              <div style={{
                color: it.big ? 'var(--cream)' : 'var(--or-2)', fontSize: 22,
              }}>{it.locked ? '🔒' : '→'}</div>
            </div>
          ))}
        </div>

        <div style={{
          position: 'absolute', bottom: 50, left: 0, right: 0, textAlign: 'center',
          fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(245,242,237,0.5)',
        }}>
          ← Retour
        </div>
      </div>
    </Phone>
  );
}

Object.assign(window, { ModeFidele, ModeArene, ModeMinimal });
