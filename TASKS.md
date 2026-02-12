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
| 1.8 | Configuration Stripe (paiements) | ✅ | `backend/src/config/stripe.ts` — Client Stripe configuré |
| 1.9 | Configuration Nodemailer (e-mails) | ✅ | `backend/src/config/email.ts` — Transporter + helper `sendEmail` |
| 1.10 | Docker / Docker Compose pour dev local | ✅ | `docker-compose.yml` avec MongoDB + MinIO |
| 1.11 | Seed data / données de démonstration | ✅ | `backend/src/seed.ts` — 4 utilisateurs, 4 projets, 4 produits, 3 articles, 3 posts forum |

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
| 2.6 | Mot de passe oublié / reset | ✅ | `UserController.forgotPassword` + `UserController.resetPassword` avec token sécurisé |
| 2.7 | Vérification e-mail | ✅ | `UserController.verifyEmail` + `UserController.resendVerificationEmail` + envoi email auto à l'inscription |
| 2.8 | OAuth (Google, Facebook) | ❌ | Stratégie Passport.js ou équivalent |
| 2.9 | Gestion du profil utilisateur (CRUD) | ✅ | `UserController.getProfile` + `UserController.updateProfile` |
| 2.10 | Upload photo de profil / avatar | ✅ | `UserController.uploadAvatar` + route `POST /users/profile/avatar` |
| 2.11 | Refresh token / gestion des sessions | ❌ | — |

### Frontend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 2.12 | Page connexion / inscription | ✅ | `frontend/src/app/auth/login/page.tsx` |
| 2.13 | Boutons OAuth (Google, Facebook) | 🟡 | UI présente, pas connecté au backend |
| 2.14 | Contexte d'authentification (AuthContext/Provider) | ✅ | `frontend/src/contexts/AuthContext.tsx` avec JWT + localStorage |
| 2.15 | Protection des routes côté client | ✅ | Middleware Next.js + redirect dans les composants |
| 2.16 | Page mot de passe oublié | ✅ | `frontend/src/app/auth/forgot-password/page.tsx` + `frontend/src/app/auth/reset-password/page.tsx` |
| 2.17 | Page profil utilisateur | ✅ | `frontend/src/app/profile/page.tsx` |
| 2.18 | Page édition du profil | ✅ | `frontend/src/app/profile/edit/page.tsx` |
| 2.19 | Page vérification email | ✅ | `frontend/src/app/auth/verify-email/page.tsx` |

---

## 3. Page d'Accueil

| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 3.1 | Hero section avec image/vidéo de fond | ✅ | Image Unsplash plein écran avec overlay sombre dans `page.tsx` |
| 3.2 | Barre de recherche principale | ✅ | Présente sur la page d'accueil |
| 3.3 | Grille catégories par pièce (cuisine, salon, etc.) | ✅ | 4 catégories avec images Unsplash |
| 3.4 | Section statistiques | ✅ | Chiffres statiques |
| 3.5 | Section fonctionnalités | ✅ | 3 cartes (Inspiration, Pros, Marketplace) |
| 3.6 | Section CTA (Call to Action) | ✅ | Inscription + En savoir plus |
| 3.7 | Carrousel de projets tendance | ✅ | Section « Projets tendance » avec scroll horizontal, 6 projets |
| 3.8 | Section « Professionnels à la une » | ✅ | Grille 4 professionnels avec avatar, services, notation |
| 3.9 | Section « Produits populaires » | ✅ | Grille 4 produits avec image, prix, notation |
| 3.10 | Section « Articles récents » | ✅ | Grille 3 articles avec image, catégorie, excerpt |
| 3.11 | Personnalisation selon le profil connecté | ❌ | Recommandations basées sur les préférences |
| 3.12 | Hero image/vidéo immersive (style Houzz) | ✅ | Grande photo plein écran Unsplash avec overlay + texte blanc |

---

## 4. Galerie de Photos / Projets

