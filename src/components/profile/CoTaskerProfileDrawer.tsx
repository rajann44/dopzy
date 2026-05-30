import { useEffect, useState } from 'react';
import { X, Star, Calendar, MapPin, ShieldCheck, Award, Clock, DollarSign, Globe } from 'lucide-react';
import type { User, CoTaskerProfile, Review } from '../../types';
import { Avatar } from '../ui/Avatar';
import { profileService } from '../../services/profileService';
import { useAppContext } from '../../context/AppContext';
import { formatDate } from '../../utils/formatters';

interface CoTaskerProfileDrawerProps {
  userId: string | null;
  onClose: () => void;
}

export function CoTaskerProfileDrawer({ userId, onClose }: CoTaskerProfileDrawerProps) {
  const { state } = useAppContext();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CoTaskerProfile | null>(null);
  const [reviews, setReviews] = useState<(Review & { clientName?: string; clientAvatar?: string })[]>([]);
  const [activeTab, setActiveTab] = useState<'about' | 'reviews'>('about');

  useEffect(() => {
    if (!userId) return;
    
    // Load profile
    profileService.getUserById(userId).then(setUser);
    profileService.getCoTaskerProfile(userId).then(setProfile);
    
    // Get all reviews for this tasker
    const taskerReviews = state.reviews
      .filter((r) => r.toUserId === userId)
      .map((r) => {
        return {
          ...r,
          clientName: r.fromUserId === 'user-1' ? 'Sarah Jenkins' : r.fromUserId === 'user-2' ? 'James Smith' : 'Verified Client',
          clientAvatar: undefined
        };
      });
    setReviews(taskerReviews);
  }, [userId, state.reviews]);

  if (!userId || !user || !profile) return null;

  // Calculate rating statistics
  const totalReviewsCount = reviews.length;
  const ratingDistribution = [0, 0, 0, 0, 0]; // Index 0 is 1 star, Index 4 is 5 star
  reviews.forEach(r => {
    const starIdx = Math.max(1, Math.min(5, r.rating)) - 1;
    ratingDistribution[starIdx]++;
  });

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end',
      background: 'rgba(0, 45, 46, 0.4)',
      backdropFilter: 'blur(6px)',
      animation: 'fadeIn var(--transition-medium) forwards'
    }}>
      {/* Click Outside Overlay to close */}
      <div 
        onClick={onClose} 
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, cursor: 'pointer' }} 
      />

      {/* Drawer Container */}
      <div style={{
        position: 'relative',
        width: '500px',
        maxWidth: '100%',
        height: '100%',
        background: 'var(--color-surface-white)',
        borderLeft: '1px solid var(--color-outline-variant)',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideInRight var(--transition-medium) forwards'
      }}>
        {/* Header */}
        <div style={{
          padding: 'var(--space-6) var(--space-6) var(--space-4) var(--space-6)',
          borderBottom: '1px solid var(--color-outline-variant)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          background: 'var(--color-surface-container-lowest)'
        }}>
          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
            <Avatar name={user.name} avatarUrl={user.avatarUrl} size="lg" />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--color-secondary)' }}>
                  {user.name}
                </h2>
                {profile.isVerified && (
                  <span title="Verified Co-Tasker" style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <ShieldCheck size={18} style={{ color: 'var(--color-primary)' }} />
                  </span>
                )}
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)' }}>
                Member since {profile.memberSince}
              </p>
              
              {/* Badges */}
              <div style={{ display: 'flex', gap: '4px', marginTop: '8px', flexWrap: 'wrap' }}>
                {profile.isTopRated && (
                  <span className="badge badge-gold" style={{ fontSize: '9px', padding: '2px 8px' }}>
                    <Award size={10} style={{ marginRight: 3 }} /> Top Rated
                  </span>
                )}
                {profile.isFastResponder && (
                  <span className="badge badge-secondary" style={{ fontSize: '9px', padding: '2px 8px' }}>
                    <Clock size={10} style={{ marginRight: 3 }} /> Fast Responder
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="btn btn-ghost btn-icon"
            style={{ color: 'var(--color-on-surface-variant)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--color-outline-variant)',
          background: 'var(--color-surface-container-lowest)',
          padding: '0 var(--space-6)'
        }}>
          <button
            onClick={() => setActiveTab('about')}
            style={{
              padding: '14px var(--space-4)',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'about' ? '3px solid var(--color-primary)' : '3px solid transparent',
              color: activeTab === 'about' ? 'var(--color-secondary)' : 'var(--color-on-surface-variant)',
              fontWeight: 600,
              fontSize: 'var(--text-body-sm)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            About Co-Tasker
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            style={{
              padding: '14px var(--space-4)',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'reviews' ? '3px solid var(--color-primary)' : '3px solid transparent',
              color: activeTab === 'reviews' ? 'var(--color-secondary)' : 'var(--color-on-surface-variant)',
              fontWeight: 600,
              fontSize: 'var(--text-body-sm)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            Reviews ({reviews.length})
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-6)' }}>
          {activeTab === 'about' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              
              {/* Bio Section */}
              <div>
                <h3 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-secondary-mid)', margin: '0 0 8px 0' }}>Bio</h3>
                <p style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-wrap' }}>
                  {profile.bio || "No biography provided."}
                </p>
              </div>

              {/* Quick Info Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                padding: 'var(--space-4)',
                background: 'var(--color-surface-container-low)',
                border: '1px solid var(--color-outline-variant)',
                borderRadius: 'var(--radius)'
              }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <DollarSign size={16} style={{ color: 'var(--color-primary)' }} />
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--color-on-surface-variant)' }}>HOURLY RATE</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-secondary)' }}>
                      {profile.hourlyRate ? `€${profile.hourlyRate}/hr` : 'Flexible'}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <MapPin size={16} style={{ color: 'var(--color-primary)' }} />
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--color-on-surface-variant)' }}>LOCATION</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-secondary)' }}>{profile.location}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Clock size={16} style={{ color: 'var(--color-primary)' }} />
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--color-on-surface-variant)' }}>RESPONSE TIME</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-secondary)' }}>{profile.responseTime}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Globe size={16} style={{ color: 'var(--color-primary)' }} />
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--color-on-surface-variant)' }}>LANGUAGES</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-secondary)' }}>
                      {profile.languages?.join(', ') || 'German, English'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-secondary-mid)', margin: '0 0 10px 0' }}>Skills</h3>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {profile.skills.map((skill, index) => (
                    <span key={index} className="badge badge-secondary" style={{ fontSize: '11px', padding: '4px 10px' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <h3 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-secondary-mid)', margin: '0 0 8px 0' }}>Availability</h3>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)' }}>
                  <Calendar size={16} style={{ color: 'var(--color-primary)' }} />
                  <span>{profile.availability}</span>
                </div>
              </div>

              {/* Logistics & Tools */}
              {(profile.transport || (profile.qualifications && profile.qualifications.length > 0)) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--color-outline-variant)', paddingTop: 'var(--space-4)' }}>
                  {profile.transport && (
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--color-on-surface-variant)', textTransform: 'uppercase' }}>Transportation</div>
                      <div style={{ fontSize: 'var(--text-body-sm)', fontWeight: 500, color: 'var(--color-secondary)', marginTop: '2px' }}>{profile.transport}</div>
                    </div>
                  )}
                  {profile.qualifications && profile.qualifications.length > 0 && (
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--color-on-surface-variant)', textTransform: 'uppercase' }}>Qualifications & Insurances</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                        {profile.qualifications.map((q, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-body-sm)' }}>
                            <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>✓</span>
                            <span>{q}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              
              {/* Ratings Summary Header */}
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-outline-variant)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-secondary)', lineHeight: 1 }}>{profile.rating.toFixed(1)}</div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', margin: '6px 0 4px 0' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star 
                        key={s} 
                        size={12} 
                        fill={s <= Math.round(profile.rating) ? 'var(--color-primary-container)' : 'none'} 
                        color="var(--color-primary)" 
                      />
                    ))}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--color-on-surface-variant)', textTransform: 'uppercase' }}>
                    {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                  </div>
                </div>

                {/* Rating bars */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = ratingDistribution[stars - 1];
                    const percent = totalReviewsCount > 0 ? (count / totalReviewsCount) * 100 : 0;
                    return (
                      <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
                        <span style={{ width: '40px', textAlign: 'right', color: 'var(--color-on-surface-variant)' }}>{stars} star</span>
                        <div style={{ flex: 1, height: '6px', background: 'var(--color-surface-container-high)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${percent}%`, height: '100%', background: 'var(--color-primary)' }} />
                        </div>
                        <span style={{ width: '24px', color: 'var(--color-on-surface-variant)' }}>{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review Comments list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {reviews.length > 0 ? (
                  reviews.map((r) => (
                    <div 
                      key={r.id}
                      style={{
                        padding: 'var(--space-4)',
                        border: '1px solid var(--color-outline-variant)',
                        borderRadius: 'var(--radius)',
                        background: 'var(--color-surface-container-lowest)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--color-primary-container)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>
                            {r.clientName ? r.clientName.split(' ').map(n => n[0]).join('') : '?'}
                          </div>
                          <div>
                            <div style={{ fontSize: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-secondary)' }}>
                              {r.clientName}
                            </div>
                            <div style={{ fontSize: '9px', color: 'var(--color-on-surface-variant)' }}>
                              {formatDate(r.createdAt.split('T')[0])}
                            </div>
                          </div>
                        </div>

                        {/* Stars */}
                        <div style={{ display: 'flex', gap: '1px' }}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star 
                              key={s} 
                              size={10} 
                              fill={s <= r.rating ? 'var(--color-primary-container)' : 'none'} 
                              color="var(--color-primary)" 
                            />
                          ))}
                        </div>
                      </div>
                      <p style={{ margin: 0, fontSize: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)', lineHeight: '1.5', fontStyle: 'italic' }}>
                        "{r.comment}"
                      </p>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-on-surface-variant)' }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>💬</div>
                    <div style={{ fontSize: 'var(--text-body-sm)' }}>No reviews received yet.</div>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
