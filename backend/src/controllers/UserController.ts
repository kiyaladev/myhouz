import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models';
import { sendEmail } from '../config/email';

export class UserController {
  // Inscription
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { firstName, lastName, email, password, userType, location, professionalInfo } = req.body;

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ 
          success: false,
          message: 'Un utilisateur avec cet email existe déjà' 
        });
        return;
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 12);

      // Créer l'utilisateur
      const userData: Partial<IUser> = {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        userType,
        location,
        professionalInfo: userType === 'professionnel' ? professionalInfo : undefined
      };

      const user = new User(userData);
      
      // Générer un token de vérification d'email
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const hashedVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
      user.emailVerificationToken = hashedVerificationToken;
      user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures
      
      await user.save();

      // Envoyer l'email de vérification
      const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/verify-email?token=${verificationToken}`;
      try {
        await sendEmail(
          user.email,
          'Vérification de votre adresse email - MyHouz',
          `
          <h1>Bienvenue sur MyHouz, ${user.firstName} !</h1>
          <p>Merci de vous être inscrit. Veuillez cliquer sur le lien ci-dessous pour vérifier votre adresse email :</p>
          <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #10B981; color: white; text-decoration: none; border-radius: 8px;">Vérifier mon email</a>
          <p>Ce lien expire dans 24 heures.</p>
          <p>Si vous n'avez pas créé de compte, veuillez ignorer cet email.</p>
          `
        );
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi de l\'email de vérification:', emailError);
        // On continue malgré l'erreur d'envoi d'email
      }

      // Générer un token JWT
      const token = jwt.sign(
        { userId: user._id, userType: user.userType },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès. Un email de vérification a été envoyé.',
        token,
        data: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          userType: user.userType,
          profileImage: user.profileImage,
          emailVerified: user.emailVerified
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      res.status(500).json({ 
        success: false,
        message: 'Erreur interne du serveur' 
      });
    }
  }

    // Connexion
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Trouver l'utilisateur
      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({ 
          success: false,
          message: 'Email ou mot de passe incorrect' 
        });
        return;
      }

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ 
          success: false,
          message: 'Email ou mot de passe incorrect' 
        });
        return;
      }

      // Vérifier si le compte est actif
      if (!user.isActive) {
        res.status(401).json({ 
          success: false,
          message: 'Compte désactivé' 
        });
        return;
      }

      // Générer un token JWT
      const token = jwt.sign(
        { userId: user._id, userType: user.userType },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        message: 'Connexion réussie',
        token,
        data: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          userType: user.userType,
          profileImage: user.profileImage
        }
      });
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      res.status(500).json({ 
        success: false,
        message: 'Erreur interne du serveur' 
      });
    }
  }

  // Obtenir le profil utilisateur
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      
      const user = await User.findById(userId).select('-password');
      if (!user) {
        res.status(404).json({ 
          success: false,
          message: 'Utilisateur non trouvé' 
        });
        return;
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      res.status(500).json({ 
        success: false,
        message: 'Erreur interne du serveur' 
      });
    }
  }

  // Mettre à jour le profil
  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const updates = req.body;

      // Supprimer les champs non modifiables
      delete updates.email;
      delete updates.password;
      delete updates.userType;

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updates, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        res.status(404).json({ 
          success: false,
          message: 'Utilisateur non trouvé' 
        });
        return;
      }

      res.json({
        success: true,
        message: 'Profil mis à jour avec succès',
        data: user
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      res.status(500).json({ 
        success: false,
        message: 'Erreur interne du serveur' 
      });
    }
  }

  // Rechercher des professionnels
  static async searchProfessionals(req: Request, res: Response): Promise<void> {
    try {
      const { 
        services, 
        location, 
        city, 
        radius = 50, 
        rating = 0, 
        verified, 
        subscription,
        page = 1, 
        limit = 20 
      } = req.query;

      const query: any = {
        userType: 'professionnel',
        isActive: true
      };

      // Filtrer par services
      if (services) {
        const servicesArray = Array.isArray(services) ? services : [services];
        query['professionalInfo.services'] = { $in: servicesArray };
      }

      // Filtrer par ville
      if (city) {
        query['location.city'] = new RegExp(city as string, 'i');
      }

      // Filtrer par note minimum
      if (rating) {
        query['professionalInfo.rating.average'] = { $gte: Number(rating) };
      }

      // Filtrer par statut vérifié
      if (verified === 'true') {
        query['professionalInfo.verified'] = true;
      }

      // Filtrer par type d'abonnement
      if (subscription) {
        query['professionalInfo.subscription.type'] = subscription;
      }

      const professionals = await User.find(query)
        .select('-password')
        .sort({ 
          'professionalInfo.subscription.type': -1, // Premium en premier
          'professionalInfo.rating.average': -1,
          'professionalInfo.totalReviews': -1
        })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit));

      const total = await User.countDocuments(query);

      res.json({
        success: true,
        data: professionals,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Erreur lors de la recherche de professionnels:', error);
      res.status(500).json({ 
        success: false,
        message: 'Erreur interne du serveur' 
      });
    }
  }

  // Obtenir un profil professionnel public
  static async getProfessionalProfile(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const professional = await User.findOne({
        _id: id,
        userType: 'professionnel',
        isActive: true
      }).select('-password');

      if (!professional) {
        res.status(404).json({ 
          success: false,
          message: 'Professionnel non trouvé' 
        });
        return;
      }

      res.json({
        success: true,
        data: professional
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du profil professionnel:', error);
      res.status(500).json({ 
        success: false,
        message: 'Erreur interne du serveur' 
      });
    }
  }

  // Mot de passe oublié
  static async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        // Ne pas révéler si l'email existe ou non
        res.json({
          success: true,
          message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé'
        });
        return;
      }

      // Générer un token de réinitialisation
      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 heure
      await user.save();

      res.json({
        success: true,
        message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé'
      });
    } catch (error) {
      console.error('Erreur lors de la demande de réinitialisation:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Réinitialiser le mot de passe
  static async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, newPassword } = req.body;

      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: new Date() }
      });

      if (!user) {
        res.status(400).json({
          success: false,
          message: 'Token invalide ou expiré'
        });
        return;
      }

      user.password = await bcrypt.hash(newPassword, 12);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.json({
        success: true,
        message: 'Mot de passe réinitialisé avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Upload d'avatar
  static async uploadAvatar(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;

      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'Aucun fichier fourni'
        });
        return;
      }

      const ext = (req.file.originalname.match(/\.(jpg|jpeg|png|webp)$/i) || ['.bin'])[0];
      const uniqueName = `${crypto.randomBytes(16).toString('hex')}${ext}`;
      const fileUrl = `/uploads/avatars/${uniqueName}`;

      const user = await User.findByIdAndUpdate(
        userId,
        { profileImage: fileUrl, updatedAt: new Date() },
        { new: true }
      ).select('-password');

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Avatar mis à jour avec succès',
        data: user
      });
    } catch (error) {
      console.error('Erreur lors de l\'upload de l\'avatar:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Vérifier l'email
  static async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body;

      if (!token) {
        res.status(400).json({
          success: false,
          message: 'Token de vérification requis'
        });
        return;
      }

      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

      const user = await User.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationExpires: { $gt: new Date() }
      });

      if (!user) {
        res.status(400).json({
          success: false,
          message: 'Token invalide ou expiré'
        });
        return;
      }

      user.emailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();

      res.json({
        success: true,
        message: 'Email vérifié avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'email:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Renvoyer l'email de vérification
  static async resendVerificationEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        // Ne pas révéler si l'utilisateur existe ou non
        res.json({
          success: true,
          message: 'Si un compte existe avec cet email et n\'est pas vérifié, un email a été envoyé'
        });
        return;
      }

      if (user.emailVerified) {
        res.status(400).json({
          success: false,
          message: 'Cet email est déjà vérifié'
        });
        return;
      }

      // Générer un nouveau token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const hashedVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
      user.emailVerificationToken = hashedVerificationToken;
      user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures
      await user.save();

      // Envoyer l'email
      const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/verify-email?token=${verificationToken}`;
      try {
        await sendEmail(
          user.email,
          'Vérification de votre adresse email - MyHouz',
          `
          <h1>Vérification de votre email</h1>
          <p>Vous avez demandé un nouveau lien de vérification. Cliquez ci-dessous pour vérifier votre adresse email :</p>
          <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #10B981; color: white; text-decoration: none; border-radius: 8px;">Vérifier mon email</a>
          <p>Ce lien expire dans 24 heures.</p>
          `
        );
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi de l\'email:', emailError);
      }

      res.json({
        success: true,
        message: 'Si un compte existe avec cet email et n\'est pas vérifié, un email a été envoyé'
      });
    } catch (error) {
      console.error('Erreur lors du renvoi de l\'email de vérification:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }
}
