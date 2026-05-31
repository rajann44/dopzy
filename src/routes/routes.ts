export const ROUTES = {
  LOGIN: '/login',
  // Client
  CLIENT_DASHBOARD: '/client/dashboard',
  CLIENT_TASKS: '/client/tasks',
  CLIENT_TASK_NEW: '/client/tasks/new',
  CLIENT_TASK_DETAIL: '/client/tasks/:id',
  CLIENT_OFFERS: '/client/offers',
  // Tasker
  TASKER_DASHBOARD: '/tasker/dashboard',
  TASKER_TASKS: '/tasker/tasks',
  TASKER_TASK_DETAIL: '/tasker/tasks/:id',
  TASKER_MY_OFFERS: '/tasker/my-offers',
  TASKER_JOBS: '/tasker/jobs',
  // Shared
  PROFILE: '/profile/:id',
  NOTIFICATIONS: '/notifications',
  MESSAGES: '/messages',
  SETTINGS: '/settings',
} as const;
