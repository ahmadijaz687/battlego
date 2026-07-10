import { prisma } from '../services/database.js';
import { BaseRepository } from './BaseRepository.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class AuthRepository extends BaseRepository<any, any, any> {
  constructor() {
    super(prisma.user, 'user');
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async createUser(data: { email: string; password: string; name: string }) {
    return prisma.user.create({ data });
  }

  async findRefreshToken(token: string) {
    return prisma.refreshToken.findUnique({ where: { token } });
  }

  async saveRefreshToken(data: { userId: string; token: string; familyId: string; expiresAt: Date }) {
    return prisma.refreshToken.create({ data });
  }

  async deleteRefreshToken(id: string) {
    await prisma.refreshToken.delete({ where: { id } });
  }

  async deleteExpiredTokens() {
    await prisma.refreshToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }

  async updatePassword(userId: string, hashedPassword: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  async updateUser(userId: string, data: { name?: string; avatar?: string }) {
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  }
}

export const authRepository = new AuthRepository();
