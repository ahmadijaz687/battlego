import express from 'express';
import request from 'supertest';
import { jest } from '@jest/globals';
import { globalErrorHandler, asyncHandler } from '../src/middlewares/errorHandler.js';
import { AppError } from '../src/utils/AppError.js';

function makeApp(handler: (req: express.Request, res: express.Response, next: express.NextFunction) => unknown) {
  const app = express();
  app.get('/test', asyncHandler(handler));
  app.use(globalErrorHandler);
  return app;
}

describe('globalErrorHandler', () => {
  it('should return 500 for unknown errors', async () => {
    const app = makeApp(() => { throw new Error('boom'); });
    const res = await request(app).get('/test');
    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
  });

  it('should return AppError status code', async () => {
    const app = makeApp(() => { throw new AppError('Not Found', 404); });
    const res = await request(app).get('/test');
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Not Found');
  });

  it('should return 400 for AppError with statusCode 400', async () => {
    const app = makeApp(() => { throw new AppError('Bad Request', 400); });
    const res = await request(app).get('/test');
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Bad Request');
  });
});

describe('asyncHandler', () => {
  it('should call handler and pass result', async () => {
    const handler = jest.fn((_req, res) => res.json({ ok: true }));
    const app = express();
    app.get('/test', asyncHandler(handler));
    app.use(globalErrorHandler);

    const res = await request(app).get('/test');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(handler).toHaveBeenCalled();
  });

  it('should catch async errors', async () => {
    const handler = jest.fn(() => Promise.reject(new Error('async error')));
    const app = express();
    app.get('/test', asyncHandler(handler));
    app.use(globalErrorHandler);

    const res = await request(app).get('/test');
    expect(res.status).toBe(500);
  });
});
