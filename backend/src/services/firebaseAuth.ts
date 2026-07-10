import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';

const CERT_URL =
  'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';

const certCache = new Map<string, { pem: string; expiry: number }>();

async function getPublicKey(kid: string): Promise<string> {
  const cached = certCache.get(kid);
  if (cached && cached.expiry > Date.now()) {
    return cached.pem;
  }

  const response = await fetch(CERT_URL);
  if (!response.ok) {
    throw new AppError('Failed to fetch Firebase signing keys', 500);
  }
  const certs = (await response.json()) as Record<string, string>;
  const now = Date.now();
  for (const [key, pem] of Object.entries(certs)) {
    certCache.set(key, { pem, expiry: now + 60 * 60 * 1000 });
  }

  const found = certs[kid];
  if (!found) {
    throw new AppError('Unknown Firebase signing key', 401);
  }
  return found;
}

export interface DecodedFirebaseUser {
  uid: string;
  email?: string;
  name?: string;
}

/**
 * Verifies a Firebase ID token using Google's public signing certificates.
 * Does NOT require firebase-admin or a service account — only FIREBASE_PROJECT_ID.
 */
export async function verifyFirebaseIdToken(idToken: string): Promise<DecodedFirebaseUser> {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new AppError('FIREBASE_PROJECT_ID is not configured on the server', 500);
  }

  const decodedHeader = jwt.decode(idToken, { complete: true });
  if (!decodedHeader || typeof decodedHeader === 'string' || !decodedHeader.header.kid) {
    throw new AppError('Invalid Firebase token', 401);
  }

  const pem = await getPublicKey(decodedHeader.header.kid);

  const decoded = jwt.verify(idToken, pem, {
    algorithms: ['RS256'],
    audience: projectId,
    issuer: `https://securetoken.google.com/${projectId}`,
  }) as { uid?: string; sub?: string; email?: string; name?: string };

  const uid = decoded.uid || decoded.sub;
  if (!uid) {
    throw new AppError('Firebase token missing subject', 401);
  }

  return { uid, email: decoded.email, name: decoded.name };
}
