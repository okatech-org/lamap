/* global React, Avatar, RankBadge, StatusBar, GoldDust, Phone, CardBack */

// ───────────────────────────────────────────────
// LOBBY / MATCHMAKING — 3 variations
// ───────────────────────────────────────────────

function LobbyMatchmaking() {
  // V1 — Recherche d'adversaire (animation pulse + rangs)
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 800);
    return () => clearInterval(id);
  }, []);
  return (
    <Phone>
      <StatusBar />
      <div className="bg-deep" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <GoldDust count={14} opacity={0.4} />

        <div style={{
          position: 'absolute', top: 70, left: 20, right: 20,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ color: 'var(--or-2)', fontSize: 22 }}>×</div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em',
            color: 'var(--or-2)',
          }}>RECHERCHE EN COURS</div>
          <div style={{ width: 22 }} />
        </div>

        {/* Center pulse */}
        <div style={{
          position: 'absolute', top: 160, left: '50%', transform: 'translateX(-50%)',
          width: 240, height: 240,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              position: 'absolute', borderRadius: '50%',
              border: '1px solid rgba(201,168,118,0.4)',
              animation: `lamap-pulse 2.4s ${i * 0.6}s ease-out infinite`,
              width: 240 - i * 0,
              height: 240 - i * 0,
              opacity: 0.6 - i * 0.18,
            }} />
          ))}
          <div style={{
            width: 110, height: 110, borderRadius: '50%',
            background: 'radial-gradient(circle, #C95048, #6E2520)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 50px rgba(201,80,72,0.5)',
            border: '2px solid rgba(201,168,118,0.5)',
          }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: 38, color: 'var(--cream)',
              letterSpacing: '-0.03em',
            }}>VS</div>
          </div>
        </div>

        <div style={{
          position: 'absolute', top: 430, left: 0, right: 0, textAlign: 'center',
        }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26,
            color: 'var(--cream)', letterSpacing: '-0.025em',
          }}>Recherche d'un adversaire</div>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 14,
            color: 'rgba(245,242,237,0.6)', marginTop: 6,
          }}>{['Estimation', 'Estimation.', 'Estimation..', 'Estimation...'][tick % 4]} ~ 12 sec</div>
        </div>

        <div style={{
          position: 'absolute', top: 510, left: 20, right: 20,
          padding: 16, borderRadius: 14,
          background: 'rgba(46,61,77,0.5)',
          border: '1px solid rgba(201,168,118,0.18)',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em',
            color: 'rgba(245,242,237,0.5)', marginBottom: 10,
          }}>VOTRE FILTRE</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ color: 'var(--cream)', fontSize: 13 }}>Mode</div>
            <div style={{ color: 'var(--or-2)', fontSize: 13, fontWeight: 600 }}>Classé</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ color: 'var(--cream)', fontSize: 13 }}>Rang adverse</div>
            <div style={{ color: 'var(--or-2)', fontSize: 13, fontWeight: 600 }}>± 100 PR</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: 'var(--cream)', fontSize: 13 }}>Région</div>
            <div style={{ color: 'var(--or-2)', fontSize: 13, fontWeight: 600 }}>Afrique Centrale</div>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 50, left: 20, right: 20 }}>
          <button className="btn-ghost" style={{ width: '100%' }}>Annuler la recherche</button>
        </div>
      </div>
    </Phone>
  );
}

