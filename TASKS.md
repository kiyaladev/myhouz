# MyHouz — Plan de Développement

Plan de développement complet pour le clone de Houzz.com avec système de gestion d'entreprise intégré.

**Légende** : ✅ Fait | 🟡 Partiel | ❌ À faire

---

## Progression Globale

| Module | Statut |
|--------|--------|
| Infrastructure & Configuration | ✅ 100% |
| Authentification & Utilisateurs | ✅ 100% |
| Page d'Accueil | ✅ 95% |
| Galerie Photos / Projets | ✅ 95% |
| Annuaire Professionnels | ✅ 100% |
| Marketplace (Produits) | ✅ 95% |
| Ideabooks | ✅ 95% |
| Articles & Magazine | ✅ 95% |
| Forum / Discussions | ✅ 95% |
| Messagerie | ✅ 100% |
| Avis & Évaluations | ✅ 100% |
| Recherche Globale | ✅ 80% |
| Tableaux de Bord | ✅ 100% |
| Commandes & Paiements | ✅ 100% |
| Notifications | ✅ 100% |
| Pages Statiques & SEO | ✅ 100% |
| Design System & UI | ✅ 100% |
| Performance & Optimisation | ✅ 95% |
| Tests | 🟡 75% |
| Déploiement & CI/CD | ✅ 95% |
| POS & Gestion Quincaillerie | ✅ 100% |
| **TOTAL GLOBAL** | **~95%** |

---

## 1. Infrastructure & Configuration ✅

**Backend**: Express.js + TypeScript + MongoDB (Mongoose)
**Frontend**: Next.js 15 + React 19 + Tailwind CSS

| Composant | Statut | Fichiers clés |
|-----------|--------|---------------|
| Configuration serveur | ✅ | `backend/src/server.ts`, `backend/src/index.ts` |
| Configuration Next.js | ✅ | `frontend/` avec App Router |
| Base de données MongoDB | ✅ | `backend/src/config/database.ts` |
| Variables d'environnement | ✅ | `.env.example` |
| CORS & Middleware | ✅ | `server.ts` |
| Upload fichiers (Multer) | ✅ | `backend/src/middleware/upload.ts` |
| Stockage MinIO (S3) | ✅ | `backend/src/config/minio.ts`, `uploadService.ts` |
| Paiements Stripe | ✅ | `backend/src/config/stripe.ts` |
| Emails Nodemailer | ✅ | `backend/src/config/email.ts` |
| Docker Compose | ✅ | `docker-compose.yml` (MongoDB + MinIO) |
| Seed data | ✅ | `backend/src/seed.ts` |

---

## 2. Authentification & Utilisateurs ✅

### Backend
- **Modèle dual**: `particulier` / `professionnel` avec `professionalInfo` conditionnel
- **JWT**: Access token (15min) + Refresh token (30j)
- **OAuth**: Google + Facebook via Passport.js
- **Sécurité**: Reset password, email verification, avatar upload
- **Middleware**: `authenticateToken`, `requireProfessional`, `requireParticulier`, `optionalAuth`

### Frontend
- Pages: Login, Register, Profile, Edit Profile, Forgot/Reset Password, Email Verification
- AuthContext avec localStorage + auto-refresh
- OAuth callbacks + token management
- Route protection

**Fichiers**: `backend/src/models/User.ts`, `UserController.ts`, `auth.ts`, `passport.ts`

---

## 3. Page d'Accueil ✅

**Composants principaux**:
- Hero section full-screen avec overlay
- Barre de recherche globale
- Grilles: catégories par pièce, projets tendance, professionnels, produits, articles
- Section personnalisée selon rôle (pro/particulier)
- Stats et CTA

**Fichier**: `frontend/src/app/page.tsx`

---

## 4. Galerie Photos / Projets ✅

### Backend
- **Modèle**: Project avec catégorie, pièce, style, tags, images[]
- **Features**: CRUD, likes, sauvegarde ideabook, statistiques
- **Tags**: Produits liés aux images

### Frontend
- Grille Masonry responsive
- Filtres avancés (catégorie, pièce, style)
- Lightbox avec navigation
- Page détail + galerie complète

**Fichiers**: `backend/src/models/Project.ts`, `ProjectController.ts`, `frontend/src/app/projects/`

---

## 5. Annuaire Professionnels ✅

### Backend
- Recherche géospatiale (MongoDB geoNear)
- Filtres: services, rayon, note minimale
- Tri par distance/note/expérience
- Gestion disponibilités

