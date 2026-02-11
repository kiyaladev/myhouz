# MyHouz — Plan de Développement (Clone Houzz.com)

Ce fichier documente l'ensemble des tâches nécessaires pour créer un clone fonctionnel et graphique de [Houzz.com](https://houzz.com/). Chaque section correspond à un module majeur de la plateforme.

> **Légende** : ✅ Fait | 🟡 Partiel | ❌ À faire

---

## Table des matières

1. [Infrastructure & Configuration](#1-infrastructure--configuration)
2. [Authentification & Gestion des Utilisateurs](#2-authentification--gestion-des-utilisateurs)
3. [Page d'Accueil](#3-page-daccueil)
4. [Galerie de Photos / Projets](#4-galerie-de-photos--projets)
5. [Annuaire des Professionnels](#5-annuaire-des-professionnels)
6. [Marketplace (Boutique de Produits)](#6-marketplace-boutique-de-produits)
7. [Ideabooks (Carnets d'Idées)](#7-ideabooks-carnets-didées)
8. [Articles & Magazine](#8-articles--magazine)
9. [Forum / Discussions](#9-forum--discussions)
10. [Messagerie](#10-messagerie)
11. [Avis & Évaluations](#11-avis--évaluations)
12. [Recherche Globale](#12-recherche-globale)
13. [Tableau de Bord Utilisateur](#13-tableau-de-bord-utilisateur)
14. [Tableau de Bord Professionnel](#14-tableau-de-bord-professionnel)
15. [Commandes & Paiements](#15-commandes--paiements)
16. [Notifications](#16-notifications)
17. [Pages Statiques & SEO](#17-pages-statiques--seo)
18. [Design System & UI](#18-design-system--ui)
19. [Performance & Optimisation](#19-performance--optimisation)
20. [Tests](#20-tests)
21. [Déploiement & CI/CD](#21-déploiement--cicd)

---

## 1. Infrastructure & Configuration

| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 1.1 | Configuration backend Express.js + TypeScript | ✅ | `backend/src/server.ts`, `backend/src/index.ts` |
| 1.2 | Configuration frontend Next.js + Tailwind CSS | ✅ | `frontend/` avec Next.js 15 + React 19 |
| 1.3 | Connexion MongoDB avec Mongoose | ✅ | `backend/src/config/database.ts` |
| 1.4 | Variables d'environnement (.env) | ✅ | `.env.example` présent |
| 1.5 | Configuration CORS | ✅ | Intégré dans server.ts |
| 1.6 | Configuration des uploads fichiers (Multer) | ✅ | `backend/src/middleware/upload.ts` |
| 1.7 | Intégration MinIO pour stockage images (S3-compatible) | ✅ | `backend/src/config/minio.ts`, `backend/src/services/uploadService.ts`, routes `/api/uploads` |
| 1.8 | Configuration Stripe (paiements) | ❌ | Dépendance installée mais non intégrée |
| 1.9 | Configuration Nodemailer (e-mails) | ❌ | Dépendance installée mais non intégrée |
| 1.10 | Docker / Docker Compose pour dev local | ✅ | `docker-compose.yml` avec MongoDB + MinIO |
| 1.11 | Seed data / données de démonstration | ❌ | Script pour populer la BD avec des données de démo |

---

## 2. Authentification & Gestion des Utilisateurs

### Backend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 2.1 | Modèle User (particulier / professionnel) | ✅ | `backend/src/models/User.ts` |
| 2.2 | Inscription (register) | ✅ | `UserController.register` |
| 2.3 | Connexion (login) avec JWT | ✅ | `UserController.login` |
| 2.4 | Middleware d'authentification | ✅ | `backend/src/middleware/auth.ts` |
| 2.5 | Middleware rôle (particulier / professionnel) | ✅ | `requireProfessional`, `requireParticulier` |
| 2.6 | Mot de passe oublié / reset | ❌ | Endpoint + envoi e-mail |
| 2.7 | Vérification e-mail | ❌ | Token de vérification + e-mail |
| 2.8 | OAuth (Google, Facebook) | ❌ | Stratégie Passport.js ou équivalent |
| 2.9 | Gestion du profil utilisateur (CRUD) | ✅ | `UserController.getProfile` + `UserController.updateProfile` |
| 2.10 | Upload photo de profil / avatar | ❌ | — |
| 2.11 | Refresh token / gestion des sessions | ❌ | — |

### Frontend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 2.12 | Page connexion / inscription | ✅ | `frontend/src/app/auth/login/page.tsx` |
| 2.13 | Boutons OAuth (Google, Facebook) | 🟡 | UI présente, pas connecté au backend |
| 2.14 | Contexte d'authentification (AuthContext/Provider) | ✅ | `frontend/src/contexts/AuthContext.tsx` avec JWT + localStorage |
| 2.15 | Protection des routes côté client | ✅ | Middleware Next.js + redirect dans les composants |
| 2.16 | Page mot de passe oublié | ❌ | — |
| 2.17 | Page profil utilisateur | ✅ | `frontend/src/app/profile/page.tsx` |
| 2.18 | Page édition du profil | ✅ | `frontend/src/app/profile/edit/page.tsx` |

---

## 3. Page d'Accueil

| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 3.1 | Hero section avec image/vidéo de fond | 🟡 | Gradient de fond, pas d'image/vidéo réelle |
| 3.2 | Barre de recherche principale | ✅ | Présente sur la page d'accueil |
| 3.3 | Grille catégories par pièce (cuisine, salon, etc.) | ✅ | 4 catégories avec images Unsplash |
| 3.4 | Section statistiques | ✅ | Chiffres statiques |
| 3.5 | Section fonctionnalités | ✅ | 3 cartes (Inspiration, Pros, Marketplace) |
| 3.6 | Section CTA (Call to Action) | ✅ | Inscription + En savoir plus |
| 3.7 | Carrousel de projets tendance | ❌ | Slider interactif avec projets populaires |
| 3.8 | Section « Professionnels à la une » | ❌ | Carousel de professionnels recommandés |
| 3.9 | Section « Produits populaires » | ❌ | Grille de produits tendance |
| 3.10 | Section « Articles récents » | ❌ | Aperçu des derniers articles du magazine |
| 3.11 | Personnalisation selon le profil connecté | ❌ | Recommandations basées sur les préférences |
| 3.12 | Hero image/vidéo immersive (style Houzz) | ❌ | Grande photo plein écran avec overlay |

---

## 4. Galerie de Photos / Projets

### Backend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 4.1 | Modèle Project | ✅ | `backend/src/models/Project.ts` |
| 4.2 | CRUD projets | ✅ | `ProjectController` |
| 4.3 | Upload multiple images par projet | 🟡 | Logique Multer présente, à tester |
| 4.4 | Filtrage par catégorie / pièce / style | ✅ | Paramètres de query dans le controller |
| 4.5 | Tri (populaire, récent, vues) | 🟡 | Partiel |
| 4.6 | Système de likes / favoris | ❌ | Ajout/retrait de likes sur un projet |
| 4.7 | Tag de produits sur les photos | ❌ | Positionnement de produits sur une image |
| 4.8 | Pagination côté serveur | 🟡 | À vérifier/compléter |

### Frontend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 4.9 | Page liste des projets avec filtres | ✅ | `frontend/src/app/projects/page.tsx` |
| 4.10 | Grille masonry (style Pinterest/Houzz) | ❌ | Layout en colonnes décalées |
| 4.11 | Page détail d'un projet | ✅ | `frontend/src/app/projects/[id]/page.tsx` — Galerie photos, description, professionnel |
| 4.12 | Visionneuse d'images plein écran (lightbox) | ❌ | Modal avec navigation entre images |
| 4.13 | Bouton « Sauvegarder dans un Ideabook » | ❌ | Popup de sélection d'ideabook |
| 4.14 | Affichage des produits tagués sur les photos | ❌ | Hotspots cliquables sur les images |
| 4.15 | Scroll infini ou pagination | ❌ | Chargement progressif des projets |
| 4.16 | Connexion au backend API | ❌ | Remplacer les données mock par des appels API |

---

## 5. Annuaire des Professionnels

### Backend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 5.1 | Filtre utilisateurs de type professionnel | ✅ | Via `userType: 'professionnel'` |
| 5.2 | Recherche géolocalisée (par ville/code postal) | 🟡 | Index géospatial dans le modèle User |
| 5.3 | Filtrage par spécialité / service | ❌ | Endpoint dédié |
| 5.4 | Système de notation moyen par professionnel | ❌ | Agrégation depuis les avis |
| 5.5 | Profil professionnel enrichi | 🟡 | Champs `professionalInfo` dans le modèle |
| 5.6 | Demande de devis | ❌ | Endpoint + notification au professionnel |

### Frontend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 5.7 | Page liste des professionnels | ✅ | `frontend/src/app/professionals/page.tsx` — Grille avec filtres (ville, spécialité) |
| 5.8 | Page profil d'un professionnel | ✅ | `frontend/src/app/professionals/[id]/page.tsx` — Bio, services, infos |
| 5.9 | Carte interactive (Google Maps / Mapbox) | ❌ | Localisation des pros sur une carte |
| 5.10 | Formulaire de demande de devis | ❌ | Description du projet + envoi au pro |
| 5.11 | Bouton « Contacter ce professionnel » | ❌ | Ouvre la messagerie |
| 5.12 | Galerie des projets du professionnel | ❌ | Sous-page portfolio |

---

## 6. Marketplace (Boutique de Produits)

### Backend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 6.1 | Modèle Product | ✅ | `backend/src/models/Product.ts` |
| 6.2 | CRUD produits | ✅ | `ProductController` |
| 6.3 | Recherche full-text | 🟡 | Index text dans le modèle |
| 6.4 | Filtrage par catégorie / prix / marque | ✅ | Query params dans le controller |
| 6.5 | Gestion du panier | ❌ | Endpoint ou session côté client |
| 6.6 | Gestion des variantes (taille, couleur) | ❌ | — |
| 6.7 | Gestion de l'inventaire / stock | 🟡 | Champ `inventory` dans le modèle |
| 6.8 | Wishlist / liste de souhaits | ❌ | — |

### Frontend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 6.9 | Page liste des produits avec filtres | ✅ | `frontend/src/app/products/page.tsx` |
| 6.10 | Page détail d'un produit | ✅ | `frontend/src/app/products/[id]/page.tsx` — Galerie, prix, spécifications, vendeur |
| 6.11 | Galerie d'images produit (zoom, slider) | ❌ | Carrousel avec zoom au survol |
| 6.12 | Composant panier (sidebar/drawer) | ❌ | — |
| 6.13 | Page panier récapitulatif | ❌ | Liste des articles, quantités, total |
| 6.14 | Système de filtres avancés (sidebar) | ❌ | Filtres à facettes style Houzz |
| 6.15 | Connexion au backend API | ❌ | Remplacer les données mock |
| 6.16 | Suggestions de produits similaires | ❌ | Section « Vous aimerez aussi » |

---

## 7. Ideabooks (Carnets d'Idées)

### Backend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 7.1 | Modèle Ideabook | ✅ | `backend/src/models/Ideabook.ts` |
| 7.2 | CRUD ideabooks | ✅ | `IdeabookController` |
| 7.3 | Ajout/suppression d'éléments (photos, produits) | 🟡 | À vérifier |
| 7.4 | Collaboration (partage avec d'autres utilisateurs) | ❌ | Invitations et permissions |
| 7.5 | Ideabooks publics / privés | 🟡 | Champ de visibilité dans le modèle |

### Frontend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 7.6 | Page liste des ideabooks de l'utilisateur | ✅ | `frontend/src/app/ideabooks/page.tsx` — Grille de carnets avec couverture, recherche |
| 7.7 | Page détail d'un ideabook | ✅ | `frontend/src/app/ideabooks/[id]/page.tsx` — Grille des éléments, infos créateur, tags |
| 7.8 | Modal « Sauvegarder dans un ideabook » | ❌ | Popup lors du clic sur le cœur/bookmark |
| 7.9 | Création rapide d'un ideabook | ❌ | Formulaire minimal (nom, description) |
| 7.10 | Drag & drop pour réorganiser les éléments | ❌ | — |
| 7.11 | Partage d'ideabook (lien public, invitation) | ❌ | — |
| 7.12 | Explorer les ideabooks publics populaires | ❌ | Page de découverte |

---

## 8. Articles & Magazine

### Backend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 8.1 | Modèle Article | ✅ | `backend/src/models/Article.ts` |
| 8.2 | CRUD articles | ✅ | `ArticleController` |
| 8.3 | Catégorisation des articles | 🟡 | Champ catégorie dans le modèle |
| 8.4 | Système de commentaires sur articles | ❌ | — |
| 8.5 | Articles liés / suggestions | ❌ | — |

### Frontend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 8.6 | Page liste des articles (blog/magazine) | ✅ | `frontend/src/app/articles/page.tsx` — Featured article, grille, filtres catégorie |
| 8.7 | Page détail d'un article | ✅ | `frontend/src/app/articles/[slug]/page.tsx` — Contenu, auteur, articles liés, partage |
| 8.8 | Filtrage par catégorie / tag | ❌ | — |
| 8.9 | Section commentaires | ❌ | — |
| 8.10 | Partage sur les réseaux sociaux | ❌ | Boutons de partage |
| 8.11 | Composant éditeur de contenu riche (admin) | ❌ | WYSIWYG pour rédiger les articles |

---

## 9. Forum / Discussions

### Backend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 9.1 | Modèle ForumPost / ForumReply | ✅ | `backend/src/models/Forum.ts` |
| 9.2 | CRUD posts et réponses | ✅ | `ForumController` |
| 9.3 | Catégorisation des discussions | 🟡 | — |
| 9.4 | Système de votes (upvote/downvote) | ❌ | — |
| 9.5 | Marquer une réponse comme « meilleure réponse » | ❌ | — |
| 9.6 | Modération (signalement, suppression) | ❌ | — |

### Frontend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 9.7 | Page liste des discussions | ✅ | `frontend/src/app/forum/page.tsx` — Liste avec filtres catégorie, recherche, badges résolu |
| 9.8 | Page détail d'une discussion + réponses | ✅ | `frontend/src/app/forum/[id]/page.tsx` — Thread, réponses, meilleure réponse, formulaire |
| 9.9 | Formulaire pour poser une question | ❌ | Titre, catégorie, description, images |
| 9.10 | Formulaire de réponse | ❌ | Éditeur texte riche ou Markdown |
| 9.11 | Recherche dans le forum | ❌ | — |
| 9.12 | Filtrage par catégorie / tag | ❌ | — |

---

## 10. Messagerie

### Backend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 10.1 | Modèle Message / Conversation | ✅ | `backend/src/models/Message.ts` |
| 10.2 | CRUD messages et conversations | ✅ | `MessageController` |
| 10.3 | Temps réel avec WebSocket (Socket.io) | ❌ | Notifications et messages instantanés |
| 10.4 | Marquage lu / non lu | ❌ | — |
| 10.5 | Pièces jointes dans les messages | ❌ | Upload d'images dans la conversation |

### Frontend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 10.6 | Page messagerie (inbox) | ❌ | Liste des conversations |
| 10.7 | Vue conversation avec fil de messages | ❌ | Chat style messagerie instantanée |
| 10.8 | Indicateur de messages non lus | ❌ | Badge sur l'icône dans le header |
| 10.9 | Envoi de pièces jointes | ❌ | — |
| 10.10 | Notifications en temps réel | ❌ | Toast ou badge lors d'un nouveau message |

---

## 11. Avis & Évaluations

### Backend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 11.1 | Modèle Review | ✅ | `backend/src/models/Review.ts` |
| 11.2 | CRUD avis | ✅ | `ReviewController` |
| 11.3 | Vérification (un avis par utilisateur par cible) | ❌ | — |
| 11.4 | Calcul de la note moyenne | ❌ | Agrégation MongoDB |
| 11.5 | Signalement d'avis inappropriés | ❌ | — |

### Frontend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 11.6 | Composant d'affichage des avis | ❌ | Étoiles, texte, auteur, date |
| 11.7 | Formulaire de rédaction d'avis | ❌ | Notation + commentaire + photos |
| 11.8 | Affichage des avis sur profils pros | ❌ | Section avis avec pagination |
| 11.9 | Affichage des avis sur fiches produits | ❌ | Résumé de notation + liste |
| 11.10 | Filtrage / tri des avis | ❌ | Par note, date, pertinence |

---

## 12. Recherche Globale

### Backend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 12.1 | Endpoint de recherche globale | ❌ | Recherche multi-entités (projets, produits, pros, articles) |
| 12.2 | Index de recherche MongoDB text | 🟡 | Index texte sur certains modèles |
| 12.3 | Autocomplétion / suggestions | ❌ | Endpoint de suggestions en temps réel |
| 12.4 | Recherche par image (optionnel) | ❌ | Fonctionnalité avancée |

### Frontend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 12.5 | Barre de recherche dans le header | ✅ | Input présent dans `Header.tsx` |
| 12.6 | Page de résultats de recherche | ❌ | Résultats groupés par type |
| 12.7 | Autocomplétion avec dropdown | ❌ | Suggestions lors de la saisie |
| 12.8 | Filtres sur la page de résultats | ❌ | Affinage par type, catégorie, prix |
| 12.9 | Recherche vocale (optionnel) | ❌ | — |

---

## 13. Tableau de Bord Utilisateur (Particulier)

### Frontend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 13.1 | Page tableau de bord principal | ❌ | Vue d'ensemble : ideabooks, commandes, messages |
| 13.2 | Mes ideabooks | ❌ | Liste et gestion des carnets |
| 13.3 | Mes commandes | ❌ | Historique et suivi des commandes |
| 13.4 | Mes avis | ❌ | Avis rédigés avec possibilité d'édition |
| 13.5 | Mes projets favoris | ❌ | Photos et projets sauvegardés |
| 13.6 | Paramètres du compte | ❌ | E-mail, mot de passe, préférences |
| 13.7 | Notifications | ❌ | Centre de notifications |

---

## 14. Tableau de Bord Professionnel

### Frontend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 14.1 | Page tableau de bord professionnel | ❌ | Statistiques, messages, projets |
| 14.2 | Gestion du portfolio (projets) | ❌ | Ajouter/éditer/supprimer des projets |
| 14.3 | Gestion des produits (marketplace) | ❌ | Ajouter/éditer/supprimer des produits |
| 14.4 | Gestion des avis reçus | ❌ | Répondre aux avis clients |
| 14.5 | Statistiques (vues, contacts, devis) | ❌ | Graphiques et métriques |
| 14.6 | Gestion des demandes de devis | ❌ | Liste des demandes avec réponse |
| 14.7 | Paramètres du profil professionnel | ❌ | Infos, services, zone géographique |
| 14.8 | Gestion de l'abonnement | ❌ | Plans gratuit / premium |

---

## 15. Commandes & Paiements

### Backend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 15.1 | Modèle Order | ✅ | `backend/src/models/Order.ts` |
| 15.2 | CRUD commandes | ✅ | `OrderController` |
| 15.3 | Intégration Stripe Checkout | ❌ | Session de paiement + webhooks |
| 15.4 | Gestion des statuts de commande | ❌ | En attente → Payée → Expédiée → Livrée |
| 15.5 | E-mail de confirmation de commande | ❌ | Template + envoi via Nodemailer |
| 15.6 | Gestion des remboursements | ❌ | — |

### Frontend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 15.7 | Page checkout / tunnel d'achat | ❌ | Adresse, livraison, paiement |
| 15.8 | Intégration Stripe Elements | ❌ | Formulaire de carte bancaire |
| 15.9 | Page de confirmation de commande | ❌ | Récapitulatif après paiement |
| 15.10 | Page de suivi de commande | ❌ | Statut et historique |

---

## 16. Notifications

### Backend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 16.1 | Modèle Notification | ❌ | Type, message, destinataire, lu/non lu |
| 16.2 | Création automatique de notifications | ❌ | Nouveau message, avis, commande, etc. |
| 16.3 | WebSocket pour notifications temps réel | ❌ | Socket.io |
| 16.4 | Notifications par e-mail | ❌ | Templates Nodemailer |
| 16.5 | Préférences de notification par utilisateur | ❌ | — |

### Frontend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 16.6 | Icône notification dans le header avec badge | ❌ | Compteur de notifications non lues |
| 16.7 | Dropdown / panel de notifications | ❌ | Liste rapide des dernières notifications |
| 16.8 | Page complète des notifications | ❌ | Historique complet avec filtres |

---

## 17. Pages Statiques & SEO

| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 17.1 | Header / Navigation | ✅ | `frontend/src/components/layout/Header.tsx` |
| 17.2 | Footer | ✅ | `frontend/src/components/layout/Footer.tsx` |
| 17.3 | Page « À propos » | ✅ | `frontend/src/app/about/page.tsx` — Mission, valeurs, stats, CTA |
| 17.4 | Page « Conditions d'utilisation » | ✅ | `frontend/src/app/terms/page.tsx` — Sections juridiques en français |
| 17.5 | Page « Politique de confidentialité » | ✅ | `frontend/src/app/privacy/page.tsx` — Sections RGPD en français |
| 17.6 | Page « Mentions légales » | ❌ | — |
| 17.7 | Page « Contact » | ✅ | `frontend/src/app/contact/page.tsx` — Formulaire + infos contact |
| 17.8 | Page « Centre d'aide / FAQ » | ❌ | — |
| 17.9 | Page 404 personnalisée | ✅ | `frontend/src/app/not-found.tsx` — Page 404 avec redirection accueil |
| 17.10 | Metadata SEO par page (title, description, OG) | 🟡 | Metadata de base dans layout.tsx |
| 17.11 | Sitemap.xml dynamique | ❌ | — |
| 17.12 | Fichier robots.txt | ❌ | — |
| 17.13 | Structured data (JSON-LD) | ❌ | Pour les produits, pros, articles |

---

## 18. Design System & UI

| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 18.1 | Composants UI de base (shadcn/ui) | ✅ | Button, Card, Input, Label, Dialog, Avatar, Select, Tabs, Badge |
| 18.2 | Thème / palette de couleurs (emerald) | ✅ | Tailwind config |
| 18.3 | Typographie et hiérarchie visuelle | 🟡 | À affiner pour ressembler à Houzz |
| 18.4 | Layout responsive (mobile-first) | 🟡 | Breakpoints en place, à optimiser |
| 18.5 | Composant Carousel / Slider | ❌ | Pour les photos et produits |
| 18.6 | Composant Masonry Grid | ❌ | Grille Pinterest-style pour les photos |
| 18.7 | Composant Lightbox / visionneuse d'images | ❌ | Modal plein écran avec navigation |
| 18.8 | Composant Skeleton / loading states | ✅ | `frontend/src/components/ui/skeleton.tsx` |
| 18.9 | Composant Toast / notifications | ❌ | Messages de feedback utilisateur |
| 18.10 | Composant Modal de confirmation | ❌ | — |
| 18.11 | Composant Dropdown menu | ❌ | Menu utilisateur, actions |
| 18.12 | Composant Breadcrumb | ✅ | `frontend/src/components/ui/breadcrumb.tsx` — Navigation hiérarchique |
| 18.13 | Composant Pagination | ✅ | `frontend/src/components/ui/pagination.tsx` — Composant réutilisable |
| 18.14 | Composant Rating (étoiles) | 🟡 | SVG inline, à extraire en composant |
| 18.15 | Composant Empty State | ✅ | `frontend/src/components/ui/empty-state.tsx` — Titre, description, action |
| 18.16 | Animations et transitions | 🟡 | Hover effects basiques, à enrichir |
| 18.17 | Mode sombre (optionnel) | ❌ | — |
| 18.18 | Icônes cohérentes (Lucide React) | 🟡 | Lucide installé, SVG inline à remplacer |

---

## 19. Performance & Optimisation

| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 19.1 | Optimisation des images (Next.js Image) | ❌ | Remplacer `<img>` par `<Image>` Next.js |
| 19.2 | Lazy loading des composants | ❌ | `React.lazy` / `next/dynamic` |
| 19.3 | Cache API côté backend (Redis) | ❌ | — |
| 19.4 | Pagination serveur sur toutes les listes | 🟡 | À vérifier sur chaque endpoint |
| 19.5 | Compression des réponses (gzip) | ❌ | Middleware Express |
| 19.6 | Rate limiting sur l'API | ❌ | Protection contre les abus |
| 19.7 | CDN pour les assets statiques | ❌ | — |
| 19.8 | Bundle analysis et tree shaking | ❌ | — |
| 19.9 | Web Vitals (LCP, FID, CLS) | ❌ | Mesures et optimisations |

---

## 20. Tests

| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 20.1 | Tests unitaires backend (Jest / Vitest) | ❌ | Controllers et modèles |
| 20.2 | Tests d'intégration API (Supertest) | ❌ | Endpoints REST |
| 20.3 | Tests unitaires frontend (Jest / React Testing Library) | ❌ | Composants UI |
| 20.4 | Tests end-to-end (Cypress / Playwright) | ❌ | Parcours utilisateur complets |
| 20.5 | Configuration CI pour les tests | ❌ | GitHub Actions |

---

## 21. Déploiement & CI/CD

| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 21.1 | Dockerfile backend | ❌ | — |
| 21.2 | Dockerfile frontend | ❌ | — |
| 21.3 | Docker Compose (dev + prod) | ❌ | Backend + Frontend + MongoDB + Redis |
| 21.4 | Pipeline CI/CD (GitHub Actions) | ❌ | Build, test, lint, deploy |
| 21.5 | Déploiement backend (Railway / Render / AWS) | ❌ | — |
| 21.6 | Déploiement frontend (Vercel) | ❌ | — |
| 21.7 | Gestion des secrets en production | ❌ | — |
| 21.8 | Monitoring et logs (Sentry, LogRocket) | ❌ | — |

---

## Résumé de l'Avancement

| Module | Progression estimée |
|--------|-------------------|
| Infrastructure & Configuration | 70% |
| Authentification & Utilisateurs | 65% |
| Page d'Accueil | 50% |
| Galerie de Photos / Projets | 45% |
| Annuaire des Professionnels | 35% |
| Marketplace (Produits) | 40% |
| Ideabooks | 35% |
| Articles & Magazine | 40% |
| Forum / Discussions | 40% |
| Messagerie | 20% |
| Avis & Évaluations | 15% |
| Recherche Globale | 10% |
| Tableau de Bord Utilisateur | 0% |
| Tableau de Bord Professionnel | 0% |
| Commandes & Paiements | 15% |
| Notifications | 0% |
| Pages Statiques & SEO | 45% |
| Design System & UI | 55% |
| Performance & Optimisation | 5% |
| Tests | 0% |
| Déploiement & CI/CD | 0% |
| **Total global** | **~30%** |

---

## Priorités Recommandées

### Phase 1 — MVP (Fondations)
1. Authentification complète (frontend ↔ backend)
2. Galerie de projets (grille masonry + détail projet)
3. Annuaire des professionnels (liste + profil)
4. Ideabooks fonctionnels
5. Design system complet

### Phase 2 — Marketplace & Communauté
1. Marketplace complète (détail produit, panier, checkout)
2. Messagerie
3. Avis et évaluations
4. Forum opérationnel

### Phase 3 — Engagement & Monétisation
1. Tableaux de bord (utilisateur + professionnel)
2. Recherche globale avancée
3. Notifications temps réel
4. Paiements Stripe
5. Articles / Magazine

### Phase 4 — Qualité & Production
1. Tests complets
2. Optimisation performance
3. SEO et pages statiques
4. Déploiement et CI/CD
5. Monitoring