### Backend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 4.1 | Modèle Project | ✅ | `backend/src/models/Project.ts` |
| 4.2 | CRUD projets | ✅ | `ProjectController` |
| 4.3 | Upload multiple images par projet | 🟡 | Logique Multer présente, à tester |
| 4.4 | Filtrage par catégorie / pièce / style | ✅ | Paramètres de query dans le controller |
| 4.5 | Tri (populaire, récent, vues) | ✅ | Boutons de tri dans `projects/page.tsx` + paramètre sort API |
| 4.6 | Système de likes / favoris | ✅ | `ProjectController.toggleLike` + route `POST /projects/:id/like` |
| 4.7 | Tag de produits sur les photos | ❌ | Positionnement de produits sur une image |
| 4.8 | Pagination côté serveur | ✅ | Pagination dans `ProjectController.getProjects` + frontend |

### Frontend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 4.9 | Page liste des projets avec filtres | ✅ | `frontend/src/app/projects/page.tsx` |
| 4.10 | Grille masonry (style Pinterest/Houzz) | ✅ | CSS columns layout dans `projects/page.tsx` |
| 4.11 | Page détail d'un projet | ✅ | `frontend/src/app/projects/[id]/page.tsx` — Galerie photos, description, professionnel |
| 4.12 | Visionneuse d'images plein écran (lightbox) | ✅ | `frontend/src/components/ui/lightbox.tsx` — Modal avec navigation, zoom, raccourcis clavier |
| 4.13 | Bouton « Sauvegarder dans un Ideabook » | ✅ | Intégré dans `projects/[id]/page.tsx` avec `SaveToIdeabookModal` |
| 4.14 | Affichage des produits tagués sur les photos | ❌ | Hotspots cliquables sur les images |
| 4.15 | Scroll infini ou pagination | ✅ | Pagination fonctionnelle avec numéros de page + appels API |
| 4.16 | Connexion au backend API | ✅ | `api.get('/projects')` avec fallback mock data |

---

## 5. Annuaire des Professionnels

### Backend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 5.1 | Filtre utilisateurs de type professionnel | ✅ | Via `userType: 'professionnel'` |
| 5.2 | Recherche géolocalisée (par ville/code postal) | 🟡 | Index géospatial dans le modèle User |
| 5.3 | Filtrage par spécialité / service | ✅ | Filtre `services` dans `searchProfessionals` |
| 5.4 | Système de notation moyen par professionnel | ✅ | `updateEntityRating()` — Agrégation MongoDB dans `ReviewController` |
| 5.5 | Profil professionnel enrichi | ✅ | Champs complets `professionalInfo` : companyName, businessNumber, services, description, portfolio, certifications, pricing, workingZones, subscription, rating, verified |
| 5.6 | Demande de devis | ✅ | `backend/src/models/Quote.ts` + `QuoteController` + routes `/api/quotes` |

### Frontend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 5.7 | Page liste des professionnels | ✅ | `frontend/src/app/professionals/page.tsx` — Grille avec filtres (ville, spécialité) |
| 5.8 | Page profil d'un professionnel | ✅ | `frontend/src/app/professionals/[id]/page.tsx` — Bio, services, infos |
| 5.9 | Carte interactive (Google Maps / Mapbox) | ❌ | Localisation des pros sur une carte |
| 5.10 | Formulaire de demande de devis | ✅ | Formulaire dans `professionals/[id]/page.tsx` avec catégorie, budget, délai |
| 5.11 | Bouton « Contacter ce professionnel » | ✅ | Bouton dans `projects/[id]/page.tsx` redirige vers messagerie |
| 5.12 | Galerie des projets du professionnel | ✅ | Section portfolio dans `professionals/[id]/page.tsx` avec appel API `projects/professional/:id` |

---

## 6. Marketplace (Boutique de Produits)

### Backend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 6.1 | Modèle Product | ✅ | `backend/src/models/Product.ts` |
| 6.2 | CRUD produits | ✅ | `ProductController` |
| 6.3 | Recherche full-text | ✅ | Index text sur `name`, `description`, `tags` + query `$text` dans `ProductController.getProducts` |
| 6.4 | Filtrage par catégorie / prix / marque | ✅ | Query params dans le controller |
| 6.5 | Gestion du panier | ✅ | `backend/src/models/Cart.ts` + `CartController` avec routes `/cart` |
| 6.6 | Gestion des variantes (taille, couleur) | ❌ | — |
| 6.7 | Gestion de l'inventaire / stock | ✅ | Champs `inventory` (quantity, sku, trackInventory) + vérifications stock dans `CartController.addItem` et `CartController.updateItemQuantity` + `ProductController.updateStock` |
| 6.8 | Wishlist / liste de souhaits | ❌ | — |

