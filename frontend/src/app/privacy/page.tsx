import React from 'react';
import Layout from '../../components/layout/Layout';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <Layout>
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Politique de confidentialité
          </h1>
          <p className="text-gray-500 mb-12">
            Dernière mise à jour : 1er janvier 2025
          </p>

          <div className="prose prose-gray max-w-none space-y-10">
            {/* Section 1 */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Collecte des données
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Dans le cadre de l&apos;utilisation de MyHouz, nous collectons les
                données suivantes :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>
                  <strong>Données d&apos;identification :</strong> nom, prénom, adresse
                  e-mail, numéro de téléphone.
                </li>
                <li>
                  <strong>Données professionnelles :</strong> raison sociale, numéro
                  SIRET, qualifications (pour les comptes professionnels).
                </li>
                <li>
                  <strong>Données de navigation :</strong> adresse IP, type de
                  navigateur, pages consultées, durée de visite.
                </li>
                <li>
                  <strong>Données de contenu :</strong> photos, descriptions de projets,
                  avis et commentaires publiés.
                </li>
              </ul>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Utilisation des données
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Vos données personnelles sont utilisées pour :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Gérer votre compte et vous authentifier sur la plateforme.</li>
                <li>
                  Personnaliser votre expérience et vous recommander des contenus
                  pertinents.
                </li>
                <li>
                  Faciliter la mise en relation entre particuliers et professionnels.
                </li>
                <li>Traiter vos commandes et gérer les transactions.</li>
                <li>
                  Vous envoyer des communications relatives à nos services (avec votre
                  consentement).
                </li>
                <li>
                  Améliorer nos services et analyser l&apos;utilisation de la
                  plateforme.
                </li>
              </ul>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Partage des données
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Nous ne vendons jamais vos données personnelles. Vos données peuvent
                être partagées avec :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>
                  <strong>Les professionnels :</strong> lorsque vous les contactez via
                  la plateforme, les informations nécessaires à la prise de contact sont
                  transmises.
                </li>
                <li>
                  <strong>Nos prestataires techniques :</strong> hébergement, analyse de
                  données, envoi d&apos;e-mails, dans le strict cadre de leurs missions.
                </li>
                <li>
                  <strong>Les autorités compétentes :</strong> en cas d&apos;obligation
                  légale ou de demande judiciaire.
                </li>
              </ul>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Cookies
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                MyHouz utilise des cookies pour améliorer votre expérience de
                navigation. Les types de cookies utilisés sont :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>
                  <strong>Cookies essentiels :</strong> nécessaires au fonctionnement du
                  site (authentification, sécurité).
                </li>
                <li>
                  <strong>Cookies analytiques :</strong> permettent d&apos;analyser
                  l&apos;utilisation du site pour l&apos;améliorer.
                </li>
                <li>
                  <strong>Cookies de personnalisation :</strong> mémorisent vos
                  préférences pour une expérience sur mesure.
                </li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                Vous pouvez gérer vos préférences de cookies à tout moment via les
                paramètres de votre navigateur.
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Vos droits
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Conformément au Règlement Général sur la Protection des Données (RGPD),
                vous disposez des droits suivants :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>
                  <strong>Droit d&apos;accès :</strong> obtenir une copie de vos
                  données personnelles.
                </li>
                <li>
                  <strong>Droit de rectification :</strong> corriger des données
                  inexactes ou incomplètes.
                </li>
                <li>
                  <strong>Droit à l&apos;effacement :</strong> demander la suppression
                  de vos données.
                </li>
                <li>
                  <strong>Droit à la portabilité :</strong> recevoir vos données dans un
                  format structuré et lisible.
                </li>
                <li>
                  <strong>Droit d&apos;opposition :</strong> vous opposer au traitement
                  de vos données à des fins de prospection.
                </li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                Pour exercer ces droits, contactez-nous via notre{' '}
                <Link
                  href="/contact"
                  className="text-emerald-600 hover:text-emerald-700 underline"
                >
                  page de contact
                </Link>
                .
              </p>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Sécurité des données
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Nous mettons en œuvre des mesures techniques et organisationnelles
                appropriées pour protéger vos données personnelles contre l&apos;accès
                non autorisé, la modification, la divulgation ou la destruction. Ces
                mesures incluent le chiffrement des données en transit et au repos,
                l&apos;authentification sécurisée et des audits de sécurité réguliers.
              </p>
            </div>

            {/* Section 7 */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Contact
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Pour toute question relative à notre politique de confidentialité ou
                pour exercer vos droits, vous pouvez nous contacter à tout moment via
                notre{' '}
                <Link
                  href="/contact"
                  className="text-emerald-600 hover:text-emerald-700 underline"
                >
                  page de contact
                </Link>{' '}
                ou par e-mail à{' '}
                <span className="text-emerald-600">privacy@myhouz.fr</span>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
