import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  userType: 'particulier' | 'professionnel';
}

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userType?: string;
}

let io: Server | null = null;

/**
 * Initialize Socket.io server attached to an HTTP server.
 * Clients authenticate via JWT token passed in auth.token.
 */
export function initSocketServer(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
    },
    path: '/socket.io',
  });

  // JWT authentication middleware
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication token required'));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      socket.userId = decoded.userId;
      socket.userType = decoded.userType;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (rawSocket: Socket) => {
    const socket = rawSocket as AuthenticatedSocket;
    const userId = socket.userId!;

    // Join personal room for direct notifications
    socket.join(`user:${userId}`);

    // Join a conversation room
    socket.on('join:conversation', (conversationId: string) => {
      if (typeof conversationId === 'string' && conversationId.length > 0) {
        socket.join(`conversation:${conversationId}`);
      }
    });

    // Leave a conversation room
    socket.on('leave:conversation', (conversationId: string) => {
      if (typeof conversationId === 'string' && conversationId.length > 0) {
        socket.leave(`conversation:${conversationId}`);
      }
    });

    // Typing indicator
    socket.on('typing:start', (conversationId: string) => {
      if (typeof conversationId === 'string' && conversationId.length > 0) {
        socket.to(`conversation:${conversationId}`).emit('typing:start', {
          userId,
          conversationId,
        });
      }
    });

    socket.on('typing:stop', (conversationId: string) => {
      if (typeof conversationId === 'string' && conversationId.length > 0) {
        socket.to(`conversation:${conversationId}`).emit('typing:stop', {
          userId,
          conversationId,
        });
      }
    });

    socket.on('disconnect', () => {
      // Cleanup handled automatically by socket.io
    });
  });

  return io;
}

/** Get the current Socket.io server instance */
export function getIO(): Server | null {
  return io;
}

/** Emit a new message event to a conversation room and individual user rooms */
export function emitNewMessage(conversationId: string, message: unknown, recipientIds: string[]): void {
  if (!io) return;
  io.to(`conversation:${conversationId}`).emit('message:new', message);
  for (const id of recipientIds) {
    io.to(`user:${id}`).emit('conversation:updated', { conversationId });
  }
}

/** Emit a message update event */
export function emitMessageUpdated(conversationId: string, message: unknown): void {
  if (!io) return;
  io.to(`conversation:${conversationId}`).emit('message:updated', message);
}

/** Emit a message deleted event */
export function emitMessageDeleted(conversationId: string, messageId: string): void {
  if (!io) return;
  io.to(`conversation:${conversationId}`).emit('message:deleted', { messageId });
}
