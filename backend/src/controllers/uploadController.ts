import { Request, Response } from 'express';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs/promises';
import { successResponse } from '../utils/response.js';
import { AuthenticatedRequest } from '../middlewares/auth.js';

const UPLOAD_DIR = path.resolve('uploads');

function getFileUrl(filename: string): string {
  const baseUrl = process.env.API_URL || `${process.env.HOST || 'http://localhost'}:${process.env.PORT || 5000}`;
  return `${baseUrl}/uploads/${filename}`;
}

export async function uploadImageHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  if (!req.file) {
    res.status(400).json({ success: false, message: 'No file provided', data: null });
    return;
  }

  const filename = `img-${Date.now()}-${userId}.webp`;
  const outputPath = path.join(UPLOAD_DIR, filename);

  await sharp(req.file.buffer || (await fs.readFile(req.file.path)))
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(outputPath);

  if (req.file.path && req.file.path !== outputPath) {
    await fs.unlink(req.file.path).catch(() => {});
  }

  res.json(successResponse({ url: getFileUrl(filename), filename }, 'Image uploaded'));
}

export async function uploadAvatarHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  if (!req.file) {
    res.status(400).json({ success: false, message: 'No file provided', data: null });
    return;
  }

  const filename = `avatar-${Date.now()}-${userId}.webp`;
  const outputPath = path.join(UPLOAD_DIR, filename);

  await sharp(req.file.buffer || (await fs.readFile(req.file.path)))
    .resize(256, 256, { fit: 'cover' })
    .webp({ quality: 80 })
    .toFile(outputPath);

  if (req.file.path && req.file.path !== outputPath) {
    await fs.unlink(req.file.path).catch(() => {});
  }

  res.json(successResponse({ url: getFileUrl(filename), filename }, 'Avatar uploaded'));
}

export async function uploadVideoHandler(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).user!.id;
  if (!req.file) {
    res.status(400).json({ success: false, message: 'No file provided', data: null });
    return;
  }

  const ext = path.extname(req.file.originalname).toLowerCase() || '.mp4';
  const filename = `video-${Date.now()}-${userId}${ext}`;
  const outputPath = path.join(UPLOAD_DIR, filename);

  if (req.file.path && req.file.path !== outputPath) {
    await fs.rename(req.file.path, outputPath);
  }

  res.json(successResponse({ url: getFileUrl(filename), filename }, 'Video uploaded'));
}
