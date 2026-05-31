import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Search, Briefcase, ListTodo, Bell, LogOut, 
  MoreHorizontal, MessageSquare, Settings, User, Shield, X 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';
import { useTranslation } from '../../context/LanguageContext';
import { prefetchRoute } from '../../utils/prefetch';
import { Avatar } from '../ui/Avatar';

const mobilePrefetchMap: Record<string, 'marketplace' | 'myTasks' | 'notifications' | 'messages' | 'settings' | 'moderation' | 'profile'> = {
  '/client/dashboard': 'marketplace',
  '/client/tasks': 'myTasks',
  '/tasker/dashboard': 'marketplace',
  '/tasker/tasks': 'marketplace',
  '/tasker/jobs': 'myTasks',
  '/notifications': 'notifications',
  '/messages': 'messages',
  '/settings': 'settings',
  '/admin/moderation': 'moderation',
};

export function MobileNav() {
  const { currentUser, logout } = useAuth();
  const { state } = useAppContext();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  if (!currentUser) return null;

  const unreadNotifications = state.notifications.filter(
    (n) => n.userId === currentUser.id && !n.isRead
  ).length;

  const unreadMessages = state.conversations.filter(
    (c) => c.participantIds.includes(currentUser.id) && c.unreadCount > 0
  ).length;

  const isClient = currentUser.role === 'client' || currentUser.role === 'admin';

  const navItems = isClient
    ? [
        { to: '/client/dashboard', label: 'Home', icon: LayoutDashboard },
        { to: '/client/tasks', label: 'Tasks', icon: ListTodo },
        { to: '/notifications', label: 'Alerts', icon: Bell },
      ]
    : [
        { to: '/tasker/dashboard', label: 'Home', icon: LayoutDashboard },
        { to: '/tasker/tasks', label: 'Browse', icon: Search },
        { to: '/tasker/jobs', label: 'Jobs', icon: Briefcase },
        { to: '/notifications', label: 'Alerts', icon: Bell },
      ];

  const handleLogout = async () => {
    setIsMoreOpen(false);
    await logout();
    navigate('/login');
  };

  return (
    <>
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--color-surface-white)',
        borderTop: '1px solid var(--color-outline-variant)',
        display: 'flex',
        alignItems: 'center',
        zIndex: 200,
        height: 64,
      }}>
        {navItems.map(({ to, label, icon: Icon }) => {
          const showBadge = to === '/notifications' && unreadNotifications > 0;
          return (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                fontSize: '10px',
                fontWeight: 600,
                textDecoration: 'none',
                color: isActive ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
                padding: '8px 0',
                position: 'relative',
              })}
              onMouseEnter={() => {
                const key = mobilePrefetchMap[to];
                if (key) prefetchRoute(key);
              }}
            >
              <div style={{ position: 'relative' }}>
                <Icon size={20} />
                {showBadge && (
                  <span style={{
                    position: 'absolute',
                    top: -4, right: -4,
                    width: 14, height: 14,
                    background: 'var(--color-status-error)',
                    borderRadius: '50%',
                    fontSize: '9px',
                    fontWeight: 700,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </div>
              <span style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
            </NavLink>
          );
        })}
        
        {/* More Menu Toggle Button */}
        <button
          onClick={() => setIsMoreOpen(true)}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            fontSize: '10px',
            fontWeight: 600,
            color: isMoreOpen ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            position: 'relative',
          }}
        >
          <div style={{ position: 'relative' }}>
            <MoreHorizontal size={20} />
            {unreadMessages > 0 && (
              <span style={{
                position: 'absolute',
                top: -4, right: -4,
                width: 8, height: 8,
                background: 'var(--color-status-error)',
                borderRadius: '50%',
              }} />
            )}
          </div>
          <span>{t('nav.more')}</span>
        </button>
      </nav>

      {/* Drawer Overlay Backdrop */}
      {isMoreOpen && (
        <div 
          onClick={() => setIsMoreOpen(false)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 999,
          }}
        />
      )}

      {/* Slide-up Bottom Sheet Drawer */}
      <div style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        background: 'var(--color-surface-white)',
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
        zIndex: 1000,
        padding: '20px 20px 32px 20px',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)',
        transform: isMoreOpen ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}>
        {/* Drawer Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Avatar name={currentUser.name} avatarUrl={currentUser.avatarUrl} size="sm" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-secondary)' }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', fontWeight: 600 }}>
                {currentUser.role === 'admin' ? 'Admin' : 'Member'}
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsMoreOpen(false)}
            style={{
              background: 'var(--color-surface)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--color-on-surface-variant)',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Menu List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {/* Messages Link */}
          <DrawerLink 
            to="/messages" 
            label={t('nav.messages')} 
            icon={<MessageSquare size={18} />} 
            onClick={() => setIsMoreOpen(false)}
            badge={unreadMessages > 0 ? unreadMessages : undefined}
          />

          {/* Profile Link */}
          <DrawerLink 
            to={`/profile/${currentUser.id}`} 
            label={t('nav.profile')} 
            icon={<User size={18} />} 
            onClick={() => setIsMoreOpen(false)}
          />

          {/* Settings Link */}
          <DrawerLink 
            to="/settings" 
            label={t('nav.settings')} 
            icon={<Settings size={18} />} 
            onClick={() => setIsMoreOpen(false)}
          />

          {/* Moderation Link (Admin Only) */}
          {currentUser.role === 'admin' && (
            <DrawerLink 
              to="/admin/moderation" 
              label={t('nav.moderation')} 
              icon={<Shield size={18} />} 
              onClick={() => setIsMoreOpen(false)}
            />
          )}

          <div style={{ height: '1px', background: 'var(--color-outline-variant)', margin: '8px 0' }} />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              borderRadius: 'var(--radius)',
              color: 'var(--color-status-error)',
              background: 'rgba(255, 107, 107, 0.08)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
              width: '100%',
              textAlign: 'left',
              transition: 'background var(--transition-fast)',
            }}
          >
            <LogOut size={18} />
            <span>{t('nav.logout')}</span>
          </button>
        </div>
      </div>
    </>
  );
}

interface DrawerLinkProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  badge?: number;
}

function DrawerLink({ to, label, icon, onClick, badge }: DrawerLinkProps) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 14px',
        borderRadius: 'var(--radius)',
        fontSize: '14px',
        fontWeight: isActive ? 600 : 500,
        color: isActive ? 'var(--color-primary)' : 'var(--color-on-surface)',
        background: isActive ? 'var(--color-primary-container)' : 'transparent',
        textDecoration: 'none',
        transition: 'background var(--transition-fast)',
      })}
      onMouseEnter={() => {
        const key = mobilePrefetchMap[to];
        if (key) prefetchRoute(key);
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {badge !== undefined && (
        <span style={{
          background: 'var(--color-status-error)',
          color: '#ffffff',
          borderRadius: 'var(--radius-full)',
          fontSize: '10px',
          fontWeight: 700,
          padding: '1px 6px',
        }}>
          {badge}
        </span>
      )}
    </NavLink>
  );
}
