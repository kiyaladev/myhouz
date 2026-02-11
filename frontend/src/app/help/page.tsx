'use client';

import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import Link from 'next/link';
import { ChevronDown, Search, Home, Users, ShoppingBag, MessageCircle, Star, Settings } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  name: string;
  icon: React.ElementType;
  items: FaqItem[];
}

const faqCategories: FaqCategory[] = [
  {
    name: 'Général',
    icon: Home,
    items: [
      {
        question: 'Qu\'est-ce que MyHouz ?',
        answer: 'MyHouz est une plateforme en ligne dédiée à la rénovation et à la décoration de la maison. Elle permet aux particuliers de trouver l\'inspiration, de contacter des professionnels qualifiés et d\'acheter des produits pour leurs projets.',
      },
      {
        question: 'L\'inscription est-elle gratuite ?',
        answer: 'Oui, l\'inscription sur MyHouz est entièrement gratuite pour les particuliers. Les professionnels peuvent choisir entre un plan gratuit et des plans premium offrant des fonctionnalités avancées.',
      },
      {
        question: 'Comment créer un compte ?',
        answer: 'Cliquez sur le bouton « S\'inscrire » en haut de la page, puis remplissez le formulaire avec vos informations personnelles. Vous pouvez vous inscrire en tant que particulier ou professionnel.',
      },
    ],
  },
  {
    name: 'Professionnels',
    icon: Users,
    items: [
      {
        question: 'Comment trouver un professionnel ?',
        answer: 'Rendez-vous sur la page « Professionnels » pour parcourir notre annuaire. Vous pouvez filtrer par spécialité, localisation et évaluations. Consultez les profils, portfolios et avis avant de contacter un professionnel.',
      },
      {
        question: 'Comment contacter un professionnel ?',
        answer: 'Sur la page de profil d\'un professionnel, cliquez sur le bouton « Contacter » pour lui envoyer un message via notre messagerie intégrée. Vous pouvez décrire votre projet et demander un devis.',
      },
      {
        question: 'Les professionnels sont-ils vérifiés ?',
        answer: 'Nous vérifions les informations professionnelles de chaque inscrit (SIRET, assurances, qualifications). Les professionnels vérifiés sont identifiés par un badge sur leur profil.',
      },
    ],
  },
  {
    name: 'Produits & Achats',
    icon: ShoppingBag,
    items: [
      {
        question: 'Comment acheter un produit ?',
        answer: 'Parcourez notre marketplace de produits, ajoutez les articles souhaités à votre panier, puis procédez au paiement sécurisé. Vous pouvez suivre votre commande depuis votre tableau de bord.',
      },
      {
        question: 'Quels sont les moyens de paiement acceptés ?',
        answer: 'Nous acceptons les cartes bancaires (Visa, Mastercard, American Express), PayPal et les virements bancaires pour les commandes professionnelles.',
      },
      {
        question: 'Quelle est la politique de retour ?',
        answer: 'Vous disposez de 14 jours après réception pour retourner un article. Le produit doit être dans son état d\'origine. Les frais de retour sont à la charge de l\'acheteur, sauf en cas de produit défectueux.',
      },
    ],
  },
  {
    name: 'Messagerie',
    icon: MessageCircle,
    items: [
      {
        question: 'Comment envoyer un message ?',
        answer: 'Accédez à la messagerie depuis l\'icône de message dans le header ou depuis votre tableau de bord. Vous pouvez démarrer une nouvelle conversation depuis le profil d\'un professionnel.',
      },
      {
        question: 'Puis-je envoyer des pièces jointes ?',
        answer: 'Oui, vous pouvez envoyer des images et des documents dans vos conversations pour partager des plans, des photos de votre projet ou des devis.',
      },
    ],
  },
  {
    name: 'Avis & Évaluations',
    icon: Star,
    items: [
      {
        question: 'Comment laisser un avis ?',
        answer: 'Après avoir travaillé avec un professionnel ou reçu un produit, rendez-vous sur sa page de profil et cliquez sur « Laisser un avis ». Remplissez les critères de notation et ajoutez un commentaire.',
      },
      {
        question: 'Puis-je modifier ou supprimer mon avis ?',
        answer: 'Oui, vous pouvez modifier ou supprimer votre avis à tout moment depuis votre tableau de bord, dans la section « Mes avis ».',
      },
    ],
  },
  {
    name: 'Compte & Paramètres',
    icon: Settings,
    items: [
      {
        question: 'Comment modifier mes informations personnelles ?',
        answer: 'Rendez-vous dans votre profil en cliquant sur « Mon profil » puis « Modifier le profil ». Vous pourrez y modifier vos informations personnelles, votre photo et vos préférences.',
      },
      {
        question: 'Comment supprimer mon compte ?',
        answer: 'Pour supprimer votre compte, contactez notre équipe support via la page de contact. La suppression est irréversible et entraîne la suppression de toutes vos données.',
      },
      {
        question: 'J\'ai oublié mon mot de passe, que faire ?',
        answer: 'Sur la page de connexion, cliquez sur « Mot de passe oublié ». Entrez votre adresse e-mail et suivez les instructions envoyées par e-mail pour réinitialiser votre mot de passe.',
      },
    ],
  },
];

function FaqAccordionItem({ item }: { item: FaqItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full py-4 text-left"
      >
        <span className="text-gray-900 font-medium">{item.question}</span>
        <ChevronDown
          className={`h-5 w-5 text-gray-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="pb-4">
          <p className="text-gray-600 leading-relaxed">{item.answer}</p>
        </div>
      )}
    </div>
  );
}

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      items: category.items.filter(
        (item) =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.items.length > 0);

  const displayCategories = activeCategory
    ? filteredCategories.filter((c) => c.name === activeCategory)
    : filteredCategories;

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Centre d&apos;aide
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Comment pouvons-nous vous aider ?
          </p>
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Rechercher dans la FAQ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="py-8 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === null
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Toutes les catégories
            </button>
            {faqCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.name}
                  onClick={() =>
                    setActiveCategory(
                      activeCategory === category.name ? null : category.name
                    )
                  }
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category.name
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {displayCategories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Aucun résultat trouvé pour « {searchQuery} »
              </p>
              <p className="text-gray-400 mt-2">
                Essayez avec d&apos;autres termes ou{' '}
                <Link
                  href="/contact"
                  className="text-emerald-600 hover:text-emerald-700 underline"
                >
                  contactez-nous
                </Link>
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {displayCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <div key={category.name}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Icon className="h-5 w-5 text-emerald-600" />
                      </div>
                      <h2 className="text-2xl font-semibold text-gray-900">
                        {category.name}
                      </h2>
                    </div>
                    <div>
                      {category.items.map((item, index) => (
                        <FaqAccordionItem key={index} item={item} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Vous n&apos;avez pas trouvé votre réponse ?
          </h2>
          <p className="text-gray-600 mb-6">
            Notre équipe est disponible pour répondre à toutes vos questions.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Contactez-nous
          </Link>
        </div>
      </section>
    </Layout>
  );
}
