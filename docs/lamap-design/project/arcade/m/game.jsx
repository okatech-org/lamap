/* global React, Phone, MStatusBar, MPlate, MMancheReel, Avatar, Embers, GoldDust, Smoke, SparkBurst, Card3D, CardBack3D */

// ─── 3.1 · Match en cours ───
function MMatch() {
  const playerHand = [
    { rank: 3, suit: 'hearts' },
    { rank: 7, suit: 'spades' },
    { rank: 3, suit: 'clubs' },
    { rank: 6, suit: 'clubs' },
  ];
  const oppCount = 4;

  return (
    <Phone bg="table">
      {/* Concentric rings */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        width: 460, height: 460, transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        border: '1px solid var(--gold-12)',
        boxShadow: 'inset 0 0 80px rgba(0,0,0,0.45)',
      }} />
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        width: 320, height: 320, transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        border: '1px solid var(--gold-08)',
      }} />
      <Embers count={10} />
      <GoldDust count={14} opacity={0.4} />

      <MStatusBar />

      {/* Header: back + manche reel + timer */}
      <div style={{
        height: 48, padding: '0 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative', zIndex: 10,
      }}>
        <button style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'var(--surf-85)', border: '1px solid var(--gold-22)',
          color: 'var(--cream)', cursor: 'pointer', fontSize: 14,
        }}>‹</button>
        <MMancheReel current={2} won={[0]} lost={[1]} />
        <div className="chip" style={{ height: 24, padding: '0 8px', fontSize: 9 }}>
          ⌛ <span className="f-display" style={{ fontSize: 11 }}>00:23</span>
        </div>
      </div>

      {/* Pot ribbon — pot + rake + table tier */}
      <div style={{
        position: 'absolute', top: 96, left: '50%', transform: 'translateX(-50%)',
        zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      }}>
        <div style={{
          padding: '4px 14px', borderRadius: 99,
          background: 'linear-gradient(180deg, var(--gold-18), var(--gold-06))',
          border: '1px solid var(--gold-40)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span className="f-mono" style={{ fontSize: 8, color: 'var(--gold)', letterSpacing: '0.3em' }}>POT</span>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: 'radial-gradient(circle, #FFE1AB, var(--gold-deep))',
            border: '1px solid #6E5536',
          }} />
          <span className="f-display" style={{ fontSize: 13, color: 'var(--gold-bright)', fontWeight: 800 }}>400 K</span>
        </div>
        <div className="f-mono" style={{ fontSize: 8, color: 'rgba(246,239,223,0.5)', letterSpacing: '0.2em', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: 'var(--gold)' }}>STANDARD</span>
          <span>·</span>
          <span>MISE 200 K</span>
          <span>·</span>
          <span>RAKE 5 %</span>
        </div>
      </div>

      {/* Opp area */}
      <div style={{
        position: 'absolute', top: 138, left: 0, right: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        zIndex: 4,
      }}>
        <MPlate name="Le Grand Bandi" initials="LB" rank="G" rating={2387} side="left" />
        <div style={{ display: 'flex', marginTop: 4 }}>
          {Array.from({ length: oppCount }).map((_, i) => (
            <div key={i} style={{
              transform: `rotate(${(i - (oppCount-1)/2) * 6}deg) translateY(${Math.abs(i - (oppCount-1)/2) * 2}px)`,
              marginLeft: i === 0 ? 0 : -34,
              filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.6))',
            }}>
              <CardBack3D size="xs" tilt={false} skin="emerald" />
            </div>
          ))}
        </div>
      </div>

      {/* Carte demandée chip */}
      <div style={{
        position: 'absolute', top: 322, left: '50%', transform: 'translateX(-50%)',
        zIndex: 6,
      }}>
        <div style={{
          padding: '4px 12px', borderRadius: 99,
          background: 'var(--surf-92)',
          border: '1px solid var(--gold-40)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span className="f-mono" style={{ fontSize: 8, color: 'var(--gold)', letterSpacing: '0.22em' }}>DEMANDÉE</span>
          <span style={{ width: 1, height: 10, background: 'var(--gold-30)' }} />
          <span style={{ fontSize: 16, color: '#B4443E', lineHeight: 1, filter: 'drop-shadow(0 0 3px var(--gold-40))' }}>♥</span>
          <span className="f-card" style={{ fontSize: 16, color: 'var(--cream)', fontWeight: 700 }}>7</span>
        </div>
      </div>

      {/* Center play area */}
      <div style={{
        position: 'absolute', top: 360, left: 0, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18,
        zIndex: 4,
      }}>
        {/* Opp's card */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div className="eyebrow" style={{ fontSize: 8 }}>ADVERSAIRE</div>
          <div style={{
            transform: 'translateY(-4px) rotate(-3deg)',
            filter: 'drop-shadow(0 14px 28px rgba(0,0,0,0.7))',
          }}>
            <Card3D rank="9" suit="diamonds" size="md" tilt />
          </div>
          <div style={{
            padding: '2px 8px', borderRadius: 99,
            background: 'var(--ember-18)',
            border: '1px solid var(--ember-40)',
            color: 'var(--chip-ember-color)', fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.18em',
          }}>HORS COULEUR</div>
        </div>

        {/* VS coin */}
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, #FFE1AB, var(--gold) 40%, #6E5536 100%)',
          border: '2px solid #4D3A1E',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 12, color: '#1F1810',
          boxShadow: '0 6px 18px var(--gold-40), inset 0 1px 0 rgba(255,255,255,0.4)',
          letterSpacing: '-0.04em',
        }}>VS</div>

        {/* Player's card */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div className="eyebrow" style={{ fontSize: 8, color: 'var(--gold-bright)' }}>TON COUP</div>
          <div style={{
            transform: 'translateY(4px) rotate(2deg)',
            filter: 'drop-shadow(0 18px 32px var(--gold-40))',
          }}>
            <Card3D rank="7" suit="hearts" size="md" tilt highlighted />
          </div>
          <div style={{
            padding: '2px 8px', borderRadius: 99,
            background: 'linear-gradient(135deg, var(--gold-25), var(--gold-12))',
            border: '1px solid var(--gold-50)',
            color: 'var(--gold-bright)', fontFamily: 'var(--font-mono)',
            fontSize: 8, letterSpacing: '0.18em',
          }}>TU PRENDS LA MAIN</div>
        </div>
      </div>

      {/* Status pill */}
      <div style={{
        position: 'absolute', top: 552, left: '50%', transform: 'translateX(-50%)',
        zIndex: 7,
      }}>
        <div className="f-display" style={{
          padding: '8px 18px', borderRadius: 99,
          background: 'linear-gradient(180deg, var(--jade-glow), var(--jade))',
          color: 'var(--cream)', fontSize: 12, fontWeight: 700,
          boxShadow: '0 10px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.18)',
          animation: 'la-breathe 2.4s ease-in-out infinite',
          letterSpacing: '0.02em', whiteSpace: 'nowrap',
        }}>♛ À TOI DE JOUER · MAIN 3</div>
      </div>

      {/* Player hand fan */}
      <div style={{
        position: 'absolute', bottom: 84, left: 0, right: 0, height: 200,
        zIndex: 8,
      }}>
        <div style={{
          position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          width: 390, height: 200,
        }}>
          {playerHand.map((c, i) => {
            const offset = (i - (playerHand.length - 1) / 2);
            const rot = offset * 7;
            const dx = offset * 70;
            const dy = Math.abs(offset) * 10;
            return (
              <div key={i} style={{
                position: 'absolute', bottom: 0,
                transform: `translateX(${dx}px) translateY(${dy}px) rotate(${rot}deg)`,
                cursor: 'pointer',
                filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.6))',
              }}>
                <Card3D rank={c.rank} suit={c.suit} size="md" tilt intensity={18} foil={i === 0} highlighted={i === 1} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom action bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 84,
        padding: '12px 14px 22px',
        background: 'linear-gradient(0deg, var(--surf-92) 60%, var(--surf-55) 100%)',
        borderTop: '1px solid var(--gold-15)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
        zIndex: 12,
      }}>
        <MPlate name="Nkomo" initials="NK" rank="M" rating={2138} side="left" state="turn" />
        <button className="btn btn-gold" style={{ fontSize: 12, padding: '12px 18px' }}>
          Confirmer
        </button>
      </div>
    </Phone>
  );
}

