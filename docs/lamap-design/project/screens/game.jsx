/* global React, CardFace, CardBack, FlipCard, CardSlot, Avatar, MancheDots, RankBadge, StatusBar, GoldDust, TableBg, Sparks, Phone */

// ───────────────────────────────────────────────
// GAME SCREEN — animated full play
// ───────────────────────────────────────────────

// Sample deal
const PLAYER_HAND = [
  { rank: 7, suit: 'hearts'  },
  { rank: 3, suit: 'clubs'   },
  { rank: 6, suit: 'clubs'   },
  { rank: 7, suit: 'spades'  },
  { rank: 4, suit: 'diamonds'},
];
const OPP_HAND = [
  { rank: 9, suit: 'diamonds' },
  { rank: 9, suit: 'spades'   },
  { rank: 6, suit: 'hearts'   },
  { rank: 4, suit: 'spades'   },
  { rank: 3, suit: 'hearts'   },
];

// Phases:
// 'intro'    — empty table, deck on side
// 'dealing'  — cards fly from deck to player + opp
// 'idle'     — player can play
// 'playing'  — player card translates to center
// 'oppPlay'  — opp card flips & translates
// 'reveal'   — winner highlighted
// 'kora'     — kora reveal banner (optional)
// 'gameover' — final result

function GameScreen({ initialPhase = 'idle', autoPlay = false, scenario = 'standard' }) {
  const [phase, setPhase] = React.useState(initialPhase);
  const [playedIdx, setPlayedIdx] = React.useState(2); // which player card played
  const [round, setRound] = React.useState(scenario === 'kora' ? 4 : 0); // 0..4 (manche 5 = idx 4)
  const [wonRounds, setWonRounds] = React.useState(scenario === 'kora' ? [0, 1, 2, 3] : []);

  const playerCard = PLAYER_HAND[playedIdx];
  const oppCard = OPP_HAND[round] || OPP_HAND[2];

  return (
    <Phone>
      <StatusBar />
      <TableBg dust={true}>
        {/* HEADER — manche pips + flag */}
        <div style={{
          position: 'absolute', top: 47, left: 0, right: 0, height: 60,
          padding: '14px 18px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'linear-gradient(180deg, rgba(15,22,32,0.9), rgba(15,22,32,0.5))',
          borderBottom: '1px solid rgba(201,168,118,0.12)',
        }}>
          <MancheDots current={round} won={wonRounds} />
          <button style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6E2520, #8E2F2A)',
            border: '1px solid rgba(201,168,118,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <svg width="14" height="16" viewBox="0 0 14 16" fill="var(--cream)">
              <path d="M2 1 V 15 H 3 V 9 L 12 9 L 10 5 L 12 1 Z"/>
            </svg>
          </button>
        </div>

        {/* OPPONENT bar */}
        <div style={{
          position: 'absolute', top: 116, left: 18, right: 18,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar initials="LG" size={36} />
            <div>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
                color: 'var(--cream)',
              }}>Le Grand Bandi</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <div style={{
                  padding: '2px 8px', borderRadius: 99,
                  background: 'rgba(166,130,88,0.18)',
                  border: '1px solid rgba(201,168,118,0.35)',
                  color: 'var(--or-2)',
                  fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600, letterSpacing: '0.1em',
                }}>♔ À LA MAIN</div>
              </div>
            </div>
          </div>
          {/* opponent face-down hand */}
          <div style={{ display: 'flex', gap: 2 }}>
            {Array.from({ length: 5 - Math.max(0, round - 1) }).map((_, i) => (
              <div key={i} style={{
                transform: `translateY(${i * 0}px) rotate(${(i - 2) * 2}deg)`,
              }}>
                <CardBack size="xs" />
              </div>
            ))}
          </div>
        </div>

        {/* CARTE DEMANDÉE chip (when reveal phase) */}
        {(phase === 'reveal' || phase === 'oppPlay') && (
          <div style={{
            position: 'absolute', top: 200, left: '50%', transform: 'translateX(-50%)',
            padding: '6px 14px', borderRadius: 99,
            background: 'rgba(15,22,32,0.85)',
            border: '1px solid rgba(201,168,118,0.25)',
            display: 'flex', alignItems: 'center', gap: 8,
            animation: 'lamap-rise 0.4s ease-out',
          }}>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(245,242,237,0.85)',
            }}>Carte demandée</span>
            <span style={{ fontSize: 14, color: '#B4443E' }}>♥</span>
          </div>
        )}

        {/* TABLE — opponent card + VS coin + player card */}
        <div style={{
          position: 'absolute', top: 240, left: 0, right: 0, height: 220,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 14,
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.25em',
              color: 'rgba(245,242,237,0.5)', marginBottom: 8,
            }}>ADVERSAIRE</div>
            {phase === 'idle' || phase === 'playing' ? (
              <CardSlot size="md" />
            ) : (
              <div style={{ animation: 'lamap-rise 0.4s ease-out' }}>
                <CardFace rank={oppCard.rank} suit={oppCard.suit} size="md" />
              </div>
            )}
          </div>

          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'linear-gradient(135deg, #C9A876, #6E5536)',
            border: '2px solid #6E5536',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#1F1810', fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 12, boxShadow: '0 0 20px rgba(232,200,121,0.4)',
          }}>VS</div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.25em',
              color: 'rgba(245,242,237,0.5)', marginBottom: 8,
            }}>VOUS</div>
            {phase === 'idle' ? (
              <CardSlot size="md" />
            ) : (
              <div style={{ animation: 'lamap-rise 0.4s 0.1s ease-out backwards' }}>
                <CardFace rank={playerCard.rank} suit={playerCard.suit} size="md" />
              </div>
            )}
          </div>
        </div>

        {/* Status indicator */}
        {(phase === 'idle' || phase === 'playing') && (
          <div style={{
            position: 'absolute', top: 480, left: '50%', transform: 'translateX(-50%)',
          }}>
            <div style={{
              padding: '10px 18px', borderRadius: 99,
              background: 'linear-gradient(180deg, #C95048 0%, #A93934 100%)',
              boxShadow: '0 6px 20px rgba(180,68,62,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', gap: 8,
              animation: 'lamap-pulse 2s ease-in-out infinite',
            }}>
              <span style={{ fontSize: 16 }}>♛</span>
              <span style={{
                color: 'var(--cream)', fontFamily: 'var(--font-body)',
                fontWeight: 600, fontSize: 14,
              }}>À vous de jouer</span>
            </div>
          </div>
        )}

        {/* PLAYER HAND — fanned cards at bottom */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 200,
          background: 'linear-gradient(180deg, transparent, rgba(15,22,32,0.6))',
        }}>
          <div style={{
            position: 'absolute', bottom: -40, left: 0, right: 0,
            display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
          }}>
            {PLAYER_HAND.map((c, i) => {
              const offset = (i - 2) * 56;
              const rot = (i - 2) * 6;
              const lift = Math.abs(i - 2) * 4;
              const isPlayed = (phase !== 'idle' && phase !== 'dealing') && i === playedIdx;
              const isPlayable = c.suit === 'hearts' || phase === 'idle';
              return (
                <div key={i} style={{
                  position: 'absolute',
                  transform: `translateX(${offset}px) translateY(${lift}px) rotate(${rot}deg)`,
                  opacity: isPlayed ? 0.25 : 1,
                  transition: 'transform 200ms ease, opacity 200ms ease',
                  filter: !isPlayable && phase === 'idle' ? 'grayscale(0.5) brightness(0.7)' : 'none',
                }}>
                  <CardFace rank={c.rank} suit={c.suit} size="lg" />
                </div>
              );
            })}
          </div>
        </div>

        {/* KORA banner overlay */}
        {phase === 'kora' && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(110,37,32,0.9) 0%, rgba(15,22,32,0.95) 70%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'lamap-rise 0.3s ease-out',
            zIndex: 10,
          }}>
            <Sparks count={32} />
            <div style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '0.4em',
                color: 'var(--or-2)', marginBottom: 12,
              }}>VICTOIRE SPÉCIALE</div>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 84,
                color: 'var(--or-2)', letterSpacing: '-0.05em', lineHeight: 0.9,
                textShadow: '0 0 40px rgba(232,200,121,0.6)',
              }}>KORA</div>
              <div style={{
                marginTop: 12,
                display: 'inline-flex', alignItems: 'center', gap: 12,
                padding: '8px 22px', borderRadius: 99,
                background: 'linear-gradient(135deg, #C9A876, #6E5536)',
                boxShadow: '0 0 30px rgba(232,200,121,0.5)',
              }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28,
                  color: '#1F1810', letterSpacing: '-0.02em',
                }}>×2</div>
              </div>
              <div style={{
                fontFamily: 'var(--font-body)', fontSize: 14,
                color: 'rgba(245,242,237,0.85)', marginTop: 18, maxWidth: 280,
              }}>Tu remportes la 5ème manche avec un 3.<br/>Tes gains sont doublés.</div>
            </div>
          </div>
        )}
      </TableBg>
    </Phone>
  );
}

