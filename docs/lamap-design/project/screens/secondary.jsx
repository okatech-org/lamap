/* global React, CardFace, CardBack, Avatar, RankBadge, StatusBar, GoldDust, Phone */

// ───────────────────────────────────────────────
// SECONDARY SCREENS — Onboarding, Wallet, Shop, Notifs
// ───────────────────────────────────────────────

function OnboardingTuto() {
  return (
    <Phone>
      <StatusBar />
      <div className="bg-deep" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <GoldDust count={8} opacity={0.3} />

        <div style={{ position: 'absolute', top: 70, left: 20, right: 20, display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ color: 'rgba(245,242,237,0.5)', fontFamily: 'var(--font-body)', fontSize: 13 }}>Passer</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ width: 24, height: 4, borderRadius: 2, background: 'var(--terre)' }} />
            <div style={{ width: 24, height: 4, borderRadius: 2, background: 'var(--terre)' }} />
            <div style={{ width: 24, height: 4, borderRadius: 2, background: 'rgba(245,242,237,0.2)' }} />
            <div style={{ width: 24, height: 4, borderRadius: 2, background: 'rgba(245,242,237,0.2)' }} />
          </div>
        </div>

        <div style={{
          position: 'absolute', top: 130, left: 0, right: 0, textAlign: 'center', padding: '0 24px',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.3em',
            color: 'var(--or-2)',
          }}>RÈGLE 3 / 4</div>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 38,
            color: 'var(--cream)', letterSpacing: '-0.03em', marginTop: 14, lineHeight: 1.05,
          }}>Le 3 vaut peu —<br/>sauf à la fin.</div>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 15,
            color: 'rgba(245,242,237,0.7)', marginTop: 12, lineHeight: 1.5, maxWidth: 320, marginLeft: 'auto', marginRight: 'auto',
          }}>Remporter la 5ème manche avec un 3 déclenche un <span style={{ color: 'var(--or-2)', fontWeight: 600 }}>Kora</span>. Doublé en 4+5. Triplé en 3+4+5.</div>
        </div>

        {/* Visualisation */}
        <div style={{
          position: 'absolute', top: 360, left: 0, right: 0,
          display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 4,
        }}>
          {[5, 6, 7, 8, 9].map((manche, i) => {
            const won = manche >= 7;
            const isKora = manche >= 8;
            return (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <CardFace rank={isKora ? 3 : (manche === 5 ? 7 : manche === 6 ? 6 : 9)} suit={isKora ? 'hearts' : 'spades'} size="sm" />
                  {isKora && (
                    <div style={{
                      position: 'absolute', top: -10, right: -10,
                      padding: '2px 7px', borderRadius: 99,
                      background: 'var(--or)', color: '#1F1810',
                      fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
                      boxShadow: '0 0 12px rgba(232,200,121,0.5)',
                    }}>×{manche === 8 ? '2' : '4'}</div>
                  )}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.15em',
                  color: 'rgba(245,242,237,0.5)', marginTop: 6,
                }}>M{manche - 4}</div>
                <div style={{
                  width: 16, height: 4, borderRadius: 2, margin: '4px auto 0',
                  background: won ? (isKora ? 'var(--or)' : 'var(--cream)') : 'rgba(245,242,237,0.2)',
                  boxShadow: isKora ? '0 0 8px rgba(232,200,121,0.6)' : 'none',
                }} />
              </div>
            );
          })}
        </div>

        <div style={{ position: 'absolute', bottom: 60, left: 24, right: 24 }}>
          <button className="btn-primary" style={{ width: '100%' }}>Suivant →</button>
        </div>
      </div>
    </Phone>
  );
}