// ─── 3.2 · KORA cinematic ───
function MKora() {
  return (
    <Phone bg="velvet">
      <div style={{
        position: 'absolute', inset: 0,
        background:
          'radial-gradient(ellipse 75% 60% at 50% 45%, var(--gold-50) 0%, var(--accent-25) 28%, var(--surf-92) 75%)',
      }} />
      <svg width="390" height="844" style={{ position: 'absolute', inset: 0, mixBlendMode: 'screen', opacity: 0.45 }}>
        <defs>
          <linearGradient id="beam-k" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--gold-50)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        {Array.from({ length: 14 }).map((_, i) => {
          const angle = (i / 14) * 360;
          return (
            <rect key={i} x="185" y="-200" width="14" height="700" fill="url(#beam-k)"
              transform={`rotate(${angle} 195 380)`} />
          );
        })}
      </svg>

      <Embers count={36} />
      <GoldDust count={26} opacity={0.7} />
      <SparkBurst count={32} />

      <MStatusBar />

      <button style={{
        position: 'absolute', top: 58, right: 18, zIndex: 30,
        width: 34, height: 34, borderRadius: '50%',
        background: 'var(--surf-60)', border: '1px solid var(--gold-30)',
        backdropFilter: 'blur(8px)', color: 'var(--cream)', cursor: 'pointer', fontSize: 14,
      }}>✕</button>

      <div style={{ position: 'absolute', top: 100, left: 0, right: 0, textAlign: 'center', zIndex: 5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
          <div style={{ width: 40, height: 1, background: 'linear-gradient(90deg, transparent, var(--gold))' }} />
          <span className="f-mono" style={{ fontSize: 10, color: 'var(--gold-bright)', letterSpacing: '0.4em' }}>VICTOIRE SPÉCIALE</span>
          <div style={{ width: 40, height: 1, background: 'linear-gradient(90deg, var(--gold), transparent)' }} />
        </div>
        <div className="f-roman" style={{ fontSize: 11, color: 'rgba(246,239,223,0.6)', marginTop: 6, fontStyle: 'italic', letterSpacing: '0.16em' }}>
          tu finis la main 5 avec un 3
        </div>
      </div>

      <div style={{ position: 'absolute', top: 150, left: 0, right: 0, textAlign: 'center', zIndex: 5 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 130,
          lineHeight: 0.85, letterSpacing: '-0.06em',
          background: 'linear-gradient(180deg, #FFE1AB 0%, var(--gold) 35%, var(--gold-deep) 65%, #4D3A1E 100%)',
          WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
          filter: 'drop-shadow(0 0 24px var(--gold-50)) drop-shadow(0 6px 16px rgba(0,0,0,0.6))',
        }}>KORA</div>
      </div>

      <div style={{ position: 'absolute', top: 270, left: 0, right: 0, textAlign: 'center', zIndex: 5 }}>
        <div className="f-display" style={{
          fontSize: 88, lineHeight: 0.85, color: 'var(--cream)', fontWeight: 800,
          textShadow: '0 4px 24px rgba(0,0,0,0.7), 0 0 40px var(--gold-50)',
          letterSpacing: '-0.05em',
        }}>×2</div>
      </div>

      <div style={{ position: 'absolute', top: 386, left: '50%', transform: 'translateX(-50%)', zIndex: 6 }}>
        <div style={{
          filter: 'drop-shadow(0 24px 48px var(--gold-50)) drop-shadow(0 0 24px var(--accent-60))',
          animation: 'la-breathe 3s ease-in-out infinite',
        }}>
          <Card3D rank="3" suit="hearts" size="lg" tilt foil highlighted intensity={16} />
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 120, left: 18, right: 18, zIndex: 8 }}>
        <div style={{
          padding: 16, borderRadius: 16,
          background: 'linear-gradient(180deg, var(--surf-92), var(--surf-92))',
          border: '1px solid var(--gold-40)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
        }}>
          <div className="eyebrow" style={{ fontSize: 9, color: 'var(--gold-bright)', marginBottom: 12 }}>★ GAIN FINAL</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <KoraRow label="Pot du match" value="400 K" />
            <KoraRow label="KORA ×2" value="800 K" tone="hot" />
            <KoraRow label="Rake (5 %)" value="−40 K" />
            <div style={{ height: 1, background: 'var(--gold-18)' }} />
            <KoraRow label="Tu encaisses" value="+560 K" tone="gold" big />
            <KoraRow label="Points de rang" value="+24 PR" tone="jade" />
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 32, left: 18, right: 18, zIndex: 10 }}>
        <button className="btn btn-gold" style={{ width: '100%', fontSize: 15, padding: '15px' }}>
          Continuer →
        </button>
      </div>
    </Phone>
  );
}

