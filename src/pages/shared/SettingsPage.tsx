import React, { useState } from 'react';
import { Globe, Lock, Bell, Eye, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from '../../context/LanguageContext';

export function SettingsPage() {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const { language, setLanguage, t } = useTranslation();

  // State for Password
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  // State for Notifications
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
  });

  // State for Privacy
  const [profilePublic, setProfilePublic] = useState(true);

  // Modal State for Account Deletion
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      showToast('Please fill out all password fields', 'error');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      showToast('New password and confirmation do not match', 'error');
      return;
    }
    if (passwords.new.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    showToast('Password updated successfully', 'success');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const handleSavePreferences = (preferenceName: string) => {
    showToast(`${preferenceName} preferences updated`, 'success');
  };

  const handleDeleteAccount = () => {
    showToast('Account deletion request submitted. Support will contact you shortly.', 'success');
    setShowDeleteModal(false);
  };

  return (
    <div>
      {/* Sticky Header */}
      <div className="page-topbar">
        <div>
          <h1 className="text-headline-md" style={{ margin: 0, fontWeight: 700 }}>{t('settings.title')}</h1>
          <p style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--text-body-sm)', margin: '4px 0 0 0' }}>
            {t('settings.subtitle')}
          </p>
        </div>
      </div>

      <div className="page-inner" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-6)', maxWidth: '800px' }}>
        
        {/* Localization & Language */}
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-4)' }}>
            <Globe size={22} style={{ color: 'var(--color-secondary)' }} />
            <h3 className="text-headline-sm" style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>{t('settings.lang_title')}</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-secondary)', marginBottom: '8px' }}>
                {t('settings.lang_label')}
              </label>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button
                  className={`chip ${language === 'en' ? 'chip-active' : ''}`}
                  onClick={() => {
                    setLanguage('en');
                    localStorage.setItem('taskbuddy_lang', 'en');
                    handleSavePreferences('Language (English)');
                  }}
                  style={{ padding: '8px var(--space-4)', borderRadius: 'var(--radius)' }}
                >
                  English (UK/US)
                </button>
                <button
                  className={`chip ${language === 'de' ? 'chip-active' : ''}`}
                  onClick={() => {
                    setLanguage('de');
                    localStorage.setItem('taskbuddy_lang', 'de');
                    handleSavePreferences('Language (Deutsch)');
                  }}
                  style={{ padding: '8px var(--space-4)', borderRadius: 'var(--radius)' }}
                >
                  Deutsch (DE)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-4)' }}>
            <Lock size={22} style={{ color: 'var(--color-secondary)' }} />
            <h3 className="text-headline-sm" style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>{t('settings.security_title')}</h3>
          </div>
          
          <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-secondary)', marginBottom: '6px' }}>
                Current Password
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                style={{ width: '100%', maxWidth: '400px' }}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', maxWidth: '400px' }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-secondary)', marginBottom: '6px' }}>
                  New Password
                </label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-secondary)', marginBottom: '6px' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: 'fit-content', marginTop: 'var(--space-2)' }}>
              Update Password
            </button>
          </form>
        </div>

        {/* Notifications Preferences */}
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-4)' }}>
            <Bell size={22} style={{ color: 'var(--color-secondary)' }} />
            <h3 className="text-headline-sm" style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Notification Channels</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: 'var(--text-body-sm)', color: 'var(--color-secondary)' }}>
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) => {
                  setNotifications({ ...notifications, email: e.target.checked });
                  handleSavePreferences('Email notifications');
                }}
              />
              <span>Receive updates and task status changes via email</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: 'var(--text-body-sm)', color: 'var(--color-secondary)' }}>
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={(e) => {
                  setNotifications({ ...notifications, push: e.target.checked });
                  handleSavePreferences('Push notifications');
                }}
              />
              <span>Enable real-time browser push notifications</span>
            </label>
          </div>
        </div>

        {/* Profile Visibility & Privacy */}
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-4)' }}>
            <Eye size={22} style={{ color: 'var(--color-secondary)' }} />
            <h3 className="text-headline-sm" style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Profile Visibility & Privacy</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: 'var(--text-body-sm)', color: 'var(--color-secondary)' }}>
              <input
                type="checkbox"
                checked={profilePublic}
                onChange={(e) => {
                  setProfilePublic(e.target.checked);
                  handleSavePreferences('Profile visibility');
                }}
              />
              <span>Allow public search engines and non-registered users to view my task marketplace feedback</span>
            </label>
          </div>
        </div>

        {/* Danger Zone (Delete Account) */}
        <div className="card" style={{ padding: 'var(--space-6)', borderColor: 'var(--color-error)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-2)' }}>
            <Shield size={22} style={{ color: 'var(--color-error)' }} />
            <h3 className="text-headline-sm" style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--color-error)' }}>{t('settings.danger_title')}</h3>
          </div>
          <p style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)', marginBottom: 'var(--space-4)' }}>
            Once you delete your account, all escrow transactions, posted jobs, and history ledger records will be permanently archived or deleted. This action is irreversible.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="btn"
            style={{
              background: 'var(--color-status-error-bg)',
              color: 'var(--color-status-error)',
              border: '1.5px solid var(--color-status-error)',
              fontWeight: 700,
              fontSize: 'var(--text-body-sm)',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              padding: '8px 16px'
            }}
          >
            {t('settings.delete_btn')}
          </button>
        </div>

      </div>

      {/* Delete Account Modal Dialog */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{
            width: '100%',
            maxWidth: '500px',
            padding: 'var(--space-6)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
            border: '1px solid var(--color-outline-variant)'
          }}>
            <h3 className="text-headline-sm" style={{ color: 'var(--color-secondary)', margin: '0 0 12px 0', fontSize: '20px', fontWeight: 700 }}>
              Confirm Account Deletion
            </h3>
            <p style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)', lineHeight: 1.5, margin: '0 0 20px 0' }}>
              Are you absolutely sure you want to delete your profile <strong>{currentUser?.name}</strong>? All pending offers, balance states, and message streams will be deleted forever.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
              <button
                className="btn btn-outlined"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn"
                style={{
                  background: 'var(--color-status-error)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  fontWeight: 700,
                  padding: '8px 16px',
                  cursor: 'pointer'
                }}
                onClick={handleDeleteAccount}
              >
                Delete Irreversibly
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
