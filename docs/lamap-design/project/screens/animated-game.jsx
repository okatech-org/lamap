/* global React, CardFace, CardBack, FlipCard, Avatar, MancheDots, StatusBar, GoldDust, TableBg, Sparks, Phone */

// ───────────────────────────────────────────────
// ANIMATED PROTOTYPE — full game experience
// User can tap their cards. AI plays back. Dealing animation on mount.
// ───────────────────────────────────────────────

const PLAYER_DECK = [
  { rank: 7, suit: 'hearts'   },
  { rank: 3, suit: 'clubs'    },
  { rank: 6, suit: 'clubs'    },
  { rank: 7, suit: 'spades'   },
  { rank: 3, suit: 'hearts'   },  // kept for potential kora
];
const OPP_DECK = [
  { rank: 9, suit: 'diamonds' },
  { rank: 4, suit: 'spades'   },
  { rank: 6, suit: 'hearts'   },
  { rank: 5, suit: 'spades'   },
  { rank: 4, suit: 'diamonds' },
];

function AnimatedGame() {
  // hand state
  const [phase, setPhase] = React.useState('dealing'); // dealing -> idle -> playerPlayed -> oppPlayed -> reveal -> nextRound -> finished
  const [dealStep, setDealStep] = React.useState(0); // 0..10 progressing through dealing
  const [round, setRound] = React.useState(0);       // 0..4
  const [wonRounds, setWonRounds] = React.useState([]);
  const [playerHand, setPlayerHand] = React.useState(PLAYER_DECK.map((c, i) => ({ ...c, i, played: false })));
  const [oppHand, setOppHand] = React.useState(OPP_DECK.map((c, i) => ({ ...c, i, played: false })));
  const [playerPlayed, setPlayerPlayed] = React.useState(null);
  const [oppPlayed, setOppPlayed] = React.useState(null);
  const [oppFlipped, setOppFlipped] = React.useState(false);
  const [winner, setWinner] = React.useState(null); // 'player' | 'opp'
  const [koraReveal, setKoraReveal] = React.useState(false);
  const [hasMain, setHasMain] = React.useState('opp'); // who currently holds the lead — opp starts in scenario

  // Run dealing animation on mount
  React.useEffect(() => {
    if (phase === 'dealing') {
      const id = setInterval(() => {
        setDealStep(s => {
          if (s >= 10) {
            clearInterval(id);
            setTimeout(() => setPhase('idle'), 400);
            return 10;
          }
          return s + 1;
        });
      }, 180);
      return () => clearInterval(id);
    }
  }, [phase]);

  function playPlayerCard(idx) {
    if (phase !== 'idle') return;
    const card = playerHand[idx];
    if (!card || card.played) return;

    setPlayerPlayed(card);
    setPlayerHand(h => h.map((c, i) => i === idx ? { ...c, played: true } : c));
    setPhase('playerPlayed');

    // Opponent responds
    setTimeout(() => {
      // Pick: if opp has same suit, the lowest of that suit; else first available
      const liveOpp = oppHand.filter(c => !c.played);
      const sameSuit = liveOpp.filter(c => c.suit === card.suit).sort((a,b) => a.rank - b.rank);
      const oppCard = sameSuit[0] || liveOpp.sort((a,b) => a.rank - b.rank)[0];
      setOppPlayed(oppCard);
      setOppHand(h => h.map(c => c.i === oppCard.i ? { ...c, played: true } : c));
      setPhase('oppPlayed');
      // Flip after a beat
      setTimeout(() => {
        setOppFlipped(true);
        setTimeout(() => {
          // determine winner
          let w = 'opp';
          if (oppCard.suit === card.suit) {
            w = card.rank > oppCard.rank ? 'player' : 'opp';
          } else {
            w = 'player'; // opp couldn't follow suit -> didn't take the hand
          }
          setWinner(w);
          setHasMain(w);
          setPhase('reveal');
          setWonRounds(prev => w === 'player' ? [...prev, round] : prev);

          // Move on to next round / finish
          setTimeout(() => {
            // If 5th round completed -> finish (and check kora)
            if (round >= 4) {
              // last round: check kora
              if (w === 'player' && card.rank === 3) {
                setKoraReveal(true);
                setTimeout(() => setPhase('finished'), 2400);
              } else {
                setPhase('finished');
              }
            } else {
              setRound(r => r + 1);
              setPlayerPlayed(null);
              setOppPlayed(null);
              setOppFlipped(false);
              setWinner(null);
              setPhase('idle');
            }
          }, 1600);
        }, 600);
      }, 700);
    }, 800);
  }

  function reset() {
    setPhase('dealing');
    setDealStep(0);
    setRound(0);
    setWonRounds([]);
    setPlayerHand(PLAYER_DECK.map((c, i) => ({ ...c, i, played: false })));
    setOppHand(OPP_DECK.map((c, i) => ({ ...c, i, played: false })));
    setPlayerPlayed(null); setOppPlayed(null);
    setOppFlipped(false); setWinner(null);
    setKoraReveal(false);
    setHasMain('opp');
  }

  // Compute fan layout
  const playerFanXBase = 0; // anchor, transformed below

  return (
    <Phone>
      <StatusBar />
      <TableBg dust>

        {/* Header */}
        <div style={{
          position: 'absolute', top: 47, left: 0, right: 0, height: 60,
          padding: '14px 18px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'linear-gradient(180deg, rgba(15,22,32,0.85), rgba(15,22,32,0.5))',
          borderBottom: '1px solid rgba(201,168,118,0.12)',
          zIndex: 5,
        }}>
          <MancheDots current={round} won={wonRounds} />
          <button onClick={reset} style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6E2520, #8E2F2A)',
            border: '1px solid rgba(201,168,118,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--cream)', cursor: 'pointer', fontSize: 14,
          }}>↻</button>
        </div>

        {/* Opponent bar */}
        <div style={{
          position: 'absolute', top: 116, left: 18, right: 18,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          zIndex: 5,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar initials="LG" size={36} />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--cream)' }}>Le Grand Bandi</div>
              {hasMain === 'opp' && (
                <div style={{
                  display: 'inline-block', padding: '2px 8px', borderRadius: 99, marginTop: 4,
                  background: 'rgba(166,130,88,0.18)', border: '1px solid rgba(201,168,118,0.35)',
                  color: 'var(--or-2)', fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600, letterSpacing: '0.1em',
                }}>♔ A LA MAIN</div>
              )}
            </div>
          </div>
          {/* Opp face-down hand */}
          <div style={{ display: 'flex', gap: 1 }}>
            {oppHand.filter(c => !c.played).map((c, i) => (
              <div key={c.i} style={{ transform: `rotate(${(i - 2) * 2}deg)` }}>
                <CardBack size="xs" />
              </div>
            ))}
          </div>
        </div>

        {/* Carte demandée chip */}
        {(phase === 'playerPlayed' || phase === 'oppPlayed' || phase === 'reveal') && playerPlayed && (
          <div style={{
            position: 'absolute', top: 200, left: '50%', transform: 'translateX(-50%)',
            padding: '6px 14px', borderRadius: 99,
            background: 'rgba(15,22,32,0.85)',
            border: '1px solid rgba(201,168,118,0.25)',
            display: 'flex', alignItems: 'center', gap: 8,
            animation: 'lamap-rise 0.3s ease-out',
            zIndex: 4,
          }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(245,242,237,0.85)' }}>Carte demandée</span>
            <span style={{ fontSize: 14, color: playerPlayed.suit === 'hearts' || playerPlayed.suit === 'diamonds' ? '#B4443E' : '#1A1A1A', filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.4))' }}>
              {playerPlayed.suit === 'hearts' ? '♥' : playerPlayed.suit === 'diamonds' ? '♦' : playerPlayed.suit === 'spades' ? '♠' : '♣'}
            </span>
          </div>
        )}

        {/* Center play area */}
        <div style={{
          position: 'absolute', top: 240, left: 0, right: 0, height: 220,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 14,
        }}>
          {/* Opp slot */}
          <div style={{ textAlign: 'center', width: 100 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.25em',
              color: 'rgba(245,242,237,0.5)', marginBottom: 8,
              opacity: phase === 'idle' || phase === 'playerPlayed' || phase === 'dealing' ? 1 : 0.3,
            }}>ADVERSAIRE</div>
            <div style={{
              minHeight: 124,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: winner === 'opp' && phase === 'reveal' ? 1 : (winner === 'player' && phase === 'reveal' ? 0.45 : 1),
              transition: 'opacity 400ms ease',
              filter: winner === 'opp' && phase === 'reveal' ? 'drop-shadow(0 0 24px rgba(232,200,121,0.7))' : 'none',
              transform: winner === 'opp' && phase === 'reveal' ? 'scale(1.08)' : 'scale(1)',
            }}>
              {!oppPlayed ? (
                <CardSlotEl size="md" />
              ) : (
                <FlipCard rank={oppPlayed.rank} suit={oppPlayed.suit} size="md" flipped={oppFlipped} duration={500} />
              )}
            </div>
          </div>

          {/* VS coin */}
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'linear-gradient(135deg, #C9A876, #6E5536)',
            border: '2px solid #6E5536',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#1F1810', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12,
            boxShadow: '0 0 20px rgba(232,200,121,0.4)',
          }}>VS</div>

          {/* Player slot */}
          <div style={{ textAlign: 'center', width: 100 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.25em',
              color: 'rgba(245,242,237,0.5)', marginBottom: 8,
              opacity: phase === 'idle' || phase === 'playerPlayed' || phase === 'dealing' ? 1 : 0.3,
            }}>VOUS</div>
            <div style={{
              minHeight: 124,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: winner === 'player' && phase === 'reveal' ? 1 : (winner === 'opp' && phase === 'reveal' ? 0.45 : 1),
              transition: 'opacity 400ms ease, transform 300ms ease',
              filter: winner === 'player' && phase === 'reveal' ? 'drop-shadow(0 0 24px rgba(232,200,121,0.7))' : 'none',
              transform: winner === 'player' && phase === 'reveal' ? 'scale(1.08)' : 'scale(1)',
            }}>
              {!playerPlayed ? (
                <CardSlotEl size="md" />
              ) : (
                <div style={{ animation: 'lamap-rise 0.35s cubic-bezier(.25,1.4,.55,1) backwards' }}>
                  <CardFace rank={playerPlayed.rank} suit={playerPlayed.suit} size="md" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status pill */}
        {phase === 'idle' && (
          <div style={{
            position: 'absolute', top: 480, left: '50%', transform: 'translateX(-50%)',
            zIndex: 5,
          }}>
            <div style={{
              padding: '10px 18px', borderRadius: 99,
              background: 'linear-gradient(180deg, #C95048 0%, #A93934 100%)',
              boxShadow: '0 6px 20px rgba(180,68,62,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', gap: 8,
              animation: 'lamap-pulse 2s ease-in-out infinite',
            }}>
              <span style={{ fontSize: 16 }}>♛</span>
              <span style={{ color: 'var(--cream)', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14 }}>À toi de jouer</span>
            </div>
          </div>
        )}

        {phase === 'reveal' && winner && (
          <div style={{
            position: 'absolute', top: 480, left: '50%', transform: 'translateX(-50%)',
            zIndex: 5,
            animation: 'lamap-rise 0.4s ease-out',
          }}>
            <div style={{
              padding: '10px 22px', borderRadius: 99,
              background: winner === 'player'
                ? 'linear-gradient(135deg, #C9A876, #6E5536)'
                : 'linear-gradient(135deg, #6E2520, #4A1815)',
              border: '1.5px solid rgba(201,168,118,0.5)',
              color: winner === 'player' ? '#1F1810' : 'var(--cream)',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
              letterSpacing: '0.05em',
              boxShadow: winner === 'player' ? '0 0 30px rgba(232,200,121,0.6)' : 'none',
            }}>
              {winner === 'player' ? '✓ Tu prends la main' : '✗ Il prend la main'}
            </div>
          </div>
        )}

        {phase === 'finished' && (
          <div style={{
            position: 'absolute', top: 470, left: 24, right: 24,
            zIndex: 5,
            animation: 'lamap-rise 0.4s ease-out',
          }}>
            <div style={{
              padding: 18, borderRadius: 16,
              background: wonRounds.includes(4)
                ? 'linear-gradient(135deg, rgba(232,200,121,0.25), rgba(46,61,77,0.6))'
                : 'linear-gradient(135deg, rgba(180,68,62,0.25), rgba(46,61,77,0.6))',
              border: `1.5px solid ${wonRounds.includes(4) ? 'var(--or)' : 'var(--terre-2)'}`,
              textAlign: 'center',
            }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22,
                color: 'var(--cream)', letterSpacing: '-0.02em',
              }}>{wonRounds.includes(4) ? 'Bandi !' : 'Tu as perdu'}</div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.15em',
                color: wonRounds.includes(4) ? 'var(--or-2)' : '#D4635D', marginTop: 4,
              }}>{wonRounds.includes(4) ? '+12 PR · victoire' : '−10 PR · défaite'}</div>
              <button onClick={reset} style={{
                marginTop: 12, padding: '10px 20px', borderRadius: 99,
                background: 'var(--cream)', color: '#1F1810',
                border: 'none', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13,
                cursor: 'pointer',
              }}>Rejouer</button>
            </div>
          </div>
        )}

        {/* Player hand fan */}
        <div style={{
          position: 'absolute', bottom: -30, left: 0, right: 0, height: 200,
          pointerEvents: phase === 'idle' ? 'auto' : 'none',
        }}>
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
          }}>
            {playerHand.map((c, i) => {
              const offset = (i - 2) * 56;
              const rot = (i - 2) * 6;
              const lift = Math.abs(i - 2) * 4;
              const dealing = phase === 'dealing' && dealStep < (i * 2 + 2);
              const isPlayable = phase === 'idle' && (
                // suit-following: player just played, opp leads (hasMain==='opp') => need to follow opp suit
                // first move of round: anything goes
                hasMain !== 'opp' || !playerPlayed || c.suit === (playerPlayed?.suit) || !playerHand.some(x => !x.played && x.suit === playerPlayed.suit)
              );
              return (
                <div
                  key={c.i}
                  onClick={() => playPlayerCard(i)}
                  style={{
                    position: 'absolute',
                    transform: dealing
                      ? `translate(0, -480px) rotate(${rot * 0.3}deg) scale(0.5)`
                      : `translateX(${offset}px) translateY(${c.played ? -800 : lift}px) rotate(${rot}deg)`,
                    opacity: dealing ? 0 : (c.played ? 0 : 1),
                    transition: 'transform 380ms cubic-bezier(0.2, 0.8, 0.3, 1.1), opacity 280ms ease',
                    cursor: phase === 'idle' && !c.played ? 'pointer' : 'default',
                  }}
                >
                  <div style={{ transition: 'transform 200ms ease' }}
                    onMouseEnter={(e) => { if (phase === 'idle') e.currentTarget.style.transform = 'translateY(-12px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}>
                    <CardFace rank={c.rank} suit={c.suit} size="lg" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Deck (shows during deal) */}
        {phase === 'dealing' && (
          <div style={{
            position: 'absolute', top: 360, left: '50%', transform: 'translate(-50%, -50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            zIndex: 3,
          }}>
            <div style={{ position: 'relative' }}>
              {[2, 1, 0].map(i => (
                <div key={i} style={{
                  position: i === 0 ? 'relative' : 'absolute',
                  top: i === 0 ? 0 : -i * 2,
                  left: i === 0 ? 0 : -i * 2,
                  filter: i > 0 ? 'brightness(0.7)' : 'none',
                }}>
                  <CardBack size="md" />
                </div>
              ))}
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.25em',
              color: 'var(--or-2)', marginTop: 14,
              animation: 'lamap-pulse 1s ease-in-out infinite',
            }}>DISTRIBUTION…</div>
          </div>
        )}

        {/* Kora explosion overlay */}
        {koraReveal && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(110,37,32,0.92) 0%, rgba(15,22,32,0.97) 70%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'lamap-rise 0.3s ease-out',
            zIndex: 20,
          }}>
            <Sparks count={36} />
            <div style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '0.4em', color: 'var(--or-2)', marginBottom: 12 }}>VICTOIRE SPÉCIALE</div>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 84,
                color: 'var(--or-2)', letterSpacing: '-0.05em', lineHeight: 0.9,
                textShadow: '0 0 40px rgba(232,200,121,0.6)',
              }}>KORA</div>
              <div style={{
                marginTop: 12,
                display: 'inline-flex', alignItems: 'center', padding: '8px 22px', borderRadius: 99,
                background: 'linear-gradient(135deg, #C9A876, #6E5536)',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28,
                color: '#1F1810', letterSpacing: '-0.02em',
                boxShadow: '0 0 30px rgba(232,200,121,0.5)',
              }}>×2</div>
            </div>
          </div>
        )}

        {/* Footer hint */}
        <div style={{
          position: 'absolute', top: 4, left: 0, right: 0,
          display: 'flex', justifyContent: 'center', zIndex: 30, pointerEvents: 'none',
        }}>
          <div style={{
            padding: '4px 10px', borderRadius: 99, marginTop: 1,
            background: 'rgba(15,22,32,0.8)',
            border: '1px solid rgba(201,168,118,0.25)',
            fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.15em',
            color: 'var(--or-2)',
          }}>TAP CARDS · INTERACTIVE</div>
        </div>

      </TableBg>
    </Phone>
  );
}

// Local card slot el
function CardSlotEl({ size = 'md' }) {
  const dims = { md: { w: 88, h: 124, corner: 10, font: 30 } }[size];
  return (
    <div style={{
      width: dims.w, height: dims.h, borderRadius: dims.corner,
      border: '2px dashed rgba(201,168,118,0.35)',
      background: 'rgba(46,61,77,0.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'rgba(201,168,118,0.5)', fontFamily: 'var(--font-card)', fontWeight: 600,
      fontSize: dims.font,
    }}>?</div>
  );
}

Object.assign(window, { AnimatedGame });
