import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, CheckCircle, X, Star, Wallet, User } from 'lucide-react';
import posthog from '../../utils/posthogClient';
import { useAuth } from '../../context/AuthContext';
import { useAppContext, acceptOfferAction, updateTaskStatusAction, addReviewAction, addNotificationAction, createConversationAction, sendChatMessageAction } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from '../../context/LanguageContext';
import { StatusBadge } from '../../components/ui/Badge';
import { OfferCard } from '../../components/offers/OfferCard';
import { ConfirmModal, Modal } from '../../components/ui/Modal';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { Avatar } from '../../components/ui/Avatar';
import { profileService } from '../../services/profileService';
import { formatDate, formatCurrency, generateId } from '../../utils/formatters';
import { CATEGORY_ICONS } from '../../utils/constants';
import type { Offer, User as UserType, Review } from '../../types';
import { TaskerProfileDrawer } from '../../components/profile/TaskerProfileDrawer';
import { supabase } from '../../utils/supabaseClient';

export function ClientTaskDetail() {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const { state, dispatch } = useAppContext();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const task = state.tasks.find((t) => t.id === id);
  const offers = state.offers.filter((o) => o.taskId === id);
  const acceptedOffer = offers.find((o) => o.status === 'accepted');

  const [assignedUser, setAssignedUser] = useState<UserType | null>(null);
  const [acceptConfirm, setAcceptConfirm] = useState<Offer | null>(null);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [completeConfirm, setCompleteConfirm] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [selectedTaskerId, setSelectedTaskerId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'offers' | 'review'>('details');

  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editBudget, setEditBudget] = useState(0);
  const [editDate, setEditDate] = useState('');

  const existingReview = state.reviews.find(
    (r) => r.taskId === id && r.fromUserId === currentUser?.id
  );

  useEffect(() => {
    if (task?.assignedTaskerId) {
      profileService.getUserById(task.assignedTaskerId).then(setAssignedUser);
    }
  }, [task?.assignedTaskerId]);



  if (!task) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔍</div>
        <h3>{t('task_detail.task_not_found')}</h3>
        <Link to="/my-tasks"><button className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>{t('task_detail.back_to_tasks')}</button></Link>
      </div>
    );
  }

  if (task.clientId !== currentUser?.id && currentUser?.role !== 'admin') {
    return <div className="empty-state"><h3>{t('task_detail.access_denied')}</h3></div>;
  }

  const handleMessageTasker = (taskerId: string) => {
    const existingConv = state.conversations.find(
      (c) => c.taskId === task.id && c.participantIds.includes(taskerId)
    );
    
    if (existingConv) {
      navigate(`/messages?conv=${existingConv.id}`);
    } else {
      const convId = generateId('conv');
      const newConversation = {
        id: convId,
        participantIds: [currentUser!.id, taskerId],
        lastMessage: `Hi! Let's chat about my task "${task.title}".`,
        lastMessageAt: new Date().toISOString(),
        unreadCount: 0,
        taskId: task.id
      };
      dispatch(createConversationAction(newConversation));
      
      const newMessage = {
        id: generateId('msg'),
        conversationId: convId,
        senderId: currentUser!.id,
        text: `Hi! Let's chat about my task "${task.title}".`,
        createdAt: new Date().toISOString()
      };
      dispatch(sendChatMessageAction(newMessage));

      navigate(`/messages?conv=${convId}`);
    }
  };

  const handleAcceptOffer = async () => {
    if (!acceptConfirm) return;
    setIsActionLoading(true);

    try {
      // 1. Update accepted offer status
      const { error: acceptErr } = await supabase
        .from('offers')
        .update({ status: 'accepted' })
        .eq('id', acceptConfirm.id);
      if (acceptErr) throw acceptErr;

      // 2. Reject other offers
      const { error: rejectErr } = await supabase
        .from('offers')
        .update({ status: 'rejected' })
        .eq('task_id', task.id)
        .neq('id', acceptConfirm.id);
      if (rejectErr) throw rejectErr;

      // 3. Update task
      const { error: taskErr } = await supabase
        .from('tasks')
        .update({ status: 'assigned', assigned_tasker_id: acceptConfirm.taskerId })
        .eq('id', task.id);
      if (taskErr) throw taskErr;

      // 4. Record wallet transaction
      const { error: walletErr } = await supabase
        .from('wallet_transactions')
        .insert({
          task_id: task.id,
          client_id: currentUser!.id,
          tasker_id: acceptConfirm.taskerId,
          amount: acceptConfirm.price,
          status: 'reserved',
          created_at: new Date().toISOString()
        });
      if (walletErr) throw walletErr;

      // 5. Send notification to Tasker
      const newNotif = {
        id: 'temp-accept-notif',
        userId: acceptConfirm.taskerId,
        type: 'offer_accepted' as const,
        title: 'Your offer was accepted!',
        message: `Your offer for "${task.title}" has been accepted. Check your jobs to get started.`,
        isRead: false,
        createdAt: new Date().toISOString(),
        linkTo: '/my-tasks?tab=tasker',
      };

      await supabase
        .from('notifications')
        .insert({
          user_id: newNotif.userId,
          type: newNotif.type,
          title: newNotif.title,
          message: newNotif.message,
          is_read: newNotif.isRead,
          created_at: newNotif.createdAt,
          link_to: newNotif.linkTo
        });

      dispatch(acceptOfferAction(acceptConfirm.id, task.id, acceptConfirm.taskerId));
      dispatch(addNotificationAction(newNotif));

      posthog.capture('offer_accepted', {
        offer_id: acceptConfirm.id,
        task_id: task.id,
        category: task.category,
        offer_price: acceptConfirm.price,
      });

      showToast(t('task_detail.toast_assigned'), 'success');
      setAcceptConfirm(null);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to accept offer', 'error');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCancelTask = async () => {
    setIsActionLoading(true);
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: 'cancelled' })
        .eq('id', task.id);
      if (error) throw error;

      dispatch({ type: 'CANCEL_TASK', payload: { taskId: task.id } });
      posthog.capture('task_cancelled', {
        task_id: task.id,
        category: task.category,
        status_at_cancel: task.status,
      });
      showToast(t('task_detail.toast_cancelled'), 'info');
      setCancelConfirm(false);
      navigate('/my-tasks');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to cancel task', 'error');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    setIsActionLoading(true);
    try {
      const { error: taskErr } = await supabase
        .from('tasks')
        .update({ status: 'completed' })
        .eq('id', task.id);
      if (taskErr) throw taskErr;

      // Update wallet transactions to released
      await supabase
        .from('wallet_transactions')
        .update({ status: 'released' })
        .eq('task_id', task.id);

      dispatch(updateTaskStatusAction(task.id, 'completed'));
      posthog.capture('task_completed', {
        task_id: task.id,
        category: task.category,
        accepted_offer_price: acceptedOffer?.price,
      });
      showToast(t('task_detail.toast_completed'), 'success');
      setCompleteConfirm(false);
      setShowReviewModal(true);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to complete task', 'error');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewComment.trim() || reviewComment.length < 10) {
      showToast(t('task_detail.toast_review_min'), 'warning');
      return;
    }
    setIsActionLoading(true);
    const review: Review = {
      id: generateId('review'),
      taskId: task.id,
      fromUserId: currentUser!.id,
      toUserId: task.assignedTaskerId!,
      rating: reviewRating,
      comment: reviewComment.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      const { data: dbReview, error } = await supabase
        .from('reviews')
        .insert({
          task_id: review.taskId,
          from_user_id: review.fromUserId,
          to_user_id: review.toUserId,
          rating: review.rating,
          comment: review.comment,
          created_at: review.createdAt
        })
        .select('id')
        .single();
      if (error) throw error;

      const newReview = {
        ...review,
        id: dbReview.id
      };

      dispatch(addReviewAction(newReview));
      posthog.capture('review_submitted', {
        review_id: newReview.id,
        task_id: task.id,
        category: task.category,
        rating: reviewRating,
      });
      showToast(t('task_detail.toast_review_success'), 'success');
      setShowReviewModal(false);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim() || !editDescription.trim()) {
      showToast(t('task_detail.toast_edit_required'), 'warning');
      return;
    }
    setIsActionLoading(true);
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          title: editTitle.trim(),
          description: editDescription.trim(),
          budget: editBudget,
          date: editDate,
          moderation_status: 'pending'
        })
        .eq('id', task.id);
      if (error) throw error;

      dispatch({
        type: 'UPDATE_TASK',
        payload: {
          id: task.id,
          title: editTitle.trim(),
          description: editDescription.trim(),
          budget: editBudget,
          date: editDate,
          moderationStatus: 'pending'
        }
      });
      showToast(t('task_detail.toast_edit_success'), 'success');
      setShowEditModal(false);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to update task', 'error');
    } finally {
      setIsActionLoading(false);
    }
  };

  const canCancel = task.status === 'open' || task.status === 'receiving_offers';
  const canComplete = task.status === 'assigned' || task.status === 'in_progress';
  const emoji = CATEGORY_ICONS[task.category] ?? '📋';

  return (
    <div>
      {/* Header */}
      <div className="page-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', minWidth: 0 }}>
          <button onClick={() => navigate(-1)} className="btn btn-ghost btn-icon btn-back" style={{ flexShrink: 0 }}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="mobile-only-header-title">{t('task_detail.title')}</h1>
          <div className="desktop-only-header-content" style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: '4px', flexWrap: 'wrap' }}>
              <span className="section-label" style={{ margin: 0, fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>{emoji}</span> {task.category}
              </span>
              <StatusBadge status={task.status} />
              {task.taskType === 'remote' ? (
                <span className="badge badge-secondary" style={{ fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>💻 {t('task_detail.remote')}</span>
              ) : (
                <span className="badge badge-secondary" style={{ fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>📍 {t('task_detail.in_person')}</span>
              )}
              <span className="badge" style={{ 
                fontSize: '10px', 
                fontWeight: 600, 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '4px',
                background: 'rgba(98, 0, 238, 0.08)', 
                color: 'var(--color-primary)', 
                border: '1px solid rgba(98, 0, 238, 0.2)',
                padding: '2px 8px',
                borderRadius: '100px'
              }}>
                ✨ {t('task_detail.posted_by_you')}
              </span>
            </div>
            <h1 className="text-headline-md truncate" style={{ margin: 0, fontWeight: 700 }}>{task.title}</h1>
          </div>
        </div>
        {/* Actions */}
        <div className="desktop-only-header-content" style={{ display: 'flex', gap: 'var(--space-2)', flexShrink: 0 }}>
          {canCancel && (
            <>
              <button className="btn btn-outlined btn-sm" onClick={() => {
                setEditTitle(task.title);
                setEditDescription(task.description);
                setEditBudget(task.budget || 0);
                setEditDate(task.date);
                setShowEditModal(true);
              }} style={{ borderColor: 'var(--color-primary)', color: 'var(--color-secondary)' }}>
                {t('task_detail.btn_edit')}
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => setCancelConfirm(true)}>
                <X size={14} /> {t('task_detail.btn_cancel')}
              </button>
            </>
          )}
          {canComplete && (
            <button className="btn btn-primary btn-sm" onClick={() => setCompleteConfirm(true)}>
              <CheckCircle size={14} /> {t('task_detail.btn_complete')}
            </button>
          )}
        </div>
      </div>

      <div className="page-inner">
        {/* Mobile Hero Block (only visible on mobile layout) */}
        <div className="mobile-only-hero-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <span className="section-label" style={{ margin: 0, fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>{emoji}</span> {task.category}
            </span>
            <StatusBadge status={task.status} />
            {task.taskType === 'remote' ? (
              <span className="badge badge-secondary" style={{ fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>💻 {t('task_detail.remote')}</span>
            ) : (
              <span className="badge badge-secondary" style={{ fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>📍 {t('task_detail.in_person')}</span>
            )}
            <span className="badge" style={{ 
              fontSize: '10px', 
              fontWeight: 600, 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '4px',
              background: 'rgba(98, 0, 238, 0.08)', 
              color: 'var(--color-primary)', 
              border: '1px solid rgba(98, 0, 238, 0.2)',
              padding: '2px 8px',
              borderRadius: '100px'
            }}>
              ✨ {t('task_detail.posted_by_you')}
            </span>
          </div>
          
          <h1 className="text-headline-md" style={{ margin: '8px 0', fontWeight: 700, color: 'var(--color-secondary)', fontSize: '20px', lineHeight: 1.3 }}>
            {task.title}
          </h1>

          <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: '4px' }}>
            {canCancel && (
              <>
                <button className="btn btn-outlined btn-sm" onClick={() => {
                  setEditTitle(task.title);
                  setEditDescription(task.description);
                  setEditBudget(task.budget || 0);
                  setEditDate(task.date);
                  setShowEditModal(true);
                }} style={{ flex: 1, borderColor: 'var(--color-primary)', color: 'var(--color-secondary)' }}>
                  {t('task_detail.btn_edit')}
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => setCancelConfirm(true)} style={{ flex: 1 }}>
                  <X size={14} /> {t('new_task.cancel')}
                </button>
              </>
            )}
            {canComplete && (
              <button className="btn btn-primary btn-sm" onClick={() => setCompleteConfirm(true)} style={{ flex: 1 }}>
                <CheckCircle size={14} /> {t('task_detail.btn_complete')}
              </button>
            )}
          </div>
        </div>
        {/* Author Notice Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(98, 0, 238, 0.05) 0%, rgba(98, 0, 238, 0.01) 100%)',
          border: '1px solid rgba(98, 0, 238, 0.12)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-4) var(--space-5)',
          marginBottom: 'var(--space-5)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(98, 0, 238, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary)',
            fontSize: '16px',
            flexShrink: 0
          }}>
            👤
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--color-secondary)' }}>{t('task_detail.posted_by_you')}</h4>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
              {t('task_detail.posted_by_you_desc')}
            </p>
          </div>
        </div>

        <div className="bento-grid">
          {/* Main Column */}
          <div className="bento-col-8 flex flex-col gap-4">
            <SegmentedControl
              options={[
                { value: 'details', label: t('task_detail.tab_details') },
                ...(task.status !== 'cancelled' ? [{
                  value: 'offers',
                  label: t('task_detail.tab_offers', { count: offers.filter(o => o.status !== 'withdrawn').length })
                }] : []),
                ...(task.status === 'completed' && task.assignedTaskerId ? [{
                  value: 'review',
                  label: t('task_detail.tab_review')
                }] : [])
              ]}
              value={activeTab}
              onChange={(val) => setActiveTab(val as 'details' | 'offers' | 'review')}
              style={{ marginBottom: 'var(--space-4)' }}
            />

            {/* Tab content 1: Details */}
            {activeTab === 'details' && (
              <div className="card">
                <div className="card-header">
                  <h2 className="text-headline-sm" style={{ fontSize: '16px', fontWeight: 700 }}>{t('task_detail.title')}</h2>
                </div>
                <div className="card-body">
                  <p style={{ whiteSpace: 'pre-wrap', lineHeight: 'var(--lh-body-lg)', color: 'var(--color-on-surface-variant)', margin: 0 }}>
                    {task.description}
                  </p>

                  {task.mustHaves && task.mustHaves.length > 0 && (
                    <div style={{ marginTop: 'var(--space-5)', borderTop: '1px solid var(--color-surface-container-highest)', paddingTop: 'var(--space-4)' }}>
                      <div className="section-label" style={{ fontSize: '11px', marginBottom: '12px' }}>{t('task_detail.must_haves')}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        {task.mustHaves.map((m, i) => (
                          <div key={i} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-3)',
                            padding: '10px var(--space-4)',
                            background: 'var(--color-surface-container-low)',
                            border: '1px solid var(--color-outline-variant)',
                            borderRadius: 'var(--radius)',
                          }}>
                            <div className="transaction-initials-badge" style={{ width: '24px', height: '24px', fontSize: '10px', flexShrink: 0, background: 'var(--color-primary-container)', borderColor: 'var(--color-outline-variant)', color: 'var(--color-secondary)' }}>
                              ✓
                            </div>
                            <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-on-surface)', fontWeight: 500 }}>
                              {m}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {task.images && task.images.length > 0 && (
                    <div style={{ marginTop: 'var(--space-5)', borderTop: '1px solid var(--color-surface-container-highest)', paddingTop: 'var(--space-4)' }}>
                      <div className="section-label" style={{ fontSize: '11px', marginBottom: '8px' }}>{t('task_detail.ref_images')}</div>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {task.images.map((img, i) => (
                          <div key={i} style={{ borderRadius: 'var(--radius)', overflow: 'hidden', width: '180px', height: '120px', border: '1px solid var(--color-outline-variant)' }}>
                            <img src={img} alt={`Reference ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginTop: 'var(--space-6)', borderTop: '1px solid var(--color-surface-container-highest)', paddingTop: 'var(--space-4)' }}>
                    <div>
                      <div className="section-label" style={{ fontSize: '11px', marginBottom: '4px' }}>{t('task_detail.location')}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-body-sm)' }}>
                        <MapPin size={16} style={{ color: 'var(--color-secondary-mid)' }} />
                        <span>{task.location} · {task.address}</span>
                      </div>
                    </div>
                    <div>
                      <div className="section-label" style={{ fontSize: '11px', marginBottom: '4px' }}>{t('task_detail.schedule')}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-body-sm)' }}>
                        <Calendar size={16} style={{ color: 'var(--color-secondary-mid)' }} />
                        <span>
                          {formatDate(task.date)} {task.time && `at ${task.time}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab content 2: Offers */}
            {activeTab === 'offers' && task.status !== 'cancelled' && (
              <div className="card">
                <div className="card-header" style={{ borderBottom: '1px solid var(--color-outline-variant)', padding: 'var(--space-4) var(--space-5)' }}>
                  <h2 className="text-headline-sm" style={{ fontSize: '16px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    {t('task_detail.offers_received', { count: offers.filter(o => o.status !== 'withdrawn').length })}
                  </h2>
                </div>
                <div className="card-body" style={{ padding: offers.length > 0 ? 0 : 'var(--space-6)' }}>
                  {offers.length > 0 ? (
                    <div className="transaction-rows-container" style={{ border: 'none', borderRadius: 0 }}>
                      {offers.map((offer) => (
                        <OfferCard
                           key={offer.id}
                           offer={offer}
                           onAccept={task.status === 'receiving_offers' ? (id) => {
                             const o = offers.find(x => x.id === id);
                             if (o) setAcceptConfirm(o);
                           } : undefined}
                           onMessage={handleMessageTasker}
                           onViewProfile={setSelectedTaskerId}
                           viewerRole="client"
                           showActions={task.status === 'receiving_offers'}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state" style={{ padding: 'var(--space-8) 0' }}>
                      <div className="empty-state-icon" style={{ fontSize: '32px', marginBottom: '12px' }}>👥</div>
                      <h3 className="text-headline-sm" style={{ marginBottom: '4px', fontSize: '15px', fontWeight: 700 }}>{t('task_detail.no_offers')}</h3>
                      <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '13px', margin: 0 }}>
                        {t('task_detail.no_offers_desc')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab content 3: Review */}
            {activeTab === 'review' && task.status === 'completed' && task.assignedTaskerId && (
              <div className="card">
                <div className="card-header">
                  <h2 className="text-headline-sm" style={{ fontSize: '16px', fontWeight: 700 }}>{t('task_detail.your_review')}</h2>
                </div>
                <div className="card-body">
                  {existingReview ? (
                    <div>
                      <div style={{ display: 'flex', gap: '2px', marginBottom: 'var(--space-3)' }}>
                        {[1, 2, 3, 4, 5].map(s => (
                          <span key={s} className={`star ${s <= existingReview.rating ? '' : 'star-empty'}`}>★</span>
                        ))}
                      </div>
                      <p style={{ color: 'var(--color-on-surface-variant)', fontStyle: 'italic', margin: 0 }}>
                        "{existingReview.comment}"
                      </p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                      <p style={{ color: 'var(--color-on-surface-variant)', margin: 0 }}>
                        {t('task_detail.leave_review_desc')}
                      </p>
                      <button className="btn btn-primary" onClick={() => setShowReviewModal(true)} style={{ width: 'fit-content', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <Star size={16} /> {t('task_detail.btn_leave_review')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar Column */}
          <div className="bento-col-4 flex flex-col gap-6">
            {/* GiroKonto styled Budget Card */}
            <div className="card" style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '180px', borderRadius: '12px', border: '1px solid var(--color-outline-variant)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--color-surface-container-low)',
                  border: '1.5px solid var(--color-outline-variant)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-secondary)'
                }}>
                  <Wallet size={18} />
                </div>
                <span className="text-label" style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('task_detail.contract_spec')}</span>
              </div>
              <div>
                <div className="section-label" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-on-surface-variant)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('dashboard.th_budget')}</div>
                {task.budgetType === 'fixed' && task.budget ? (
                  <div style={{ fontFamily: 'var(--font-headline)', fontSize: '38px', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '-0.03em', lineHeight: 1.0 }}>
                    {formatCurrency(task.budget)}
                  </div>
                ) : task.budgetType === 'hourly' && task.budget ? (
                  <div style={{ fontFamily: 'var(--font-headline)', fontSize: '38px', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '-0.03em', lineHeight: 1.0 }}>
                    {formatCurrency(task.budget)}<span style={{ fontSize: '18px', fontWeight: 500, color: 'var(--color-on-surface-variant)' }}>/hr</span>
                  </div>
                ) : (
                  <div style={{ fontFamily: 'var(--font-headline)', fontSize: '28px', fontWeight: 700, color: 'var(--color-on-surface-variant)', letterSpacing: '-0.02em', lineHeight: 1.0 }}>
                    {t('new_task.open_for_offers')}
                  </div>
                )}
              </div>
              <div style={{ borderTop: '1px solid var(--color-outline-variant)', paddingTop: '12px', marginTop: '12px', fontSize: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)', fontWeight: 500 }}>
                {task.budgetType === 'fixed' ? t('new_task.contract_fixed') : task.budgetType === 'hourly' ? t('new_task.contract_hourly') : t('new_task.contract_open')}
              </div>
            </div>


            {/* Payment Info */}
            {acceptedOffer && (
              <div className="card">
                <div className="card-header">
                  <h3 className="text-headline-sm" style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Wallet size={16} style={{ color: 'var(--color-secondary-mid)' }} />
                    {t('task_detail.payment_details')}
                  </h3>
                </div>
                <div className="card-body" style={{ padding: 'var(--space-4)' }}>
                  {state.walletTransactions.filter(w => w.taskId === task.id).map(tx => (
                    <div key={tx.id} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-body-sm)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--color-on-surface-variant)' }}>{t('task_detail.funded_amount')}</span>
                        <span style={{ fontWeight: 700 }}>{formatCurrency(tx.amount)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--color-on-surface-variant)' }}>{t('task_detail.contract_status')}</span>
                        <span className={`badge badge-${tx.status}`}>
                          {tx.status === 'reserved' ? t('dashboard.label_escrow_hold') : tx.status === 'released' ? t('dashboard.tx_released') : t('dashboard.tx_refunded')}
                        </span>
                      </div>
                    </div>
                  ))}
                  {state.walletTransactions.filter(w => w.taskId === task.id).length === 0 && (
                    <div style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--text-body-sm)', textAlign: 'center' }}>
                      {t('dashboard.empty_payments')}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Assigned Provider Profile */}
            {assignedUser && (
              <div className="card">
                <div className="card-header">
                  <h3 className="text-headline-sm" style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={16} style={{ color: 'var(--color-secondary-mid)' }} />
                    {t('task_detail.assigned_tasker')}
                  </h3>
                </div>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', padding: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <Avatar name={assignedUser.name} avatarUrl={assignedUser.avatarUrl} size="lg" />
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--color-on-surface)' }}>{assignedUser.name}</div>
                      <Link to={`/profile/${assignedUser.id}`} style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-secondary)', fontWeight: 600, display: 'inline-block', marginTop: '2px' }}>
                        {t('task_detail.view_profile')}
                      </Link>
                    </div>
                  </div>
                  {acceptedOffer && (
                    <div style={{ padding: 'var(--space-3)', background: 'var(--color-surface-container-low)', borderRadius: 'var(--radius)', fontSize: 'var(--text-body-sm)', border: '1px solid var(--color-outline-variant)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ color: 'var(--color-on-surface-variant)' }}>{t('task_detail.agreed_budget')}</span>
                        <strong>{formatCurrency(acceptedOffer.price)}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--color-on-surface-variant)' }}>{t('task_detail.estimated_effort')}</span>
                        <strong>~{acceptedOffer.estimatedHours} {t('task_detail.hours')}</strong>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Posted by card */}
            {currentUser && (
              <div className="card">
                <div className="card-header">
                  <h3 className="text-headline-sm" style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={16} style={{ color: 'var(--color-secondary-mid)' }} />
                    {t('task_detail.posted_by_you')}
                  </h3>
                </div>
                <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-4)' }}>
                  <Avatar name={currentUser.name} avatarUrl={currentUser.avatarUrl} size="md" />
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--color-on-surface)' }}>
                      {currentUser.name} <span style={{ color: 'var(--color-primary)', fontWeight: 500, fontSize: '11px' }}>({t('messages.you')})</span>
                    </div>
                    <Link to={`/profile/${currentUser.id}`} style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-secondary)', fontWeight: 600, display: 'inline-block', marginTop: '2px' }}>
                      {t('task_detail.view_profile')}
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>



      {/* Confirm Modals */}
      <ConfirmModal
        isOpen={!!acceptConfirm}
        onClose={() => setAcceptConfirm(null)}
        onConfirm={handleAcceptOffer}
        title={t('task_detail.confirm_accept_title')}
        message={t('task_detail.confirm_accept_msg', { price: acceptConfirm?.price ? formatCurrency(acceptConfirm.price) : '' })}
        confirmLabel={t('task_detail.confirm_accept_btn')}
        isLoading={isActionLoading}
      />
      <ConfirmModal
        isOpen={cancelConfirm}
        onClose={() => setCancelConfirm(false)}
        onConfirm={handleCancelTask}
        title={t('task_detail.confirm_cancel_title')}
        message={t('task_detail.confirm_cancel_msg')}
        confirmLabel={t('task_detail.confirm_cancel_btn')}
        confirmVariant="danger"
        isLoading={isActionLoading}
      />
      <ConfirmModal
        isOpen={completeConfirm}
        onClose={() => setCompleteConfirm(false)}
        onConfirm={handleMarkComplete}
        title={t('task_detail.confirm_complete_title')}
        message={t('task_detail.confirm_complete_msg')}
        confirmLabel={t('task_detail.confirm_complete_btn')}
        isLoading={isActionLoading}
      />

      {/* Review Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title={t('task_detail.modal_review_title')}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setShowReviewModal(false)}>{t('task_detail.modal_review_skip')}</button>
            <button className="btn btn-primary" onClick={handleSubmitReview} disabled={isActionLoading}>
              {isActionLoading && <span className="spinner" style={{ width: 16, height: 16 }} />}
              {t('task_detail.modal_review_submit')}
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ fontSize: 'var(--text-body-sm)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>{t('task_detail.modal_review_experience')}</div>
            <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setReviewRating(s)}
                  style={{ fontSize: '32px', background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--color-primary-container)' }}
                >
                  {s <= reviewRating ? '★' : '☆'}
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label required">{t('task_detail.modal_review_feedback')}</label>
            <textarea
              className="form-textarea"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder={t('task_detail.modal_review_placeholder')}
              rows={4}
              required
            />
          </div>
        </div>
      </Modal>

      {/* Profile & Reviews Drawer */}
      <TaskerProfileDrawer 
        userId={selectedTaskerId}
        onClose={() => setSelectedTaskerId(null)}
      />

      {/* Edit Task Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={t('task_detail.modal_edit_title')}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setShowEditModal(false)}>{t('new_task.cancel')}</button>
            <button className="btn btn-primary" onClick={handleSaveEdit} disabled={isActionLoading}>
              {isActionLoading && <span className="spinner" style={{ width: 16, height: 16 }} />}
              {t('task_detail.modal_edit_save')}
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="form-group">
            <label className="form-label required">{t('new_task.task_title')}</label>
            <input
              type="text"
              className="form-input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder={t('task_detail.modal_edit_placeholder_title')}
              required
              style={{
                width: '100%',
                padding: '10px 0',
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
          <div className="form-group">
            <label className="form-label required">{t('new_task.description')}</label>
            <textarea
              className="form-textarea"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder={t('task_detail.modal_edit_placeholder_desc')}
              rows={5}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1.5px solid var(--color-outline-variant)',
                borderRadius: 'var(--radius)',
                fontSize: 'var(--text-body-sm)',
                outline: 'none',
                background: 'transparent',
                color: 'var(--color-on-surface)',
                fontFamily: 'inherit'
              }}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('task_detail.modal_edit_label_date')}</label>
            <input
              type="date"
              className="form-input"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 0',
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
          {task.budgetType !== 'open_to_offers' && (
            <div className="form-group">
              <label className="form-label required">{t('task_detail.modal_edit_label_budget')}</label>
              <input
                type="number"
                className="form-input"
                value={editBudget}
                onChange={(e) => setEditBudget(Number(e.target.value))}
                min={5}
                required
                style={{
                  width: '100%',
                  padding: '10px 0',
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
          )}
        </div>
      </Modal>
    </div>
  );
}
