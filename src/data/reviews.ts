import type { Review } from '../types';

export const MOCK_REVIEWS: Review[] = [
  // Task 3 — Furniture Assembly (completed)
  {
    id: 'review-1',
    taskId: 'task-3',
    fromUserId: 'user-1',
    toUserId: 'user-3',
    rating: 5,
    comment: 'Marcus was absolutely fantastic. He assembled all 3 PAX wardrobes in under 3 hours and even helped us position them correctly. Left no mess behind. Highly recommended!',
    createdAt: '2025-05-23T17:00:00Z',
  },
  {
    id: 'review-2',
    taskId: 'task-3',
    fromUserId: 'user-3',
    toUserId: 'user-1',
    rating: 5,
    comment: 'Sarah was a great client. Clear instructions, everything was ready when I arrived. Payment prompt. Would happily work with her again.',
    createdAt: '2025-05-23T18:00:00Z',
  }
];