function WalletScreen() {
  return (
    <Phone>
      <StatusBar />
      <div className="bg-deep" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 380,
          background: 'radial-gradient(ellipse at 50% 30%, rgba(166,130,88,0.25), transparent 60%)',
        }} />
        <GoldDust count={15} opacity={0.5} />

        <div style={{ position: 'absolute', top: 70, left: 20, right: 20, display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ color: 'var(--or-2)', fontSize: 22 }}>←</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--cream)' }}>Wallet</div>
          <div style={{ color: 'var(--or-2)', fontSize: 18 }}>⟳</div>
        </div>

        {/* Balance hero */}
        <div style={{ position: 'absolute', top: 120, left: 0, right: 0, textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.3em', color: 'var(--or-2)',
          }}>SOLDE KORA</div>
          {/* Coin */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 14, marginTop: 18,
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, #F2DA9A 0%, #C9A876 50%, #6E5536 100%)',
              border: '3px solid #6E5536',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28,
              color: '#1F1810',
              boxShadow: '0 0 30px rgba(232,200,121,0.5), inset 0 -3px 8px rgba(0,0,0,0.4)',
            }}>K</div>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 56,
              color: 'var(--cream)', letterSpacing: '-0.04em', lineHeight: 1,
            }}>1 250</div>
          </div>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(245,242,237,0.55)', marginTop: 8,
          }}>≈ 12 500 XAF · 1 Kora = 10 XAF</div>
        </div>

        {/* Actions */}
        <div style={{ position: 'absolute', top: 320, left: 20, right: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button className="btn-primary" style={{ width: '100%' }}>+ Recharger</button>
          <button className="btn-ghost" style={{ width: '100%' }}>Retirer</button>
        </div>

        {/* Transactions */}
        <div style={{ position: 'absolute', top: 410, left: 20, right: 20 }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.25em',
            color: 'var(--or-2)', marginBottom: 10,
          }}>HISTORIQUE</div>
          {[
            { l: 'Victoire vs Anna K.', s: 'il y a 12 min', v: '+180 K', pos: true },
            { l: 'Mise · Duel',        s: 'il y a 12 min', v: '−100 K' },
            { l: 'Recharge MTN',        s: 'il y a 2 j',    v: '+500 K', pos: true },
            { l: 'Défaite vs Le Grand', s: 'il y a 3 j',    v: '−100 K' },
            { l: 'Kora ×4',             s: 'il y a 4 j',    v: '+800 K', pos: true, kora: true },
          ].map((t, i) => (
            <div key={i} style={{
              padding: '10px 4px',
              borderBottom: '1px solid rgba(201,168,118,0.1)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--cream)' }}>
                  {t.l} {t.kora && <span style={{ marginLeft: 6, padding: '1px 5px', borderRadius: 4, background: 'var(--or)', color: '#1F1810', fontSize: 9, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>KORA</span>}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(245,242,237,0.45)', marginTop: 2 }}>{t.s}</div>
              </div>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
                color: t.pos ? 'var(--or-2)' : '#D4635D',
              }}>{t.v}</div>
            </div>
          ))}
        </div>
      </div>
    </Phone>
  );
}

function ShopScreen() {
  return (
    <Phone>
      <StatusBar />
      <div className="bg-deep" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <GoldDust count={10} opacity={0.4} />

        <div style={{ position: 'absolute', top: 70, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, color: 'var(--cream)' }}>Boutique</div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 99,
            background: 'rgba(166,130,88,0.15)', border: '1px solid rgba(201,168,118,0.3)',
          }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'radial-gradient(circle, #E8C879, #6E5536)' }} />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: 'var(--or-2)' }}>1 250</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ position: 'absolute', top: 130, left: 20, right: 20, display: 'flex', gap: 8 }}>
          {['Dos de cartes', 'Avatars', 'Effets'].map((t, i) => (
            <div key={i} style={{
              padding: '8px 14px', borderRadius: 99,
              background: i === 0 ? 'var(--terre)' : 'rgba(46,61,77,0.5)',
              color: i === 0 ? 'var(--cream)' : 'rgba(245,242,237,0.55)',
              fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
              border: i === 0 ? 'none' : '1px solid rgba(201,168,118,0.15)',
            }}>{t}</div>
          ))}
        </div>

        {/* Card backs grid */}
        <div style={{ position: 'absolute', top: 190, left: 20, right: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { name: 'Bandi Classique', price: 'Acquis', owned: true, theme: 'red' },
            { name: 'Bleu Royal',      price: '500 K',  theme: 'blue' },
            { name: 'Or Sable',        price: '850 K', rare: true, theme: 'gold' },
            { name: 'Ombre Tribale',   price: '1 200 K', rare: true, theme: 'dark' },
          ].map((p, i) => (
            <div key={i} style={{
              padding: 14, borderRadius: 16,
              background: 'rgba(46,61,77,0.5)',
              border: p.owned ? '1.5px solid var(--or)' : '1px solid rgba(201,168,118,0.12)',
              position: 'relative',
            }}>
              {p.rare && (
                <div style={{
                  position: 'absolute', top: 10, right: 10,
                  padding: '2px 7px', borderRadius: 99,
                  background: 'rgba(157,91,210,0.25)', border: '1px solid rgba(157,91,210,0.5)',
                  color: '#C898E5', fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
                }}>RARE</div>
              )}
              <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
                <ShopCardPreview theme={p.theme} />
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--cream)', marginTop: 4 }}>{p.name}</div>
              <div style={{
                marginTop: 6,
                padding: '6px 10px', borderRadius: 99,
                background: p.owned ? 'transparent' : 'var(--terre)',
                border: p.owned ? '1px solid rgba(201,168,118,0.4)' : 'none',
                color: p.owned ? 'var(--or-2)' : 'var(--cream)',
                fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
                textAlign: 'center', letterSpacing: '0.05em',
              }}>{p.price}</div>
            </div>
          ))}
        </div>
      </div>
    </Phone>
  );
}