// ───────────────────────────────────────────────
// END OF GAME — defeat / victory variations
// ───────────────────────────────────────────────

function GameDefeat() {
  return (
    <Phone>
      <StatusBar />
      <TableBg dust={false}>
        <div style={{
          position: 'absolute', top: 47, left: 0, right: 0, height: 60,
          padding: '14px 18px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'linear-gradient(180deg, rgba(15,22,32,0.9), rgba(15,22,32,0.5))',
          borderBottom: '1px solid rgba(201,168,118,0.12)',
        }}>
          <MancheDots current={4} won={[0, 2]} />
        </div>

        {/* Opponent bar */}
        <div style={{
          position: 'absolute', top: 116, left: 18, right: 18,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Avatar initials="LG" size={36} />
          <div>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
              color: 'var(--cream)',
            }}>Le Grand Bandi</div>
            <div style={{
              display: 'inline-block',
              padding: '2px 8px', borderRadius: 99, marginTop: 4,
              background: 'rgba(166,130,88,0.18)',
              border: '1px solid rgba(201,168,118,0.35)',
              color: 'var(--or-2)',
              fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600, letterSpacing: '0.1em',
            }}>♔ A LA MAIN</div>
          </div>
        </div>

        {/* Card stacks */}
        <div style={{
          position: 'absolute', top: 200, left: 0, right: 0, height: 240,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
        }}>
          {/* Opponent stack */}
          <div style={{ position: 'relative', width: 100, height: 200 }}>
            {[
              { rank: 9, suit: 'diamonds', y: 0,   o: 0.4 },
              { rank: 9, suit: 'spades',   y: 14,  o: 0.4 },
              { rank: 6, suit: 'hearts',   y: 28,  o: 0.4 },
              { rank: 4, suit: 'spades',   y: 42,  o: 0.4 },
              { rank: 4, suit: 'diamonds', y: 70,  o: 1, big: true },
            ].map((c, i) => (
              <div key={i} style={{
                position: 'absolute', top: c.y, left: '50%',
                transform: 'translateX(-50%)',
                opacity: c.o,
                filter: c.o < 1 ? 'grayscale(0.4) brightness(0.6)' : 'none',
              }}>
                <CardFace rank={c.rank} suit={c.suit} size={c.big ? 'md' : 'sm'} />
              </div>
            ))}
          </div>

          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: 'rgba(166,130,88,0.2)', border: '1px solid rgba(201,168,118,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--or-2)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11,
          }}>VS</div>

          {/* Player stack */}
          <div style={{ position: 'relative', width: 100, height: 200 }}>
            {[
              { rank: 3, suit: 'hearts',   y: 0,  o: 0.4 },
              { rank: 6, suit: 'clubs',    y: 14, o: 0.4 },
              { rank: 7, suit: 'spades',   y: 28, o: 0.4 },
              { rank: 3, suit: 'clubs',    y: 42, o: 0.4 },
              { rank: 7, suit: 'hearts',   y: 70, o: 1, big: true },
            ].map((c, i) => (
              <div key={i} style={{
                position: 'absolute', top: c.y, left: '50%',
                transform: 'translateX(-50%)',
                opacity: c.o,
                filter: c.o < 1 ? 'grayscale(0.4) brightness(0.6)' : 'none',
              }}>
                <CardFace rank={c.rank} suit={c.suit} size={c.big ? 'md' : 'sm'} />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom defeat panel */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '24px 24px 36px',
          background: 'linear-gradient(180deg, rgba(15,22,32,0) 0%, rgba(15,22,32,0.95) 30%)',
          borderTop: '1px solid rgba(201,168,118,0.18)',
        }}>
          {/* corner ornaments */}
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{
              position: 'absolute',
              [i < 2 ? 'top' : 'bottom']: 14,
              [i % 2 === 0 ? 'left' : 'right']: 14,
              width: 20, height: 20,
              borderTop: i < 2 ? '1.5px solid var(--or)' : 'none',
              borderBottom: i >= 2 ? '1.5px solid var(--or)' : 'none',
              borderLeft: i % 2 === 0 ? '1.5px solid var(--or)' : 'none',
              borderRight: i % 2 === 1 ? '1.5px solid var(--or)' : 'none',
              opacity: 0.6,
            }} />
          ))}

          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 30,
            color: 'var(--cream)', textAlign: 'center', letterSpacing: '-0.02em',
          }}>Vous avez perdu <span>💀</span></div>

          <div style={{ marginTop: 16, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(201,168,118,0.2)' }} />
            <div style={{ width: 6, height: 6, background: 'var(--or)', transform: 'rotate(45deg)' }} />
            <div style={{ flex: 1, height: 1, background: 'rgba(201,168,118,0.2)' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em',
              color: 'rgba(245,242,237,0.65)',
            }}>PERTE</div>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22,
              color: '#D4635D',
            }}>−12 PR</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button className="btn-primary" style={{ fontSize: 14 }}>Nouvelle partie</button>
            <button className="btn-ghost" style={{ fontSize: 14 }}>Revanche</button>
          </div>
          <div style={{
            textAlign: 'center', marginTop: 14,
            color: 'rgba(245,242,237,0.55)',
            fontFamily: 'var(--font-body)', fontSize: 13,
          }}>← Retour à l'accueil</div>
        </div>
      </TableBg>
    </Phone>
  );
}

