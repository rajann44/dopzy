import posthog from 'posthog-js';

// Defer PostHog initialization until after first paint to keep it off the critical path.
// Uses requestIdleCallback where available, falls back to setTimeout.
const initPostHog = () => {
  // Skip PostHog initialization in development mode
  if (import.meta.env.DEV) {
    return;
  }
  const key = import.meta.env.VITE_POSTHOG_KEY as string;
  const host = import.meta.env.VITE_POSTHOG_HOST as string;
  if (key && host) {
    posthog.init(key, {
      api_host: host,
      loaded: () => {
        // PostHog is ready — no-op, but keeps the callback pattern
      },
    });
  }
};

if (typeof window !== 'undefined') {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(initPostHog);
  } else {
    setTimeout(initPostHog, 0);
  }
}

export default posthog;