### Frontend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 6.9 | Page liste des produits avec filtres | ✅ | `frontend/src/app/products/page.tsx` |
| 6.10 | Page détail d'un produit | ✅ | `frontend/src/app/products/[id]/page.tsx` — Galerie, prix, spécifications, vendeur |
| 6.11 | Galerie d'images produit (zoom, slider) | ✅ | Lightbox intégré dans `products/[id]/page.tsx` avec zoom et navigation |
| 6.12 | Composant panier (sidebar/drawer) | ✅ | `frontend/src/components/cart/CartSidebar.tsx` — Sidebar avec gestion quantités |
| 6.13 | Page panier récapitulatif | ✅ | `frontend/src/app/cart/page.tsx` — Page dédiée avec quantités, récapitulatif, frais de port |
| 6.14 | Système de filtres avancés (sidebar) | 🟡 | Filtres basiques (recherche, catégorie, prix) dans `products/page.tsx` — Manque filtres facettes avancés |
| 6.15 | Connexion au backend API | ✅ | `api.get('/products')` avec fallback mock data + pagination |
| 6.16 | Suggestions de produits similaires | ✅ | Section « Produits similaires » dans `products/[id]/page.tsx` avec appel API + fallback mock |
| 6.17 | Contexte panier global | ✅ | `frontend/src/contexts/CartContext.tsx` avec badge dans header |

---

## 7. Ideabooks (Carnets d'Idées)

