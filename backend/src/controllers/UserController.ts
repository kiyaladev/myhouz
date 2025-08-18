import { Request, Response } from 'express';
import User, { IUser } from '../models/User';

export class UserController {
  // Récupérer tous les utilisateurs
  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await User.find().select('-motDePasse');
      res.json({
        success: true,
        data: users,
        count: users.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des utilisateurs',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }

  // Récupérer un utilisateur par ID
  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await User.findById(id).select('-motDePasse');
      
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
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'utilisateur',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }

  // Créer un nouvel utilisateur
  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { nom, email, motDePasse, telephone, role } = req.body;

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'Un utilisateur avec cet email existe déjà'
        });
        return;
      }

      const newUser = new User({
        nom,
        email,
        motDePasse, // Note: En production, hasher le mot de passe avec bcrypt
        telephone,
        role
      });

      const savedUser = await newUser.save();
      
      // Retourner l'utilisateur sans le mot de passe
      const userResponse = savedUser.toObject();
      const { motDePasse: _, ...userWithoutPassword } = userResponse;

      res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès',
        data: userWithoutPassword
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Erreur lors de la création de l\'utilisateur',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }

  // Mettre à jour un utilisateur
  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).select('-motDePasse');

      if (!updatedUser) {
        res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Utilisateur mis à jour avec succès',
        data: updatedUser
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Erreur lors de la mise à jour de l\'utilisateur',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }

  // Supprimer un utilisateur
  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deletedUser = await User.findByIdAndDelete(id);

      if (!deletedUser) {
        res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Utilisateur supprimé avec succès'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression de l\'utilisateur',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }
}
