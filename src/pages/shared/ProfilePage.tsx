import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Clock, CheckCircle, Calendar, Briefcase, Tag } from 'lucide-react';
import { profileService } from '../../services/profileService';
import { useAppContext } from '../../context/AppContext';
import { Avatar } from '../../components/ui/Avatar';
import { ProfileBadge } from '../../components/ui/Badge';
import { formatCurrency, formatDate, formatRelativeTime } from '../../utils/formatters';
import type { User, CoTaskerProfile, ClientProfile } from '../../types';

export function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useAppContext();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [coTaskerProfile, setCoTaskerProfile] = useState<CoTaskerProfile | null>(null);
  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setIsLoading(true);
      const [u, co, cl] = await Promise.all([
        profileService.getUserById(id),
        profileService.getCoTaskerProfile(id),
        profileService.getClientProfile(id),
      ]);
      setUser(u);
      setCoTaskerProfile(co);
      setClientProfile(cl);
      setIsLoading(false);
    };
    load();
  }, [id]);

  const reviews = state.reviews.filter((r) => r.toUserId === id);
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-12)' }}>
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="empty-state">
        <h3>User not found</h3>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="page-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <button onClick={() => navigate(-1)} className="btn btn-ghost btn-icon">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-headline-md" style={{ margin: 0, fontWeight: 700 }}>{user.name}</h1>
            <p style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--text-body-sm)', margin: '4px 0 0 0', textTransform: 'capitalize' }}>
              {user.role === 'cotasker' ? 'Service Provider' : 'Client Profile'}
            </p>
          </div>
        </div>
      </div>

      <div className="page-inner">
        <div className="bento-grid">
          {/* Left Column */}
          <div className="bento-col-8 flex flex-col gap-6">
            {/* Main profile card */}
            <div className="card">
              <div style={{ background: 'var(--color-secondary)', height: '120px', position: 'relative' }}>
                {/* Visual decoration */}
                <div style={{ position: 'absolute', right: 20, bottom: 20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,215,0,0.08)' }} />
              </div>
              <div className="card-body" style={{ position: 'relative', paddingTop: 0, paddingBottom: 'var(--space-6)' }}>
                <div style={{ marginTop: -48, marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                  <Avatar name={user.name} avatarUrl={user.avatarUrl} size="xl"
                    style={{ border: '4px solid var(--color-surface-white)', boxShadow: 'var(--shadow-sm)' } as any} />
                  
                  {avgRating && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '24px', color: 'var(--color-secondary)' }}>
                      <Star size={22} fill="var(--color-primary-container)" color="var(--color-primary)" />
                      <span>{avgRating}</span>
                      <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)', fontWeight: 400, fontFamily: 'var(--font-body)', marginLeft: '2px' }}>
                        ({reviews.length} reviews)
                      </span>
                    </div>
                  )}
                </div>

                {coTaskerProfile && (
                  <div className="flex flex-col gap-4">
                    <p style={{ color: 'var(--color-on-surface-variant)', lineHeight: '1.6', margin: 0, fontSize: 'var(--text-body-md)' }}>
                      {coTaskerProfile.bio}
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                      {coTaskerProfile.isVerified && <ProfileBadge type="verified" />}
                      {coTaskerProfile.isTopRated && <ProfileBadge type="top-rated" />}
                      {coTaskerProfile.isFastResponder && <ProfileBadge type="fast" />}
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap', fontSize: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)', borderTop: '1px solid var(--color-surface-container-highest)', paddingTop: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={16} style={{ color: 'var(--color-secondary-mid)' }} />
                        {coTaskerProfile.location}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={16} style={{ color: 'var(--color-secondary-mid)' }} />
                        Responds {coTaskerProfile.responseTime}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Briefcase size={16} style={{ color: 'var(--color-secondary-mid)' }} />
                        {coTaskerProfile.completedJobs} jobs completed
                      </span>
                    </div>
                  </div>
                )}

                {clientProfile && user.role === 'client' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <p style={{ color: 'var(--color-on-surface-variant)', lineHeight: '1.6', margin: 0 }}>
                      {clientProfile.bio || 'No bio provided.'}
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap', fontSize: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)', borderTop: '1px solid var(--color-surface-container-highest)', paddingTop: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={16} style={{ color: 'var(--color-secondary-mid)' }} />
                        {clientProfile.location}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={16} style={{ color: 'var(--color-secondary-mid)' }} />
                        Member since {formatDate(clientProfile.createdAt)}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle size={16} style={{ color: 'var(--color-secondary-mid)' }} />
                        {clientProfile.tasksPosted} tasks posted
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <div className="section-label">Reviews ({reviews.length})</div>
              {reviews.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {reviews.map((review) => (
                    <div key={review.id} className="card">
                      <div className="card-body" style={{ padding: 'var(--space-4)' }}>
                        <div style={{ display: 'flex', gap: '2px', marginBottom: 'var(--space-2)' }}>
                          {[1, 2, 3, 4, 5].map(s => (
                            <span key={s} className={`star ${s <= review.rating ? '' : 'star-empty'}`}>★</span>
                          ))}
                        </div>
                        <p style={{ color: 'var(--color-on-surface-variant)', fontStyle: 'italic', margin: 0, fontSize: 'var(--text-body-sm)' }}>
                          "{review.comment}"
                        </p>
                        <div style={{ fontSize: 'var(--text-label-md)', color: 'var(--color-on-surface-variant)', marginTop: 'var(--space-2)' }}>
                          {formatRelativeTime(review.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card">
                  <div className="empty-state">
                    <h3 className="text-headline-sm" style={{ marginBottom: 'var(--space-2)' }}>No reviews yet</h3>
                    <p>Reviews will appear here after completing tasks on the platform.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="bento-col-4 flex flex-col gap-6">
            {coTaskerProfile && (
              <>
                {/* Stats Card */}
                <div className="card">
                  <div className="card-header">
                    <h3 className="text-headline-sm" style={{ fontWeight: 700 }}>Performance</h3>
                  </div>
                  <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', padding: 'var(--space-4)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
                      <div className="stat-card" style={{ padding: 'var(--space-3)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div className="stat-value" style={{ fontSize: '20px' }}>{coTaskerProfile.rating}</div>
                        <div className="stat-label" style={{ fontSize: '10px' }}>Rating</div>
                      </div>
                      <div className="stat-card" style={{ padding: 'var(--space-3)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div className="stat-value" style={{ fontSize: '20px' }}>{coTaskerProfile.completedJobs}</div>
                        <div className="stat-label" style={{ fontSize: '10px' }}>Jobs Done</div>
                      </div>
                    </div>

                    {coTaskerProfile.hourlyRate && (
                      <div style={{ padding: 'var(--space-3)', background: 'var(--color-surface-container-low)', borderRadius: 'var(--radius)', border: '1px solid var(--color-outline-variant)' }}>
                        <div className="section-label" style={{ fontSize: '10px', marginBottom: '4px' }}>Hourly Rate</div>
                        <div style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '22px', color: 'var(--color-secondary)' }}>
                          {formatCurrency(coTaskerProfile.hourlyRate)}/hr
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Skills/Categories */}
                <div className="card">
                  <div className="card-header">
                    <h3 className="text-headline-sm" style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Tag size={16} style={{ color: 'var(--color-secondary-mid)' }} />
                      Categories
                    </h3>
                  </div>
                  <div className="card-body" style={{ padding: 'var(--space-4)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    {coTaskerProfile.categories.map((cat) => (
                      <span key={cat} className="chip chip-active" style={{ fontSize: '10px' }}>{cat}</span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {clientProfile && user.role === 'client' && (
              <div className="card">
                <div className="card-header">
                  <h3 className="text-headline-sm" style={{ fontWeight: 700 }}>Activity</h3>
                </div>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', padding: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-body-sm)' }}>
                    <span style={{ color: 'var(--color-on-surface-variant)' }}>Tasks Posted</span>
                    <strong style={{ color: 'var(--color-secondary)' }}>{clientProfile.tasksPosted}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-body-sm)' }}>
                    <span style={{ color: 'var(--color-on-surface-variant)' }}>Completed Tasks</span>
                    <strong style={{ color: 'var(--color-secondary)' }}>{clientProfile.completedTasks}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