### Backend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 7.1 | Modèle Ideabook | ✅ | `backend/src/models/Ideabook.ts` |
| 7.2 | CRUD ideabooks | ✅ | `IdeabookController` |
| 7.3 | Ajout/suppression d'éléments (photos, produits) | ✅ | `IdeabookController.addItem` + `removeItem` + routes |
| 7.4 | Collaboration (partage avec d'autres utilisateurs) | ✅ | `IdeabookController.inviteCollaborator`, `updateCollaboratorPermission`, `removeCollaborator` |
| 7.5 | Ideabooks publics / privés | ✅ | `getPublicIdeabooks`, `getPublicIdeabook` + champ `isPublic` |

### Frontend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 7.6 | Page liste des ideabooks de l'utilisateur | ✅ | `frontend/src/app/ideabooks/page.tsx` — Grille de carnets avec couverture, recherche |
| 7.7 | Page détail d'un ideabook | ✅ | `frontend/src/app/ideabooks/[id]/page.tsx` — Grille des éléments, infos créateur, tags |
| 7.8 | Modal « Sauvegarder dans un ideabook » | ✅ | `frontend/src/components/SaveToIdeabookModal.tsx` — Sélection ideabook + création rapide |
| 7.9 | Création rapide d'un ideabook | ✅ | Intégré dans le modal SaveToIdeabook |
| 7.10 | Drag & drop pour réorganiser les éléments | ❌ | — |
| 7.11 | Partage d'ideabook (lien public, invitation) | ✅ | Panel partage dans `ideabooks/[id]/page.tsx` — Copier lien + invitation email avec permissions |
| 7.12 | Explorer les ideabooks publics populaires | ✅ | `frontend/src/app/ideabooks/explore/page.tsx` — Page de découverte avec recherche, grille |

---

## 8. Articles & Magazine

### Backend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 8.1 | Modèle Article | ✅ | `backend/src/models/Article.ts` |
| 8.2 | CRUD articles | ✅ | `ArticleController` |
| 8.3 | Catégorisation des articles | ✅ | Champ catégorie enum dans le modèle (conseils/tendances/guides/interviews/actualites/diy) |
| 8.4 | Système de commentaires sur articles | ✅ | `backend/src/models/ArticleComment.ts` + `ArticleController.getComments/addComment/updateComment/deleteComment/likeComment` |
| 8.5 | Articles liés / suggestions | ✅ | Sidebar « Articles similaires » dans `articles/[slug]/page.tsx` — Appel API par catégorie + fallback mock |

### Frontend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 8.6 | Page liste des articles (blog/magazine) | ✅ | `frontend/src/app/articles/page.tsx` — Featured article, grille, filtres catégorie |
| 8.7 | Page détail d'un article | ✅ | `frontend/src/app/articles/[slug]/page.tsx` — Contenu, auteur, articles liés, partage |
| 8.8 | Filtrage par catégorie / tag | ✅ | Boutons catégorie dans `articles/page.tsx` + filtre API |
| 8.9 | Section commentaires | ✅ | Section commentaires dans `articles/[slug]/page.tsx` — Formulaire + liste + API intégrée |
| 8.10 | Partage sur les réseaux sociaux | ✅ | Boutons Twitter, Facebook, Copier le lien dans `articles/[slug]/page.tsx` |
| 8.11 | Composant éditeur de contenu riche (admin) | ❌ | WYSIWYG pour rédiger les articles |

---

## 9. Forum / Discussions

### Backend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 9.1 | Modèle ForumPost / ForumReply | ✅ | `backend/src/models/Forum.ts` |
| 9.2 | CRUD posts et réponses | ✅ | `ForumController` |
| 9.3 | Catégorisation des discussions | ✅ | Enum catégorie dans le modèle (decoration/renovation/jardinage/bricolage/architecture/general) |
| 9.4 | Système de votes (upvote/downvote) | ✅ | `ForumController.votePost` + `ForumController.voteReply` + routes |
| 9.5 | Marquer une réponse comme « meilleure réponse » | ✅ | `ForumController.markBestAnswer` + route `PUT /:postId/best-answer/:replyId` |
| 9.6 | Modération (signalement, suppression) | ✅ | `ForumController.reportPost` + route `POST /:id/report` + bouton signaler dans `forum/[id]/page.tsx` |

### Frontend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 9.7 | Page liste des discussions | ✅ | `frontend/src/app/forum/page.tsx` — Liste avec filtres catégorie, recherche, badges résolu |
| 9.8 | Page détail d'une discussion + réponses | ✅ | `frontend/src/app/forum/[id]/page.tsx` — Thread, réponses, meilleure réponse, formulaire |
| 9.9 | Formulaire pour poser une question | ✅ | `frontend/src/app/forum/new/page.tsx` — Titre, catégorie, contenu, tags |
| 9.10 | Formulaire de réponse | ✅ | Formulaire dans `forum/[id]/page.tsx` connecté à `api.post('/forum/:id/replies')` |
| 9.11 | Recherche dans le forum | ✅ | `ForumController.searchPosts` + barre de recherche dans `forum/page.tsx` |
| 9.12 | Filtrage par catégorie / tag | ✅ | Boutons catégorie dans `forum/page.tsx` + filtre côté client |

---

## 10. Messagerie

### Backend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 10.1 | Modèle Message / Conversation | ✅ | `backend/src/models/Message.ts` |
| 10.2 | CRUD messages et conversations | ✅ | `MessageController` |
| 10.3 | Temps réel avec WebSocket (Socket.io) | ❌ | Notifications et messages instantanés |
| 10.4 | Marquage lu / non lu | ✅ | `MessageController.markConversationAsRead` + `getUnreadCount` |
| 10.5 | Pièces jointes dans les messages | ❌ | Upload d'images dans la conversation |

### Frontend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 10.6 | Page messagerie (inbox) | ✅ | `frontend/src/app/messages/page.tsx` — Liste des conversations avec recherche |
| 10.7 | Vue conversation avec fil de messages | ✅ | Chat style messagerie instantanée intégré dans la page messages |
| 10.8 | Indicateur de messages non lus | ✅ | Icône `MessageCircle` (Lucide) dans le header |
| 10.9 | Envoi de pièces jointes | ❌ | — |
| 10.10 | Notifications en temps réel | ❌ | Toast ou badge lors d'un nouveau message |

---

## 11. Avis & Évaluations

### Backend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 11.1 | Modèle Review | ✅ | `backend/src/models/Review.ts` |
| 11.2 | CRUD avis | ✅ | `ReviewController` |
| 11.3 | Vérification (un avis par utilisateur par cible) | ✅ | Duplicate check dans `ReviewController.createReview` |
| 11.4 | Calcul de la note moyenne | ✅ | `updateEntityRating()` — Agrégation MongoDB dans `ReviewController` |
| 11.5 | Signalement d'avis inappropriés | ✅ | `ReviewController.reportReview` — Route POST `/:id/report` avec raison + détection doublons |

### Frontend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 11.6 | Composant d'affichage des avis | ✅ | `frontend/src/components/reviews/ReviewCard.tsx` — Étoiles, texte, auteur, date, helpful, réponse pro |
| 11.7 | Formulaire de rédaction d'avis | ✅ | `frontend/src/components/reviews/ReviewForm.tsx` — Notation + commentaire + validation |
| 11.8 | Affichage des avis sur profils pros | ✅ | `frontend/src/components/reviews/ReviewSummary.tsx` — Résumé + distribution + page démo |
| 11.9 | Affichage des avis sur fiches produits | ✅ | Composants réutilisables ReviewSummary + ReviewCard |
| 11.10 | Filtrage / tri des avis | ✅ | Par note, date, pertinence — Filtres et tri dans `reviews/page.tsx` |

---

## 12. Recherche Globale

### Backend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 12.1 | Endpoint de recherche globale | ✅ | `backend/src/controllers/SearchController.ts` — Recherche multi-entités |
| 12.2 | Index de recherche MongoDB text | 🟡 | Index texte sur certains modèles |
| 12.3 | Autocomplétion / suggestions | ✅ | `GET /api/search/suggestions` |
| 12.4 | Recherche par image (optionnel) | ❌ | Fonctionnalité avancée |

### Frontend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 12.5 | Barre de recherche dans le header | ✅ | Input présent dans `Header.tsx` |
| 12.6 | Page de résultats de recherche | ✅ | `frontend/src/app/search/page.tsx` — Résultats groupés par type avec onglets |
| 12.7 | Autocomplétion avec dropdown | ✅ | Suggestions avec debounce lors de la saisie dans le header |
| 12.8 | Filtres sur la page de résultats | ✅ | Affinage par catégorie, prix, ville — Panel de filtres dans `search/page.tsx` |
| 12.9 | Recherche vocale (optionnel) | ❌ | — |

---

## 13. Tableau de Bord Utilisateur (Particulier)

### Frontend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 13.1 | Page tableau de bord principal | ✅ | `frontend/src/app/dashboard/page.tsx` — Vue d'ensemble : ideabooks, commandes, messages, activité |
| 13.2 | Mes ideabooks | ✅ | `frontend/src/app/dashboard/ideabooks/page.tsx` — Liste et gestion des carnets |
| 13.3 | Mes commandes | ✅ | `frontend/src/app/dashboard/orders/page.tsx` — Historique et suivi des commandes |
| 13.4 | Mes avis | ✅ | `frontend/src/app/dashboard/reviews/page.tsx` — Avis rédigés avec édition/suppression |
| 13.5 | Mes projets favoris | ✅ | `frontend/src/app/dashboard/favorites/page.tsx` — Photos et projets sauvegardés |
| 13.6 | Paramètres du compte | ✅ | `frontend/src/app/dashboard/settings/page.tsx` — E-mail, mot de passe, préférences |
| 13.7 | Notifications | ✅ | `frontend/src/app/dashboard/notifications/page.tsx` — Centre de notifications avec filtres par type |

---

## 14. Tableau de Bord Professionnel

### Frontend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 14.1 | Page tableau de bord professionnel | ✅ | `frontend/src/app/dashboard/pro/page.tsx` — Statistiques, demandes, projets, avis |
| 14.2 | Gestion du portfolio (projets) | ✅ | `frontend/src/app/dashboard/pro/projects/page.tsx` — Liste, recherche, filtres par statut |
| 14.3 | Gestion des produits (marketplace) | ✅ | `frontend/src/app/dashboard/pro/products/page.tsx` — Catalogue, stats, filtres par statut |
| 14.4 | Gestion des avis reçus | ✅ | `frontend/src/app/dashboard/pro/reviews/page.tsx` — Consultation et réponse aux avis |
| 14.5 | Statistiques (vues, contacts, devis) | ❌ | Graphiques et métriques |
| 14.6 | Gestion des demandes de devis | ❌ | Liste des demandes avec réponse |
| 14.7 | Paramètres du profil professionnel | ✅ | `frontend/src/app/dashboard/pro/settings/page.tsx` — Infos entreprise, adresse, services |
| 14.8 | Gestion de l'abonnement | ❌ | Plans gratuit / premium |

---

## 15. Commandes & Paiements

### Backend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 15.1 | Modèle Order | ✅ | `backend/src/models/Order.ts` |
| 15.2 | CRUD commandes | ✅ | `OrderController` |
| 15.3 | Intégration Stripe Checkout | ❌ | Session de paiement + webhooks |
| 15.4 | Gestion des statuts de commande | ✅ | `OrderController.updateOrderStatus` — pending → confirmed → processing → shipped → delivered |
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
| 16.1 | Modèle Notification | ✅ | `backend/src/models/Notification.ts` — Type, destinataire, lu/non lu, metadata |
| 16.2 | Création automatique de notifications | ✅ | `NotificationController` + `notificationRoutes.ts` — GET, mark read, delete |
| 16.3 | WebSocket pour notifications temps réel | ❌ | Socket.io |
| 16.4 | Notifications par e-mail | ❌ | Templates Nodemailer |
| 16.5 | Préférences de notification par utilisateur | ❌ | — |

### Frontend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 16.6 | Icône notification dans le header avec badge | ✅ | Bell icon (Lucide) + badge compteur non-lus dans `Header.tsx` |
| 16.7 | Dropdown / panel de notifications | ✅ | Panel dropdown avec liste, marquage lu, lien vers `/notifications` |
| 16.8 | Page complète des notifications | ✅ | `frontend/src/app/notifications/page.tsx` — Historique avec filtres par type, lu/non lu |

---

## 17. Pages Statiques & SEO

| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 17.1 | Header / Navigation | ✅ | `frontend/src/components/layout/Header.tsx` |
| 17.2 | Footer | ✅ | `frontend/src/components/layout/Footer.tsx` |
| 17.3 | Page « À propos » | ✅ | `frontend/src/app/about/page.tsx` — Mission, statistiques, équipe |
| 17.4 | Page « Conditions d'utilisation » | ✅ | `frontend/src/app/terms/page.tsx` — Sections juridiques en français |
| 17.5 | Page « Politique de confidentialité » | ✅ | `frontend/src/app/privacy/page.tsx` — Sections RGPD en français |
| 17.6 | Page « Mentions légales » | ✅ | `frontend/src/app/legal/page.tsx` |
| 17.7 | Page « Contact » | ✅ | `frontend/src/app/contact/page.tsx` — Formulaire + infos de contact |
| 17.8 | Page « Centre d'aide / FAQ » | ✅ | `frontend/src/app/help/page.tsx` — FAQ interactive avec recherche et catégories |
| 17.9 | Page 404 personnalisée | ✅ | `frontend/src/app/not-found.tsx` — Page 404 avec liens de navigation |
| 17.10 | Metadata SEO par page (title, description, OG) | ✅ | Metadata Next.js sur 13+ pages (home, about, terms, privacy, legal, products, professionals, projects, contact, help, search, reviews, articles, forum) |
| 17.11 | Sitemap.xml dynamique | ✅ | `frontend/src/app/sitemap.ts` — Sitemap Next.js dynamique |
| 17.12 | Fichier robots.txt | ✅ | `frontend/public/robots.txt` |
| 17.13 | Structured data (JSON-LD) | ✅ | `frontend/src/components/seo/JsonLd.tsx` — Pour les produits, pros, articles |

---

## 18. Design System & UI

| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 18.1 | Composants UI de base (shadcn/ui) | ✅ | Button, Card, Input, Label, Dialog, Avatar, Select, Tabs, Badge |
| 18.2 | Thème / palette de couleurs (emerald) | ✅ | Tailwind config |
| 18.3 | Typographie et hiérarchie visuelle | 🟡 | À affiner pour ressembler à Houzz |
| 18.4 | Layout responsive (mobile-first) | 🟡 | Breakpoints en place, à optimiser |
| 18.5 | Composant Carousel / Slider | ✅ | `frontend/src/components/ui/carousel.tsx` — Carousel avec autoplay, flèches, dots |
| 18.6 | Composant Masonry Grid | ✅ | `frontend/src/components/ui/masonry-grid.tsx` — Grille Pinterest-style pour les photos |
| 18.7 | Composant Lightbox / visionneuse d'images | ✅ | `frontend/src/components/ui/lightbox.tsx` — Modal plein écran avec navigation, zoom, raccourcis clavier |
| 18.8 | Composant Skeleton / loading states | ✅ | `frontend/src/components/ui/skeleton.tsx` |
| 18.9 | Composant Toast / notifications | ✅ | `frontend/src/components/ui/toast.tsx` — ToastProvider + useToast hook |
| 18.10 | Composant Modal de confirmation | ✅ | `frontend/src/components/ui/confirm-dialog.tsx` — AlertDialog Radix UI |
| 18.11 | Composant Dropdown menu | ✅ | `frontend/src/components/ui/dropdown-menu.tsx` — DropdownMenu Radix UI |
| 18.12 | Composant Breadcrumb | ✅ | `frontend/src/components/ui/breadcrumb.tsx` — Navigation hiérarchique |
| 18.13 | Composant Pagination | ✅ | `frontend/src/components/ui/pagination.tsx` — Composant réutilisable |
| 18.14 | Composant Rating (étoiles) | ✅ | `frontend/src/components/ui/rating.tsx` — RatingDisplay + RatingInput |
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
| 19.5 | Compression des réponses (gzip) | ✅ | `compression` middleware dans `server.ts` |
| 19.6 | Rate limiting sur l'API | ✅ | `express-rate-limit` dans `server.ts` — 100 req/15min |
| 19.7 | CDN pour les assets statiques | ❌ | — |
| 19.8 | Bundle analysis et tree shaking | ❌ | — |
| 19.9 | Web Vitals (LCP, FID, CLS) | ❌ | Mesures et optimisations |

---

## 20. Tests

| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 20.1 | Tests unitaires backend (Jest / Vitest) | ✅ | `backend/src/__tests__/` — Jest + ts-jest configuré, tests health + search |
| 20.2 | Tests d'intégration API (Supertest) | ✅ | 5 tests passants via Supertest sur les endpoints health et search |
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
| Infrastructure & Configuration | 100% |
| Authentification & Utilisateurs | 90% |
| Page d'Accueil | 85% |
| Galerie de Photos / Projets | 85% |
| Annuaire des Professionnels | 85% |
| Marketplace (Produits) | 85% |
| Ideabooks | 85% |
| Articles & Magazine | 90% |
| Forum / Discussions | 95% |
| Messagerie | 50% |
| Avis & Évaluations | 100% |
| Recherche Globale | 80% |
| Tableau de Bord Utilisateur | 100% |
| Tableau de Bord Professionnel | 60% |
| Commandes & Paiements | 30% |
| Notifications | 65% |
| Pages Statiques & SEO | 100% |
| Design System & UI | 85% |
| Performance & Optimisation | 25% |
| Tests | 40% |
| Déploiement & CI/CD | 0% |
| **Total global** | **~70%** |

---

## Priorités Recommandées

### Phase 1 — MVP (Fondations) ✅ Complété
1. ~~Authentification complète (frontend ↔ backend)~~ ✅
2. ~~Galerie de projets (grille masonry + détail projet)~~ ✅
3. ~~Annuaire des professionnels (liste + profil)~~ ✅
4. ~~Ideabooks fonctionnels~~ ✅
5. ~~Design system complet~~ ✅

### Phase 2 — Marketplace & Communauté ✅ Complété
1. ~~Marketplace complète (détail produit, panier, checkout)~~ ✅
2. ~~Messagerie~~ ✅
3. ~~Avis et évaluations~~ ✅
4. ~~Forum opérationnel~~ ✅

### Phase 3 — Engagement & Monétisation 🟡 En cours
1. ~~Tableaux de bord (utilisateur + professionnel)~~ ✅
2. ~~Recherche globale avancée~~ ✅
3. ~~Notifications (modèle + UI)~~ ✅
4. Paiements Stripe (checkout + webhooks) ❌
5. ~~Articles / Magazine~~ ✅

### Phase 4 — Qualité & Production 🟡 En cours
1. Tests complets (frontend + E2E) ❌
2. Optimisation performance (images, lazy loading) ❌
3. ~~SEO et pages statiques~~ ✅
4. Déploiement et CI/CD ❌
5. Monitoring ❌
