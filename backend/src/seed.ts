import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User, Project, Product, Article, ForumPost } from './models';

dotenv.config();

const PASSWORD = process.env.SEED_PASSWORD || 'password123';

async function seed() {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI n\'est pas défini dans les variables d\'environnement');
    }

    await mongoose.connect(mongoURI);
    console.log('✅ Connexion à MongoDB réussie');

    const hashedPassword = await bcrypt.hash(PASSWORD, 12);

    // --- Utilisateurs ---
    const users = await User.insertMany([
      {
        firstName: 'Marie',
        lastName: 'Dupont',
        email: 'marie.dupont@example.com',
        password: hashedPassword,
        userType: 'particulier',
        location: { address: '12 Rue de Rivoli', city: 'Paris', zipCode: '75001' },
        preferences: { newsletter: true, notifications: true, language: 'fr' },
        isActive: true,
        emailVerified: true,
      },
      {
        firstName: 'Lucas',
        lastName: 'Martin',
        email: 'lucas.martin@example.com',
        password: hashedPassword,
        userType: 'particulier',
        location: { address: '5 Avenue Jean Jaurès', city: 'Lyon', zipCode: '69007' },
        preferences: { newsletter: false, notifications: true, language: 'fr' },
        isActive: true,
        emailVerified: true,
      },
      {
        firstName: 'Sophie',
        lastName: 'Bernard',
        email: 'sophie.bernard@example.com',
        password: hashedPassword,
        userType: 'professionnel',
        location: { address: '8 Boulevard Haussmann', city: 'Paris', zipCode: '75009' },
        professionalInfo: {
          companyName: 'Bernard Design Intérieur',
          businessNumber: 'SIRET-12345678900012',
          services: ['decoration', 'amenagement', 'conseil'],
          description: 'Architecte d\'intérieur spécialisée dans les espaces modernes et lumineux.',
          portfolio: [],
          certifications: ['Diplôme ENSAD', 'Certification HQE'],
          workingZones: ['Paris', 'Île-de-France'],
          pricing: { startingPrice: 80, currency: 'EUR' },
          subscription: { type: 'premium' },
          rating: { average: 4.7, totalReviews: 23 },
          verified: true,
        },
        isActive: true,
        emailVerified: true,
      },
      {
        firstName: 'Pierre',
        lastName: 'Lefèvre',
        email: 'pierre.lefevre@example.com',
        password: hashedPassword,
        userType: 'professionnel',
        location: { address: '22 Rue Garibaldi', city: 'Lyon', zipCode: '69003' },
        professionalInfo: {
          companyName: 'Lefèvre Rénovation',
          businessNumber: 'SIRET-98765432100034',
          services: ['renovation', 'construction', 'plomberie'],
          description: 'Entreprise de rénovation complète, du gros œuvre aux finitions.',
          portfolio: [],
          certifications: ['RGE', 'Qualibat'],
          workingZones: ['Lyon', 'Rhône-Alpes'],
          pricing: { startingPrice: 50, currency: 'EUR' },
          subscription: { type: 'gratuit' },
          rating: { average: 4.3, totalReviews: 15 },
          verified: true,
        },
        isActive: true,
        emailVerified: true,
      },
    ]);

    console.log(`✅ ${users.length} utilisateurs créés`);

    const [marie, lucas, sophie, pierre] = users;

    // --- Projets ---
    const projects = await Project.insertMany([
      {
        title: 'Rénovation complète d\'un appartement haussmannien',
        description: 'Transformation d\'un appartement de 120m² dans le 9ème arrondissement de Paris. Moulures restaurées, parquet chevron poncé, cuisine ouverte contemporaine.',
        images: [{ url: '/images/projects/haussmann-1.jpg', caption: 'Salon après rénovation', tags: ['salon', 'haussmannien'] }],
        professional: sophie._id,
        category: 'renovation',
        room: 'salon',
        style: ['classique', 'contemporain'],
        budget: { min: 80000, max: 120000, currency: 'EUR' },
        location: { city: 'Paris', country: 'France' },
        tags: ['haussmannien', 'rénovation', 'parquet'],
        featured: true,
        status: 'published',
        likes: 42,
        views: 380,
        saves: 18,
      },
      {
        title: 'Cuisine moderne ouverte sur séjour',
        description: 'Création d\'une cuisine ouverte avec îlot central en chêne massif et plan de travail en quartz. Électroménager intégré haut de gamme.',
        images: [{ url: '/images/projects/cuisine-1.jpg', caption: 'Vue d\'ensemble de la cuisine', tags: ['cuisine', 'moderne'] }],
        professional: sophie._id,
        category: 'amenagement',
        room: 'cuisine',
        style: ['moderne', 'minimaliste'],
        budget: { min: 25000, max: 40000, currency: 'EUR' },
        location: { city: 'Paris', country: 'France' },
        tags: ['cuisine', 'îlot', 'chêne'],
        featured: false,
        status: 'published',
        likes: 28,
        views: 215,
        saves: 12,
      },
      {
        title: 'Salle de bain zen en pierre naturelle',
        description: 'Rénovation complète d\'une salle de bain avec douche italienne, vasque en pierre et robinetterie noire mat.',
        images: [{ url: '/images/projects/sdb-1.jpg', caption: 'Douche italienne', tags: ['salle-de-bain', 'zen'] }],
        professional: pierre._id,
        category: 'renovation',
        room: 'salle-de-bain',
        style: ['minimaliste', 'contemporain'],
        budget: { min: 12000, max: 18000, currency: 'EUR' },
        location: { city: 'Lyon', country: 'France' },
        tags: ['salle-de-bain', 'pierre', 'douche-italienne'],
        featured: true,
        status: 'published',
        likes: 35,
        views: 290,
        saves: 22,
      },
      {
        title: 'Terrasse paysagée avec pergola bioclimatique',
        description: 'Aménagement d\'une terrasse de 30m² avec pergola bioclimatique, jardinières intégrées et éclairage d\'ambiance LED.',
        images: [{ url: '/images/projects/terrasse-1.jpg', caption: 'Terrasse de nuit', tags: ['exterieur', 'pergola'] }],
        professional: pierre._id,
        category: 'jardin',
        room: 'exterieur',
        style: ['moderne', 'contemporain'],
        budget: { min: 15000, max: 25000, currency: 'EUR' },
        location: { city: 'Lyon', country: 'France' },
        tags: ['terrasse', 'pergola', 'jardin'],
        featured: false,
        status: 'published',
        likes: 19,
        views: 145,
        saves: 8,
      },
    ]);

    console.log(`✅ ${projects.length} projets créés`);

    // --- Produits ---
    const products = await Product.insertMany([
      {
        name: 'Canapé d\'angle en lin lavé gris',
        description: 'Canapé d\'angle modulable en lin lavé, structure en bois massif. Confort ferme, coussins déhoussables. Fabrication française.',
        images: ['/images/products/canape-lin-1.jpg'],
        price: { amount: 2490, currency: 'EUR', originalPrice: 2990 },
        category: 'mobilier',
        subcategory: 'canapés',
        brand: 'Maison Française',
        seller: sophie._id,
        specifications: {
          dimensions: { width: 280, height: 85, depth: 160, unit: 'cm' },
          material: ['lin', 'bois massif'],
          color: ['gris'],
          style: ['contemporain', 'scandinave'],
          weight: 65,
        },
        inventory: { quantity: 8, sku: 'MF-CANAPE-LIN-001', trackInventory: true },
        shipping: { weight: 70, dimensions: { length: 290, width: 170, height: 90 }, freeShipping: true },
        seo: { slug: 'canape-angle-lin-lave-gris', metaTitle: 'Canapé d\'angle lin lavé gris - Maison Française' },
        rating: { average: 4.6, totalReviews: 12 },
        tags: ['canapé', 'lin', 'français', 'modulable'],
        featured: true,
        status: 'active',
        sales: 24,
        views: 580,
      },
      {
        name: 'Suspension luminaire laiton et verre',
        description: 'Suspension design en laiton brossé avec globe en verre fumé. Éclairage chaleureux, compatible LED E27.',
        images: ['/images/products/suspension-1.jpg'],
        price: { amount: 189, currency: 'EUR' },
        category: 'eclairage',
        subcategory: 'suspensions',
        brand: 'Atelier Lumière',
        seller: sophie._id,
        specifications: {
          dimensions: { width: 30, height: 40, depth: 30, unit: 'cm' },
          material: ['laiton', 'verre'],
          color: ['doré', 'fumé'],
          style: ['moderne', 'industriel'],
          weight: 2.5,
        },
        inventory: { quantity: 25, sku: 'AL-SUSP-LAITON-001', trackInventory: true },
        shipping: { weight: 3, dimensions: { length: 40, width: 40, height: 50 }, freeShipping: false, shippingCost: 12 },
        seo: { slug: 'suspension-laiton-verre-fume', metaTitle: 'Suspension laiton et verre fumé - Atelier Lumière' },
        rating: { average: 4.8, totalReviews: 31 },
        tags: ['luminaire', 'laiton', 'suspension', 'design'],
        featured: true,
        status: 'active',
        sales: 67,
        views: 920,
      },
      {
        name: 'Miroir rond en rotin naturel',
        description: 'Miroir mural rond encadré de rotin tressé à la main. Diamètre 60 cm. Apporte une touche bohème à votre intérieur.',
        images: ['/images/products/miroir-rotin-1.jpg'],
        price: { amount: 79, currency: 'EUR' },
        category: 'decoration',
        subcategory: 'miroirs',
        brand: 'Natur\'Déco',
        seller: pierre._id,
        specifications: {
          dimensions: { width: 60, height: 60, depth: 5, unit: 'cm' },
          material: ['rotin', 'verre'],
          color: ['naturel'],
          style: ['boheme', 'scandinave'],
          weight: 3,
        },
        inventory: { quantity: 40, sku: 'ND-MIROIR-ROT-001', trackInventory: true },
        shipping: { weight: 4, dimensions: { length: 65, width: 65, height: 10 }, freeShipping: false, shippingCost: 8 },
        seo: { slug: 'miroir-rond-rotin-naturel', metaTitle: 'Miroir rond en rotin naturel - Natur\'Déco' },
        rating: { average: 4.4, totalReviews: 18 },
        tags: ['miroir', 'rotin', 'bohème', 'naturel'],
        featured: false,
        status: 'active',
        sales: 45,
        views: 430,
      },
      {
        name: 'Table basse en chêne massif et métal noir',
        description: 'Table basse rectangulaire au design industriel. Plateau en chêne massif huilé, pieds en métal noir mat. Fabrication artisanale.',
        images: ['/images/products/table-basse-1.jpg'],
        price: { amount: 449, currency: 'EUR', originalPrice: 549 },
        category: 'mobilier',
        subcategory: 'tables',
        brand: 'Atelier du Bois',
        seller: pierre._id,
        specifications: {
          dimensions: { width: 110, height: 40, depth: 60, unit: 'cm' },
          material: ['chêne massif', 'métal'],
          color: ['naturel', 'noir'],
          style: ['industriel', 'contemporain'],
          weight: 25,
        },
        inventory: { quantity: 12, sku: 'AB-TABLE-CHE-001', trackInventory: true },
        shipping: { weight: 28, dimensions: { length: 120, width: 70, height: 50 }, freeShipping: true },
        seo: { slug: 'table-basse-chene-metal-noir', metaTitle: 'Table basse chêne massif et métal noir - Atelier du Bois' },
        rating: { average: 4.5, totalReviews: 9 },
        tags: ['table', 'chêne', 'industriel', 'artisanal'],
        featured: false,
        status: 'active',
        sales: 18,
        views: 310,
      },
    ]);

    console.log(`✅ ${products.length} produits créés`);

    // --- Articles ---
    const articles = await Article.insertMany([
      {
        title: '10 tendances déco 2024 pour votre intérieur',
        slug: '10-tendances-deco-2024',
        excerpt: 'Découvrez les couleurs, matériaux et styles qui marqueront l\'année 2024 en décoration intérieure.',
        content: '<h2>Les couleurs de 2024</h2><p>Le vert sauge et le terracotta restent des valeurs sûres, tandis que le bleu nuit fait une entrée remarquée...</p><h2>Les matériaux naturels</h2><p>Le bois brut, la pierre et le lin continuent de séduire les amateurs de décoration authentique...</p>',
        author: sophie._id,
        featuredImage: '/images/articles/tendances-2024.jpg',
        category: 'tendances',
        tags: ['tendances', 'déco', '2024', 'couleurs'],
        seo: { metaTitle: '10 tendances déco 2024', metaDescription: 'Les tendances décoration intérieure incontournables de 2024.', keywords: ['tendances', 'déco', '2024'] },
        status: 'published',
        featured: true,
        publishedAt: new Date(),
        views: 1250,
        likes: 89,
        shares: 34,
        estimatedReadTime: 8,
      },
      {
        title: 'Guide complet : rénover sa salle de bain étape par étape',
        slug: 'guide-renovation-salle-de-bain',
        excerpt: 'Tout ce qu\'il faut savoir pour réussir la rénovation de votre salle de bain, du budget aux finitions.',
        content: '<h2>Étape 1 : Définir le budget</h2><p>Prévoyez entre 5 000 et 15 000 € pour une rénovation complète...</p><h2>Étape 2 : Choisir les matériaux</h2><p>Le carrelage grand format et la faïence métro restent des choix populaires...</p>',
        author: pierre._id,
        featuredImage: '/images/articles/renovation-sdb.jpg',
        category: 'guides',
        tags: ['rénovation', 'salle-de-bain', 'guide', 'budget'],
        seo: { metaTitle: 'Guide rénovation salle de bain', metaDescription: 'Guide complet pour rénover votre salle de bain.', keywords: ['rénovation', 'salle de bain'] },
        status: 'published',
        featured: false,
        publishedAt: new Date(),
        views: 870,
        likes: 56,
        shares: 21,
        estimatedReadTime: 12,
      },
      {
        title: 'Comment choisir le bon artisan pour vos travaux',
        slug: 'choisir-bon-artisan-travaux',
        excerpt: 'Les critères essentiels pour sélectionner un professionnel fiable et compétent pour vos projets de rénovation.',
        content: '<h2>Vérifiez les certifications</h2><p>Les labels RGE, Qualibat et OPQIBI sont des gages de qualité...</p><h2>Demandez plusieurs devis</h2><p>Comparez au moins trois devis détaillés avant de vous engager...</p>',
        author: sophie._id,
        featuredImage: '/images/articles/choisir-artisan.jpg',
        category: 'conseils',
        tags: ['artisan', 'conseils', 'travaux', 'devis'],
        seo: { metaTitle: 'Choisir le bon artisan', metaDescription: 'Conseils pour bien choisir votre artisan.', keywords: ['artisan', 'travaux', 'conseils'] },
        status: 'published',
        featured: false,
        publishedAt: new Date(),
        views: 640,
        likes: 42,
        shares: 15,
        estimatedReadTime: 6,
      },
    ]);

    console.log(`✅ ${articles.length} articles créés`);

    // --- Forum Posts ---
    const forumPosts = await ForumPost.insertMany([
      {
        title: 'Quel revêtement de sol pour une cuisine ouverte ?',
        content: 'Bonjour à tous, je suis en train de rénover ma cuisine ouverte sur le salon et j\'hésite entre le carrelage imitation parquet et le vrai parquet massif traité. Quels sont vos retours d\'expérience ? Merci !',
        author: marie._id,
        category: 'renovation',
        tags: ['sol', 'cuisine', 'parquet', 'carrelage'],
        solved: false,
        views: 156,
        votes: { up: 8, down: 0 },
        status: 'active',
        isPinned: false,
      },
      {
        title: 'Idées déco pour un petit salon de 15m²',
        content: 'J\'ai un salon de 15m² et j\'aimerais le rendre plus spacieux visuellement. Avez-vous des astuces pour optimiser l\'espace et le rendre cosy en même temps ? Je suis ouvert à toutes les suggestions !',
        author: lucas._id,
        category: 'decoration',
        tags: ['petit-espace', 'salon', 'astuces', 'déco'],
        solved: false,
        views: 89,
        votes: { up: 5, down: 0 },
        status: 'active',
        isPinned: false,
      },
      {
        title: 'Retour d\'expérience : isolation par l\'extérieur',
        content: 'Je viens de faire réaliser l\'isolation par l\'extérieur de ma maison des années 70. Je partage mon expérience : coût, durée des travaux, aides obtenues (MaPrimeRénov\') et résultats sur la facture de chauffage.',
        author: marie._id,
        category: 'renovation',
        tags: ['isolation', 'ITE', 'économies', 'MaPrimeRénov'],
        solved: false,
        views: 234,
        votes: { up: 15, down: 1 },
        status: 'active',
        isPinned: true,
      },
    ]);

    console.log(`✅ ${forumPosts.length} posts de forum créés`);

    console.log('\n🎉 Seed terminé avec succès !');
    console.log('Comptes de démonstration (mot de passe: password123):');
    console.log('  - marie.dupont@example.com (particulier)');
    console.log('  - lucas.martin@example.com (particulier)');
    console.log('  - sophie.bernard@example.com (professionnel)');
    console.log('  - pierre.lefevre@example.com (professionnel)');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
