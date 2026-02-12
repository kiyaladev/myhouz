import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { User } from '../models';

// Génération des tokens JWT (même pattern que UserController)
export const generateTokens = (userId: string, userType: string) => {
  const token = jwt.sign(
    { userId, userType },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId, userType, tokenType: 'refresh' },
    process.env.JWT_SECRET!,
    { expiresIn: '30d' }
  );

  return { token, refreshToken };
};

// Trouve ou crée un utilisateur via OAuth
const findOrCreateOAuthUser = async (
  provider: 'googleId' | 'facebookId',
  profileId: string,
  email: string,
  firstName: string,
  lastName: string,
  profileImage?: string
) => {
  // Chercher par ID social
  const socialQuery = { [`socialAuth.${provider}`]: profileId };
  let user = await User.findOne(socialQuery);
  if (user) return user;

  // Chercher par email pour lier les comptes
  user = await User.findOne({ email });
  if (user) {
    user.socialAuth = user.socialAuth || {};
    (user.socialAuth as any)[provider] = profileId;
    if (!user.emailVerified) user.emailVerified = true;
    await user.save();
    return user;
  }

  // Créer un nouvel utilisateur
  const randomPassword = crypto.randomBytes(32).toString('hex');
  const hashedPassword = await bcrypt.hash(randomPassword, 12);

  user = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    userType: 'particulier',
    profileImage,
    emailVerified: true,
    isActive: true,
    socialAuth: { [provider]: profileId },
  });

  await user.save();
  return user;
};

// Stratégie Google
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/users/auth/google/callback',
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(null, false, { message: 'Aucun email associé au compte Google' });
          }

          const user = await findOrCreateOAuthUser(
            'googleId',
            profile.id,
            email,
            profile.name?.givenName || 'Utilisateur',
            profile.name?.familyName || 'Google',
            profile.photos?.[0]?.value
          );

          return done(null, user as any);
        } catch (error) {
          console.error('Erreur lors de l\'authentification Google:', error);
          return done(error as Error);
        }
      }
    )
  );
}

// Stratégie Facebook
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: '/api/users/auth/facebook/callback',
        profileFields: ['id', 'emails', 'name', 'photos'],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(null, false, { message: 'Aucun email associé au compte Facebook' });
          }

          const user = await findOrCreateOAuthUser(
            'facebookId',
            profile.id,
            email,
            profile.name?.givenName || 'Utilisateur',
            profile.name?.familyName || 'Facebook',
            profile.photos?.[0]?.value
          );

          return done(null, user as any);
        } catch (error) {
          console.error('Erreur lors de l\'authentification Facebook:', error);
          return done(error as Error);
        }
      }
    )
  );
}

export default passport;
