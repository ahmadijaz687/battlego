import { Request, Response } from 'express';
import * as authService from '../services/authService.js';
import { successResponse } from '../utils/response.js';
import type { AuthenticatedRequest } from '../middlewares/auth.js';

export const registerHandler = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  const result = await authService.register(email, password, name);
  res.status(201).json(successResponse(result, 'Registration successful'));
};

export const loginHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.json(successResponse(result, 'Login successful'));
};

export const refreshHandler = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const result = await authService.refreshToken(refreshToken);
  res.json(successResponse(result, 'Token refreshed'));
};

export async function logout(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user?.id;
  const { refreshToken } = req.body;
  if (userId) {
    await authService.logoutUser(userId, refreshToken);
  }
  res.json(successResponse(null, 'Logged out successfully'));
}

export const socialLoginHandler = async (req: Request, res: Response) => {
  const { provider, idToken } = req.body;
  const result = await authService.socialLogin(provider, idToken);
  res.json(successResponse(result, 'Social login successful'));
};;
