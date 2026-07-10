import { prisma } from '../services/database.js';
import { BaseRepository } from './BaseRepository.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class ProfileRepository extends BaseRepository<any, any, any> {
  constructor() {
    super(prisma.userProfile, 'userProfile');
  }

  async getProfile(userId: string) {
    return prisma.userProfile.findUnique({ where: { userId } });
  }

  async upsertProfile(data: {
    userId: string;
    bio?: string;
    dateOfBirth?: Date;
    height?: number;
    heightUnit?: string;
    goal?: string;
    experience?: string;
    fitnessLevel?: string;
    activityLevel?: string;
    equipment?: string[];
    injuries?: string[];
    preferences?: Record<string, unknown>;
  }) {
    return prisma.userProfile.upsert({
      where: { userId: data.userId },
      create: data as never,
      update: data as never,
    });
  }

  async updateProfile(userId: string, data: {
    bio?: string;
    dateOfBirth?: Date;
    height?: number;
    heightUnit?: string;
    goal?: string;
    experience?: string;
    fitnessLevel?: string;
    activityLevel?: string;
    equipment?: string[];
    injuries?: string[];
    preferences?: Record<string, unknown>;
  }) {
    return prisma.userProfile.update({ where: { userId }, data: data as never });
  }

  async updateAvatar(userId: string, url: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { avatar: url },
    });
  }

  async getSettings(userId: string) {
    let settings = await prisma.userSettings.findUnique({ where: { userId } });
    if (!settings) {
      settings = await prisma.userSettings.create({ data: { userId } });
    }
    return settings;
  }

  async upsertSettings(userId: string, data: {
    theme?: string;
    units?: string;
    notifications?: Record<string, unknown>;
  }) {
    return prisma.userSettings.upsert({
      where: { userId },
      create: { userId, ...data } as never,
      update: data as never,
    });
  }

  async updateOnboarding(userId: string, step: string) {
    const profile = await prisma.userProfile.findUnique({ where: { userId } });
    const preferences = (profile?.preferences as Record<string, unknown>) || {};
    preferences.onboardingStep = step;

    return prisma.userProfile.update({
      where: { userId },
      data: { preferences } as never,
    });
  }

  async completeOnboarding(userId: string) {
    return prisma.userProfile.update({
      where: { userId },
      data: { onboardingComplete: true },
    });
  }
}

export const profileRepository = new ProfileRepository();
