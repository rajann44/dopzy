/**
 * PageSkeleton — a branded shimmer skeleton used as Suspense fallback
 * for lazy-loaded pages and the auth loading state.
 */
export function PageSkeleton() {
  return (
    <div style={{
      padding: 'var(--space-8)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-6)',
      animation: 'fadeIn 200ms ease',
      maxWidth: '100%',
    }}>
      {/* Topbar skeleton */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="skeleton-line" style={{ width: 180, height: 22, borderRadius: 6 }} />
          <div className="skeleton-line" style={{ width: 120, height: 14, borderRadius: 4 }} />
        </div>
        <div className="skeleton-line" style={{ width: 120, height: 40, borderRadius: 9999 }} />
      </div>

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
        <span style={{
          fontSize: 'var(--text-body-sm)',
          color: 'var(--color-on-surface-variant)',
          fontWeight: 500,
        }}>Loading...</span>
      </div>
    </div>
  );
}
