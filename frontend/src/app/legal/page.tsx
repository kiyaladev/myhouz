import React from 'react';
import type { Metadata } from 'next';
import Layout from '../../components/layout/Layout';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Mentions légales - MyHouz',
  description: 'Mentions légales de la plateforme MyHouz — informations sur l\'éditeur et l\'hébergeur.',
};

export default function LegalPage() {
  return (
    <Layout>
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mentions légales
          </h1>
          <p className="text-gray-500 mb-12">
            Dernière mise à jour : 1er janvier 2025
          </p>

          <div className="prose prose-gray max-w-none space-y-10">
            {/* Section 1 */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Éditeur du site
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Le site MyHouz est édité par :
              </p>
              <ul className="list-none text-gray-600 space-y-2">
                <li>
                  <strong>Raison sociale :</strong> MyHouz SAS
                </li>
                <li>
                  <strong>Siège social :</strong> 42 rue de la Rénovation, 75001
                  Paris, France
                </li>
                <li>
                  <strong>Capital social :</strong> 50 000 €
                </li>
                <li>
                  <strong>RCS :</strong> Paris B 123 456 789
                </li>
                <li>
                  <strong>SIRET :</strong> 123 456 789 00001
                </li>
                <li>
                  <strong>Numéro de TVA :</strong> FR 12 345678901
                </li>
                <li>
                  <strong>Directeur de la publication :</strong> Sophie Martin
                </li>
                <li>
                  <strong>E-mail :</strong>{' '}
                  <span className="text-emerald-600">contact@myhouz.fr</span>
                </li>
                <li>
                  <strong>Téléphone :</strong> +33 1 23 45 67 89
                </li>
              </ul>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Hébergeur
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Le site MyHouz est hébergé par OVH SAS, dont le siège social est
                situé au 2 rue Kellermann, 59100 Roubaix, France. Téléphone :
                +33 9 72 10 10 07.
              </p>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Propriété intellectuelle
              </h2>
              <p className="text-gray-600 leading-relaxed">
                L&apos;ensemble des éléments constituant le site MyHouz (textes,
                graphismes, logiciels, photographies, images, vidéos, sons,
                plans, logos, marques, créations et œuvres protégeables diverses,
                bases de données, etc.) ainsi que le site lui-même, relèvent des
                législations françaises et internationales sur le droit de la
                propriété intellectuelle. Ces éléments restent la propriété
                exclusive de MyHouz SAS. Toute reproduction, représentation,
                utilisation ou adaptation, sous quelque forme que ce soit, de
                tout ou partie de ces éléments est strictement interdite sans
                l&apos;autorisation écrite préalable de MyHouz SAS.
              </p>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Responsabilité
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                MyHouz SAS s&apos;efforce d&apos;assurer au mieux de ses
                possibilités, l&apos;exactitude et la mise à jour des
                informations diffusées sur ce site. Toutefois, MyHouz SAS ne
                peut garantir l&apos;exactitude, la précision ou
                l&apos;exhaustivité des informations mises à disposition sur ce
                site.
              </p>
              <p className="text-gray-600 leading-relaxed">
                MyHouz SAS décline toute responsabilité pour tout dommage
                résultant d&apos;une intrusion frauduleuse d&apos;un tiers ayant
                entraîné une modification des informations ou éléments mis à
                disposition sur le site, ainsi que pour les éventuels virus
                informatiques contractés lors de la navigation sur le site.
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Protection des données personnelles
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Conformément à la loi « Informatique et Libertés » du 6 janvier
                1978 modifiée et au Règlement Général sur la Protection des
                Données (RGPD), vous disposez d&apos;un droit d&apos;accès, de
                rectification, de suppression et d&apos;opposition aux données
                personnelles vous concernant. Pour exercer ce droit, veuillez
                consulter notre{' '}
                <Link
                  href="/privacy"
                  className="text-emerald-600 hover:text-emerald-700 underline"
                >
                  politique de confidentialité
                </Link>{' '}
                ou nous contacter via notre{' '}
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
                6. Cookies
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Le site MyHouz utilise des cookies pour améliorer
                l&apos;expérience de navigation et à des fins statistiques. En
                naviguant sur ce site, vous acceptez l&apos;utilisation de
                cookies conformément à notre politique de cookies. Vous pouvez à
                tout moment modifier les paramètres de votre navigateur pour
                refuser les cookies.
              </p>
            </div>

            {/* Section 7 */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Droit applicable
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Les présentes mentions légales sont régies par le droit français.
                En cas de litige, les tribunaux français seront seuls compétents.
              </p>
            </div>

            {/* Contact */}
            <div className="border-t border-gray-200 pt-8">
              <p className="text-gray-600">
                Pour toute question concernant ces mentions légales, veuillez
                nous contacter à{' '}
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
