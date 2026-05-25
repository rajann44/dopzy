import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, Clock } from 'lucide-react';
import type { Task } from '../../types';
import { StatusBadge } from '../ui/Badge';
import { CATEGORY_ICONS } from '../../utils/constants';
import { formatDate, formatCurrency, truncate } from '../../utils/formatters';

interface TaskCardProps {
  task: Task;
  linkPrefix?: string; // '/client' or '/cotasker'
  showClient?: boolean;
  clientName?: string;
}

export function TaskCard({ task, linkPrefix = '/client', }: TaskCardProps) {
  const emoji = CATEGORY_ICONS[task.category] ?? '📋';

  return (
    <Link
      to={`${linkPrefix}/tasks/${task.id}`}
      style={{ textDecoration: 'none' }}
    >
      <article className="card card-hover" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Category Header */}
        <div style={{
          padding: 'var(--space-3) var(--space-4)',
          background: 'var(--color-surface-container-low)',
          borderBottom: '1px solid var(--color-outline-variant)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-2)',
        }}>
          <span className="section-label" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', margin: 0, fontSize: '11px' }}>
            <span>{emoji}</span>
            {task.category}
          </span>
          <StatusBadge status={task.status} />
        </div>

        {/* Card Body */}
        <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', padding: 'var(--space-4)' }}>
          <h3 className="text-headline-sm" style={{ color: 'var(--color-on-surface)', fontSize: '16px', fontWeight: 700, lineHeight: '22px' }}>
            {truncate(task.title, 70)}
          </h3>
          <p style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)', flex: 1, lineHeight: '18px' }}>
            {truncate(task.description, 110)}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)', borderTop: '1px solid var(--color-surface-container-high)', paddingTop: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <MapPin size={14} style={{ color: 'var(--color-secondary-mid)', flexShrink: 0 }} />
              {task.location}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Calendar size={14} style={{ color: 'var(--color-secondary-mid)', flexShrink: 0 }} />
              {formatDate(task.date)}
              {task.time && <><Clock size={14} style={{ marginLeft: 4 }} /> {task.time}</>}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: 'var(--space-3) var(--space-4)',
          borderTop: '1px solid var(--color-surface-container-highest)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--color-surface-container-lowest)',
        }}>
          <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '16px', color: 'var(--color-secondary)' }}>
            {task.budgetType === 'fixed' && task.budget
              ? formatCurrency(task.budget)
              : task.budgetType === 'hourly' && task.budget
                ? `${formatCurrency(task.budget)}/hr`
                : <span style={{ color: 'var(--color-secondary-mid)', fontSize: 'var(--text-label-md)', fontWeight: 600, textTransform: 'uppercase' }}>Open Offer</span>}
          </span>

          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-label-md)', fontWeight: 600, color: 'var(--color-on-surface-variant)', textTransform: 'uppercase' }}>
            <Users size={14} />
            {task.offersCount} offer{task.offersCount !== 1 ? 's' : ''}
          </span>
        </div>
      </article>
    </Link>
  );
}
