import { createServer, Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { io as clientIO, Socket as ClientSocket } from 'socket.io-client';
import jwt from 'jsonwebtoken';
import { initSocketServer, getIO, emitNewMessage, emitMessageUpdated, emitMessageDeleted } from '../services/socketService';

const JWT_SECRET = 'test-secret';
const PORT = 0; // let OS pick a free port

function makeToken(userId: string, userType: string = 'particulier'): string {
  return jwt.sign({ userId, userType }, JWT_SECRET);
}

describe('Socket.io service', () => {
  let httpServer: HttpServer;
  let ioServer: Server;
  let port: number;

  beforeAll((done) => {
    httpServer = createServer();
    ioServer = initSocketServer(httpServer);
    httpServer.listen(PORT, () => {
      const addr = httpServer.address();
      port = typeof addr === 'object' && addr ? addr.port : 0;
      done();
    });
  });

  afterAll((done) => {
    ioServer.close();
    httpServer.close(done);
  });

  function connectClient(token: string): ClientSocket {
    return clientIO(`http://localhost:${port}`, {
      auth: { token },
      transports: ['websocket'],
      forceNew: true,
    });
  }

  describe('authentication', () => {
    it('should reject connection without token', (done) => {
      const client = clientIO(`http://localhost:${port}`, {
        transports: ['websocket'],
        forceNew: true,
      });
      client.on('connect_error', (err) => {
        expect(err.message).toContain('Authentication token required');
        client.disconnect();
        done();
      });
    });

    it('should reject connection with invalid token', (done) => {
      const client = connectClient('invalid-token');
      client.on('connect_error', (err) => {
        expect(err.message).toContain('Invalid token');
        client.disconnect();
        done();
      });
    });

    it('should accept connection with valid token', (done) => {
      const client = connectClient(makeToken('user1'));
      client.on('connect', () => {
        expect(client.connected).toBe(true);
        client.disconnect();
        done();
      });
    });
  });

  describe('conversation rooms', () => {
    let sender: ClientSocket;
    let receiver: ClientSocket;

    afterEach(() => {
      sender?.disconnect();
      receiver?.disconnect();
    });

    it('should receive typing:start events in the same conversation', (done) => {
      const convId = 'conv123';
      sender = connectClient(makeToken('userA'));
      receiver = connectClient(makeToken('userB'));

      let connected = 0;
      const onBothConnected = () => {
        connected++;
        if (connected < 2) return;

        // Both join the conversation room
        sender.emit('join:conversation', convId);
        receiver.emit('join:conversation', convId);

        // Give a moment for room join to process
        setTimeout(() => {
          receiver.on('typing:start', (data) => {
            expect(data.userId).toBe('userA');
            expect(data.conversationId).toBe(convId);
            done();
          });
          sender.emit('typing:start', convId);
        }, 50);
      };

      sender.on('connect', onBothConnected);
      receiver.on('connect', onBothConnected);
    });

    it('should receive typing:stop events in the same conversation', (done) => {
      const convId = 'conv456';
      sender = connectClient(makeToken('userC'));
      receiver = connectClient(makeToken('userD'));

      let connected = 0;
      const onBothConnected = () => {
        connected++;
        if (connected < 2) return;

        sender.emit('join:conversation', convId);
        receiver.emit('join:conversation', convId);

        setTimeout(() => {
          receiver.on('typing:stop', (data) => {
            expect(data.userId).toBe('userC');
            expect(data.conversationId).toBe(convId);
            done();
          });
          sender.emit('typing:stop', convId);
        }, 50);
      };

      sender.on('connect', onBothConnected);
      receiver.on('connect', onBothConnected);
    });

    it('should not receive events after leaving a conversation room', (done) => {
      const convId = 'conv789';
      sender = connectClient(makeToken('userE'));
      receiver = connectClient(makeToken('userF'));

      let connected = 0;
      const onBothConnected = () => {
        connected++;
        if (connected < 2) return;

        sender.emit('join:conversation', convId);
        receiver.emit('join:conversation', convId);

        setTimeout(() => {
          receiver.emit('leave:conversation', convId);

          setTimeout(() => {
            let received = false;
            receiver.on('typing:start', () => {
              received = true;
            });
            sender.emit('typing:start', convId);

            setTimeout(() => {
              expect(received).toBe(false);
              done();
            }, 100);
          }, 50);
        }, 50);
      };

      sender.on('connect', onBothConnected);
      receiver.on('connect', onBothConnected);
    });
  });

  describe('emit helpers', () => {
    let client: ClientSocket;

    afterEach(() => {
      client?.disconnect();
    });

    it('emitNewMessage sends message:new to conversation room', (done) => {
      const convId = 'convEmit1';
      client = connectClient(makeToken('userG'));

      client.on('connect', () => {
        client.emit('join:conversation', convId);

        setTimeout(() => {
          client.on('message:new', (msg) => {
            expect(msg.content).toBe('Hello');
            done();
          });
          emitNewMessage(convId, { content: 'Hello' }, []);
        }, 50);
      });
    });

    it('emitNewMessage sends conversation:updated to user room', (done) => {
      const convId = 'convEmit2';
      client = connectClient(makeToken('userH'));

      client.on('connect', () => {
        client.on('conversation:updated', (data) => {
          expect(data.conversationId).toBe(convId);
          done();
        });

        setTimeout(() => {
          emitNewMessage(convId, { content: 'Hi' }, ['userH']);
        }, 50);
      });
    });

    it('emitMessageUpdated sends message:updated to conversation room', (done) => {
      const convId = 'convEmit3';
      client = connectClient(makeToken('userI'));

      client.on('connect', () => {
        client.emit('join:conversation', convId);

        setTimeout(() => {
          client.on('message:updated', (msg) => {
            expect(msg.edited).toBe(true);
            done();
          });
          emitMessageUpdated(convId, { edited: true });
        }, 50);
      });
    });

    it('emitMessageDeleted sends message:deleted to conversation room', (done) => {
      const convId = 'convEmit4';
      client = connectClient(makeToken('userJ'));

      client.on('connect', () => {
        client.emit('join:conversation', convId);

        setTimeout(() => {
          client.on('message:deleted', (data) => {
            expect(data.messageId).toBe('msg123');
            done();
          });
          emitMessageDeleted(convId, 'msg123');
        }, 50);
      });
    });
  });

  describe('getIO', () => {
    it('should return the io instance after initialization', () => {
      const instance = getIO();
      expect(instance).not.toBeNull();
      expect(instance).toBe(ioServer);
    });
  });
});
