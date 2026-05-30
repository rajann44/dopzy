import { useAppContext, markNotificationReadAction, markAllNotificationsReadAction } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { NotificationItem } from '../../components/notifications/NotificationItem';
import { Check } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

export function NotificationsPage() {
  const { currentUser } = useAuth();
  const { state, dispatch } = useAppContext();
  const { t } = useTranslation();

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

  const getSubtitle = () => {
    if (unreadCount === 0) return t('notifications_page.all_caught_up');
    if (unreadCount === 1) return t('notifications_page.unread_singular');
    return t('notifications_page.unread_plural').replace('{count}', String(unreadCount));
  };

  return (
    <div>
      <div className="page-topbar">
        <div>
          <h1 className="text-headline-md" style={{ margin: 0, fontWeight: 700 }}>{t('notifications_page.title')}</h1>
          <p style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--text-body-sm)', margin: '4px 0 0 0' }}>
            {getSubtitle()}
          </p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-ghost btn-sm" onClick={handleMarkAllRead} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Check size={14} /> {t('notifications_page.mark_all_read')}
          </button>
        )}
      </div>

      <div className="page-inner">
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
              <div className="empty-state-icon">🔔</div>
              <h3 className="text-headline-sm" style={{ marginBottom: 'var(--space-2)' }}>{t('notifications_page.empty_title')}</h3>
              <p>{t('notifications_page.empty_desc')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
