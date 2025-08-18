# MyHouz Backend

Backend Express.js avec TypeScript pour l'application MyHouz.

## 🚀 Installation

1. Naviguer vers le dossier backend :
```bash
cd backend
```

2. Installer les dépendances :
```bash
npm install
```

3. Configurer les variables d'environnement :
```bash
cp .env.example .env
```
Puis modifier le fichier `.env` avec vos propres valeurs.

## 📋 Variables d'environnement

- `MONGODB_URI` : URI de connexion à MongoDB
- `PORT` : Port du serveur (défaut: 5000)
- `NODE_ENV` : Environnement (development/production)
- `JWT_SECRET` : Clé secrète pour JWT
- `FRONTEND_URL` : URL du frontend pour CORS

## 🛠️ Scripts disponibles

- `npm run dev` : Démarre le serveur en mode développement avec rechargement automatique
- `npm run build` : Compile le TypeScript en JavaScript
- `npm start` : Démarre le serveur en mode production
- `npm run watch` : Compile en mode surveillance

## 📁 Structure du projet

```
backend/
├── src/
│   ├── config/         # Configuration (database, etc.)
│   ├── controllers/    # Contrôleurs
│   ├── middleware/     # Middlewares personnalisés
│   ├── models/         # Modèles Mongoose
│   ├── routes/         # Routes API
│   ├── utils/          # Utilitaires
│   └── index.ts        # Point d'entrée
├── dist/               # Fichiers compilés
├── .env                # Variables d'environnement
├── .env.example        # Exemple de variables d'environnement
├── package.json
└── tsconfig.json
```

## 🌐 API Endpoints

### Base
- `GET /` : Information sur l'API
- `GET /health` : Status de santé du serveur

## 🔧 Technologies utilisées

- **Express.js** : Framework web
- **TypeScript** : Langage de programmation
- **MongoDB** : Base de données
- **Mongoose** : ODM pour MongoDB
- **JWT** : Authentification
- **Helmet** : Sécurité
- **CORS** : Cross-Origin Resource Sharing
- **Morgan** : Logging des requêtes
