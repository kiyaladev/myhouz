# MyHouz — Tâches Sections 10 à 20

> **Légende** : ✅ Fait | 🟡 Partiel | ❌ À faire

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
| 11.5 | Signalement d'avis inappropriés | ❌ | — |

### Frontend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 11.6 | Composant d'affichage des avis | ✅ | `frontend/src/components/reviews/ReviewCard.tsx` — Étoiles, texte, auteur, date, helpful, réponse pro |
| 11.7 | Formulaire de rédaction d'avis | ✅ | `frontend/src/components/reviews/ReviewForm.tsx` — Notation + commentaire + validation |
| 11.8 | Affichage des avis sur profils pros | ✅ | `frontend/src/components/reviews/ReviewSummary.tsx` — Résumé + distribution + page démo |
| 11.9 | Affichage des avis sur fiches produits | ✅ | Composants réutilisables ReviewSummary + ReviewCard |
| 11.10 | Filtrage / tri des avis | ❌ | Par note, date, pertinence |

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
| 12.8 | Filtres sur la page de résultats | ❌ | Affinage par type, catégorie, prix |
| 12.9 | Recherche vocale (optionnel) | ❌ | — |

---

## 13. Tableau de Bord Utilisateur (Particulier)

### Frontend
| # | Tâche | Statut | Détails |
|---|-------|--------|---------|
| 13.1 | Page tableau de bord principal | ✅ | `frontend/src/app/dashboard/page.tsx` — Vue d'ensemble : ideabooks, commandes, messages, activité |
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
| 14.1 | Page tableau de bord professionnel | ✅ | `frontend/src/app/dashboard/pro/page.tsx` — Statistiques, demandes, projets, avis |
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
| 16.1 | Modèle Notification | ✅ | `backend/src/models/Notification.ts` — Type, destinataire, lu/non lu, metadata |
| 16.2 | CRUD notifications + routes | ✅ | `NotificationController` + `notificationRoutes.ts` — GET, mark read, delete |
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
| 17.4 | Page « Conditions d'utilisation » | ✅ | `frontend/src/app/terms/page.tsx` |
| 17.5 | Page « Politique de confidentialité » | ✅ | `frontend/src/app/privacy/page.tsx` |
| 17.6 | Page « Mentions légales » | ✅ | `frontend/src/app/legal/page.tsx` |
| 17.7 | Page « Contact » | ✅ | `frontend/src/app/contact/page.tsx` — Formulaire + infos de contact |
| 17.8 | Page « Centre d'aide / FAQ » | ✅ | `frontend/src/app/help/page.tsx` — FAQ interactive avec recherche et catégories |
| 17.9 | Page 404 personnalisée | ✅ | `frontend/src/app/not-found.tsx` — Page 404 avec liens de navigation |
| 17.10 | Metadata SEO par page (title, description, OG) | 🟡 | Metadata de base dans layout.tsx |
| 17.11 | Sitemap.xml dynamique | ❌ | — |
| 17.12 | Fichier robots.txt | ✅ | `frontend/public/robots.txt` |
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
| 18.9 | Composant Toast / notifications | ✅ | `frontend/src/components/ui/toast.tsx` — ToastProvider + useToast hook |
| 18.10 | Composant Modal de confirmation | ✅ | `frontend/src/components/ui/confirm-dialog.tsx` — AlertDialog Radix UI |
| 18.11 | Composant Dropdown menu | ✅ | `frontend/src/components/ui/dropdown-menu.tsx` — DropdownMenu Radix UI |
| 18.12 | Composant Breadcrumb | ✅ | `frontend/src/components/ui/breadcrumb.tsx` |
| 18.13 | Composant Pagination | ✅ | `frontend/src/components/ui/pagination.tsx` |
| 18.14 | Composant Rating (étoiles) | ✅ | `frontend/src/components/ui/rating.tsx` — RatingDisplay + RatingInput |
| 18.15 | Composant Empty State | ✅ | `frontend/src/components/ui/empty-state.tsx` |
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

## Résumé de l'Avancement (Sections 10–20)

| Module | Progression estimée |
|--------|-------------------|
| Messagerie | 50% |
| Avis & Évaluations | 70% |
| Recherche Globale | 70% |
| Tableau de Bord Utilisateur | 15% |
| Tableau de Bord Professionnel | 15% |
| Commandes & Paiements | 20% |
| Notifications | 65% |
| Pages Statiques & SEO | 65% |
| Design System & UI | 70% |
| Performance & Optimisation | 25% |
| Tests | 40% |
| **Moyenne sections 10–20** | **~46%** |
