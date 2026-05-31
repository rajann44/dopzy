import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { ToastContainer } from '../ui/Toast';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';
import { supabase } from '../../utils/supabaseClient';
import { useToast } from '../../context/ToastContext';

export function AppLayout() {
  const { currentUser, isEmailVerified } = useAuth();
  const { language } = useTranslation();
  const { showToast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleResend = async () => {
    if (!currentUser?.email) return;
    setIsSending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: currentUser.email,
        options: {
          emailRedirectTo: window.location.origin + '/browse'
        }
      });
      if (error) throw error;
      setIsSent(true);
      showToast(
        language === 'de' 
          ? 'Bestätigungslink erfolgreich gesendet.' 
          : 'Verification email resent successfully.', 
        'success'
      );
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to resend email.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-surface)' }}>
      {/* Desktop Sidebar */}
      <div style={{ display: 'none' }} className="sidebar-desktop">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main
        id="main-content"
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {currentUser && !isEmailVerified && (
          <div style={{
            background: 'var(--color-primary-container)',
            borderBottom: '1px solid var(--color-outline-variant)',
            color: 'var(--color-secondary)',
            padding: 'var(--space-3) var(--space-6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-4)',
            fontSize: 'var(--text-body-sm)',
            fontWeight: 500,
            zIndex: 10,
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span style={{ fontSize: '16px' }}>✉️</span>
              <span>
                {language === 'de'
                  ? `Bitte bestätigen Sie Ihre E-Mail-Adresse (${currentUser.email}), um alle Funktionen freizuschalten.`
                  : `Please confirm your email address (${currentUser.email}) to unlock all features.`
                }
              </span>
            </div>
            <button
              onClick={handleResend}
              disabled={isSending || isSent}
              className={`btn ${isSent ? 'btn-ghost' : 'btn-secondary'} btn-sm`}
              style={{
                flexShrink: 0,
                borderRadius: 'var(--radius-full)',
                padding: '4px var(--space-4)',
                height: 'auto',
                fontSize: '12px'
              }}
            >
              {isSending 
                ? (language === 'de' ? 'Wird gesendet...' : 'Sending...') 
                : isSent 
                  ? (language === 'de' ? 'Gesendet!' : 'Sent!') 
                  : (language === 'de' ? 'Link erneut senden' : 'Resend link')
              }
            </button>
          </div>
        )}

        <div
          className="page-content"
          style={{
            flex: 1,
            maxWidth: '100%',
          }}
        >
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="mobile-nav-container">
        <MobileNav />
      </div>

      <ToastContainer />

      <style>{`
        @media (min-width: 768px) {
          .sidebar-desktop {
            display: block !important;
            width: var(--sidebar-width);
            flex-shrink: 0;
          }
          .mobile-nav-container {
            display: none;
          }
          #main-content > div {
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