function GameVictory() {
  return (
    <Phone>
      <StatusBar />
      <TableBg dust={true}>
        <Sparks count={26} />
        <div style={{
          position: 'absolute', top: 47, left: 0, right: 0, height: 60,
          padding: '14px 18px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <MancheDots current={4} won={[0, 1, 3, 4]} />
        </div>

        {/* Trophy region */}
        <div style={{
          position: 'absolute', top: 120, left: 0, right: 0, textAlign: 'center',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.4em',
            color: 'var(--or-2)',
          }}>VICTOIRE</div>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 56,
            color: 'var(--cream)', letterSpacing: '-0.04em', marginTop: 4, lineHeight: 1,
            textShadow: '0 0 30px rgba(232,200,121,0.4)',
          }}>BANDI !</div>
        </div>

        {/* Winning card highlighted */}
        <div style={{
          position: 'absolute', top: 240, left: '50%', transform: 'translateX(-50%)',
          filter: 'drop-shadow(0 0 30px rgba(232,200,121,0.7))',
          animation: 'lamap-glow-or 2.5s ease-in-out infinite',
        }}>
          <CardFace rank={10} suit="hearts" size="xl" />
        </div>

        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '24px 24px 36px',
          background: 'linear-gradient(180deg, transparent, rgba(15,22,32,0.95) 25%)',
          borderTop: '1px solid rgba(201,168,118,0.3)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em', color: 'rgba(245,242,237,0.6)' }}>RANG</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--or-2)' }}>Tacticien → Maître</div>
          </div>
          <div style={{
            height: 8, borderRadius: 99,
            background: 'rgba(166,130,88,0.18)',
            overflow: 'hidden', position: 'relative', marginBottom: 14,
          }}>
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: '78%',
              background: 'linear-gradient(90deg, #C9A876, #E8C879)',
              boxShadow: '0 0 12px rgba(232,200,121,0.7)',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em', color: 'rgba(245,242,237,0.6)' }}>GAIN</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--or-2)' }}>+24 PR</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button className="btn-primary" style={{ fontSize: 14 }}>Encore</button>
            <button className="btn-ghost" style={{ fontSize: 14 }}>Partager</button>
          </div>
        </div>
      </TableBg>
    </Phone>
  );
}

// Game in "Kora reveal" phase
function GameKora() {
  return <GameScreen initialPhase="kora" scenario="kora" />;
}

// Game during play (reveal phase)
function GamePlay() {
  return <GameScreen initialPhase="reveal" />;
}

// Game waiting for player
function GameIdle() {
  return <GameScreen initialPhase="idle" />;
}

Object.assign(window, { GameScreen, GameDefeat, GameVictory, GameKora, GamePlay, GameIdle });
