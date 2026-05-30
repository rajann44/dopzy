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
    id: 'notif-2',
    userId: 'user-1',
    type: 'new_offer',
    title: 'New offer received',
    message: 'Priya Sharma sent an offer of €390 for your moving task.',
    isRead: false,
    createdAt: '2025-06-01T11:35:00Z',
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
    id: 'notif-4',
    userId: 'user-3',
    type: 'new_review',
    title: 'New review posted',
    message: 'James Holloway left you a 5-star review for the PAX wardrobe assembly. Great work!',
    isRead: true,
    createdAt: '2025-05-23T17:05:00Z',
    linkTo: '/profile/user-3',
  },
  {
    id: 'notif-5',
    userId: 'user-4',
    type: 'offer_accepted',
    title: 'Offer accepted!',
    message: 'Sarah Mitchell accepted your offer for the weekly grocery delivery for her mother.',
    isRead: true,
    createdAt: '2025-05-15T12:30:00Z',
    linkTo: '/cotasker/jobs',
  },
  {
    id: 'notif-6',
    userId: 'user-4',
    type: 'task_completed',
    title: 'Task marked complete',
    message: 'The post-renovation cleaning task has been marked complete. Your payment has been released.',
    isRead: false,
    createdAt: '2025-06-01T11:00:00Z',
    linkTo: '/cotasker/jobs',
  },
  {
    id: 'notif-7',
    userId: 'user-1',
    type: 'payment_released',
    title: 'Payment released',
    message: '€55 has been released to Priya Sharma for the grocery delivery service. Task closed.',
    isRead: true,
    createdAt: '2025-05-18T16:00:00Z',
    linkTo: '/client/tasks/task-6',
  },
  {
    id: 'notif-8',
    userId: 'user-2',
    type: 'new_review',
    title: 'New review posted',
    message: 'Marcus Weber left you a 5-star review. He enjoyed working with you!',
    isRead: false,
    createdAt: '2025-05-23T18:05:00Z',
    linkTo: '/profile/user-2',
  },
  {
    id: 'notif-9',
    userId: 'user-1',
    type: 'new_offer',
    title: 'New offer received',
    message: 'Marcus Weber sent an offer for your office relocation task.',
    isRead: false,
    createdAt: '2025-06-04T09:05:00Z',
    linkTo: '/client/tasks/task-8',
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
    clientId: 'user-2',
    coTaskerId: 'user-3',
    amount: 110,
    status: 'released',
    createdAt: '2025-05-23T17:30:00Z',
  },
  {
    id: 'wallet-2',
    taskId: 'task-6',
    clientId: 'user-1',
    coTaskerId: 'user-4',
    amount: 55,
    status: 'released',
    createdAt: '2025-05-18T15:30:00Z',
  },
  {
    id: 'wallet-3',
    taskId: 'task-9',
    clientId: 'user-2',
    coTaskerId: 'user-4',
    amount: 200,
    status: 'released',
    createdAt: '2025-06-01T11:30:00Z',
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
  {
    id: 'conv-2',
    participantIds: ['user-1', 'user-4'],
    lastMessage: 'Thanks for the list! See you Thursday.',
    lastMessageAt: '2025-05-15T13:00:00Z',
    unreadCount: 0,
    taskId: 'task-6',
  },
  {
    id: 'conv-3',
    participantIds: ['user-2', 'user-3'],
    lastMessage: 'All done! Left the keys under the mat as agreed.',
    lastMessageAt: '2025-05-23T16:30:00Z',
    unreadCount: 0,
    taskId: 'task-3',
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
  {
    id: 'req-2',
    taskId: 'task-4', // Paint living room
    senderId: 'user-4', // Priya Sharma
    receiverId: 'user-2', // James Holloway (OP)
    question: 'Hi James, do we need to bring our own drop sheets and taping supplies, or are those provided with the paint?',
    status: 'pending',
    createdAt: '2025-06-02T14:20:00Z'
  }
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

  // Conversation 2 (conv-2): weekly grocery delivery
  {
    id: 'msg-2-1',
    conversationId: 'conv-2',
    senderId: 'user-4',
    text: 'Hi Sarah, is it okay to shop at REWE or Aldi? They usually have everything on your mother\'s list.',
    createdAt: '2025-05-15T12:45:00Z'
  },
  {
    id: 'msg-2-2',
    conversationId: 'conv-2',
    senderId: 'user-1',
    text: 'REWE is perfect, thank you! Please make sure to get the organic milk. Thanks for the list! See you Thursday.',
    createdAt: '2025-05-15T13:00:00Z'
  },

  // Conversation 3 (conv-3): IKEA PAX wardrobe
  {
    id: 'msg-3-1',
    conversationId: 'conv-3',
    senderId: 'user-3',
    text: 'I will get started with the drawers first. All done! Left the keys under the mat as agreed.',
    createdAt: '2025-05-23T16:30:00Z'
  }
];

