"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./LandingCinematic.module.css";

type Suit = "heart" | "diamond" | "club" | "spade";

const suitGlyph: Record<Suit, string> = {
  heart: "♥",
  diamond: "♦",
  club: "♣",
  spade: "♠",
};

const hand = [
  { rank: "7", suit: "heart" as Suit },
  { rank: "6", suit: "club" as Suit },
  { rank: "5", suit: "diamond" as Suit },
  { rank: "9", suit: "spade" as Suit },
];

function Mark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={styles.mark} aria-label="LaMap">
      <span className={styles.markSeal}>LM</span>
      {!compact && <span className={styles.markWord}>LaMap</span>}
    </span>
  );
}

function PlayingCard({
  rank,
  suit,
  className = "",
  hidden = false,
}: {
  rank: string;
  suit: Suit;
  className?: string;
  hidden?: boolean;
}) {
  if (hidden) {
    return (
      <div className={`${styles.playingCard} ${styles.cardBack} ${className}`}>
        <span>LM</span>
      </div>
    );
  }

  const red = suit === "heart" || suit === "diamond";
  return (
    <div
      className={`${styles.playingCard} ${red ? styles.redSuit : ""} ${className}`}
      aria-label={`${rank} ${suitGlyph[suit]}`}
    >
      <span className={styles.cardCorner}>
        <b>{rank}</b>
        <i>{suitGlyph[suit]}</i>
      </span>
      <span className={styles.cardPip}>{suitGlyph[suit]}</span>
      <span className={`${styles.cardCorner} ${styles.cardCornerBottom}`}>
        <b>{rank}</b>
        <i>{suitGlyph[suit]}</i>
      </span>
    </div>
  );
}

function MiniPlayer({
  name,
  initials,
  active,
}: {
  name: string;
  initials: string;
  active?: boolean;
}) {
  return (
    <div
      className={`${styles.miniPlayer} ${active ? styles.miniPlayerActive : ""}`}
    >
      <span className={styles.avatar}>{initials}</span>
      <span>
        <b>{name}</b>
        <small>{active ? "À LA MAIN" : "3 CARTES"}</small>
      </span>
    </div>
  );
}

function HeroTable() {
  const [selected, setSelected] = useState(2);
  const [played, setPlayed] = useState(false);

  const play = () => {
    setPlayed(true);
    window.setTimeout(() => setPlayed(false), 1800);
  };

  return (
    <div className={styles.heroGameShell}>
      <div className={styles.heroGameTopbar}>
        <span>
          <i /> PARTIE CLASSÉE
        </span>
        <b>MANCHE 3 / 5</b>
        <button type="button" aria-label="Ouvrir le menu">
          •••
        </button>
      </div>

      <div className={styles.heroTable}>
        <div className={styles.tableRingOuter} />
        <div className={styles.tableRingInner} />
        <div className={styles.heroOpponent}>
          <MiniPlayer name="Ndolo" initials="ND" active />
          <div className={styles.hiddenHand}>
            {[0, 1, 2].map((card) => (
              <PlayingCard key={card} rank="" suit="spade" hidden />
            ))}
          </div>
        </div>

        <div className={styles.centerCards}>
          <PlayingCard rank="4" suit="club" className={styles.centerCardLeft} />
          <div className={styles.roundSeal}>M3</div>
          <PlayingCard
            rank={played ? hand[selected].rank : "8"}
            suit={played ? hand[selected].suit : "diamond"}
            className={`${styles.centerCardRight} ${played ? styles.cardPlayed : ""}`}
          />
        </div>

        <div className={styles.turnNote}>
          <span>COULEUR DEMANDÉE</span>
          <b>♣ Trèfle</b>
        </div>

        <div className={styles.heroHand} aria-label="Ta main">
          {hand.map((card, index) => (
            <button
              type="button"
              key={`${card.rank}-${card.suit}`}
              className={`${styles.handCardButton} ${selected === index ? styles.handCardSelected : ""}`}
              onClick={() => {
                setSelected(index);
                setPlayed(false);
              }}
              aria-label={`Choisir ${card.rank} ${suitGlyph[card.suit]}`}
              aria-pressed={selected === index}
            >
              <PlayingCard rank={card.rank} suit={card.suit} />
            </button>
          ))}
        </div>

        <div className={styles.youBadge}>
          <span className={styles.avatar}>BI</span>
          <span>
            <b>Biyick</b>
            <small>1 427 PR</small>
          </span>
        </div>

        <button type="button" className={styles.playButton} onClick={play}>
          {played ? "Carte posée" : "Jouer cette carte"}
        </button>
      </div>
    </div>
  );
}