function ShopCardPreview({ theme }) {
  const themes = {
    red:  { bg: 'linear-gradient(135deg, #B4443E, #6E2520)', accent: '#C9A876' },
    blue: { bg: 'linear-gradient(135deg, #465D74, #1F2C3B)', accent: '#5A7A96' },
    gold: { bg: 'linear-gradient(135deg, #C9A876, #6E5536)', accent: '#1F1810' },
    dark: { bg: 'linear-gradient(135deg, #2A1F1A, #0A0807)', accent: '#9D5BD2' },
  }[theme];
  return (
    <div style={{
      width: 80, height: 112, borderRadius: 10, padding: 6,
      background: themes.bg, border: '1.5px solid rgba(0,0,0,0.4)',
      boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
    }}>
      <div style={{
        width: '100%', height: '100%', borderRadius: 6,
        border: `1px solid ${themes.accent}80`,
        background: `repeating-linear-gradient(45deg, ${themes.accent}30 0 1px, transparent 1px 8px), repeating-linear-gradient(-45deg, ${themes.accent}30 0 1px, transparent 1px 8px)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
          color: themes.accent,
        }}>LM</div>
      </div>
    </div>
  );
}

function NotificationsScreen() {
  return (
    <Phone>
      <StatusBar />
      <div className="bg-deep" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <GoldDust count={6} opacity={0.25} />

        <div style={{ position: 'absolute', top: 70, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: 'var(--or-2)', fontSize: 22 }}>←</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--cream)' }}>Notifications</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--or-2)' }}>Tout lu</div>
        </div>

        <div style={{ position: 'absolute', top: 116, left: 20, right: 20 }}>
          {/* Challenge — important */}
          <div style={{
            padding: 14, marginBottom: 10, borderRadius: 14,
            background: 'linear-gradient(110deg, rgba(180,68,62,0.25), rgba(46,61,77,0.5))',
            border: '1.5px solid var(--terre-2)',
            position: 'relative',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Avatar initials="LG" size={36} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--cream)' }}>
                  <span style={{ fontWeight: 700 }}>Le Grand Bandi</span> te défie
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--or-2)', marginTop: 2 }}>il y a 2 min · Mise 200 K</div>
              </div>
              <div style={{
                width: 8, height: 8, borderRadius: '50%', background: '#D4635D',
                boxShadow: '0 0 8px rgba(212,99,93,0.7)',
              }} />
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button style={{ flex: 1, padding: '8px', borderRadius: 99, background: 'var(--terre)', color: 'var(--cream)', border: 'none', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13 }}>Accepter</button>
              <button style={{ flex: 1, padding: '8px', borderRadius: 99, background: 'transparent', color: 'rgba(245,242,237,0.6)', border: '1px solid rgba(201,168,118,0.3)', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13 }}>Refuser</button>
            </div>
          </div>

          {[
            { icon: '🏆', title: 'Promu Tacticien !', sub: 'Tu as franchi 400 PR · il y a 1j', color: 'var(--or)' },
            { icon: '⚡', title: 'Anna K. te suit', sub: 'il y a 2j', color: 'var(--terre-2)' },
            { icon: '💰', title: 'Bonus quotidien', sub: '+25 Kora · réclamé · il y a 3j', color: 'var(--or-2)' },
            { icon: '◈', title: 'Saison 4 — bientôt', sub: 'Récompenses : carte dorée · il y a 5j', color: 'var(--or-2)' },
          ].map((n, i) => (
            <div key={i} style={{
              padding: 12, marginBottom: 6, borderRadius: 12,
              background: 'rgba(46,61,77,0.4)',
              border: '1px solid rgba(201,168,118,0.1)',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: 'rgba(15,22,32,0.7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, color: n.color,
                border: '1px solid rgba(201,168,118,0.15)',
              }}>{n.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--cream)' }}>{n.title}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(245,242,237,0.5)', marginTop: 2 }}>{n.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Phone>
  );
}

Object.assign(window, { OnboardingTuto, WalletScreen, ShopScreen, NotificationsScreen });
