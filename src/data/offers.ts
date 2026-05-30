import type { Offer } from '../types';

export const MOCK_OFFERS: Offer[] = [
  // Task 1 -- Moving (receiving_offers)
  {
    id: 'offer-1',
    taskId: 'task-1',
    coTaskerId: 'user-3',
    price: 420,
    message: 'I have a 7.5t van and a colleague to help. We can complete this in a single morning. Fully insured and experienced with large furniture. Happy to do a quick video call to discuss.',
    estimatedHours: 4,
    status: 'pending',
    createdAt: '2025-06-01T10:00:00Z',
  },
  // Task 2 -- Cleaning (in_progress, assigned to user-3)
  {
    id: 'offer-3',
    taskId: 'task-2',
    coTaskerId: 'user-3',
    price: 180,
    message: 'I do end-of-tenancy cleans regularly. I use professional-grade products and always achieve deposit-back results. I\'ll need 6 hours.',
    estimatedHours: 6,
    status: 'accepted',
    createdAt: '2025-05-28T16:00:00Z',
  },
  // Task 3 -- Furniture Assembly (completed, assigned to user-3)
  {
    id: 'offer-5',
    taskId: 'task-3',
    coTaskerId: 'user-3',
    price: 110,
    message: 'I have assembled over 200 PAX units. This will take me about 3 hours. I bring all my own tools.',
    estimatedHours: 3,
    status: 'accepted',
    createdAt: '2025-05-20T11:00:00Z',
  }
];
