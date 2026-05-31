import { ShimmerText } from './ShimmerText';

/**
 * PageSkeleton — a branded shimmer skeleton used as Suspense fallback
 * for lazy-loaded pages and the auth loading state.
 */
interface PageSkeletonProps {
  showSidebar?: boolean;
}

export function PageSkeleton({ showSidebar = false }: PageSkeletonProps) {
  const content = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      width: '100%',
      animation: 'fadeIn 200ms ease',
    }}>
      {/* Topbar skeleton matching actual .page-topbar exactly */}
      <div style={{
        height: '73px',
        background: '#ffffff',
        borderBottom: '1px solid var(--color-outline-variant, #d0c6ab)',
        padding: '0 var(--space-8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        width: '100%',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div className="skeleton-line" style={{ width: 180, height: 18, borderRadius: 4 }} />
          <div className="skeleton-line" style={{ width: 120, height: 12, borderRadius: 3 }} />
        </div>
        <div className="skeleton-line" style={{ width: 100, height: 36, borderRadius: 9999 }} />
      </div>

      {/* Page Inner Shimmer content */}
      <div style={{
        padding: 'var(--space-8)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}>
        {/* Stats row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 'var(--space-4)',
        }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton-card" style={{ height: 90, borderRadius: 8 }} />
          ))}
        </div>

        {/* Content cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 'var(--space-4)',
        }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="skeleton-card" style={{ height: 180, borderRadius: 8 }} />
          ))}
        </div>
      </div>

      <style>{`
        .skeleton-line {
          background: var(--color-surface-container-high, #eae8e6);
          position: relative;
          overflow: hidden;
        }
        .skeleton-line::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%);
          animation: skeletonShimmer 1.5s ease-in-out infinite;
        }
        .skeleton-card {
          background: var(--color-surface-white, #ffffff);
          border: 1px solid var(--color-outline-variant, #d0c6ab);
          position: relative;
          overflow: hidden;
        }
        .skeleton-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%);
          animation: skeletonShimmer 1.5s ease-in-out infinite;
        }
        @keyframes skeletonShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );

  if (showSidebar) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-surface)' }}>
        {/* Exact HTML/CSS replication of Sidebar design to avoid dependency loading */}
        <aside style={{
          width: 'var(--sidebar-width)',
          background: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--sidebar-border)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          flexShrink: 0,
        }} className="skeleton-sidebar-desktop">
          {/* Logo Section */}
          <div style={{
            padding: '0 20px',
            height: '88px',
            borderBottom: '1px solid var(--sidebar-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexShrink: 0,
          }}>
            <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 'var(--radius-lg)', flexShrink: 0 }}>
              <rect width="100" height="100" rx="16" fill="#004352"/>
              <path d="M30 50L45 65L75 35" stroke="#FFE600" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M25 25L40 25" stroke="#FFE600" strokeWidth="4" strokeLinecap="round"/>
              <path d="M25 75L40 75" stroke="#FFE600" strokeWidth="4" strokeLinecap="round"/>
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
              <div style={{
                fontFamily: 'var(--font-headline)',
                fontWeight: 700, fontSize: '18px',
                color: '#ffffff',
                lineHeight: '1.2',
                letterSpacing: '-0.01em',
              }}>
                Dopzy
              </div>
              <div style={{
                fontSize: '11px',
                color: 'var(--sidebar-text-muted)',
                marginTop: '3px',
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
                lineHeight: '1.2',
              }}>
                One Tap, Task Done
              </div>
            </div>
          </div>

          {/* User profile skeleton block */}
          <div style={{
            padding: '14px 20px',
            borderBottom: '1px solid var(--sidebar-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexShrink: 0,
          }}>
            <div style={{
              width: 32, height: 32,
              borderRadius: '50%',
              border: '2px solid rgba(255,215,0,0.35)',
              background: 'rgba(255,255,255,0.1)',
              padding: 2,
              flexShrink: 0,
            }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
              <div className="skeleton-line" style={{ width: 80, height: 12, borderRadius: 4, background: 'rgba(255,255,255,0.15)' }} />
              <div className="skeleton-line" style={{ width: 50, height: 10, borderRadius: 3, background: 'rgba(255,255,255,0.08)' }} />
            </div>
          </div>

          {/* Navigation links skeleton */}
          <div style={{ flex: 1, padding: '12px 12px' }}>
            <div style={{
              fontSize: '10px', fontWeight: 600,
              color: 'var(--sidebar-label-color)',
              textTransform: 'uppercase', letterSpacing: '0.10em',
              padding: '8px 10px 6px',
            }}>
              Workspace
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'var(--sidebar-active-bg)', borderLeft: '3px solid var(--sidebar-active-border)', borderRadius: 4, marginBottom: 2 }}>
              <div style={{ width: 16, height: 16, borderRadius: 4, background: 'rgba(255,255,255,0.2)' }} />
              <div style={{ width: 100, height: 12, borderRadius: 4, background: '#FFD700', opacity: 0.85 }} />
            </div>
            {[85, 75].map((w, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 4, marginBottom: 2 }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, background: 'rgba(255,255,255,0.15)' }} />
                <div style={{ width: w, height: 12, borderRadius: 4, background: 'rgba(255,255,255,0.1)' }} />
              </div>
            ))}

            <div style={{ height: 1, background: 'var(--sidebar-border)', margin: '10px 4px' }} />

            <div style={{
              fontSize: '10px', fontWeight: 600,
              color: 'var(--sidebar-label-color)',
              textTransform: 'uppercase', letterSpacing: '0.10em',
              padding: '8px 10px 6px',
            }}>
              Account
            </div>
            {[80, 110, 90].map((w, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 4, marginBottom: 2 }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, background: 'rgba(255,255,255,0.15)' }} />
                <div style={{ width: w, height: 12, borderRadius: 4, background: 'rgba(255,255,255,0.1)' }} />
              </div>
            ))}
          </div>
        </aside>
        {content}
        <style>{`
          @media (max-width: 767px) {
            .skeleton-sidebar-desktop { display: none !important; }
          }
        `}</style>
      </div>
    );
  }

  return content;
}

/**
 * Compact loading spinner used for smaller inline loading states.
 */
export function PageSpinner() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'var(--color-surface)',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        animation: 'fadeIn 300ms ease',
      }}>
        <div className="spinner" style={{ width: 36, height: 36 }} />
        <ShimmerText
          text="Loading..."
          style={{
            fontSize: 'var(--text-body-sm)',
            fontWeight: 500,
          }}
        />
      </div>
    </div>
  );
}
