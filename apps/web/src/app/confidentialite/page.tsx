import type { Metadata } from "next";
import Link from "next/link";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Lamap",
  description: "Données collectées et droits des joueurs de Lamap.",
};

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <Link className={styles.back} href="/">
          ← Retour à Lamap
        </Link>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Informations légales</p>
          <h1>Politique de confidentialité</h1>
          <p className={styles.updated}>Dernière mise à jour : 27 août 2026</p>
        </header>
        <div className={styles.content}>
          <section>
            <h2>Qui traite tes données ?</h2>
            <p>
              OkaTech, éditeur de Lamap, est responsable du traitement des
              données utilisées par l’application et le site Lamap.
            </p>
            <p>
              Pour toute question ou demande :{" "}
              <a href="mailto:support@lamap.gg">support@lamap.gg</a>.
            </p>
          </section>
          <section>
            <h2>Données utilisées</h2>
            <ul>
              <li>
                identifiant de compte Apple ou Google et adresse e-mail vérifiée
                fournie par le service choisi ;
              </li>
              <li>
                pseudo, avatar équipé, points, position et statistiques de
                parties ;
              </li>
              <li>
                parties, actions nécessaires à leur fonctionnement et incidents
                techniques ;
              </li>
              <li>
                produits cosmétiques possédés et références de transactions
                StoreKit nécessaires à la restauration et à la lutte contre la
                fraude ;
              </li>
              <li>signalements et blocages créés par les joueurs.</li>
            </ul>
            <p>
              Lamap n’utilise ni publicité ciblée, ni géolocalisation précise,
              ni carnet d’adresses, ni messagerie entre joueurs.
            </p>
          </section>
          <section>
            <h2>Pourquoi ?</h2>
            <p>
              Ces données permettent d’authentifier ton compte, faire
              fonctionner les parties et le classement, livrer et restaurer les
              achats, modérer les pseudos, sécuriser le service et répondre au
              support. Leur traitement repose selon le cas sur l’exécution du
              service, nos obligations légales ou notre intérêt légitime à
              prévenir la fraude et les abus.
            </p>
          </section>
          <section>
            <h2>Prestataires et transferts</h2>
            <p>
              Les données strictement nécessaires peuvent être traitées par
              Apple ou Google pour la connexion, Apple pour les achats, Convex
              pour l’hébergement du backend, et Expo/EAS pour la production
              technique de l’application. Certains prestataires peuvent traiter
              des données hors de l’Union européenne avec les garanties
              contractuelles applicables.
            </p>
            <p>Lamap ne vend pas les données personnelles.</p>
          </section>
          <section>
            <h2>Durée et sécurité</h2>
            <p>
              Les données du compte sont conservées tant que le compte existe.
              La suppression est disponible dans Profil → Supprimer mon compte.
              Les sessions sont alors révoquées et les données associées
              supprimées. Une référence de transaction anonymisée peut être
              conservée lorsque cela est strictement nécessaire à la prévention
              de la fraude ou à une obligation légale.
            </p>
          </section>
          <section>
            <h2>Tes droits</h2>
            <p>
              Tu peux demander l’accès, la rectification, l’effacement, la
              limitation ou la portabilité de tes données, et t’opposer à
              certains traitements en écrivant à{" "}
              <a href="mailto:support@lamap.gg">support@lamap.gg</a>. Tu peux
              aussi saisir la CNIL si tu estimes que tes droits ne sont pas
              respectés.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
