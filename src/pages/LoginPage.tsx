import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import { useTranslation } from '../context/LanguageContext';

export function LoginPage() {
  const { currentUser, login, signUp } = useAuth();
  const { showToast } = useToast();
  const { t, language, setLanguage } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (currentUser) {
    return <Navigate to="/browse" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password, name || 'New Member');
        showToast('Account created successfully! Welcome to Dopzy.', 'success');
      } else {
        await login(email, password);
        showToast('Welcome back!', 'success');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      if (error) {
        throw new Error(error.message);
      }
      showToast('Password reset link sent! Check your inbox.', 'success');
      setIsForgotPassword(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send reset link';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      background: 'var(--color-surface)',
    }}>
      {/* Left: Brand Panel */}
      <div style={{
        background: 'var(--color-secondary)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'var(--space-12)',
        position: 'relative',
        overflow: 'hidden',
      }} className="login-brand-panel">
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', zIndex: 1 }}>
          <svg width="44" height="44" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 'var(--radius)', flexShrink: 0 }}>
            <rect width="100" height="100" rx="16" fill="#004352"/>
            <path d="M30 50L45 65L75 35" stroke="#FFE600" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M25 25L40 25" stroke="#FFE600" strokeWidth="4" strokeLinecap="round"/>
            <path d="M25 75L40 75" stroke="#FFE600" strokeWidth="4" strokeLinecap="round"/>
          </svg>
          <div>
            <div style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '20px', color: '#fff' }}>Dopzy</div>
            <div style={{ fontSize: 'var(--text-label-md)', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>One Tap, Task Done</div>
          </div>
        </div>

        {/* Hero text */}
        <div style={{ zIndex: 1 }}>
          <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '42px', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: 'var(--space-4)', letterSpacing: '-0.02em' }}>
            Your Tasks,<br />
            <span style={{ color: 'var(--color-primary-container)' }}>Done.</span>
          </h1>
          <p style={{ fontSize: 'var(--text-body-lg)', color: 'rgba(255,255,255,0.75)', lineHeight: 'var(--lh-body-lg)', maxWidth: '380px' }}>
            Connect with vetted, trusted service providers in your area. From moving to cleaning — every task, matched perfectly.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 'var(--space-8)', zIndex: 1 }}>
          {[['2,400+', 'Tasks Completed'], ['98%', 'Satisfaction Rate'], ['500+', 'Verified Providers']].map(([val, label]) => (
            <div key={label}>
              <div style={{ fontFamily: 'var(--font-headline)', fontSize: '28px', fontWeight: 700, color: 'var(--color-primary-container)' }}>{val}</div>
              <div style={{ fontSize: 'var(--text-label-md)', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          bottom: -60, right: -60,
          width: 320, height: 320,
          borderRadius: '50%',
          background: 'rgba(255,215,0,0.07)',
          border: '1px solid rgba(255,215,0,0.12)',
        }} />
        <div style={{
          position: 'absolute',
          top: -80, right: 60,
          width: 200, height: 200,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
        }} />
      </div>

      {/* Right: Form Panel */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'var(--space-12) var(--space-16)',
        background: 'var(--color-surface-white)',
        overflowY: 'auto',
        position: 'relative'
      }} className="login-form-panel">
        {/* Language selector */}
        <div style={{
          position: 'absolute',
          top: 'var(--space-6)',
          right: 'var(--space-6)',
          display: 'flex',
          gap: 'var(--space-2)',
          zIndex: 10
        }}>
          <button
            type="button"
            onClick={() => setLanguage('en')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              border: language === 'en' ? '1.5px solid var(--color-secondary)' : '1.5px solid transparent',
              background: language === 'en' ? 'var(--color-primary-container)' : 'transparent',
              color: 'var(--color-secondary)',
              fontWeight: 700,
              fontSize: '11px',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage('de')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              border: language === 'de' ? '1.5px solid var(--color-secondary)' : '1.5px solid transparent',
              background: language === 'de' ? 'var(--color-primary-container)' : 'transparent',
              color: 'var(--color-secondary)',
              fontWeight: 700,
              fontSize: '11px',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            DE
          </button>
        </div>

        <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: 'var(--text-headline-lg)', fontWeight: 700, color: 'var(--color-on-surface)', marginBottom: 'var(--space-2)' }}>
              {isForgotPassword ? 'Reset Password' : (isSignUp ? 'Create an Account' : t('login.login_btn'))}
            </h2>
            <p style={{ fontSize: 'var(--text-body-md)', color: 'var(--color-on-surface-variant)' }}>
              {isForgotPassword 
                ? 'Enter your email address and we will send you a link to reset your password.'
                : (isSignUp ? 'Sign up to post tasks or offer your services on Dopzy.' : 'Sign in to access your dashboard and manage tasks.')
              }
            </p>
          </div>

          {isForgotPassword ? (
            /* Forgot Password Form */
            <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label htmlFor="reset-email" className="form-label">{t('login.email')}</label>
                <input
                  id="reset-email"
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              {error && (
                <div style={{
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'var(--color-error-container)',
                  color: 'var(--color-on-error-container)',
                  borderRadius: 'var(--radius)',
                  fontSize: 'var(--text-body-sm)',
                  fontWeight: 500,
                }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
                style={{
                  width: '100%',
                  marginTop: 'var(--space-2)',
                  borderRadius: '999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  height: '48px',
                  fontSize: '16px',
                  fontWeight: 700,
                }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner" style={{ width: '18px', height: '18px', borderColor: 'rgba(0,48,59,0.3)', borderTopColor: '#00303b' }} />
                    Sending Link...
                  </>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight size={18} strokeWidth={2.5} />
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn btn-outlined btn-lg"
                onClick={() => {
                  setIsForgotPassword(false);
                  setError('');
                }}
                style={{ width: '100%' }}
              >
                Back to Sign In
              </button>
            </form>
          ) : (
            /* Login / Signup Form */
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {isSignUp && (
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email" className="form-label">{t('login.email')}</label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label htmlFor="password" className="form-label" style={{ marginBottom: 0 }}>{t('login.password')}</label>
                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(true);
                        setError('');
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-secondary)',
                        fontSize: 'var(--text-body-sm)',
                        fontWeight: 500,
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                    required
                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                    style={{ paddingRight: '44px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: '12px', top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none', border: 'none',
                      color: 'var(--color-on-surface-variant)',
                      cursor: 'pointer', padding: '4px',
                    }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'var(--color-error-container)',
                  color: 'var(--color-on-error-container)',
                  borderRadius: 'var(--radius)',
                  fontSize: 'var(--text-body-sm)',
                  fontWeight: 500,
                }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
                style={{
                  width: '100%',
                  marginTop: 'var(--space-2)',
                  borderRadius: '999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  height: '48px',
                  fontSize: '16px',
                  fontWeight: 700,
                }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner" style={{ width: '18px', height: '18px', borderColor: 'rgba(0,48,59,0.3)', borderTopColor: '#00303b' }} />
                    {isSignUp ? 'Registering...' : (language === 'de' ? 'Anmeldung...' : 'Signing in...')}
                  </>
                ) : (
                  <>
                    <span>{isSignUp ? 'Create Account' : t('login.login_btn')}</span>
                    <ArrowRight size={18} strokeWidth={2.5} />
                  </>
                )}
              </button>
            </form>
          )}

          {!isForgotPassword && (
            <p style={{ marginTop: 'var(--space-6)', fontSize: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)', textAlign: 'center' }}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-secondary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                }}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .login-brand-panel { display: none !important; }
          [style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          .login-form-panel { padding: var(--space-8) var(--space-5) !important; }
        }
      `}</style>
    </div>
  );
}
