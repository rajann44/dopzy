import { useState, useEffect } from 'react';
import { Star, Clock, MessageSquare } from 'lucide-react';
import type { Offer, User, TaskerProfile } from '../../types';
import { StatusBadge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { formatCurrency, formatRelativeTime } from '../../utils/formatters';
import { profileService } from '../../services/profileService';

interface OfferCardProps {
  offer: Offer;
  onAccept?: (offerId: string) => void;
  onWithdraw?: (offerId: string) => void;
  onMessage?: (taskerId: string) => void;
  onViewProfile?: (taskerId: string) => void;
  viewerRole: 'client' | 'tasker' | 'admin';
  showActions?: boolean;
  statusOverride?: string;
}

export function OfferCard({ offer, onAccept, onWithdraw, onMessage, onViewProfile, viewerRole, showActions = true, statusOverride }: OfferCardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<TaskerProfile | null>(null);

  useEffect(() => {
    profileService.getUserById(offer.taskerId).then(setUser);
    profileService.getTaskerProfile(offer.taskerId).then(setProfile);
  }, [offer.taskerId]);

  return (
    <div className="transaction-row-item offer-card">
      {/* 1. Profile Column (Avatar + Info) */}
      <div 
        className="offer-profile-col"
        onClick={() => onViewProfile && onViewProfile(offer.taskerId)}
        style={{ cursor: onViewProfile ? 'pointer' : 'default' }}
      >
        <div className="offer-avatar-wrapper">
          <Avatar name={user?.name ?? '?'} avatarUrl={user?.avatarUrl} size="md" />
          <span className="status-dot"></span>
        </div>

        <div className="offer-user-info">
          <span className="offer-user-name">
            {user?.name ?? 'Loading...'}
          </span>
          {profile && (
            <div className="offer-rating-row">
              <span className="offer-rating-badge">
                <Star size={11} fill="var(--color-primary-container)" color="var(--color-primary)" />
                {profile.rating}
              </span>
              <span className="offer-jobs-count">
                ({profile.completedJobs} jobs done)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Bid Proposal Message Column */}
      <div className="offer-message-col">
        <p className="offer-message-text">
          "{offer.message}"
        </p>
      </div>

      {/* 3. Timeline / Effort Column */}
      <div className="offer-timeline-col">
        <span className="offer-duration">
          <Clock size={13} /> ~{offer.estimatedHours} hours
        </span>
        <span className="offer-timeago">
          {formatRelativeTime(offer.createdAt)}
        </span>
      </div>

      {/* 4. Price Column */}
      <div className="offer-price-col">
        <div className="transaction-amount-green">
          {formatCurrency(offer.price)}
        </div>
        <div className="offer-price-label">
          Bid Price
        </div>
      </div>

      {/* 5. Actions Column */}
      <div className="offer-actions-col">
        {showActions && offer.status === 'pending' ? (
          <div className="offer-actions-btn-group">
            {viewerRole === 'client' && onMessage && (
              <button
                className="btn btn-outlined btn-sm btn-icon-round"
                onClick={() => onMessage(offer.taskerId)}
                title="Message Tasker"
              >
                <MessageSquare size={14} />
              </button>
            )}
            {viewerRole === 'client' && onAccept && (
              <button
                className="btn btn-primary btn-sm btn-action-accept"
                onClick={() => onAccept(offer.id)}
              >
                Accept
              </button>
            )}
            {viewerRole === 'tasker' && onWithdraw && (
              <button
                className="btn btn-danger btn-sm btn-action-withdraw"
                onClick={() => onWithdraw(offer.id)}
              >
                Withdraw
              </button>
            )}
          </div>
        ) : (
          <div className="offer-actions-btn-group">
            {viewerRole === 'client' && onMessage && (
              <button
                className="btn btn-outlined btn-sm btn-icon-round"
                onClick={() => onMessage(offer.taskerId)}
                title="Message Tasker"
              >
                <MessageSquare size={14} />
              </button>
            )}
            <StatusBadge status={statusOverride ?? offer.status} />
          </div>
        )}
      </div>
    </div>
  );
}
