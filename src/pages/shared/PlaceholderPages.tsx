import { MessageSquare, Settings } from 'lucide-react';

export function MessagesPage() {
  return (
    <div>
      <div className="page-topbar">
        <div>
          <h1 className="text-headline-md" style={{ margin: 0, fontWeight: 700 }}>Messages</h1>
          <p style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--text-body-sm)', margin: '4px 0 0 0' }}>
            Direct messaging between clients and providers
          </p>
        </div>
      </div>

      <div className="page-inner">
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon"><MessageSquare size={40} /></div>
            <h3 className="text-headline-sm" style={{ marginBottom: 'var(--space-2)' }}>Messaging coming soon</h3>
            <p>In-app messaging will be available in the next release. Providers and clients will be able to communicate directly about task details.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SettingsPage() {
  return (
    <div>
      <div className="page-topbar">
        <div>
          <h1 className="text-headline-md" style={{ margin: 0, fontWeight: 700 }}>Settings</h1>
          <p style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--text-body-sm)', margin: '4px 0 0 0' }}>
            Manage your account preferences
          </p>
        </div>
      </div>

      <div className="page-inner">
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon"><Settings size={40} /></div>
            <h3 className="text-headline-sm" style={{ marginBottom: 'var(--space-2)' }}>Settings coming soon</h3>
            <p>Account settings and preferences will be available in a future update.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
