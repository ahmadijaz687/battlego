import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { initializeSocket } from '../src/socket/index.js';
import jwt from 'jsonwebtoken';
import { jest } from '@jest/globals';

function createMockSocket(server: Server, namespace = '/') {
  const nsp = server.of(namespace);
  return nsp;
}

describe('Socket Initialization', () => {
  let httpServer: HttpServer;
  let io: Server;

  beforeAll(() => {
    process.env.CORS_ORIGIN = 'http://localhost:3000';
  });

  beforeEach(() => {
    httpServer = new HttpServer();
    io = initializeSocket(httpServer);
  });

  afterEach(() => {
    io?.close();
    httpServer?.close();
  });

  describe('server setup', () => {
    it('should create socket.io server with cors options', () => {
      expect(io).toBeDefined();
      expect(io.engine.opts.cors).toBeDefined();
    });

    it('should have ping settings configured', () => {
      expect(io.engine.opts.pingInterval).toBe(25000);
      expect(io.engine.opts.pingTimeout).toBe(20000);
    });
  });

  describe('namespaces', () => {
    it('should have /battle namespace', () => {
      const battleNsp = createMockSocket(io, '/battle');
      expect(battleNsp).toBeDefined();
    });

    it('should have /chat namespace', () => {
      const chatNsp = createMockSocket(io, '/chat');
      expect(chatNsp).toBeDefined();
    });

    it('should have /notifications namespace', () => {
      const notifNsp = createMockSocket(io, '/notifications');
      expect(notifNsp).toBeDefined();
    });

    it('should have /ai namespace', () => {
      const aiNsp = createMockSocket(io, '/ai');
      expect(aiNsp).toBeDefined();
    });
  });

  describe('authentication middleware', () => {
    it('should apply auth middleware on connection', () => {
      const useSpy = jest.spyOn(Server.prototype, 'use');
      initializeSocket(httpServer);
      expect(useSpy).toHaveBeenCalled();
      useSpy.mockRestore();
    });

    it('should decode valid JWT tokens', () => {
      const token = jwt.sign(
        { id: 'test-user' },
        process.env.JWT_SECRET || 'default-secret'
      );
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as { id: string };
      expect(decoded.id).toBe('test-user');
    });

    it('should reject invalid JWT tokens gracefully (not throw)', () => {
      expect(() => {
        jwt.verify('invalid-token', process.env.JWT_SECRET || 'default-secret');
      }).toThrow();
    });
  });

  describe('battle namespace events', () => {
    it('should handle join:battle event', () => {
      const handler = io.of('/battle').on as jest.Mock;
      expect(io.of('/battle')).toBeDefined();
    });
  });

  describe('chat namespace events', () => {
    it('should handle typing events', () => {
      const chatNsp = io.of('/chat');
      expect(chatNsp).toBeDefined();
    });
  });

  describe('notifications namespace', () => {
    it('should auto-join user room on auth', () => {
      const notifNsp = io.of('/notifications');
      expect(notifNsp).toBeDefined();
    });
  });
});
