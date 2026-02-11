import React from 'react';
import Layout from '../../components/layout/Layout';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <Layout>
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Conditions d&apos;utilisation
          </h1>
          <p className="text-gray-500 mb-12">
            Dernière mise à jour : 1er janvier 2025
          </p>

          <div className="prose prose-gray max-w-none space-y-10">
            {/* Section 1 */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Acceptation des conditions
              </h2>
              <p className="text-gray-600 leading-relaxed">
                En accédant au site MyHouz et en utilisant nos services, vous acceptez
                d&apos;être lié par les présentes conditions d&apos;utilisation. Si vous
                n&apos;acceptez pas ces conditions, veuillez ne pas utiliser notre
                plateforme. Nous nous réservons le droit de modifier ces conditions à
                tout moment. L&apos;utilisation continue du site après toute
                modification constitue votre acceptation des nouvelles conditions.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Création et gestion de compte
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Pour accéder à certaines fonctionnalités de MyHouz, vous devez créer un
                compte. Lors de la création de votre compte, vous vous engagez à :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>
                  Fournir des informations exactes, complètes et à jour.
                </li>
                <li>
                  Maintenir la confidentialité de vos identifiants de connexion.
                </li>
                <li>
                  Notifier immédiatement MyHouz de toute utilisation non autorisée de
                  votre compte.
                </li>
                <li>
                  Être responsable de toutes les activités effectuées sous votre
                  compte.
                </li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                MyHouz se réserve le droit de suspendre ou de supprimer tout compte en
                cas de violation des présentes conditions.
              </p>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Utilisation de la plateforme
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Vous vous engagez à utiliser MyHouz conformément aux lois et
                réglementations en vigueur. Il est strictement interdit de :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>
                  Publier du contenu illicite, diffamatoire, offensant ou portant
                  atteinte aux droits d&apos;autrui.
                </li>
                <li>
                  Utiliser la plateforme à des fins commerciales non autorisées.
                </li>
                <li>
                  Tenter d&apos;accéder de manière non autorisée aux systèmes ou
                  données de MyHouz.
                </li>
                <li>
                  Perturber le fonctionnement normal de la plateforme.
                </li>
                <li>
                  Collecter ou stocker des données personnelles d&apos;autres
                  utilisateurs sans leur consentement.
                </li>
              </ul>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Propriété intellectuelle
              </h2>
              <p className="text-gray-600 leading-relaxed">
                L&apos;ensemble des contenus présents sur MyHouz, incluant mais sans se
                limiter aux textes, graphiques, logos, icônes, images, clips audio et
                logiciels, sont la propriété de MyHouz ou de ses concédants de licence
                et sont protégés par les lois françaises et internationales sur la
                propriété intellectuelle. Toute reproduction, distribution,
                modification ou utilisation non autorisée de ces contenus est
                strictement interdite.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                En publiant du contenu sur MyHouz, vous accordez à la plateforme une
                licence non exclusive, mondiale et gratuite d&apos;utiliser, reproduire
                et afficher ce contenu dans le cadre de nos services.
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Limitation de responsabilité
              </h2>
              <p className="text-gray-600 leading-relaxed">
                MyHouz agit en tant qu&apos;intermédiaire entre les utilisateurs et les
                professionnels. En conséquence, MyHouz ne saurait être tenu responsable
                de la qualité des prestations fournies par les professionnels, des
                litiges entre utilisateurs, de l&apos;exactitude des informations
                publiées par les tiers, ni des dommages directs ou indirects résultant
                de l&apos;utilisation de la plateforme. La plateforme est fournie
                &quot;en l&apos;état&quot; sans garantie d&apos;aucune sorte, expresse
                ou implicite.
              </p>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Modifications des conditions
              </h2>
              <p className="text-gray-600 leading-relaxed">
                MyHouz se réserve le droit de modifier les présentes conditions
                d&apos;utilisation à tout moment. Les utilisateurs seront informés de
                toute modification substantielle par notification sur la plateforme ou
                par e-mail. La continuation de l&apos;utilisation du service après la
                publication des modifications vaut acceptation des nouvelles conditions.
              </p>
            </div>

            {/* Contact */}
            <div className="border-t border-gray-200 pt-8">
              <p className="text-gray-600">
                Pour toute question concernant ces conditions d&apos;utilisation,
                veuillez nous contacter à{' '}
                <Link
                  href="/contact"
                  className="text-emerald-600 hover:text-emerald-700 underline"
                >
                  notre page de contact
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
