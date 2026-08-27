import type { Metadata } from "next";
import Link from "next/link";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Support — Lamap",
  description: "Aide pour le compte, les parties et les achats Lamap.",
};

export default function SupportPage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <Link className={styles.back} href="/">
          ← Retour à Lamap
        </Link>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Aide Lamap</p>
          <h1>Comment pouvons-nous t’aider ?</h1>
          <p className={styles.updated}>
            Réponse par e-mail : support@lamap.gg
          </p>
          <a
            className={styles.contact}
            href="mailto:support@lamap.gg?subject=Support%20Lamap"
          >
            Contacter le support
          </a>
        </header>
        <div className={`${styles.content} ${styles.cards}`}>
          <section className={styles.card}>
            <h2>Restaurer un achat</h2>
            <p>
              Dans l’application, ouvre Profil puis touche « Restaurer mes
              achats ». Utilise le même compte Apple que lors de l’achat.
            </p>
          </section>
          <section className={styles.card}>
            <h2>Supprimer ton compte</h2>
            <p>
              Ouvre Profil puis « Supprimer mon compte ». Une authentification
              récente est demandée avant la suppression définitive.
            </p>
          </section>
          <section className={styles.card}>
            <h2>Signaler ou bloquer</h2>
            <p>
              Fais un appui long sur un joueur dans le classement, ou utilise
              les actions proposées à la fin d’une partie.
            </p>
          </section>
          <section className={styles.card}>
            <h2>Partie interrompue</h2>
            <p>
              Relance l’application et vérifie ta connexion. Une interruption
              technique avant résultat ne doit pas changer tes points.
              Écris-nous si le problème persiste.
            </p>
          </section>
          <section className={styles.card}>
            <h2>Informations utiles</h2>
            <p>
              Dans ton message, indique ton pseudo, le modèle d’iPhone, la
              version d’iOS et l’heure approximative du problème. Ne joins
              jamais de mot de passe ni de code de connexion.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