### Frontend
- Liste avec carte interactive
- Filtres avancés + recherche par localisation
- Fiches profil complètes
- Formulaire de contact
- Affichage avis + projets

**Fichiers**: `backend/src/models/User.ts` (professionalInfo), `ProfessionalController.ts`, `frontend/src/app/professionals/`

---

## 6. Marketplace (Produits) ✅

### Backend
- **Modèle**: Spécifications, variations, inventaire, SEO slug
- **Features**: CRUD, recherche full-text, filtres facettes, likes
- **Catégories**: mobilier, decoration, eclairage, textile, rangement, exterieur, materiaux, outils

### Frontend
- Grille produits avec filtres prix/catégorie/marque
- Page détail: galerie, variations, specs, reviews
- Panier + wishlist
- Checkout Stripe

**Fichiers**: `backend/src/models/Product.ts`, `ProductController.ts`, `frontend/src/app/products/`, `checkout/`

---

## 7. Ideabooks ✅

### Backend
- Collections collaboratives
- Permissions (owner, editor, viewer)
- Visibilité publique/privée
- CRUD items (projets, produits, articles)

### Frontend
- Création/édition/suppression ideabooks
- Drag & drop pour réorganiser
- Modal "Sauvegarder dans ideabook"
- Partage par lien ou email
- Page explore publique

**Fichiers**: `backend/src/models/Ideabook.ts`, `IdeabookController.ts`, `frontend/src/app/ideabooks/`

---

## 8. Articles & Magazine ✅

### Backend
- Modèle Article avec catégories (conseils, tendances, guides, DIY, interviews)
- Système commentaires complet (CRUD, likes)
- Articles liés par catégorie

### Frontend
- Liste articles avec featured + grille
- Page détail: contenu, auteur, commentaires, partage social
- Filtrage par catégorie
- Éditeur WYSIWYG (dashboard pro)

**Fichiers**: `backend/src/models/Article.ts`, `ArticleController.ts`, `frontend/src/app/articles/`

---

## 9. Forum / Discussions ✅

### Backend
- Modèles ForumPost + ForumReply
- Votes (upvote/downvote)
- Meilleure réponse
- Modération (signalement)
- Catégories: decoration, renovation, jardinage, bricolage, architecture

### Frontend
- Liste discussions avec badges (résolu, populaire)
- Thread complet avec réponses imbriquées
- Formulaire nouvelle question
- Recherche + filtres catégorie

**Fichiers**: `backend/src/models/Forum.ts`, `ForumController.ts`, `frontend/src/app/forum/`

---

## 10. Messagerie ✅

### Backend ✅
- Modèle Message + Conversation
- CRUD complet
- Marquage lu/non lu
- Compteur non lus
- **NotificationService** : création automatique de notifications à chaque message
- **Emails** : notification par email aux destinataires

### Frontend ✅
- Page inbox avec liste conversations (API intégrée)
- Vue chat style messagerie (API intégrée)
- Indicateur badge non lus
- Polling automatique (5s messages, 15s conversations)
- Loading states et empty states
- Responsive mobile-first (vue liste ↔ vue chat)

### À améliorer ✅
- ✅ WebSocket (Socket.io) pour temps réel (JWT auth, rooms, typing indicators)
- ✅ Pièces jointes dans les messages (upload images via Multer + MinIO)
- ✅ Notifications temps réel via Socket.io (notification:new, notification:count)

**Fichiers**: `backend/src/models/Message.ts`, `MessageController.ts`, `notificationService.ts`, `frontend/src/app/messages/`

---

## 11. Avis & Évaluations ✅

### Backend
- Modèle Review (professionnels + produits)
- Duplicate check (1 avis/utilisateur/cible)
- Calcul note moyenne (agrégation MongoDB)
- Signalement d'avis

### Frontend
- Composants ReviewCard, ReviewForm, ReviewSummary
- Distribution des notes
- Filtres et tri
- Réponses des professionnels

**Fichiers**: `backend/src/models/Review.ts`, `ReviewController.ts`, `frontend/src/components/reviews/`

---

## 12. Recherche Globale ✅

### Backend
- Endpoint unifié multi-entités (projets, professionnels, produits, articles)
- Full-text search MongoDB
- Filtres par type

### Frontend
- Barre recherche dans header
- Page résultats avec tabs
- Preview résultats par type

**Fichiers**: `backend/src/controllers/SearchController.ts`, `frontend/src/app/search/`

**À améliorer**: Autocomplétion, historique recherches

