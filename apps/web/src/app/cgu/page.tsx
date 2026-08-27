import type { Metadata } from "next";
import Link from "next/link";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Conditions générales d’utilisation — Lamap",
  description: "Conditions d’utilisation du jeu mobile Lamap.",
};

export default function TermsPage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <Link className={styles.back} href="/">
          ← Retour à Lamap
        </Link>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Informations légales</p>
          <h1>Conditions d’utilisation</h1>
          <p className={styles.updated}>Dernière mise à jour : 27 août 2026</p>
        </header>
        <div className={styles.content}>
          <section>
            <h2>Le service</h2>
            <p>
              Lamap est un jeu gratuit édité par OkaTech. Il propose des parties
              classées entre joueurs, un entraînement contre l’IA, un classement
              mondial et une boutique de cosmétiques.
            </p>
          </section>
          <section>
            <h2>Compte et conduite</h2>
            <p>
              Tu es responsable de l’accès à ton compte et de ton pseudo. Les
              pseudos injurieux, discriminatoires, trompeurs ou portant atteinte
              aux droits d’autrui sont interdits. Les joueurs peuvent signaler
              ou bloquer un profil. OkaTech peut masquer un pseudo ou suspendre
              un compte en cas d’abus, de triche ou d’atteinte au service.
            </p>
            <p>
              Si tu es mineur, utilise Lamap avec l’autorisation de ton
              représentant légal.
            </p>
          </section>
          <section>
            <h2>Classement</h2>
            <p>
              Les parties classées font évoluer les points selon le résultat. Un
              abandon compte comme une défaite. L’entraînement n’a aucun effet
              sur le classement. La Kora est une victoire spéciale visuelle et
              sonore : elle n’a ni valeur monétaire, ni multiplicateur, ni bonus
              de points.
            </p>
          </section>
          <section>
            <h2>Cosmétiques et achats</h2>
            <p>
              Les cosmétiques payants sont des achats intégrés Apple non
              consommables. Leur prix et leur facturation sont affichés et gérés
              par l’App Store. Ils ne peuvent être ni revendus, ni échangés
              contre de l’argent. La restauration des achats est disponible dans
              le profil. Les remboursements relèvent des règles de l’App Store
              et peuvent entraîner la révocation du cosmétique concerné.
            </p>
          </section>
          <section>
            <h2>Disponibilité et responsabilité</h2>
            <p>
              Nous faisons le nécessaire pour maintenir le service, sans
              garantir une disponibilité permanente. Une partie interrompue par
              une erreur technique avant son résultat ne modifie pas le
              classement. Dans les limites prévues par la loi, OkaTech n’est pas
              responsable des interruptions dues aux réseaux, aux plateformes ou
              à un usage contraire à ces conditions.
            </p>
          </section>
          <section>
            <h2>Propriété intellectuelle</h2>
            <p>
              Le nom Lamap, l’application, son code, ses visuels, ses sons et
              ses textes sont protégés. Aucun droit de reproduction ou
              d’exploitation n’est accordé en dehors de l’usage personnel du
              jeu.
            </p>
          </section>
          <section>
            <h2>Contact et évolution</h2>
            <p>
              Ces conditions peuvent évoluer avec le service ou la loi. La
              version en vigueur est publiée ici. Pour nous contacter :{" "}
              <a href="mailto:support@lamap.gg">support@lamap.gg</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
