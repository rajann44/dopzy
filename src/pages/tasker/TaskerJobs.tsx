import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';
import { StatusBadge } from '../../components/ui/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CATEGORY_ICONS } from '../../utils/constants';
import { ArrowRight, CheckCircle, Clock } from 'lucide-react';

export function TaskerJobs() {
  const { currentUser } = useAuth();
  const { state } = useAppContext();

  const myJobs = state.tasks
    .filter((t) => t.assignedTaskerId === currentUser?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const active = myJobs.filter((t) => t.status === 'assigned' || t.status === 'in_progress');
  const completed = myJobs.filter((t) => t.status === 'completed');

  const totalEarned = state.walletTransactions
    .filter((w) => w.taskerId === currentUser?.id && w.status === 'released')
    .reduce((sum, w) => sum + w.amount, 0);

  return (
    <div>
      <div className="page-topbar">
        <div>
          <h1 className="text-headline-md" style={{ margin: 0, fontWeight: 700 }}>My Jobs</h1>
          <p style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--text-body-sm)', margin: '4px 0 0 0' }}>
            {active.length} active · {completed.length} completed · {formatCurrency(totalEarned)} total earned
          </p>
        </div>
      </div>

      <div className="page-inner">
        {/* Active Jobs */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <div className="section-label" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Clock size={14} style={{ color: 'var(--color-secondary-mid)' }} />
            <span>Active Jobs ({active.length})</span>
          </div>
          {active.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {active.map((task) => {
                const myOffer = state.offers.find(
                  (o) => o.taskId === task.id && o.taskerId === currentUser?.id && o.status === 'accepted'
                );
                return (
                  <Link key={task.id} to={`/tasker/tasks/${task.id}`} style={{ textDecoration: 'none' }}>
                    <div className="card card-hover">
                      <div className="card-body" style={{ padding: 'var(--space-4)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: '8px', flexWrap: 'wrap' }}>
                              <span className="section-label" style={{ margin: 0, fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span>{CATEGORY_ICONS[task.category]}</span> {task.category}
                              </span>
                              <StatusBadge status={task.status} />
                            </div>
                            <div className="truncate" style={{ fontWeight: 700, fontSize: '16px', color: 'var(--color-secondary)' }}>{task.title}</div>
                            <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
                              Location: {task.location} · Task Date: {formatDate(task.date)}
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexShrink: 0 }}>
                            {myOffer && (
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '18px', color: 'var(--color-secondary)' }}>
                                  {formatCurrency(myOffer.price)}
                                </div>
                                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-on-surface-variant)', textTransform: 'uppercase' }}>
                                  Agreed Price
                                </div>
                              </div>
                            )}
                            <ArrowRight size={20} style={{ color: 'var(--color-on-surface-variant)' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="card">
              <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <h3 className="text-headline-sm" style={{ marginBottom: 'var(--space-2)' }}>No active jobs</h3>
                <p style={{ marginBottom: 'var(--space-4)' }}>Browse available tasks and send offers to get assigned jobs.</p>
                <Link to="/tasker/tasks">
                  <button className="btn btn-primary">Browse Tasks</button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Completed Jobs */}
        {completed.length > 0 && (
          <div>
            <div className="section-label" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <CheckCircle size={14} style={{ color: 'var(--color-status-success)' }} />
              <span>Completed Jobs ({completed.length})</span>
            </div>
            <div className="card">
              <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
                <table>
                  <thead>
                    <tr>
                      <th>Task Title</th>
                      <th>Category</th>
                      <th>Completion Date</th>
                      <th>Total Earned</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completed.map((task) => {
                      const tx = state.walletTransactions.find(
                        (w) => w.taskId === task.id && w.taskerId === currentUser?.id
                      );
                      return (
                        <tr key={task.id}>
                          <td style={{ fontWeight: 600 }}>
                            <Link to={`/tasker/tasks/${task.id}`} style={{ color: 'var(--color-secondary)', textDecoration: 'none' }}>
                              {task.title}
                            </Link>
                          </td>
                          <td style={{ color: 'var(--color-on-surface-variant)' }}>
                            {CATEGORY_ICONS[task.category]} {task.category}
                          </td>
                          <td style={{ color: 'var(--color-on-surface-variant)' }}>
                            {formatDate(task.date)}
                          </td>
                          <td style={{ fontWeight: 700, fontFamily: 'var(--font-headline)', color: 'var(--color-secondary)' }}>
                            {tx ? formatCurrency(tx.amount) : '—'}
                          </td>
                          <td><StatusBadge status={task.status} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