---

## 13. Tableau de Bord Utilisateur ✅

**Pages dashboard particulier**:
- Vue d'ensemble: stats personnelles, activité récente
- Mes projets sauvegardés
- Mes ideabooks
- Mes avis
- Mes commandes
- Mes messages
- Paramètres profil

**Fichiers**: `frontend/src/app/dashboard/user/`

---

## 14. Tableau de Bord Professionnel ✅

**Pages dashboard pro**:
- Vue d'ensemble: stats business, revenus, contacts
- Gestion projets (portfolio)
- Gestion produits
- Gestion articles
- Messages clients
- Avis reçus
- Calendrier disponibilités
- Statistiques détaillées
- **Module POS complet** (voir section 22)

**Fichiers**: `frontend/src/app/dashboard/pro/`

---

## 15. Commandes & Paiements ✅

### Backend
- Modèle Order avec items, totaux, statuts
- Stripe Checkout Session
- Webhooks sécurisés (raw body)
- Gestion remboursements
- Email confirmation automatique
- Déduction stock atomique ($inc)

### Frontend
- Panier avec quantités
- Page checkout avec CardElement Stripe
- Page confirmation
- Historique commandes dashboard

**Fichiers**: `backend/src/models/Order.ts`, `OrderController.ts`, `frontend/src/app/checkout/`

---

## 16. Notifications ✅

### Backend
- Modèle Notification avec types multiples
- Statuts: unread, read, archived
- Routes: liste, marquer lues, supprimer
- **NotificationService** : création automatique sur événements (messages, avis, commandes)
- Email notifications (templates HTML : commandes, messages, avis, devis, ideabooks)

### Frontend
- Dropdown header avec badge compteur (API intégrée, polling 30s)
- Page notifications avec filtres par type (API intégrée)
- Page dashboard notifications (API intégrée)
- Marquage lu / tout marquer comme lu

**Fichiers**: `backend/src/models/Notification.ts`, `NotificationController.ts`, `notificationService.ts`, `notificationEmailService.ts`

**À améliorer**: ~~Notifications push navigateur~~, ~~préférences utilisateur~~ ✅ Préférences granulaires implémentées

---

## 17. Pages Statiques & SEO ✅

**Pages créées**:
- About (présentation plateforme)
- Contact (formulaire + infos)
- Terms (CGU)
- Privacy (politique confidentialité)

**SEO**:
- Metadata Next.js
- Sitemap XML
- Slugs SEO-friendly (produits, articles)

**Fichiers**: `frontend/src/app/about/`, `contact/`, `terms/`, `privacy/`

---

## 18. Design System & UI ✅

### Composants UI
**Base**: Button, Input, Textarea, Select, Checkbox, Label, Badge, Card, Avatar, Dialog, Dropdown, Tabs, Tooltip
**Feedback**: Toast (provider + hook), Alert (info/success/warning/error), Progress (variants + sizes), EmptyState
**Avancés**: Lightbox, Rich Editor, MasonryGrid, DatePicker, Map, Carousel, Pagination, Skeleton, ConfirmDialog, Rating
**Layout**: Header, Footer, Sidebar, Breadcrumb

### Design
- Tailwind CSS avec palette cohérente (emerald primary)
- Dark mode support
- Responsive mobile-first
- Animations Framer Motion
- Icons Lucide React

**Fichiers**: `frontend/src/components/ui/`, `frontend/tailwind.config.ts`

---

## 19. Performance & Optimisation ✅

| Optimisation | Statut | Détails |
|--------------|--------|---------|
| Images Next.js | ✅ | Component Image avec remotePatterns |
| Lazy loading | ✅ | React.lazy() + Suspense |
| Code splitting | ✅ | Dynamic imports Next.js |
| Compression | ✅ | Gzip côté serveur + nginx |
| API Caching | ✅ | In-memory cache middleware (GET publics, TTL configurable) |
| Bundle optimization | ✅ | Next.js automatic |
| Database indexes | ✅ | MongoDB indexes (geo, text, composite) |
| Static assets | ✅ | Cache longue durée via nginx (365j pour _next/static) |

**Fichiers**: `frontend/next.config.ts`, `backend/src/middleware/cache.ts`, `backend/src/models/*.ts` (indexes), `nginx/nginx.conf`

---

## 20. Tests 🟡

### Backend ✅
- Jest configuré
- Tests: `search.test.ts`, `health.test.ts`, `socket.test.ts`
- Coverage: ~60%
- **Command**: `cd backend && npm test`

