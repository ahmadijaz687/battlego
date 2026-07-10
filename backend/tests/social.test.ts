import request from 'supertest';
import socialRoutes from '../src/routes/social.js';
import { createRouteApp } from './helpers/setup.js';

const { app, authHeader } = createRouteApp(socialRoutes, '/api/social');

describe('Social Routes', () => {
  describe('GET /api/social/stories', () => {
    it('should return stories array', async () => {
      const response = await request(app).get('/api/social/stories');
      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/social/communities', () => {
    it('should return communities array', async () => {
      const response = await request(app).get('/api/social/communities');
      expect(response.status).toBe(200);
    });
  });

  describe('Protected routes without auth', () => {
    it('should return 401 for feed', async () => {
      const response = await request(app).get('/api/social/feed');
      expect(response.status).toBe(401);
    });

    it('should return 401 for friends', async () => {
      const response = await request(app).get('/api/social/friends');
      expect(response.status).toBe(401);
    });

    it('should return 401 for notifications', async () => {
      const response = await request(app).get('/api/social/notifications');
      expect(response.status).toBe(401);
    });

    it('should return 401 for friend requests', async () => {
      const response = await request(app).get('/api/social/friend-requests');
      expect(response.status).toBe(401);
    });

    it('should return 401 for messages', async () => {
      const response = await request(app).get('/api/social/messages/conv-1');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/social/posts (create post)', () => {
    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/social/posts')
        .set('Authorization', authHeader)
        .send({});
      expect(response.status).toBe(400);
    });

    it('should return 400 for invalid post type', async () => {
      const response = await request(app)
        .post('/api/social/posts')
        .set('Authorization', authHeader)
        .send({ content: 'Test post', type: 'invalid', userName: 'Tester' });
      expect(response.status).toBe(400);
    });

    it('should return 400 for missing content', async () => {
      const response = await request(app)
        .post('/api/social/posts')
        .set('Authorization', authHeader)
        .send({ type: 'general', userName: 'Tester' });
      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/social/posts/:postId/like', () => {
    it('should return 401 without auth', async () => {
      const response = await request(app)
        .post('/api/social/posts/post-1/like');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/social/posts/:postId/comment', () => {
    it('should return 401 without auth', async () => {
      const response = await request(app)
        .post('/api/social/posts/post-1/comment');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/social/friend-requests', () => {
    it('should return 400 for missing fields', async () => {
      const response = await request(app)
        .post('/api/social/friend-requests')
        .set('Authorization', authHeader)
        .send({});
      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/social/messages', () => {
    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/social/messages')
        .set('Authorization', authHeader)
        .send({});
      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/social/communities', () => {
    it('should return 400 for missing fields', async () => {
      const response = await request(app)
        .post('/api/social/communities')
        .set('Authorization', authHeader)
        .send({});
      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/social/stories', () => {
    it('should return 400 for missing userName', async () => {
      const response = await request(app)
        .post('/api/social/stories')
        .set('Authorization', authHeader)
        .send({});
      expect(response.status).toBe(400);
    });
  });
});
