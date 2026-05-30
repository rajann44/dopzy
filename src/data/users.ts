import type { User, ClientProfile, CoTaskerProfile } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    email: 'client@demo.com',
    password: '123456',
    role: 'client',
    name: 'Sarah Mitchell',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah&backgroundColor=b6e3f4',
    createdAt: '2024-01-15T10:00:00Z',
    coTaskerStatus: 'pending',
    isDisabled: false,
  },
  {
    id: 'user-3',
    email: 'cotasker@demo.com',
    password: '123456',
    role: 'cotasker',
    name: 'Marcus Weber',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus&backgroundColor=ffd5dc',
    createdAt: '2023-11-05T10:00:00Z',
    coTaskerStatus: 'approved',
    isDisabled: false,
  },
  {
    id: 'user-5',
    email: 'admin@demo.com',
    password: '123456',
    role: 'admin',
    name: 'Admin User',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin&backgroundColor=ffdfbf',
    createdAt: '2023-01-01T10:00:00Z',
    coTaskerStatus: 'none',
    isDisabled: false,
  },
];

export const MOCK_CLIENT_PROFILES: ClientProfile[] = [
  {
    userId: 'user-1',
    bio: 'Homeowner looking for reliable help with household tasks.',
    location: 'Berlin',
    tasksPosted: 8,
    completedTasks: 5,
    memberSince: 'January 2024',
    isVerified: true,
    createdAt: '2024-01-15T10:00:00Z',
  },
];

export const MOCK_COTASKER_PROFILES: CoTaskerProfile[] = [
  {
    userId: 'user-3',
    bio: 'Professional handyman with 8+ years experience. I specialize in furniture assembly, repairs, and moving. Punctual, careful, and detail-oriented.',
    skills: ['Furniture Assembly', 'Moving', 'Repairs', 'Painting', 'Mounting', 'Smart Home Setup'],
    categories: ['Furniture Assembly', 'Moving', 'Repairs', 'Painting'],
    location: 'Berlin',
    rating: 4.9,
    reviewCount: 47,
    completedJobs: 52,
    responseTime: '< 30 min',
    memberSince: 'November 2023',
    isVerified: true,
    isTopRated: true,
    isFastResponder: true,
    totalEarnings: 12840,
    availability: 'Mon–Sat, 8am–7pm',
    hourlyRate: 35,
    qualifications: [
      'Certified Handyman (IHK Germany)',
      'IKEA Assembly Partner Certificate',
      'Electrical Installation & Safety Training (DGUV V3)'
    ],
    languages: ['German (Native)', 'English (Fluent)', 'Spanish (Basic)'],
    transport: 'Mercedes Sprinter Van (Large payload, equipped with cargo straps, blankets & trolley)',
    portfolio: [
      {
        title: 'IKEA PAX Wardrobe Custom Build',
        imageUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600',
        description: 'Complete assembly and wall-anchoring of a 3-meter wide PAX wardrobe with sliding mirror doors and custom interior organizers.'
      },
      {
        title: 'Drywall Repair & Apartment Repaint',
        imageUrl: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600',
        description: 'Patched multiple holes in drywall, primed, and repainted the entire living area using premium low-VOC white paint.'
      },
      {
        title: 'Living Room Pendant Light Installation',
        imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600',
        description: 'Safely mounted three heavy designer pendant lamps, routed wires cleanly, and set up a smart dimmer switch.'
      }
    ]
  },
];
