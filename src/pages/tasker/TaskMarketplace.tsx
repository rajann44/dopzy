import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';
import { TaskCard } from '../../components/tasks/TaskCard';
import { TaskFiltersBar } from '../../components/tasks/TaskFilters';
import { taskService } from '../../services/taskService';
import { useTranslation } from '../../context/LanguageContext';
import type { Task, TaskFilters } from '../../types';

export function TaskMarketplace() {
  const { currentUser } = useAuth();
  const { state } = useAppContext();
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFilters>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const open = (await taskService.getOpenTasks(state.tasks)).filter(
        (t) => t.moderationStatus !== 'pending' && t.moderationStatus !== 'rejected'
      );
      const filtered = await taskService.getTasks(open, filters);
      setTasks(filtered);
      setIsLoading(false);
    };
    load();
  }, [state.tasks, filters]);

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return t('marketplace.greeting_morning');
    if (hr < 17) return t('marketplace.greeting_afternoon');
    return t('marketplace.greeting_evening');
  };

  return (
    <div>
      {/* Commerzbank Greeting Header */}
      <div className="page-topbar">
        <div>
          <h1 className="text-headline-md" style={{ margin: 0, fontWeight: 700 }}>
            {getGreeting()}, {currentUser?.name.split(' ')[0]} 👋
          </h1>
          <p style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--text-body-sm)', margin: '4px 0 0 0' }}>
            {t('marketplace.subtitle_prefix')}{tasks.length} {tasks.length === 1 ? t('marketplace.task_singular') : t('marketplace.task_plural')}{t('marketplace.subtitle_suffix')}
          </p>
        </div>
      </div>

      <div className="page-inner">
        {/* Clipped Promo Banner (Transaction Overview spec) */}
        <div className="promo-banner">
          <div className="promo-banner-left">
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600"
              alt="Bank architecture"
            />
          </div>
          <div className="promo-banner-right">
            <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 500 }}>
              {t('marketplace.promo_referral')}<strong style={{ color: 'var(--color-primary-container)' }}>{t('marketplace.promo_referral_bold')}</strong>
            </span>
            <button className="promo-card-btn-gold" style={{ fontSize: '11px', padding: '6px 14px' }}>
              {t('marketplace.promo_btn')}
            </button>
          </div>
        </div>

        <div className="card" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
          <TaskFiltersBar filters={filters} onChange={setFilters} showStatus={false} />
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-12)' }}>
            <div className="spinner" style={{ width: 40, height: 40 }} />
          </div>
        ) : tasks.length > 0 ? (
          <div className="grid-tasks">
            {tasks.map((task) => (
              <div key={task.id} className="content-visibility-auto">
                <TaskCard task={task} linkPrefix="" />
              </div>
            ))}
          </div>
        ) : (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3 className="text-headline-sm" style={{ marginBottom: 'var(--space-2)' }}>{t('marketplace.no_tasks')}</h3>
              <p>{t('marketplace.adjust_filters')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