### Frontend 🟡
- Jest + React Testing Library + jsdom configurés
- Tests unitaires: composants UI (Button, Badge, Input, Card, Alert, EmptyState, Pagination, Progress) + utilitaires (cn)
- 52 tests passants (9 suites)
- **Command**: `cd frontend && npm test`
- **À faire**: Tests E2E (Playwright/Cypress)

**Fichiers**: `backend/jest.config.js`, `backend/src/__tests__/`, `frontend/jest.config.ts`, `frontend/src/__tests__/`

---

## 21. Déploiement & CI/CD ✅

### Docker ✅
- **Backend**: Multi-stage Node 20 Alpine (`backend/Dockerfile`)
- **Frontend**: Multi-stage Next.js standalone (`frontend/Dockerfile`)
- **Compose Dev**: 4 services (mongodb, minio, backend, frontend)
- **Compose Prod**: 5 services + nginx reverse proxy (`docker-compose.prod.yml`)

### CI/CD ✅
- **GitHub Actions**: `.github/workflows/ci.yml`
- **Jobs**:
  - Backend: lint, build, test
  - Frontend: lint, build
- **Trigger**: push/PR sur main

### Production (Contabo VPS) ✅
- **Nginx**: Reverse proxy avec SSL, gzip, rate limiting, cache statique (`nginx/nginx.conf`)
- **SSL**: Let's Encrypt avec auto-renouvellement
- **Deploy script**: `deploy.sh` (setup, deploy, ssl, backup, logs, status)
- **Backups**: MongoDB dump automatisé, rétention 7 jours
- **Sécurité**: UFW firewall, services sur 127.0.0.1 uniquement, headers sécurité

### À faire ❌
- Monitoring (Sentry, logs centralisés)

**Fichiers**: `docker-compose.yml`, `docker-compose.prod.yml`, `nginx/nginx.conf`, `deploy.sh`, `.github/workflows/ci.yml`

---

## 22. POS & Gestion Quincaillerie ✅

Module complet de Point de Vente pour professionnels avec gestion d'entreprise.

### Backend — 100% Complet

**Caisse & Ventes**:
- Modèle PosSale (articles, totaux, paiement, client, remboursement)
- CRUD complet + stats dashboard
- Déduction stock atomique
- Remboursements avec restauration stock

**Gestion Stocks**:
- Liste avec filtres (catégorie, statut, recherche)
- Ajustement stock +/- avec auto-update statut
- Recherche rapide produits (nom, SKU, tags)
- Alertes réapprovisionnement (seuils configurables)
- Gestion fournisseurs (CRUD complet)

**Facturation**:
- Modèle Invoice (client B2B, TVA, statuts)
- CRUD + stats
- Numéro séquentiel FAC-YYYY-NNNNNN
- Liaison vente POS → facture
- Export PDF (pdfkit) avec en-tête entreprise
- Envoi email facture (HTML + PDF)

**Features Avancées**:
- Recherche code-barres
- Rapports financiers (agrégations MongoDB)
- Multi-caisse (sessions ouverture/fermeture)
- Programme fidélité (points, tiers bronze→platinum)
- Gestion retours produits
- Export comptable (FEC + CSV)

**Routes**: `backend/src/routes/posRoutes.ts` — 35+ endpoints sous `/api/pos/*`

### Frontend — 100% Complet

**9 Pages POS**:
1. **Caisse** (`/dashboard/pro/pos/`) — Scanner, panier, paiement, ticket
2. **Stocks** (`/stock/`) — Liste, ajustement, alertes, stats
3. **Historique Ventes** (`/sales/`) — Liste, filtres, détails, stats CA
4. **Factures** (`/invoices/`) — Liste, création, détail, envoi email
5. **Fournisseurs** (`/suppliers/`) — CRUD, liste contacts
6. **Multi-Caisse** (`/registers/`) — Gestion sessions caisses
7. **Rapports** (`/reports/`) — Stats financières, top produits
8. **Fidélité** (`/loyalty/`) — Gestion programme clients
9. **Retours** (`/returns/`) — Gestion retours produits

**UX**:
- Layout cohérent avec navigation POS
- Formulaires modaux
- Stats cards + graphiques
- Filtres et recherche temps réel
- Raccourcis catégories quincaillerie