function LobbyHome() {
  // V2 — Home / lobby principal après auth
  return (
    <Phone>
      <StatusBar />
      <div className="bg-deep" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <GoldDust count={10} opacity={0.3} />

        {/* Top */}
        <div style={{
          position: 'absolute', top: 60, left: 20, right: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar initials="EM" size={40} />
            <div>
              <div style={{
                fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(245,242,237,0.5)',
              }}>Salut,</div>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
                color: 'var(--cream)',
              }}>Emma</div>
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 99,
            background: 'rgba(166,130,88,0.15)',
            border: '1px solid rgba(201,168,118,0.3)',
          }}>
            <div style={{
              width: 14, height: 14, borderRadius: '50%',
              background: 'radial-gradient(circle, #E8C879, #6E5536)',
            }} />
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600,
              color: 'var(--or-2)',
            }}>1 250</div>
          </div>
        </div>

        {/* Hero card — quick play */}
        <div style={{
          position: 'absolute', top: 130, left: 20, right: 20,
          padding: 22, borderRadius: 22,
          background: 'linear-gradient(135deg, #C95048 0%, #6E2520 100%)',
          overflow: 'hidden', position: 'absolute',
          boxShadow: '0 12px 40px rgba(180,68,62,0.4)',
        }}>
          <div style={{
            position: 'absolute', top: -40, right: -30,
            width: 180, height: 180,
            background: 'radial-gradient(circle, rgba(201,168,118,0.25), transparent 70%)',
          }} />
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.25em',
            color: 'rgba(245,242,237,0.7)',
          }}>PARTIE RAPIDE</div>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32,
            color: 'var(--cream)', letterSpacing: '-0.03em', marginTop: 6, lineHeight: 1.05,
          }}>Affronter<br/>maintenant</div>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 13,
            color: 'rgba(245,242,237,0.8)', marginTop: 8,
          }}>4 217 joueurs en ligne · ± 100 PR de toi</div>
          <button style={{
            marginTop: 16, padding: '12px 22px', borderRadius: 99,
            background: 'var(--cream)', color: '#6E2520',
            border: 'none', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15,
            cursor: 'pointer',
          }}>Lancer ↗</button>
        </div>

        {/* Mode tiles */}
        <div style={{ position: 'absolute', top: 380, left: 20, right: 20 }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.25em',
            color: 'var(--or-2)', marginBottom: 10,
          }}>MODES DE JEU</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { l: 'IA', s: '3 niveaux', icon: '◈', big: false },
              { l: 'Privé', s: 'Code partie', icon: '◇', big: false },
              { l: 'Mise', s: 'Beta · 4j', icon: '◉', big: false, locked: true },
              { l: 'Tournoi', s: 'Dimanche 18h', icon: '♔', big: false, hot: true },
            ].map((m, i) => (
              <div key={i} style={{
                padding: 14, borderRadius: 14,
                background: 'rgba(46,61,77,0.5)',
                border: '1px solid rgba(201,168,118,0.18)',
                position: 'relative',
                opacity: m.locked ? 0.6 : 1,
              }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: 22,
                  color: 'var(--or-2)',
                }}>{m.icon}</div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
                  color: 'var(--cream)', marginTop: 6,
                }}>{m.l}</div>
                <div style={{
                  fontFamily: 'var(--font-body)', fontSize: 11,
                  color: 'rgba(245,242,237,0.5)',
                }}>{m.s}</div>
                {m.hot && (
                  <div style={{
                    position: 'absolute', top: 10, right: 10,
                    width: 8, height: 8, borderRadius: '50%', background: '#D4635D',
                    boxShadow: '0 0 8px rgba(212,99,93,0.7)',
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom nav */}
        <div style={{
          position: 'absolute', bottom: 30, left: 20, right: 20,
          height: 60, borderRadius: 18,
          background: 'rgba(15,22,32,0.9)',
          border: '1px solid rgba(201,168,118,0.18)',
          backdropFilter: 'blur(20px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        }}>
          {[
            { l: 'Jouer', icon: '▶', active: true },
            { l: 'Classement', icon: '☷' },
            { l: 'Boutique', icon: '◈' },
            { l: 'Profil', icon: '○' },
          ].map((n, i) => (
            <div key={i} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              color: n.active ? 'var(--terre-2)' : 'rgba(245,242,237,0.5)',
            }}>
              <div style={{ fontSize: 18 }}>{n.icon}</div>
              <div style={{
                fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: n.active ? 600 : 400,
              }}>{n.l}</div>
            </div>
          ))}
        </div>
      </div>
    </Phone>
  );
}

function LobbyFound() {
  // V3 — Adversaire trouvé : animation reveal
  return (
    <Phone>
      <StatusBar />
      <div className="bg-deep" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <GoldDust count={20} opacity={0.6} />

        <div style={{
          position: 'absolute', top: 110, left: 0, right: 0, textAlign: 'center',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.3em',
            color: 'var(--or-2)',
          }}>ADVERSAIRE TROUVÉ</div>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32,
            color: 'var(--cream)', marginTop: 8, letterSpacing: '-0.03em',
          }}>Préparez-vous.</div>
        </div>

        {/* Player vs Player */}
        <div style={{
          position: 'absolute', top: 240, left: 0, right: 0,
          display: 'flex', justifyContent: 'space-between', padding: '0 28px',
          alignItems: 'center',
        }}>
          {/* You */}
          <div style={{ flex: 1, textAlign: 'center', animation: 'lamap-rise 0.4s ease-out' }}>
            <div style={{ display: 'inline-block', position: 'relative' }}>
              <Avatar initials="EM" size={88} />
              <div style={{
                position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%) scale(0.7)',
              }}>
                <RankBadge rank="Tacticien" size={36} />
              </div>
            </div>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17,
              color: 'var(--cream)', marginTop: 22,
            }}>Emma</div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--or-2)', marginTop: 2,
            }}>551 PR · 12W</div>
          </div>

          {/* VS */}
          <div style={{
            position: 'relative', width: 80, height: 80,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(232,200,121,0.3), transparent 70%)',
              animation: 'lamap-pulse 2s ease-in-out infinite',
            }} />
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 38,
              color: 'var(--or-2)', letterSpacing: '-0.05em',
              textShadow: '0 0 16px rgba(232,200,121,0.6)',
            }}>VS</div>
          </div>

          {/* Opponent */}
          <div style={{ flex: 1, textAlign: 'center', animation: 'lamap-rise 0.4s 0.1s ease-out backwards' }}>
            <div style={{ display: 'inline-block', position: 'relative' }}>
              <div style={{
                width: 88, height: 88, borderRadius: '50%',
                background: 'linear-gradient(135deg, #5A7A96, #2E3D4D)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--cream)', fontFamily: 'var(--font-display)', fontWeight: 700,
                fontSize: 32, border: '1.5px solid rgba(201,168,118,0.55)',
              }}>LG</div>
              <div style={{
                position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%) scale(0.7)',
              }}>
                <RankBadge rank="Maître" size={36} />
              </div>
            </div>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17,
              color: 'var(--cream)', marginTop: 22,
            }}>Le Grand Bandi</div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--or-2)', marginTop: 2,
            }}>720 PR · 47W</div>
          </div>
        </div>

        {/* Stakes panel */}
        <div style={{
          position: 'absolute', top: 480, left: 24, right: 24,
          padding: 16, borderRadius: 16,
          background: 'rgba(166,130,88,0.1)',
          border: '1px solid rgba(201,168,118,0.3)',
          display: 'flex', justifyContent: 'space-around',
          textAlign: 'center',
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em',
              color: 'rgba(245,242,237,0.5)',
            }}>EN JEU</div>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18,
              color: 'var(--or-2)', marginTop: 4,
            }}>+12 PR</div>
          </div>
          <div style={{ width: 1, background: 'rgba(201,168,118,0.2)' }} />
          <div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em',
              color: 'rgba(245,242,237,0.5)',
            }}>RISQUE</div>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18,
              color: '#D4635D', marginTop: 4,
            }}>−10 PR</div>
          </div>
          <div style={{ width: 1, background: 'rgba(201,168,118,0.2)' }} />
          <div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em',
              color: 'rgba(245,242,237,0.5)',
            }}>BONUS KORA</div>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18,
              color: 'var(--or-2)', marginTop: 4,
            }}>×2 — ×8</div>
          </div>
        </div>

        <div style={{
          position: 'absolute', bottom: 60, left: 0, right: 0, textAlign: 'center',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.25em',
            color: 'var(--or-2)', marginBottom: 8,
            animation: 'lamap-pulse 1s ease-in-out infinite',
          }}>DISTRIBUTION DANS 3</div>
        </div>
      </div>
    </Phone>
  );
}

Object.assign(window, { LobbyMatchmaking, LobbyHome, LobbyFound });