function KoraRow({ label, value, tone = 'neutral', big = false }) {
  const colors = {
    neutral: 'var(--cream)',
    hot: 'var(--chip-ember-color)',
    gold: 'var(--gold-bright)',
    jade: 'var(--accent-text)',
  };
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <span className="f-body" style={{ fontSize: big ? 13 : 12, color: 'rgba(246,239,223,0.7)' }}>{label}</span>
      <span className="f-display" style={{ fontSize: big ? 22 : 14, color: colors[tone], fontWeight: 800 }}>{value}</span>
    </div>
  );
}

// ─── 3.3 · End of match (victory) ───
function MEndGame() {
  return (
    <Phone bg="velvet">
      <Smoke count={3} />
      <GoldDust count={20} opacity={0.5} />

      <MStatusBar />

      {/* Big result */}
      <div style={{
        position: 'absolute', top: 100, left: 0, right: 0, textAlign: 'center',
      }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>FIN DE MATCH · MAIN 5</div>
        <div className="f-display" style={{
          fontSize: 76, color: 'var(--cream)', fontWeight: 800,
          letterSpacing: '-0.04em', lineHeight: 0.9,
          textShadow: '0 4px 24px rgba(0,0,0,0.7)',
        }}>Victoire.</div>
        <div className="f-roman" style={{
          fontSize: 14, color: 'rgba(246,239,223,0.6)', marginTop: 12,
          fontStyle: 'italic', letterSpacing: '0.12em',
        }}>tu rafles la mise contre Le Grand Bandi</div>
      </div>

      {/* Winning card */}
      <div style={{
        position: 'absolute', top: 280, left: '50%', transform: 'translateX(-50%)',
        filter: 'drop-shadow(0 20px 40px var(--gold-40))',
      }}>
        <Card3D rank="10" suit="spades" size="lg" tilt highlighted />
      </div>

      {/* Stats summary */}
      <div style={{
        position: 'absolute', top: 520, left: 18, right: 18,
        padding: 16, borderRadius: 18,
        background: 'var(--surf-70)',
        border: '1px solid var(--gold-18)',
        backdropFilter: 'blur(8px)',
      }}>
        <div className="eyebrow" style={{ fontSize: 9, marginBottom: 12 }}>RÉCAPITULATIF</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <EndStat label="Manches" value="3 / 5" />
          <EndStat label="Coups parfaits" value="4" />
          <EndStat label="Plus haute" value="10♠" tone="gold" />
          <EndStat label="Durée" value="2:14" />
        </div>
        <div style={{ height: 1, background: 'var(--gold-18)', margin: '14px 0' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span className="f-body" style={{ fontSize: 12, color: 'rgba(246,239,223,0.55)' }}>Pot du match</span>
            <span className="f-display" style={{ fontSize: 13, color: 'var(--cream)' }}>400 K</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span className="f-body" style={{ fontSize: 12, color: 'rgba(246,239,223,0.55)' }}>
              Rake <span style={{ color: 'rgba(246,239,223,0.4)' }}>(5 %)</span>
            </span>
            <span className="f-display" style={{ fontSize: 13, color: 'var(--chip-ember-color)' }}>−20 K</span>
          </div>
        </div>
        <div style={{ height: 1, background: 'var(--gold-18)', margin: '12px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className="f-body" style={{ fontSize: 13, color: 'rgba(246,239,223,0.65)' }}>Gain net</span>
          <span className="f-display" style={{ fontSize: 24, color: 'var(--gold-bright)', fontWeight: 800 }}>+180 K</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 4 }}>
          <span className="f-body" style={{ fontSize: 12, color: 'rgba(246,239,223,0.55)' }}>Points de rang</span>
          <span className="f-display" style={{ fontSize: 14, color: 'var(--accent-text)' }}>+18 PR</span>
        </div>
      </div>

      {/* CTAs */}
      <div style={{
        position: 'absolute', bottom: 32, left: 18, right: 18,
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        <button className="btn btn-gold" style={{ width: '100%', fontSize: 15, padding: '15px' }}>
          Rejouer — 100 K
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-dark" style={{ flex: 1, fontSize: 12, padding: '11px' }}>↗ Partager</button>
          <button className="btn btn-dark" style={{ flex: 1, fontSize: 12, padding: '11px' }}>Retour accueil</button>
        </div>
      </div>
    </Phone>
  );
}

function EndStat({ label, value, tone = 'neutral' }) {
  const colors = { neutral: 'var(--cream)', gold: 'var(--gold-bright)' };
  return (
    <div>
      <div className="f-mono" style={{ fontSize: 8, color: 'rgba(246,239,223,0.5)', letterSpacing: '0.18em', marginBottom: 2 }}>{label}</div>
      <div className="f-display" style={{ fontSize: 18, color: colors[tone], fontWeight: 800 }}>{value}</div>
    </div>
  );
}

Object.assign(window, { MMatch, MKora, MEndGame });
