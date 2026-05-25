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
  },
  {
    id: 'user-2',
    email: 'client2@demo.com',
    password: '123456',
    role: 'client',
    name: 'James Holloway',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james&backgroundColor=c0aede',
    createdAt: '2024-02-20T10:00:00Z',
  },
  {
    id: 'user-3',
    email: 'cotasker@demo.com',
    password: '123456',
    role: 'cotasker',
    name: 'Marcus Weber',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus&backgroundColor=ffd5dc',
    createdAt: '2023-11-05T10:00:00Z',
  },
  {
    id: 'user-4',
    email: 'cotasker2@demo.com',
    password: '123456',
    role: 'cotasker',
    name: 'Priya Sharma',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya&backgroundColor=d1f4cc',
    createdAt: '2023-09-12T10:00:00Z',
  },
  {
    id: 'user-5',
    email: 'admin@demo.com',
    password: '123456',
    role: 'admin',
    name: 'Admin User',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin&backgroundColor=ffdfbf',
    createdAt: '2023-01-01T10:00:00Z',
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
  {
    userId: 'user-2',
    bio: 'Busy professional who needs help with moving and home maintenance.',
    location: 'Hamburg',
    tasksPosted: 3,
    completedTasks: 2,
    memberSince: 'February 2024',
    isVerified: false,
    createdAt: '2024-02-20T10:00:00Z',
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
  {
    userId: 'user-4',
    bio: 'Experienced cleaner and personal assistant. I take pride in leaving every space spotless. Background-checked and fully insured.',
    skills: ['Cleaning', 'Deep Cleaning', 'Organization', 'Personal Assistance', 'Delivery', 'Grocery Shopping'],
    categories: ['Cleaning', 'Personal Assistance', 'Delivery'],
    location: 'Berlin',
    rating: 4.7,
    reviewCount: 31,
    completedJobs: 35,
    responseTime: '< 1 hour',
    memberSince: 'September 2023',
    isVerified: true,
    isTopRated: false,
    isFastResponder: true,
    totalEarnings: 7600,
    availability: 'Mon–Sun, 9am–6pm',
    hourlyRate: 28,
    qualifications: [
      'Professional Domestic Cleaning Certificate',
      'Hygiene & Sanitation Training Certified',
      'First Aid & Emergency Response Certificate'
    ],
    languages: ['English (Fluent)', 'Hindi (Native)', 'German (Conversational)'],
    transport: 'Compact SUV (Fully stocked with eco-friendly cleaning supplies and vacuum)',
    portfolio: [
      {
        title: 'End of Lease Deep Kitchen Cleaning',
        imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600',
        description: 'Deep oven degreasing, refrigerator sanitation, and polishing of all stainless steel surfaces.'
      },
      {
        title: 'Office Closet & Storage Space Organization',
        imageUrl: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=600',
        description: 'Sorted, categorized, and labeled entire office stock inventory room, maximizing usable storage by 40%.'
      }
    ]
  },
];
