import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, TrendingUp, CheckCircle, Clock, DollarSign, ArrowRight, Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';
import { useTranslation } from '../../context/LanguageContext';
import { profileService } from '../../services/profileService';
import { StatusBadge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { formatCurrency, formatRelativeTime } from '../../utils/formatters';
import type { TaskerProfile } from '../../types';

export function TaskerDashboard() {
  const { currentUser } = useAuth();
  const { state } = useAppContext();
  const { t } = useTranslation();
  const [profile, setProfile] = useState<TaskerProfile | null>(null);

  useEffect(() => {
    if (currentUser) profileService.getTaskerProfile(currentUser.id).then(setProfile);
  }, [currentUser]);

  const myOffers = state.offers.filter((o) => o.taskerId === currentUser?.id);
  const pendingOffers = myOffers.filter((o) => o.status === 'pending');
  const assignedTasks = state.tasks.filter((t) => t.assignedTaskerId === currentUser?.id);
  const activeTasks = assignedTasks.filter((t) => t.status === 'assigned' || t.status === 'in_progress');
  const completedTasks = assignedTasks.filter((t) => t.status === 'completed');
  const myReviews = state.reviews.filter((r) => r.toUserId === currentUser?.id).slice(0, 3);

  const totalEarned = state.walletTransactions
    .filter((w) => w.taskerId === currentUser?.id && w.status === 'released')
    .reduce((sum, w) => sum + w.amount, 0);

  const openTasksCount = state.tasks.filter(
    (t) => t.status === 'open' || t.status === 'receiving_offers'
  ).length;

  const recentActivity = state.notifications
    .filter((n) => n.userId === currentUser?.id)
    .slice(0, 5);

  return (
    <div>
      {/* Header */}
      <div className="page-topbar">
        <div>
          <h1 className="text-headline-md" style={{ margin: 0, fontWeight: 700 }}>
            {t('dashboard.welcome_back')}, {currentUser?.name.split(' ')[0]} 👋
          </h1>
          {profile && (
            <p style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--text-body-sm)', margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Star size={14} fill="var(--color-primary-container)" color="var(--color-primary)" />
              <span style={{ fontWeight: 600 }}>{t('dashboard.rating_span', { rating: profile.rating })}</span> · {t('dashboard.reviews_count', { count: profile.reviewCount })} · {t('dashboard.response_time', { time: profile.responseTime })}
            </p>
          )}
        </div>
        <Link to="/tasker/tasks">
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            {t('dashboard.browse_tasks_btn')}
            <ArrowRight size={16} />
          </button>
        </Link>
      </div>

      <div className="page-inner">
        {/* Stats */}
        <div className="grid-stats mb-6">
          <div className="stat-card">
            <div className="stat-icon-wrap" style={{ background: 'var(--color-status-warning-bg)' }}>
              <TrendingUp size={18} style={{ color: 'var(--color-status-warning)' }} />
            </div>
            <div className="stat-value">{pendingOffers.length}</div>
            <div className="stat-label">{t('dashboard.pending_offers')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrap" style={{ background: 'rgba(69, 39, 160, 0.08)' }}>
              <Clock size={18} style={{ color: '#4527A0' }} />
            </div>
            <div className="stat-value">{activeTasks.length}</div>
            <div className="stat-label">{t('dashboard.active_jobs')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrap" style={{ background: 'var(--color-status-success-bg)' }}>
              <CheckCircle size={18} style={{ color: 'var(--color-status-success)' }} />
            </div>
            <div className="stat-value">{completedTasks.length}</div>
            <div className="stat-label">{t('dashboard.completed')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrap" style={{ background: 'rgba(255, 215, 0, 0.15)' }}>
              <DollarSign size={18} style={{ color: 'var(--color-primary)' }} />
            </div>
            <div className="stat-value">{formatCurrency(totalEarned || (profile?.totalEarnings ?? 0))}</div>
            <div className="stat-label">{t('dashboard.total_earned')}</div>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="bento-grid">
          {/* Left Main Column */}
          <div className="bento-col-8 flex flex-col gap-6">
            {/* Open market banner */}
            <div style={{
              background: 'var(--color-secondary)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--space-4)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '20px', color: '#fff', marginBottom: '4px' }}>
                  {t('dashboard.open_market_banner', { count: openTasksCount })}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 'var(--text-body-sm)' }}>
                  {t('dashboard.open_market_banner_desc')}
                </div>
              </div>
              <Link to="/tasker/tasks" style={{ flexShrink: 0, zIndex: 1 }}>
                <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {t('dashboard.view_all')} <ArrowRight size={14} />
                </button>
              </Link>
              <div style={{ position: 'absolute', right: -40, top: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,215,0,0.08)' }} />
            </div>

            {/* Active Jobs */}
            {activeTasks.length > 0 && (
              <div>
                <div className="section-label">{t('dashboard.active_jobs')}</div>
                <div className="flex flex-col gap-3">
                  {activeTasks.map((task) => (
                    <Link key={task.id} to={`/tasker/tasks/${task.id}`} style={{ textDecoration: 'none' }}>
                      <div className="card card-hover" style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
                        <div style={{ minWidth: 0 }}>
                          <div className="truncate" style={{ fontWeight: 600, color: 'var(--color-on-surface)', fontSize: 'var(--text-body-md)' }}>{task.title}</div>
                          <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)' }}>{task.location} · {task.category}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexShrink: 0 }}>
                          <StatusBadge status={task.status} />
                          <ArrowRight size={16} style={{ color: 'var(--color-on-surface-variant)' }} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Recent reviews */}
            {myReviews.length > 0 && (
              <div>
                <div className="section-label">{t('dashboard.recent_reviews')}</div>
                <div className="flex flex-col gap-3">
                  {myReviews.map((review) => (
                    <div key={review.id} className="card">
                      <div className="card-body" style={{ padding: 'var(--space-4)' }}>
                        <div style={{ display: 'flex', gap: '2px', marginBottom: 'var(--space-2)' }}>
                          {[1, 2, 3, 4, 5].map(s => (
                            <span key={s} className={`star ${s <= review.rating ? '' : 'star-empty'}`}>★</span>
                          ))}
                        </div>
                        <p style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)', fontStyle: 'italic', margin: 0 }}>
                          "{review.comment}"
                        </p>
                        <div style={{ fontSize: 'var(--text-label-md)', color: 'var(--color-on-surface-variant)', marginTop: 'var(--space-2)' }}>
                          {formatRelativeTime(review.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="bento-col-4 flex flex-col gap-6">
            {/* Profile bento card */}
            {profile && currentUser && (
              <div className="card">
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 'var(--space-3)' }}>
                  <Avatar name={currentUser.name} avatarUrl={currentUser.avatarUrl} size="xl" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 'var(--text-body-lg)', color: 'var(--color-on-surface)' }}>{currentUser.name}</div>
                    <div style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--text-body-sm)', marginTop: '2px' }}>{profile.location}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {profile.isVerified && <span className="badge badge-verified">{t('dashboard.badge_verified')}</span>}
                    {profile.isTopRated && <span className="badge badge-top-rated">{t('dashboard.badge_top_rated')}</span>}
                    {profile.isFastResponder && <span className="badge badge-fast">{t('dashboard.badge_fast')}</span>}
                  </div>
                  <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-surface-container-highest)', marginTop: 'var(--space-2)' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '20px', color: 'var(--color-on-surface)' }}>{profile.rating}</div>
                      <div style={{ fontSize: 'var(--text-label-md)', color: 'var(--color-on-surface-variant)' }}>{t('dashboard.label_rating')}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '20px', color: 'var(--color-on-surface)' }}>{profile.completedJobs}</div>
                      <div style={{ fontSize: 'var(--text-label-md)', color: 'var(--color-on-surface-variant)' }}>{t('dashboard.jobs_done')}</div>
                    </div>
                  </div>
                  <Link to={`/profile/${currentUser.id}`} style={{ width: '100%', marginTop: 'var(--space-2)' }}>
                    <button className="btn btn-outlined w-full" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)' }}>
                      <User size={16} />
                      {t('dashboard.view_public_profile')}
                    </button>
                  </Link>
                </div>
              </div>
            )}

            {/* Activity Feed Card */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-headline-sm" style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Bell size={16} />
                  {t('dashboard.title_recent_activity')}
                </h3>
                <Link to="/notifications" style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-secondary)', fontWeight: 600 }}>{t('dashboard.view_all')}</Link>
              </div>
              <div>
                {recentActivity.length > 0 ? (
                  recentActivity.map((notif) => (
                    <div key={notif.id} className="activity-item" style={{ opacity: notif.isRead ? 0.7 : 1 }}>
                      {!notif.isRead && <div className="unread-dot" />}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: notif.isRead ? 500 : 700, fontSize: 'var(--text-body-sm)', color: 'var(--color-on-surface)' }}>
                          {notif.title}
                        </div>
                        <div style={{ fontSize: 'var(--text-label-md)', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
                          {formatRelativeTime(notif.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state" style={{ padding: 'var(--space-6)' }}>
                    <p>{t('dashboard.no_recent_activity')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
