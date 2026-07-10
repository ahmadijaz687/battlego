import { Request, Response } from 'express';
import * as profileService from '../services/profileService.js';
import { successResponse } from '../utils/response.js';
import { AuthenticatedRequest } from '../middlewares/auth.js';

export async function getProfileHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const profile = await profileService.getProfile(userId);
  res.json(successResponse(profile));
}

export async function updateProfileHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const profile = await profileService.updateProfile(userId, req.body);
  res.json(successResponse(profile, 'Profile updated'));
}

export async function getSettingsHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const settings = await profileService.getSettings(userId);
  res.json(successResponse(settings));
}

export async function updateSettingsHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const settings = await profileService.updateSettings(userId, req.body);
  res.json(successResponse(settings, 'Settings updated'));
}

export async function getProfileDetailsHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const details = await profileService.getProfileDetails(userId);
  res.json(successResponse(details));
}

export async function updateProfileDetailsHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const details = await profileService.updateProfileDetails(userId, req.body);
  res.json(successResponse(details, 'Profile details updated'));
}

export async function completeOnboardingHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const result = await profileService.completeOnboarding(userId, req.body);
  res.json(successResponse(result, 'Onboarding completed'));
}

export async function getProfileStatsHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const stats = await profileService.getProfileStats(userId);
  res.json(successResponse(stats));
}

export async function updateAvatarHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const { avatar } = req.body;
  const profile = await profileService.updateProfileAvatar(userId, avatar);
  res.json(successResponse(profile, 'Avatar updated'));
}

export async function getOnboardingStatusHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  const status = await profileService.getOnboardingStatus(userId);
  res.json(successResponse(status));
}
