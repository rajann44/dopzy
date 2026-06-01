import { useState } from 'react';
import { 
  useAppContext, 
  approveTaskerAction, 
  rejectTaskerAction, 
  approveTaskAction, 
  rejectTaskAction,
  disableUserAction,
  enableUserAction,
  toggleUserTaskerAction,
  deleteTaskAction
} from '../../context/AppContext';
import { useTranslation } from '../../context/LanguageContext';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Check, X, Shield, FileText, UserCheck, Trash2, Search } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { supabase } from '../../utils/supabaseClient';

export function ModerationPanel() {
  const { state, dispatch } = useAppContext();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'pending' | 'users' | 'tasks'>('pending');
  
  // Search states
  const [userSearch, setUserSearch] = useState('');
  const [taskSearch, setTaskSearch] = useState('');

  // Filter pending data
  const pendingUsers = state.users.filter((u) => u.taskerStatus === 'pending');
  const pendingTasks = state.tasks.filter((t) => t.moderationStatus === 'pending');

  // Search filtered users
  const filteredUsers = state.users.filter((u) => {
    const term = userSearch.toLowerCase();
    return u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term) || u.role.toLowerCase().includes(term);
  });

  // Search filtered tasks
  const filteredTasks = state.tasks.filter((t) => {
    const term = taskSearch.toLowerCase();
    return t.title.toLowerCase().includes(term) || t.description.toLowerCase().includes(term) || t.category.toLowerCase().includes(term);
  });

  // Action handlers
  const handleApproveUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ tasker_status: 'approved', role: 'tasker' })
        .eq('id', userId);
      if (error) throw error;
      dispatch(approveTaskerAction(userId));
      showToast(t('moderation.toast_approved_user'), 'success');
    } catch (err: any) {
      console.error('Failed to approve user:', err);
      showToast(err.message || 'Failed to approve user in database.', 'error');
    }
  };

  const handleRejectUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ tasker_status: 'rejected' })
        .eq('id', userId);
      if (error) throw error;
      dispatch(rejectTaskerAction(userId));
      showToast(t('moderation.toast_rejected_user'), 'info');
    } catch (err: any) {
      console.error('Failed to reject user:', err);
      showToast(err.message || 'Failed to reject user in database.', 'error');
    }
  };

  const handleApproveTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ moderation_status: 'approved' })
        .eq('id', taskId);
      if (error) throw error;
      dispatch(approveTaskAction(taskId));
      showToast(t('moderation.toast_approved_task'), 'success');
    } catch (err: any) {
      console.error('Failed to approve task:', err);
      showToast(err.message || 'Failed to approve task in database.', 'error');
    }
  };

  const handleRejectTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ moderation_status: 'rejected' })
        .eq('id', taskId);
      if (error) throw error;
      dispatch(rejectTaskAction(taskId));
      showToast(t('moderation.toast_rejected_task'), 'info');
    } catch (err: any) {
      console.error('Failed to reject task:', err);
      showToast(err.message || 'Failed to reject task in database.', 'error');
    }
  };

  const handleToggleDisableUser = async (userId: string, currentDisabled: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_disabled: !currentDisabled })
        .eq('id', userId);
      if (error) throw error;
      
      if (currentDisabled) {
        dispatch(enableUserAction(userId));
        showToast(t('moderation.toast_enabled_user'), 'success');
      } else {
        dispatch(disableUserAction(userId));
        showToast(t('moderation.toast_disabled_user'), 'warning');
      }
    } catch (err: any) {
      console.error('Failed to toggle user status:', err);
      showToast(err.message || 'Failed to update user status in database.', 'error');
    }
  };

  const handleToggleTasker = async (userId: string, isTasker: boolean) => {
    try {
      const nextRole = isTasker ? 'client' : 'tasker';
      const nextStatus = isTasker ? 'none' : 'approved';
      const { error } = await supabase
        .from('users')
        .update({ role: nextRole, tasker_status: nextStatus })
        .eq('id', userId);
      if (error) throw error;

      dispatch(toggleUserTaskerAction(userId, !isTasker));
      showToast(
        isTasker 
          ? t('moderation.toast_revoked_tasker')
          : t('moderation.toast_promoted_tasker'), 
        'success'
      );
    } catch (err: any) {
      console.error('Failed to toggle tasker role:', err);
      showToast(err.message || 'Failed to update user role in database.', 'error');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm(t('moderation.confirm_delete_task'))) {
      try {
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', taskId);
        if (error) throw error;

        dispatch(deleteTaskAction(taskId));
        showToast(t('moderation.toast_deleted_task'), 'error');
      } catch (err: any) {
        console.error('Failed to delete task:', err);
        showToast(err.message || 'Failed to delete task from database.', 'error');
      }
    }
  };

  return (
    <div>
      <div className="page-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Shield size={24} style={{ color: 'var(--color-primary)' }} />
          <div>
            <h1 className="text-headline-md" style={{ margin: 0, fontWeight: 700 }}>
              {t('moderation.title') || 'Moderation & Admin Panel'}
            </h1>
            <p style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--text-body-sm)', margin: '4px 0 0 0' }}>
              {t('moderation.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="page-inner">
        <SegmentedControl
          options={[
            { value: 'pending', label: t('moderation.tab_pending_count', { count: pendingUsers.length + pendingTasks.length }) },
            { value: 'users', label: `${t('moderation.tab_users')} (${state.users.length})` },
            { value: 'tasks', label: `${t('moderation.tab_tasks')} (${state.tasks.length})` },
          ]}
          value={activeTab}
          onChange={(val) => setActiveTab(val as 'pending' | 'users' | 'tasks')}
          style={{ marginBottom: 'var(--space-6)' }}
        />

        {/* Tab Content 1: Pending Approvals */}
        {activeTab === 'pending' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Tasker applications */}
            <div>
              <div className="section-label" style={{ marginBottom: 'var(--space-3)' }}>
                {t('moderation.pending_tasker_apps', { count: pendingUsers.length })}
              </div>
              {pendingUsers.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {pendingUsers.map((user) => (
                    <div key={user.id} className="card" style={{ padding: 'var(--space-4)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                          <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--color-secondary)' }}>
                            {user.name}
                          </h3>
                          <span style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
                            {user.email} · Applied {formatDate(user.createdAt)}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleRejectUser(user.id)}
                            className="btn btn-outlined btn-sm"
                            style={{ color: 'var(--color-status-error)', borderColor: 'var(--color-status-error)', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <X size={14} /> {t('moderation.btn_reject')}
                          </button>
                          <button
                            onClick={() => handleApproveUser(user.id)}
                            className="btn btn-primary btn-sm"
                            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Check size={14} /> {t('moderation.btn_approve')}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card">
                  <div className="empty-state" style={{ padding: 'var(--space-6)' }}>
                    <UserCheck size={28} style={{ opacity: 0.4, marginBottom: '6px' }} />
                    <p style={{ margin: 0, fontSize: '13px' }}>{t('moderation.no_pending_apps')}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Task moderation */}
            <div>
              <div className="section-label" style={{ marginBottom: 'var(--space-3)' }}>
                {t('moderation.tasks_pending_review', { count: pendingTasks.length })}
              </div>
              {pendingTasks.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {pendingTasks.map((task) => (
                    <div key={task.id} className="card" style={{ padding: 'var(--space-4)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '8px' }}>
                        <div>
                          <span className="chip" style={{ fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px', display: 'inline-block' }}>
                            {task.category}
                          </span>
                          <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--color-secondary)' }}>
                            {task.title}
                          </h3>
                          <span style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
                            📍 {task.location} · 💶 Budget: {task.budgetType === 'open_to_offers' ? 'Open Bids' : formatCurrency(task.budget || 0)}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleRejectTask(task.id)}
                            className="btn btn-outlined btn-sm"
                            style={{ color: 'var(--color-status-error)', borderColor: 'var(--color-status-error)', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <X size={14} /> {t('moderation.btn_reject')}
                          </button>
                          <button
                            onClick={() => handleApproveTask(task.id)}
                            className="btn btn-primary btn-sm"
                            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Check size={14} /> {t('moderation.btn_approve')}
                          </button>
                        </div>
                      </div>
                      <div style={{
                        background: 'var(--color-surface-container-lowest)',
                        border: '1px solid var(--color-outline-variant)',
                        borderRadius: 'var(--radius)',
                        padding: '8px 12px',
                        fontSize: '12px',
                        color: 'var(--color-on-surface-variant)',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {task.description}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card">
                  <div className="empty-state" style={{ padding: 'var(--space-6)' }}>
                    <FileText size={28} style={{ opacity: 0.4, marginBottom: '6px' }} />
                    <p style={{ margin: 0, fontSize: '13px' }}>{t('moderation.no_pending_tasks')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab Content 2: All Users */}
        {activeTab === 'users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {/* Search filter */}
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-on-surface-variant)' }} />
              <input
                type="text"
                placeholder={t('moderation.search_users_placeholder')}
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 40px',
                  border: 'none',
                  borderBottom: '1.5px solid var(--color-outline-variant)',
                  borderRadius: 0,
                  fontSize: 'var(--text-body-sm)',
                  outline: 'none',
                  background: 'transparent',
                  color: 'var(--color-on-surface)'
                }}
              />
            </div>

            <div className="transaction-rows-container">
              <div className="transaction-row-header" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1.5fr' }}>
                <span>{t('moderation.th_user_info')}</span>
                <span>{t('moderation.th_role')}</span>
                <span>{t('moderation.th_tasker_status')}</span>
                <span style={{ textAlign: 'right', paddingRight: '16px' }}>{t('moderation.th_actions')}</span>
              </div>
              
              {filteredUsers.map((user) => {
                const isTasker = user.role === 'tasker';
                const isUserAdmin = user.role === 'admin';
                return (
                  <div key={user.id} className="transaction-row-item" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.5fr', cursor: 'default' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 700, color: user.isDisabled ? 'var(--color-on-surface-variant)' : 'var(--color-secondary)' }}>
                        {user.name} {user.isDisabled && <span style={{ color: 'var(--color-status-error)', fontSize: '11px', fontWeight: 600 }}>({t('moderation.badge_disabled')})</span>}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
                        {user.email}
                      </span>
                    </div>

                    <div>
                      <span style={{ textTransform: 'capitalize', fontSize: 'var(--text-body-sm)' }}>
                        {user.role}
                      </span>
                    </div>

                    <div>
                      <span className={`badge badge-${user.taskerStatus || 'none'}`} style={{ textTransform: 'uppercase', fontSize: '10px' }}>
                        {user.taskerStatus || 'none'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', paddingRight: '16px' }}>
                      {!isUserAdmin && (
                        <>
                          <button
                            onClick={() => handleToggleTasker(user.id, isTasker)}
                            className="btn btn-outlined btn-xs"
                            style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', padding: '4px 8px' }}
                          >
                            {isTasker ? t('moderation.btn_revoke_tasker') : t('moderation.btn_promote_tasker')}
                          </button>
                          <button
                            onClick={() => handleToggleDisableUser(user.id, !!user.isDisabled)}
                            className={`btn btn-xs ${user.isDisabled ? 'btn-primary' : 'btn-danger'}`}
                            style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', padding: '4px 8px' }}
                          >
                            {user.isDisabled ? t('moderation.btn_enable_account') : t('moderation.btn_disable_account')}
                          </button>
                        </>
                      )}
                      {isUserAdmin && (
                        <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', fontStyle: 'italic' }}>{t('moderation.sys_admin')}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab Content 3: All Tasks */}
        {activeTab === 'tasks' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {/* Search filter */}
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-on-surface-variant)' }} />
              <input
                type="text"
                placeholder={t('moderation.search_tasks_placeholder')}
                value={taskSearch}
                onChange={(e) => setTaskSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 40px',
                  border: 'none',
                  borderBottom: '1.5px solid var(--color-outline-variant)',
                  borderRadius: 0,
                  fontSize: 'var(--text-body-sm)',
                  outline: 'none',
                  background: 'transparent',
                  color: 'var(--color-on-surface)'
                }}
              />
            </div>

            <div className="transaction-rows-container">
              <div className="transaction-row-header" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1.2fr' }}>
                <span>{t('moderation.th_task_listing')}</span>
                <span>{t('dashboard.th_category')}</span>
                <span>{t('moderation.th_flow_status')}</span>
                <span>{t('moderation.th_moderation')}</span>
                <span style={{ textAlign: 'right', paddingRight: '16px' }}>{t('moderation.th_actions')}</span>
              </div>
              
              {filteredTasks.map((task) => (
                <div key={task.id} className="transaction-row-item" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1.2fr', cursor: 'default' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 700, color: 'var(--color-secondary)' }}>{task.title}</span>
                    <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
                      📍 {task.location} · 💶 {task.budgetType === 'open_to_offers' ? 'Open Bids' : formatCurrency(task.budget || 0)}
                    </span>
                  </div>

                  <div>
                    <span style={{ fontSize: 'var(--text-body-sm)' }}>{task.category}</span>
                  </div>

                  <div>
                    <span className="badge badge-secondary" style={{ textTransform: 'uppercase', fontSize: '10px' }}>
                      {task.status}
                    </span>
                  </div>

                  <div>
                    <span className={`badge badge-${task.moderationStatus || 'approved'}`} style={{ textTransform: 'uppercase', fontSize: '10px' }}>
                      {task.moderationStatus || 'approved'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', paddingRight: '16px' }}>
                    {task.moderationStatus === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApproveTask(task.id)}
                          className="btn btn-primary btn-xs"
                          style={{ padding: '4px 6px' }}
                          title="Approve Listing"
                        >
                          <Check size={12} />
                        </button>
                        <button
                          onClick={() => handleRejectTask(task.id)}
                          className="btn btn-outlined btn-xs"
                          style={{ color: 'var(--color-status-error)', borderColor: 'var(--color-status-error)', padding: '4px 6px' }}
                          title="Reject Listing"
                        >
                          <X size={12} />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="btn btn-danger btn-xs"
                      style={{ padding: '4px 6px' }}
                      title="Delete Listing Permanently"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default ModerationPanel;