function HomePhone() {
  return (
    <article className={`${styles.phone} ${styles.phoneHome}`}>
      <div className={styles.phoneChrome}>
        <span>20:41</span>
        <i />
      </div>
      <div className={styles.phoneInner}>
        <div className={styles.phoneTopline}>
          <span className={styles.avatar}>BI</span>
          <span className={styles.points}>1 427 pts</span>
        </div>
        <p className={styles.phoneEyebrow}>BONSOIR BIYICK</p>
        <h3>
          Une partie
          <br />
          <em>ce soir&nbsp;?</em>
        </h3>
        <div className={styles.continueTicket}>
          <span>PARTIE EN COURS</span>
          <b>Reprendre contre Ndolo</b>
          <i>→</i>
        </div>
        <div className={styles.modeCard}>
          <span className={styles.modeNumber}>01</span>
          <div>
            <small>LE CHOIX DU SOIR</small>
            <b>Match classé</b>
            <p>Une partie, des points, un rang.</p>
          </div>
          <i>↗</i>
        </div>
        <div className={styles.phoneModes}>
          <span>
            <b>♟</b> Entraînement
          </span>
          <span>
            <b>♣</b> Classement
          </span>
        </div>
      </div>
      <div className={styles.phoneNav}>
        <b>Jouer</b>
        <span>Rang</span>
        <span>Boutique</span>
        <span>Profil</span>
      </div>
    </article>
  );
}

function MatchPhone() {
  return (
    <article className={`${styles.phone} ${styles.phoneMatch}`}>
      <div className={styles.phoneChrome}>
        <span>20:42</span>
        <i />
      </div>
      <div className={styles.phoneInner}>
        <button type="button" className={styles.phoneBack}>
          ←
        </button>
        <p className={styles.phoneEyebrow}>TABLE CLASSÉE · DUEL</p>
        <h3>
          Un adversaire
          <br />
          <em>à ta mesure.</em>
        </h3>
        <div className={styles.matchSeal}>
          <span>04</span>
          <small>TABLE</small>
        </div>
        <div className={styles.matchPlayers}>
          <MiniPlayer name="Biyick" initials="BI" />
          <strong>VS</strong>
          <MiniPlayer name="Ndolo" initials="ND" />
        </div>
        <div className={styles.matchStatus}>
          <i />
          <span>ADVERSAIRE TROUVÉ</span>
        </div>
        <dl className={styles.matchFacts}>
          <div>
            <dt>Points</dt>
            <dd>1 427</dd>
          </div>
          <div>
            <dt>Position</dt>
            <dd>#128 monde</dd>
          </div>
          <div>
            <dt>Format</dt>
            <dd>5 manches</dd>
          </div>
        </dl>
        <button type="button" className={styles.matchCta}>
          Prendre place
        </button>
      </div>
    </article>
  );
}

function GamePhone() {
  return (
    <article className={`${styles.phone} ${styles.phoneGame}`}>
      <div className={styles.phoneChrome}>
        <span>20:43</span>
        <i />
      </div>
      <div className={styles.mobileGameTop}>
        <span>M3 / 5</span>
        <div className={styles.mobileDots}>
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
        <span>00:18</span>
      </div>
      <div className={styles.mobileTable}>
        <div className={styles.mobileOpponent}>
          <MiniPlayer name="Ndolo" initials="ND" active />
        </div>
        <div className={styles.mobileBoard}>
          <PlayingCard rank="4" suit="club" />
          <span className={styles.mobileRoundSeal}>M3</span>
          <PlayingCard rank="8" suit="diamond" />
        </div>
        <div className={styles.mobileTurn}>
          <span>À TOI</span>
          <b>♣ Trèfle demandé</b>
        </div>
        <div className={styles.mobileHand}>
          {hand.map((card) => (
            <PlayingCard
              key={`${card.rank}-${card.suit}`}
              rank={card.rank}
              suit={card.suit}
            />
          ))}
        </div>
        <button type="button" className={styles.mobilePlay}>
          Jouer la carte
        </button>
      </div>
    </article>
  );
}

