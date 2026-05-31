import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const icon = typeIcons[notification.type] ?? typeIcons.default;

  const handleClick = () => {
    if (!notification.isRead && onMarkRead) {
      onMarkRead(notification.id);
    }
    if (notification.linkTo) {
      navigate(notification.linkTo);
    }
  };

  return (
    <div
      className="activity-item"
      onClick={handleClick}
      style={{
        background: notification.isRead ? 'transparent' : 'var(--color-surface-container-low)',
        cursor: 'pointer',
        alignItems: 'center',
        padding: '16px var(--space-4)',
        gap: 'var(--space-3)',
        display: 'flex',
      }}
    >
      {/* Unread dot */}
      <span className="t-badge" data-open={!notification.isRead ? "true" : "false"} style={{ position: 'relative', top: 'auto', right: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 10, height: 10, flexShrink: 0 }}>
        <span className="t-badge-dot" style={{
          backgroundColor: '#007AFF',
          width: '10px',
          height: '10px',
          borderRadius: '50%',
        }} />
      </span>

      {/* Icon */}
      <div style={{
        width: 38, height: 38,
        borderRadius: '50%',
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
        <div style={{ fontWeight: notification.isRead ? 600 : 700, fontSize: 'var(--text-body-sm)', color: 'var(--color-on-surface)' }}>
          {notification.title}
        </div>
        <p style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)', lineHeight: '16px', marginTop: '2px', marginBlockEnd: 0 }}>
          {notification.message}
        </p>
        <span style={{ fontSize: 'var(--text-label-md)', color: 'var(--color-on-surface-variant)', marginTop: '4px', display: 'block' }}>
          {formatRelativeTime(notification.createdAt)}
        </span>
      </div>
    </div>
  );
}
