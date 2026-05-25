import { MOCK_USERS, MOCK_CLIENT_PROFILES, MOCK_COTASKER_PROFILES } from '../data/users';
import type { User, ClientProfile, CoTaskerProfile } from '../types';

let users = [...MOCK_USERS];
let clientProfiles = [...MOCK_CLIENT_PROFILES];
let coTaskerProfiles = [...MOCK_COTASKER_PROFILES];

export const profileService = {
  async getUserById(id: string): Promise<User | null> {
    await new Promise((r) => setTimeout(r, 50));
    return users.find((u) => u.id === id) ?? null;
  },

  async getClientProfile(userId: string): Promise<ClientProfile | null> {
    await new Promise((r) => setTimeout(r, 50));
    return clientProfiles.find((p) => p.userId === userId) ?? null;
  },

  async getCoTaskerProfile(userId: string): Promise<CoTaskerProfile | null> {
    await new Promise((r) => setTimeout(r, 50));
    return coTaskerProfiles.find((p) => p.userId === userId) ?? null;
  },

  async getAllUsers(): Promise<User[]> {
    await new Promise((r) => setTimeout(r, 50));
    return users;
  },

  async updateCoTaskerProfile(userId: string, profileData: Partial<CoTaskerProfile>): Promise<CoTaskerProfile> {
    await new Promise((r) => setTimeout(r, 50));
    const idx = coTaskerProfiles.findIndex((p) => p.userId === userId);
    if (idx !== -1) {
      coTaskerProfiles[idx] = { ...coTaskerProfiles[idx], ...profileData };
      return coTaskerProfiles[idx];
    } else {
      const newProfile: CoTaskerProfile = {
        userId,
        bio: '',
        skills: [],
        categories: [],
        location: 'Berlin',
        rating: 5.0,
        reviewCount: 0,
        completedJobs: 0,
        responseTime: '< 1 hour',
        memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        isVerified: false,
        isTopRated: false,
        isFastResponder: false,
        totalEarnings: 0,
        availability: 'Flexible',
        hourlyRate: 25,
        qualifications: [],
        languages: ['English'],
        transport: '',
        portfolio: [],
        ...profileData,
      };
      coTaskerProfiles.push(newProfile);
      return newProfile;
    }
  },

  async updateClientProfile(userId: string, profileData: Partial<ClientProfile>): Promise<ClientProfile> {
    await new Promise((r) => setTimeout(r, 50));
    const idx = clientProfiles.findIndex((p) => p.userId === userId);
    if (idx !== -1) {
      clientProfiles[idx] = { ...clientProfiles[idx], ...profileData };
      return clientProfiles[idx];
    } else {
      const newProfile: ClientProfile = {
        userId,
        bio: '',
        location: 'Berlin',
        tasksPosted: 0,
        completedTasks: 0,
        memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        isVerified: false,
        createdAt: new Date().toISOString(),
        ...profileData,
      };
      clientProfiles.push(newProfile);
      return newProfile;
    }
  },

  async updateUser(userId: string, userData: Partial<User>): Promise<User | null> {
    await new Promise((r) => setTimeout(r, 50));
    const idx = users.findIndex((u) => u.id === userId);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...userData };
      return users[idx];
    }
    return null;
  }
};

