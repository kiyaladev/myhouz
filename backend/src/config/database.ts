import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI n\'est pas défini dans les variables d\'environnement');
    }

    const options = {
      retryWrites: true,
      w: 'majority' as const,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      serverSelectionTimeoutMS: 10000
    };

    await mongoose.connect(mongoURI, options);
    
    console.log('✅ Connexion à MongoDB réussie');
    
    // Gestion des événements de connexion
    mongoose.connection.on('error', (error) => {
      console.error('❌ Erreur de connexion MongoDB:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ Déconnexion de MongoDB');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 Reconnexion à MongoDB');
    });

  } catch (error) {
    console.error('❌ Impossible de se connecter à MongoDB:', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('✅ Déconnexion de MongoDB réussie');
  } catch (error) {
    console.error('❌ Erreur lors de la déconnexion:', error);
  }
};
