import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, Clock } from 'lucide-react';
import type { Task } from '../../types';
import { StatusBadge } from '../ui/Badge';
import { CATEGORY_ICONS } from '../../utils/constants';
import { formatDate, formatCurrency, truncate } from '../../utils/formatters';
import { TaskPlaceholderImage } from './TaskPlaceholderImage';
import { getOptimizedImageUrl } from '../../utils/image';

interface TaskCardProps {
  task: Task;
  linkPrefix?: string; // '/client' or '/tasker'
  showClient?: boolean;
  clientName?: string;
}

export function TaskCard({ task, linkPrefix = '/client', }: TaskCardProps) {
  const emoji = CATEGORY_ICONS[task.category] ?? '📋';

  // Standardise links: if prefix is empty string, route to /tasks/:id
  const targetPath = linkPrefix === '' ? `/tasks/${task.id}` : `${linkPrefix}/tasks/${task.id}`;

  const hasImage = task.images && task.images.length > 0 && task.images[0];

  return (
    <Link
      to={targetPath}
      style={{ textDecoration: 'none' }}
    >
      <article className="card card-hover" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Category Header with Commerzbank Diamond */}
        <div style={{
          padding: '12px var(--space-4)',
          background: 'var(--color-surface-container-low)',
          borderBottom: '1px solid var(--color-outline-variant)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="section-label" style={{ margin: 0, fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-secondary)' }}>
              <span style={{ fontSize: '14px' }}>{emoji}</span>
              {task.category}
            </span>
          </div>
          <StatusBadge status={task.status} />
        </div>

        {/* Task Image or fallback placeholder SVG */}
        <div style={{ 
          width: '100%', 
          height: '140px', 
          overflow: 'hidden', 
          borderBottom: '1px solid var(--color-outline-variant)',
          background: 'var(--color-surface-container-low)'
        }}>
          {hasImage ? (
            <img 
              src={getOptimizedImageUrl(task.images[0], 500)} 
              alt={task.title} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                transition: 'transform var(--transition-medium)'
              }} 
              className="task-card-image"
              loading="lazy"
            />
          ) : (
            <div style={{ width: '100%', height: '100%', transition: 'transform var(--transition-medium)' }} className="task-card-image">
              <TaskPlaceholderImage />
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', padding: 'var(--space-4)' }}>
          <h3 style={{ 
            fontFamily: 'var(--font-headline)',
            fontSize: '16.5px', 
            fontWeight: 700, 
            lineHeight: '22px',
            color: 'var(--color-secondary)',
            letterSpacing: '-0.01em',
            margin: 0
          }}>
            {truncate(task.title, 70)}
          </h3>
          <p style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)', flex: 1, lineHeight: '18px', margin: 0 }}>
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

        {/* Footer with Pill Budget */}
        <div style={{
          padding: 'var(--space-3) var(--space-4)',
          borderTop: '1px solid var(--color-surface-container-highest)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--color-surface-container-lowest)',
        }}>
          <div style={{
            padding: '4px 12px',
            background: 'var(--color-surface-container-low)',
            border: '1.5px solid var(--color-outline-variant)',
            borderRadius: 'var(--radius-full)',
            display: 'inline-flex',
            alignItems: 'center'
          }}>
            <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '14.5px', color: 'var(--color-secondary)' }}>
              {task.budgetType === 'fixed' && task.budget
                ? formatCurrency(task.budget)
                : task.budgetType === 'hourly' && task.budget
                  ? `${formatCurrency(task.budget)}/hr`
                  : 'Open Offer'}
            </span>
          </div>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-label-md)', fontWeight: 600, color: 'var(--color-on-surface-variant)', textTransform: 'uppercase' }}>
            <Users size={14} />
            {task.offersCount} offer{task.offersCount !== 1 ? 's' : ''}
          </span>
        </div>
      </article>
    </Link>
  );
}