export function LandingCinematic() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav} aria-label="Navigation principale">
        <Mark />
        <div className={styles.navLinks}>
          <a href="#jeu">Le jeu</a>
          <a href="#parcours">Les écrans</a>
          <a href="#origine">L’histoire</a>
        </div>
        <a
          href="mailto:support@lamap.gg?subject=TestFlight%20Lamap"
          className={styles.navCta}
        >
          Tester sur iPhone <span>↗</span>
        </a>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.kicker}>
            <span>CARTE · RUSE · CAMEROUN</span>
            <i />
          </div>
          <h1>
            Le tapis
            <br />
            est <em>prêt.</em>
          </h1>
          <p>
            La Map passe du salon à l’écran sans perdre le regard, les silences
            et le coup qui retourne la table.
          </p>
          <div className={styles.heroActions}>
            <a
              href="mailto:support@lamap.gg?subject=TestFlight%20Lamap"
              className={styles.primaryCta}
            >
              Tester sur iPhone <span>→</span>
            </a>
            <a href="#jeu" className={styles.textCta}>
              Voir une manche <span>↓</span>
            </a>
          </div>
          <div className={styles.heroFootnote}>
            <span>01</span>
            <p>
              <b>UNE TABLE T’ATTEND</b>
              <br />
              Parties classées ou entraînement contre l’IA.
            </p>
          </div>
        </div>

        <div className={styles.heroVisual} id="jeu">
          <div className={styles.heroStamp}>
            ÉDITION
            <br />
            <b>04</b>
            <br />
            YAOUNDÉ
          </div>
          <HeroTable />
          <div className={styles.heroCaption}>
            <span>TOUR 09</span>
            <i />
            <span>TABLE 04</span>
          </div>
        </div>
      </section>

      <div className={styles.marquee} aria-hidden="true">
        <div>
          <span>LA RUE A SON JEU</span>
          <i>♠</i>
          <span>LA TABLE A SES LÉGENDES</span>
          <i>♦</i>
          <span>LA RUE A SON JEU</span>
          <i>♣</i>
          <span>LA TABLE A SES LÉGENDES</span>
          <i>♥</i>
        </div>
      </div>

      <section className={styles.journey} id="parcours">
        <header className={styles.sectionHeader}>
          <div>
            <p className={styles.kickerText}>
              LE PARCOURS EN POCHE · 03 ÉCRANS
            </p>
            <h2>
              De l’envie de jouer
              <br />
              au dernier pli.
            </h2>
          </div>
          <p className={styles.sectionIntro}>
            L’accueil donne une seule décision à prendre. Le matchmaking pose le
            duel. Puis l’interface s’efface autour du tapis.
          </p>
        </header>

        <div className={styles.phoneStage}>
          <div className={styles.phoneNote}>
            <span>01</span>
            <b>CHOISIR</b>
            <p>Reprendre une partie ou trouver une table en un geste.</p>
          </div>
          <HomePhone />
          <MatchPhone />
          <GamePhone />
          <div className={`${styles.phoneNote} ${styles.phoneNoteLast}`}>
            <span>03</span>
            <b>JOUER</b>
            <p>
              L’adversaire, la couleur et ta main restent toujours visibles.
            </p>
          </div>
        </div>

        <div className={styles.principles}>
          <article>
            <span>01</span>
            <h3>Une décision par écran</h3>
            <p>
              Pas de tableau de bord à déchiffrer. Chaque page pousse le
              prochain geste.
            </p>
          </article>
          <article>
            <span>02</span>
            <h3>Le jeu prend la place</h3>
            <p>
              Sur la table, aucun décor ne concurrence les cartes, le tour ou
              l’adversaire.
            </p>
          </article>
          <article>
            <span>03</span>
            <h3>Le papier garde la mémoire</h3>
            <p>
              Tickets, fiches et sceaux donnent à chaque partie une trace
              reconnaissable.
            </p>
          </article>
        </div>
      </section>

      <section className={styles.story} id="origine">
        <div className={styles.storyPaper}>
          <p className={styles.kickerText}>NÉE AUTOUR D’UNE TABLE</p>
          <blockquote>
            «&nbsp;On ne gagne pas avec les meilleures cartes. On gagne en
            lisant la pièce.&nbsp;»
          </blockquote>
          <p>
            La Map est un jeu camerounais de mémoire et de culot. Cette version
            garde ce qui compte : la tension d’un pli, l’éclat visuel d’un Kora
            et l’envie immédiate d’une revanche.
          </p>
          <div className={styles.signature}>
            La Map <span>— depuis toujours</span>
          </div>
        </div>
        <div className={styles.storyFigures}>
          <div>
            <strong>02</strong>
            <span>modes de jeu</span>
          </div>
          <div>
            <strong>05</strong>
            <span>manches maximum</span>
          </div>
          <div>
            <strong>01</strong>
            <span>table à renverser</span>
          </div>
        </div>
      </section>

      <section className={styles.finalCta}>
        <div className={styles.finalSeal}>LM</div>
        <p>TA PLACE EST LIBRE</p>
        <h2>On distribue&nbsp;?</h2>
        <a
          href="mailto:support@lamap.gg?subject=TestFlight%20Lamap"
          className={styles.finalButton}
        >
          Rejoindre le TestFlight <span>→</span>
        </a>
        <small>Gratuit · une minute pour entrer à table</small>
      </section>

      <footer className={styles.footer}>
        <Mark />
        <p>Le jeu de cartes du Cameroun.</p>
        <div>
          <Link href="/support">Support</Link>
          <Link href="/confidentialite">Confidentialité</Link>
          <Link href="/cgu">CGU</Link>
        </div>
        <span>© 2026</span>
      </footer>
    </main>
  );
}
