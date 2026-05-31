import React, { useState } from 'react';
import { Globe, Lock, Bell, Eye, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from '../../context/LanguageContext';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { ConfirmModal } from '../../components/ui/Modal';

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
              <SegmentedControl
                options={[
                  { value: 'en', label: 'English (UK/US)' },
                  { value: 'de', label: 'Deutsch (DE)' }
                ]}
                value={language}
                onChange={(val) => {
                  setLanguage(val as 'en' | 'de');
                  localStorage.setItem('taskbuddy_lang', val);
                  handleSavePreferences(`Language (${val === 'en' ? 'English' : 'Deutsch'})`);
                }}
                style={{ maxWidth: '400px' }}
              />
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
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="settings-row">
              <span className="settings-row-label">Receive updates and task status changes via email</span>
              <label className="ios-switch">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) => {
                    setNotifications({ ...notifications, email: e.target.checked });
                    handleSavePreferences('Email notifications');
                  }}
                />
                <span className="ios-switch-slider"></span>
              </label>
            </div>
            <div className="settings-row">
              <span className="settings-row-label">Enable real-time browser push notifications</span>
              <label className="ios-switch">
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={(e) => {
                    setNotifications({ ...notifications, push: e.target.checked });
                    handleSavePreferences('Push notifications');
                  }}
                />
                <span className="ios-switch-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Profile Visibility & Privacy */}
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-4)' }}>
            <Eye size={22} style={{ color: 'var(--color-secondary)' }} />
            <h3 className="text-headline-sm" style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Profile Visibility & Privacy</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="settings-row">
              <span className="settings-row-label">Allow public search engines and non-registered users to view my task marketplace feedback</span>
              <label className="ios-switch">
                <input
                  type="checkbox"
                  checked={profilePublic}
                  onChange={(e) => {
                    setProfilePublic(e.target.checked);
                    handleSavePreferences('Profile visibility');
                  }}
                />
                <span className="ios-switch-slider"></span>
              </label>
            </div>
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

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Confirm Account Deletion"
        message={`Are you absolutely sure you want to delete your profile ${currentUser?.name}? All pending offers, balance states, and message streams will be deleted forever.`}
        confirmLabel="Delete Irreversibly"
        confirmVariant="danger"
      />
    </div>
  );
}
