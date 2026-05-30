import type { Notification, WalletTransaction, Conversation, ChatRequest, ChatMessage } from '../types';

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-1',
    type: 'new_offer',
    title: 'New offer received',
    message: 'Marcus Weber sent an offer of €420 for your moving task.',
    isRead: false,
    createdAt: '2025-06-01T10:05:00Z',
    linkTo: '/client/tasks/task-1',
  },
  {
    id: 'notif-3',
    userId: 'user-3',
    type: 'offer_accepted',
    title: 'Offer accepted!',
    message: 'Sarah Mitchell accepted your offer for "Deep clean 3-room apartment". Check your jobs for details.',
    isRead: true,
    createdAt: '2025-05-29T10:00:00Z',
    linkTo: '/cotasker/jobs',
  },
  {
    id: 'notif-10',
    userId: 'user-3',
    type: 'task_assigned',
    title: 'Job assigned to you',
    message: 'Sarah Mitchell assigned the apartment deep clean task to you. View your jobs for scheduling.',
    isRead: true,
    createdAt: '2025-05-29T10:00:00Z',
    linkTo: '/cotasker/jobs',
  },
];

export const MOCK_WALLET_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'wallet-1',
    taskId: 'task-3',
    clientId: 'user-1',
    coTaskerId: 'user-3',
    amount: 110,
    status: 'released',
    createdAt: '2025-05-23T17:30:00Z',
  },
  {
    id: 'wallet-4',
    taskId: 'task-2',
    clientId: 'user-1',
    coTaskerId: 'user-3',
    amount: 180,
    status: 'reserved',
    createdAt: '2025-05-29T10:30:00Z',
  },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    participantIds: ['user-1', 'user-3'],
    lastMessage: 'Great, I\'ll be there at 9am sharp!',
    lastMessageAt: '2025-06-01T12:00:00Z',
    unreadCount: 1,
    taskId: 'task-2',
  },
];

export const MOCK_CHAT_REQUESTS: ChatRequest[] = [
  {
    id: 'req-1',
    taskId: 'task-1',
    senderId: 'user-3', // Marcus Weber
    receiverId: 'user-1', // Sarah Mitchell (OP)
    question: 'Hello! I have a large Mercedes Sprinter van. Will we need to load any items that are wider than 2 meters?',
    status: 'pending',
    createdAt: '2025-06-01T10:10:00Z'
  },
];

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  // Conversation 1 (conv-1): deep clean apartment
  {
    id: 'msg-1-1',
    conversationId: 'conv-1',
    senderId: 'user-3',
    text: 'Hello Sarah, regarding the end-of-tenancy clean, are cleaning agents and a vacuum cleaner available at the apartment?',
    createdAt: '2025-05-28T14:30:00Z'
  },
  {
    id: 'msg-1-2',
    conversationId: 'conv-1',
    senderId: 'user-1',
    text: 'Hi Marcus! Yes, I have a vacuum cleaner and mop there, but it would be great if you could bring your own high-strength oven cleaners and sponges.',
    createdAt: '2025-05-28T15:00:00Z'
  },
  {
    id: 'msg-1-3',
    conversationId: 'conv-1',
    senderId: 'user-3',
    text: 'Understood, I will bring my professional supplies. Great, I\'ll be there at 9am sharp!',
    createdAt: '2025-06-01T12:00:00Z'
  },
];
