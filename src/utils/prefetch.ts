export const prefetchMap = {
  login: () => import('../pages/LoginPage'),
  myTasks: () => import('../pages/MyTasksPage'),
  newTask: () => import('../pages/client/NewTaskPage'),
  taskDetail: () => import('../pages/TaskDetailPage'),
  marketplace: () => import('../pages/tasker/TaskMarketplace'),
  notifications: () => import('../pages/shared/NotificationsPage'),
  profile: () => import('../pages/shared/ProfilePage'),
  settings: () => import('../pages/shared/SettingsPage'),
  messages: () => import('../pages/shared/MessagesPage'),
  moderation: () => import('../pages/shared/ModerationPanel'),
};

const prefetched = new Set<string>();

export function prefetchRoute(routeKey: keyof typeof prefetchMap) {
  if (prefetched.has(routeKey)) return;
  prefetched.add(routeKey);
  const importFn = prefetchMap[routeKey];
  if (importFn) {
    importFn().catch(() => {
      prefetched.delete(routeKey);
    });
  }
}
