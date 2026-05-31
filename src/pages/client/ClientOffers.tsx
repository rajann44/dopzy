import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';
import { StatusBadge } from '../../components/ui/Badge';
import { formatCurrency, formatDate, formatRelativeTime } from '../../utils/formatters';
import type { Offer, Task, User } from '../../types';
import { CATEGORY_ICONS } from '../../utils/constants';
import { profileService } from '../../services/profileService';

function ProviderName({ id }: { id: string }) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    profileService.getUserById(id).then(setUser);
  }, [id]);
  return <span>{user ? user.name : `Provider #${id.slice(-4)}`}</span>;
}

export function ClientOffers() {
  const { currentUser } = useAuth();
  const { state } = useAppContext();

  // Get all offers on client's active tasks (exclude completed/cancelled)
  const ACTIVE_TASK_STATUSES = ['open', 'receiving_offers', 'assigned', 'in_progress'];
  const clientTasks = state.tasks.filter(
    (t) => t.clientId === currentUser?.id && ACTIVE_TASK_STATUSES.includes(t.status)
  );
  const clientTaskIds = clientTasks.map((t) => t.id);

  const offers = state.offers.filter((o) => clientTaskIds.includes(o.taskId));

  // Group by task
  const offersByTask: Record<string, { task: Task; offers: Offer[] }> = {};
  for (const offer of offers) {
    const task = state.tasks.find((t) => t.id === offer.taskId);
    if (!task) continue;
    if (!offersByTask[offer.taskId]) {
      offersByTask[offer.taskId] = { task, offers: [] };
    }
    offersByTask[offer.taskId].offers.push(offer);
  }

  const pendingCount = offers.filter((o) => o.status === 'pending').length;

  return (
    <div>
      <div className="page-topbar">
        <div>
          <h1 className="text-headline-md" style={{ margin: 0, fontWeight: 700 }}>Received Offers</h1>
          <p style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--text-body-sm)', margin: '4px 0 0 0' }}>
            {pendingCount} pending offer{pendingCount !== 1 ? 's' : ''} awaiting your review
          </p>
        </div>
      </div>

      <div className="page-inner">
        {Object.keys(offersByTask).length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">📬</div>
              <h3 className="text-headline-sm" style={{ marginBottom: 'var(--space-2)' }}>No offers yet</h3>
              <p>Post a task to start receiving offers from providers.</p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {Object.values(offersByTask).map(({ task, offers: taskOffers }) => (
              <div key={task.id} className="card">
                {/* Task header */}
                <div className="card-header" style={{ background: 'var(--color-surface-container-low)' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: '4px' }}>
                      <span className="section-label" style={{ margin: 0, fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>{CATEGORY_ICONS[task.category]}</span> {task.category}
                      </span>
                      <StatusBadge status={task.status} />
                    </div>
                    <Link to={`/client/tasks/${task.id}`} className="truncate" style={{ fontWeight: 700, fontSize: '16px', color: 'var(--color-secondary)', textDecoration: 'none', display: 'block' }}>
                      {task.title}
                    </Link>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
                      Scheduled: {formatDate(task.date)} · Location: {task.location}
                    </div>
                  </div>
                  <Link to={`/client/tasks/${task.id}`}>
                    <button className="btn btn-outlined btn-sm">View Task</button>
                  </Link>
                </div>

                {/* Offers table */}
                <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Provider</th>
                        <th>Proposed Budget</th>
                        <th>Est. Hours</th>
                        <th>Status</th>
                        <th>Received</th>
                        <th style={{ width: '100px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {taskOffers.map((offer) => {
                        const biddingOpen = task.status === 'open' || task.status === 'receiving_offers';
                        const isAcceptedOffer = task.assignedCoTaskerId === offer.coTaskerId;
                        const displayStatus: typeof offer.status =
                          offer.status !== 'pending'
                            ? offer.status
                            : biddingOpen
                              ? 'pending'
                              : isAcceptedOffer
                                ? 'accepted'
                                : 'rejected';
                        return (
                          <tr key={offer.id}>
                            <td style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>
                              <ProviderName id={offer.coTaskerId} />
                            </td>
                            <td style={{ fontWeight: 700, fontFamily: 'var(--font-headline)', color: 'var(--color-secondary)' }}>
                              {formatCurrency(offer.price)}
                            </td>
                            <td>{offer.estimatedHours}h</td>
                            <td><StatusBadge status={displayStatus} /></td>
                            <td style={{ color: 'var(--color-on-surface-variant)' }}>{formatRelativeTime(offer.createdAt)}</td>
                            <td>
                              {displayStatus === 'pending' && biddingOpen && (
                                <Link to={`/client/tasks/${task.id}`}>
                                  <button className="btn btn-primary btn-sm">Review</button>
                                </Link>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