**Fichiers**: 
- Backend: `backend/src/models/{PosSale,Invoice,Supplier,Register,LoyaltyProgram,ProductReturn}.ts`
- Backend: `backend/src/controllers/{PosController,InvoiceController,SupplierController,RegisterController,LoyaltyController,ReturnController}.ts`
- Frontend: `frontend/src/app/dashboard/pro/pos/**/*.tsx`

---

## Phases de Développement

### Phase 1 — MVP (Fondations) ✅ COMPLÉTÉ
- Authentification complète (frontend ↔ backend)
- Galerie projets (grille masonry + détail)
- Annuaire professionnels (liste + profil)
- Ideabooks fonctionnels
- Design system complet

### Phase 2 — Marketplace & Communauté ✅ COMPLÉTÉ
- Marketplace complète (détail, panier, checkout)
- Messagerie
- Avis et évaluations
- Forum opérationnel

### Phase 3 — Engagement & Monétisation ✅ COMPLÉTÉ
- Tableaux de bord (utilisateur + professionnel)
- Recherche globale avancée
- Notifications (modèle + UI)
- Paiements Stripe (checkout + webhooks)
- Articles / Magazine
- POS & Gestion Quincaillerie (caisse, stocks, factures)

### Phase 4 — Qualité & Production 🟡 EN COURS (95%)
**Complété**:
- ✅ Optimisation performance (images, lazy loading, API caching)
- ✅ SEO et pages statiques
- ✅ Déploiement Docker + CI/CD GitHub Actions
- ✅ Messagerie connectée à l'API (polling temps réel)
- ✅ Notifications connectées à l'API + NotificationService
- ✅ Design System complet (25+ composants UI)
- ✅ Déploiement production Contabo (nginx, SSL, backups)

**Restant**:
- 🟡 Tests frontend (Jest + RTL configuré, 52 tests passants — manque E2E)
- ❌ Monitoring production (Sentry, logs centralisés)

---

## Commandes Utiles

```bash
# Backend
cd backend
npm run dev          # Dev avec hot reload
npm run build        # Build TypeScript
npm test            # Run tests (Jest)
npm start           # Production

# Frontend
cd frontend
npm run dev         # Dev mode
npm run build       # Build production
npm run lint        # ESLint

# Docker
docker-compose up -d        # Start all services
docker-compose down         # Stop all services

# Database
npm run seed        # Populate demo data (backend)
```

---

## Stack Technique

**Backend**:
- Node.js 20 + Express.js + TypeScript
- MongoDB + Mongoose ODM
- JWT + Passport.js (OAuth)
- Stripe + Nodemailer
- MinIO (S3-compatible)
- Multer (uploads)
- PDFKit (factures PDF)

**Frontend**:
- Next.js 15 (App Router) + React 19
- TypeScript + Tailwind CSS
- Stripe React
- Framer Motion + Lucide Icons

**DevOps**:
- Docker + Docker Compose
- Nginx (reverse proxy + SSL)
- GitHub Actions (CI)
- Jest (tests backend)
- Let's Encrypt (SSL)
- Contabo VPS (production)

---

## Prochaines Étapes Prioritaires

1. ~~**Tests Frontend** — Jest + React Testing Library~~ 🟡 (configuré, 52 tests passants)
2. **Tests E2E** — Playwright/Cypress pour parcours utilisateur
3. **Monitoring Production** — Sentry error tracking + logs
4. ~~**WebSocket** — Socket.io pour messagerie temps réel~~ ✅
5. **SEO Avancé** — Schema.org + Open Graph complet

---

## Déploiement Contabo

```bash
# 1. Setup initial du serveur
scp deploy.sh user@your-contabo-ip:/tmp/
ssh user@your-contabo-ip "chmod +x /tmp/deploy.sh && /tmp/deploy.sh setup"

# 2. Configurer les variables d'environnement
ssh user@your-contabo-ip "nano /opt/myhouz/.env.production"

# 3. Configurer SSL
ssh user@your-contabo-ip "cd /opt/myhouz && ./deploy.sh ssl"

# 4. Déployer
ssh user@your-contabo-ip "cd /opt/myhouz && ./deploy.sh deploy"

# 5. Vérifier
ssh user@your-contabo-ip "cd /opt/myhouz && ./deploy.sh status"

# 6. Backup quotidien (ajouter au cron)
ssh user@your-contabo-ip "cd /opt/myhouz && ./deploy.sh backup"
```

---

**Document mis à jour** : Février 2026  
**Progression totale** : ~95%  
**Statut** : Plateforme production-ready, déploiement Contabo configuré
**Hébergement** : Contabo VPS (Docker + Nginx + SSL)
