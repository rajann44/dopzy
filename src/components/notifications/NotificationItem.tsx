import { Bell, CheckCircle, XCircle, AlertCircle, TrendingUp, Star, Package } from 'lucide-react';
import type { Notification } from '../../types';
import { formatRelativeTime } from '../../utils/formatters';

const typeIcons: Record<string, React.ReactNode> = {
  new_offer: <TrendingUp size={16} style={{ color: 'var(--color-secondary-mid)' }} />,
  offer_accepted: <CheckCircle size={16} style={{ color: 'var(--color-status-success)' }} />,
  offer_withdrawn: <XCircle size={16} style={{ color: 'var(--color-status-error)' }} />,
  task_assigned: <Package size={16} style={{ color: 'var(--color-secondary-mid)' }} />,
  task_completed: <CheckCircle size={16} style={{ color: 'var(--color-status-success)' }} />,
  new_review: <Star size={16} fill="var(--color-primary-container)" color="var(--color-primary)" />,
  task_cancelled: <XCircle size={16} style={{ color: 'var(--color-status-error)' }} />,
  payment_released: <AlertCircle size={16} style={{ color: 'var(--color-status-success)' }} />,
  default: <Bell size={16} style={{ color: 'var(--color-secondary-mid)' }} />,
};

interface NotificationItemProps {
  notification: Notification;
  onMarkRead?: (id: string) => void;
}

export function NotificationItem({ notification, onMarkRead }: NotificationItemProps) {
  const icon = typeIcons[notification.type] ?? typeIcons.default;

  return (
    <div
      className="activity-item"
      onClick={() => !notification.isRead && onMarkRead?.(notification.id)}
      style={{
        background: notification.isRead ? 'transparent' : 'var(--color-surface-container-low)',
        cursor: notification.isRead ? 'default' : 'pointer',
        alignItems: 'center',
      }}
    >
      {/* Unread dot */}
      {!notification.isRead ? (
        <div className="unread-dot" style={{ marginTop: 0 }} />
      ) : (
        <div style={{ width: 8, height: 8 }} />
      )}

      {/* Icon */}
      <div style={{
        width: 36, height: 36,
        borderRadius: 'var(--radius)',
        background: 'var(--color-surface-container-high)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: notification.isRead ? 500 : 700, fontSize: 'var(--text-body-sm)', color: 'var(--color-on-surface)' }}>
          {notification.title}
        </div>
        <p style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)', lineHeight: '16px', marginTop: '2px' }}>
          {notification.message}
        </p>
        <span style={{ fontSize: 'var(--text-label-md)', color: 'var(--color-on-surface-variant)', marginTop: '4px', display: 'block' }}>
          {formatRelativeTime(notification.createdAt)}
        </span>
      </div>
    </div>
  );
}
