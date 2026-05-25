import { useAppContext, markNotificationReadAction, markAllNotificationsReadAction } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { NotificationItem } from '../../components/notifications/NotificationItem';
import { Bell, Check } from 'lucide-react';

export function NotificationsPage() {
  const { currentUser } = useAuth();
  const { state, dispatch } = useAppContext();

  const myNotifications = state.notifications
    .filter((n) => n.userId === currentUser?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const unreadCount = myNotifications.filter((n) => !n.isRead).length;

  const handleMarkRead = (id: string) => {
    dispatch(markNotificationReadAction(id));
  };

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsReadAction(currentUser!.id));
  };

  return (
    <div>
      <div className="page-topbar">
        <div>
          <h1 className="text-headline-md" style={{ margin: 0, fontWeight: 700 }}>Notifications</h1>
          <p style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--text-body-sm)', margin: '4px 0 0 0' }}>
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-ghost btn-sm" onClick={handleMarkAllRead} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Check size={14} /> Mark all read
          </button>
        )}
      </div>

      <div className="page-inner" style={{ maxWidth: '680px', margin: '0 auto' }}>
        <div className="card" style={{ overflow: 'hidden' }}>
          {myNotifications.length > 0 ? (
            myNotifications.map((notif) => (
              <NotificationItem
                key={notif.id}
                notification={notif}
                onMarkRead={handleMarkRead}
              />
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon"><Bell size={40} /></div>
              <h3 className="text-headline-sm" style={{ marginBottom: 'var(--space-2)' }}>No notifications yet</h3>
              <p>You'll see updates about your offers, tasks, and reviews here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
