import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, ClipboardList, Briefcase, Star, Search, Clock, ArrowRight, DollarSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import { StatusBadge } from '../components/ui/Badge';
import { formatCurrency, formatDate, formatRelativeTime } from '../utils/formatters';
import { CATEGORY_ICONS } from '../utils/constants';

export function MyTasksPage() {
  const { currentUser } = useAuth();
  const { state } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'client';

  // ── Client Calculations ──
  const clientTasks = state.tasks.filter((t) => t.clientId === currentUser?.id);
  const postedAds = clientTasks.filter((t) => t.status === 'open' || t.status === 'receiving_offers');
  const bookedTasks = clientTasks.filter((t) => t.status === 'assigned' || t.status === 'in_progress');
  const completedTasks = clientTasks.filter((t) => t.status === 'completed' || t.status === 'cancelled');

  // ── Co-Tasker Calculations ──
  const myOffers = state.offers
    .filter((o) => o.coTaskerId === currentUser?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const pendingOffers = myOffers.filter((o) => o.status === 'pending');

  const myAssignedTasks = state.tasks
    .filter((t) => t.assignedCoTaskerId === currentUser?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const activeJobs = myAssignedTasks.filter((t) => t.status === 'assigned' || t.status === 'in_progress');
  const completedJobs = myAssignedTasks.filter((t) => t.status === 'completed');

  const totalEarned = state.walletTransactions
    .filter((w) => w.coTaskerId === currentUser?.id && w.status === 'released')
    .reduce((sum, w) => sum + w.amount, 0);

  const setTab = (tab: 'client' | 'tasker') => {
    setSearchParams({ tab });
  };

  return (
    <div>
      {/* Sticky Header */}
      <div className="page-topbar">
        <div>
          <h1 className="text-headline-md" style={{ margin: 0, fontWeight: 700 }}>My Tasks</h1>
          <p style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--text-body-sm)', margin: '4px 0 0 0' }}>
            Manage tasks you have posted or jobs you are working on
          </p>
        </div>
        {activeTab === 'client' && (
          <Link to="/tasks/new">
            <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Plus size={16} /> Post a Task
            </button>
          </Link>
        )}
      </div>

      <div className="page-inner">
        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--color-surface-container-highest)', paddingBottom: 'var(--space-2)' }}>
          <button
            onClick={() => setTab('client')}
            className={`chip ${activeTab === 'client' ? 'chip-active' : ''}`}
            style={{ padding: '8px var(--space-4)', fontSize: 'var(--text-body-sm)', borderRadius: 'var(--radius)' }}
          >
            I am a Client ({clientTasks.length})
          </button>
          <button
            onClick={() => setTab('tasker')}
            className={`chip ${activeTab === 'tasker' ? 'chip-active' : ''}`}
            style={{ padding: '8px var(--space-4)', fontSize: 'var(--text-body-sm)', borderRadius: 'var(--radius)' }}
          >
            I am a Tasker ({myOffers.length + myAssignedTasks.length})
          </button>
        </div>

        {activeTab === 'client' ? (
          /* ─────────────────────────────────────────────────────────────────
             CLIENT VIEW
             ───────────────────────────────────────────────────────────────── */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Posted Ads */}
            <div>
              <div className="section-label">Posted Ads ({postedAds.length})</div>
              {postedAds.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {postedAds.map((task) => (
                    <Link key={task.id} to={`/tasks/${task.id}`} style={{ textDecoration: 'none' }}>
                      <div className="card card-hover">
                        <div className="card-body" style={{ padding: 'var(--space-4)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: '4px' }}>
                                <span className="section-label" style={{ margin: 0, fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <span>{CATEGORY_ICONS[task.category]}</span> {task.category}
                                </span>
                                <StatusBadge status={task.status} />
                              </div>
                              <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--color-secondary)' }}>{task.title}</div>
                              <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
                                {task.location} · Posted {formatDate(task.createdAt)}
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '18px', color: 'var(--color-secondary)' }}>
                                  {task.budget ? formatCurrency(task.budget) : 'Open Budget'}
                                </div>
                                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-on-surface-variant)', textTransform: 'uppercase' }}>
                                  {task.offersCount} offer{task.offersCount !== 1 ? 's' : ''} received
                                </div>
                              </div>
                              <ArrowRight size={20} style={{ color: 'var(--color-on-surface-variant)' }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="card">
                  <div className="empty-state">
                    <h3 className="text-headline-sm" style={{ marginBottom: 'var(--space-2)' }}>No active task ads</h3>
                    <p style={{ marginBottom: 'var(--space-4)' }}>Post a task description to receive offers from taskers.</p>
                    <Link to="/tasks/new">
                      <button className="btn btn-primary"><Plus size={16} /> Post a Task</button>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Booked Tasks */}
            {bookedTasks.length > 0 && (
              <div>
                <div className="section-label">Booked / In Progress ({bookedTasks.length})</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {bookedTasks.map((task) => (
                    <Link key={task.id} to={`/tasks/${task.id}`} style={{ textDecoration: 'none' }}>
                      <div className="card card-hover">
                        <div className="card-body" style={{ padding: 'var(--space-4)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: '4px' }}>
                                <span className="section-label" style={{ margin: 0, fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <span>{CATEGORY_ICONS[task.category]}</span> {task.category}
                                </span>
                                <StatusBadge status={task.status} />
                              </div>
                              <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--color-secondary)' }}>{task.title}</div>
                              <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
                                Assigned to provider · Scheduled: {formatDate(task.date)}
                              </div>
                            </div>
                            <ArrowRight size={20} style={{ color: 'var(--color-on-surface-variant)' }} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Completed client tasks */}
            {completedTasks.length > 0 && (
              <div>
                <div className="section-label">History ({completedTasks.length})</div>
                <div className="card">
                  <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
                    <table>
                      <thead>
                        <tr>
                          <th>Task Title</th>
                          <th>Category</th>
                          <th>Completed Date</th>
                          <th>Budget</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {completedTasks.map((task) => (
                          <tr key={task.id}>
                            <td style={{ fontWeight: 600 }}>
                              <Link to={`/tasks/${task.id}`} style={{ color: 'var(--color-secondary)', textDecoration: 'none' }}>
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
                              {task.budget ? formatCurrency(task.budget) : '—'}
                            </td>
                            <td><StatusBadge status={task.status} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ─────────────────────────────────────────────────────────────────
             CO-TASKER VIEW
             ───────────────────────────────────────────────────────────────── */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Active Jobs */}
            <div>
              <div className="section-label">Active Jobs ({activeJobs.length})</div>
              {activeJobs.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {activeJobs.map((task) => {
                    const acceptedOffer = state.offers.find(
                      (o) => o.taskId === task.id && o.coTaskerId === currentUser?.id && o.status === 'accepted'
                    );
                    return (
                      <Link key={task.id} to={`/tasks/${task.id}`} style={{ textDecoration: 'none' }}>
                        <div className="card card-hover">
                          <div className="card-body" style={{ padding: 'var(--space-4)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: '8px', flexWrap: 'wrap' }}>
                                  <span className="section-label" style={{ margin: 0, fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span>{CATEGORY_ICONS[task.category]}</span> {task.category}
                                  </span>
                                  <StatusBadge status={task.status} />
                                </div>
                                <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--color-secondary)' }}>{task.title}</div>
                                <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
                                  Location: {task.location} · Due Date: {formatDate(task.date)}
                                </div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                                {acceptedOffer && (
                                  <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '18px', color: 'var(--color-secondary)' }}>
                                      {formatCurrency(acceptedOffer.price)}
                                    </div>
                                    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-on-surface-variant)', textTransform: 'uppercase' }}>
                                      Agreed price
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
                    <h3 className="text-headline-sm" style={{ marginBottom: 'var(--space-2)' }}>No active assigned jobs</h3>
                    <p style={{ marginBottom: 'var(--space-4)' }}>Browse tasks posted by others and make an offer to start earning.</p>
                    <Link to="/browse">
                      <button className="btn btn-primary">Browse Tasks</button>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* My Offers */}
            <div>
              <div className="section-label">My Offers / Bids ({myOffers.length})</div>
              {myOffers.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {myOffers.map((offer) => {
                    const task = state.tasks.find((t) => t.id === offer.taskId);
                    if (!task) return null;
                    return (
                      <div key={offer.id} className="card">
                        <div className="card-body" style={{ padding: 'var(--space-4)' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: '8px', flexWrap: 'wrap' }}>
                                <span className="section-label" style={{ margin: 0, fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <span>{CATEGORY_ICONS[task.category]}</span> {task.category}
                                </span>
                                <StatusBadge status={offer.status} />
                              </div>
                              <Link to={`/tasks/${task.id}`} style={{ fontWeight: 700, fontSize: '16px', color: 'var(--color-secondary)', textDecoration: 'none', display: 'block' }}>
                                {task.title}
                              </Link>
                              <p style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)', margin: '6px 0 0 0', fontStyle: 'italic' }}>
                                "{offer.message}"
                              </p>
                            </div>
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                              <div style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '18px', color: 'var(--color-secondary)' }}>
                                {formatCurrency(offer.price)}
                              </div>
                              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', marginTop: '2px' }}>
                                Effort: ~{offer.estimatedHours}h
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-4)', borderTop: '1px solid var(--color-surface-container-highest)', paddingTop: 'var(--space-3)' }}>
                            <span style={{ fontSize: 'var(--text-label-md)', color: 'var(--color-on-surface-variant)' }}>
                              SUBMITTED {formatRelativeTime(offer.createdAt)}
                            </span>
                            <Link to={`/tasks/${task.id}`}>
                              <button className="btn btn-outlined btn-sm">View Task Details</button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="card">
                  <div className="empty-state">
                    <p>You haven't submitted any offers yet.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Completed Jobs */}
            {completedJobs.length > 0 && (
              <div>
                <div className="section-label">Completed Jobs History ({completedJobs.length})</div>
                <div className="card">
                  <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
                    <table>
                      <thead>
                        <tr>
                          <th>Task Title</th>
                          <th>Category</th>
                          <th>Date</th>
                          <th>Earned</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {completedJobs.map((task) => {
                          const tx = state.walletTransactions.find(
                            (w) => w.taskId === task.id && w.coTaskerId === currentUser?.id
                          );
                          return (
                            <tr key={task.id}>
                              <td style={{ fontWeight: 600 }}>
                                <Link to={`/tasks/${task.id}`} style={{ color: 'var(--color-secondary)', textDecoration: 'none' }}>
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
        )}
      </div>
    </div>
  );
}
