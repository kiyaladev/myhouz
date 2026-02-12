import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';

interface JwtPayload {
  userId: string;
  userType: 'particulier' | 'professionnel';
}

declare global {
  namespace Express {
    interface User {
      userId: string;
      userType: 'particulier' | 'professionnel';
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Token d\'accès requis'
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    
    // Vérifier que l'utilisateur existe toujours
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Token invalide ou utilisateur inactif'
      });
      return;
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }
};

export const requireProfessional = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.userType !== 'professionnel') {
    res.status(403).json({
      success: false,
      message: 'Accès réservé aux professionnels'
    });
    return;
  }
  next();
};

export const requireParticulier = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.userType !== 'particulier') {
    res.status(403).json({
      success: false,
      message: 'Accès réservé aux particuliers'
    });
    return;
  }
  next();
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      
      // Vérifier que l'utilisateur existe toujours
      const user = await User.findById(decoded.userId);
      if (user && user.isActive) {
        req.user = decoded;
      }
    }
    
    next();
  } catch (error) {
    // En cas d'erreur avec le token, on continue sans utilisateur authentifié
    next();
  }
};
