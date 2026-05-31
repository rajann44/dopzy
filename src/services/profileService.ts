import { MOCK_USERS } from '../data/users';
import type { User, ClientProfile, TaskerProfile } from '../types';
import { supabase } from '../utils/supabaseClient';

let users = [...MOCK_USERS];

export const profileService = {
  async getUserById(id: string): Promise<User | null> {
    await new Promise((r) => setTimeout(r, 50));
    const mockUser = users.find((u) => u.id === id);
    if (mockUser) return mockUser;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error || !data) return null;
      return {
        id: data.id,
        email: data.email,
        role: data.role as any,
        name: data.name,
        avatarUrl: data.avatar_url || undefined,
        taskerStatus: data.tasker_status || 'none',
        isDisabled: data.is_disabled,
        createdAt: data.created_at,
        password: '',
      };
    } catch (err) {
      console.error('Error in getUserById:', err);
      return null;
    }
  },

  async getClientProfile(userId: string): Promise<ClientProfile | null> {
    await new Promise((r) => setTimeout(r, 50));
    const mockUser = users.find((u) => u.id === userId);
    if (mockUser) {
      return {
        userId,
        bio: mockUser.bio || '',
        location: mockUser.location || 'Berlin',
        tasksPosted: 0,
        completedTasks: 0,
        memberSince: new Date(mockUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        isVerified: mockUser.isVerified || false,
        createdAt: mockUser.createdAt,
      };
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error || !data) return null;
      return {
        userId: data.id,
        bio: data.bio || '',
        location: data.location || 'Berlin',
        tasksPosted: 0,
        completedTasks: 0,
        memberSince: new Date(data.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        isVerified: data.is_verified || false,
        createdAt: data.created_at,
      };
    } catch (err) {
      console.error('Error in getClientProfile:', err);
      return null;
    }
  },

  async getTaskerProfile(userId: string): Promise<TaskerProfile | null> {
    await new Promise((r) => setTimeout(r, 50));
    const mockUser = users.find((u) => u.id === userId);
    if (mockUser) {
      if ((mockUser.taskerStatus || 'none') === 'none') return null;
      return {
        userId,
        bio: mockUser.bio || '',
        skills: mockUser.taskerSkills || [],
        categories: mockUser.taskerCategories || [],
        location: mockUser.location || 'Berlin',
        rating: Number(mockUser.taskerRating || 5),
        reviewCount: mockUser.taskerReviewCount || 0,
        completedJobs: mockUser.taskerCompletedJobs || 0,
        responseTime: mockUser.taskerResponseTime || '< 1 hour',
        memberSince: new Date(mockUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        isVerified: mockUser.isVerified || false,
        isTopRated: mockUser.taskerIsTopRated || false,
        isFastResponder: mockUser.taskerIsFastResponder || false,
        totalEarnings: mockUser.taskerTotalEarnings || 0,
        availability: mockUser.taskerAvailability || 'Flexible',
        hourlyRate: Number(mockUser.taskerHourlyRate || 0) || undefined,
        qualifications: mockUser.taskerQualifications || [],
        languages: mockUser.taskerLanguages || [],
        transport: mockUser.taskerTransport || '',
        portfolio: mockUser.taskerPortfolio || [],
      };
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error || !data) return null;
      if ((data.tasker_status || 'none') === 'none') return null;
      return {
        userId: data.id,
        bio: data.bio || '',
        skills: data.tasker_skills || [],
        categories: data.tasker_categories || [],
        location: data.location || 'Berlin',
        rating: Number(data.tasker_rating || 5),
        reviewCount: data.tasker_review_count || 0,
        completedJobs: data.tasker_completed_jobs || 0,
        responseTime: data.tasker_response_time || '< 1 hour',
        memberSince: new Date(data.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        isVerified: data.is_verified || false,
        isTopRated: data.tasker_is_top_rated || false,
        isFastResponder: data.tasker_is_fast_responder || false,
        totalEarnings: Number(data.tasker_total_earnings || 0),
        availability: data.tasker_availability || 'Flexible',
        hourlyRate: data.tasker_hourly_rate ? Number(data.tasker_hourly_rate) : undefined,
        qualifications: data.tasker_qualifications || [],
        languages: data.tasker_languages || [],
        transport: data.tasker_transport || '',
        portfolio: data.tasker_portfolio || [],
      };
    } catch (err) {
      console.error('Error in getTaskerProfile:', err);
      return null;
    }
  },

  async getAllUsers(): Promise<User[]> {
    await new Promise((r) => setTimeout(r, 50));
    return users;
  },

  async updateTaskerProfile(userId: string, profileData: Partial<TaskerProfile>): Promise<TaskerProfile> {
    await new Promise((r) => setTimeout(r, 50));
    const { error } = await supabase
      .from('users')
      .update({
        bio: profileData.bio,
        location: profileData.location,
        tasker_skills: profileData.skills,
        tasker_categories: profileData.categories,
        tasker_availability: profileData.availability,
        tasker_hourly_rate: profileData.hourlyRate,
        tasker_qualifications: profileData.qualifications,
        tasker_languages: profileData.languages,
        tasker_transport: profileData.transport,
        tasker_portfolio: profileData.portfolio,
      })
      .eq('id', userId);

    if (error) {
      throw error;
    }

    const refreshed = await profileService.getTaskerProfile(userId);
    if (!refreshed) {
      throw new Error('Failed to reload updated tasker profile.');
    }
    return refreshed;
  },

  async updateClientProfile(userId: string, profileData: Partial<ClientProfile>): Promise<ClientProfile> {
    await new Promise((r) => setTimeout(r, 50));
    const { error } = await supabase
      .from('users')
      .update({
        bio: profileData.bio,
        location: profileData.location,
      })
      .eq('id', userId);

    if (error) {
      throw error;
    }

    const refreshed = await profileService.getClientProfile(userId);
    if (!refreshed) {
      throw new Error('Failed to reload updated client profile.');
    }
    return refreshed;
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
