import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ListTodo, PlusCircle, Bell, MessageSquare,
  User, LogOut, Briefcase, Search, ClipboardList, Settings, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';
import { Avatar } from '../ui/Avatar';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const clientNav: NavItem[] = [
  { to: '/client/dashboard',  label: 'Dashboard',  icon: <LayoutDashboard size={17} /> },
  { to: '/client/tasks',      label: 'My Tasks',   icon: <ListTodo size={17} /> },
  { to: '/client/tasks/new',  label: 'Post a Task',icon: <PlusCircle size={17} /> },
  { to: '/client/offers',     label: 'My Offers',  icon: <ClipboardList size={17} /> },
];

const cotaskerNav: NavItem[] = [
  { to: '/cotasker/dashboard', label: 'Dashboard',    icon: <LayoutDashboard size={17} /> },
  { to: '/cotasker/tasks',     label: 'Browse Tasks', icon: <Search size={17} /> },
  { to: '/cotasker/my-offers', label: 'My Offers',    icon: <ClipboardList size={17} /> },
  { to: '/cotasker/jobs',      label: 'My Jobs',      icon: <Briefcase size={17} /> },
];

const sharedNav: NavItem[] = [
  { to: '/notifications', label: 'Notifications', icon: <Bell size={17} /> },
  { to: '/messages',      label: 'Messages',      icon: <MessageSquare size={17} /> },
];

export function Sidebar() {
  const { currentUser, logout } = useAuth();
  const { state } = useAppContext();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const mainNav = currentUser.role === 'client' || currentUser.role === 'admin'
    ? clientNav : cotaskerNav;

  const unreadCount = state.notifications.filter(
    (n) => n.userId === currentUser.id && !n.isRead
  ).length;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const roleLabel = currentUser.role === 'cotasker' ? 'Provider' : currentUser.role === 'admin' ? 'Admin' : 'Client';
  const sectionLabel = currentUser.role === 'cotasker' ? 'Provider' : 'Client';

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      background: 'var(--sidebar-bg)',
      borderRight: '1px solid var(--sidebar-border)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'fixed',
      left: 0, top: 0,
      zIndex: 100,
      overflow: 'hidden',
    }}>

      {/* ── Logo ── */}
      <div style={{
        padding: '20px 20px 18px',
        borderBottom: '1px solid var(--sidebar-border)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexShrink: 0,
      }}>
        <div style={{
          width: 38, height: 38,
          background: 'var(--color-primary-container)',
          borderRadius: 'var(--radius)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-headline)',
          fontWeight: 800, fontSize: '17px',
          color: 'var(--color-on-primary-container)',
          flexShrink: 0,
          letterSpacing: '-0.02em',
        }}>
          TB
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--font-headline)',
            fontWeight: 700, fontSize: '16px',
            color: '#ffffff',
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
          }}>
            TaskBuddy
          </div>
          <div style={{
            fontSize: 'var(--text-label-md)',
            color: 'var(--sidebar-text-muted)',
            marginTop: 2,
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
          }}>
            Service Marketplace
          </div>
        </div>
      </div>

      {/* ── User info ── */}
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid var(--sidebar-border)',
        display: 'flex', alignItems: 'center', gap: '12px',
        flexShrink: 0,
      }}>
        <div style={{
          border: '2px solid rgba(255,215,0,0.35)',
          borderRadius: '50%',
          padding: 2,
          flexShrink: 0,
        }}>
          <Avatar name={currentUser.name} avatarUrl={currentUser.avatarUrl} size="sm" />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontWeight: 600, fontSize: '13px',
            color: '#ffffff',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {currentUser.name}
          </div>
          <div style={{
            fontSize: 'var(--text-label-md)',
            color: 'var(--sidebar-text-muted)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>
            {roleLabel}
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 12px' }}>

        {/* Main nav section */}
        <div style={{
          fontSize: '10px', fontWeight: 600,
          color: 'var(--sidebar-label-color)',
          textTransform: 'uppercase', letterSpacing: '0.10em',
          padding: '8px 10px 6px',
        }}>
          {sectionLabel}
        </div>
        {mainNav.map((item) => (
          <SidebarLink key={item.to} {...item} />
        ))}

        <div style={{ height: '1px', background: 'var(--sidebar-border)', margin: '10px 4px' }} />

        {/* General section */}
        <div style={{
          fontSize: '10px', fontWeight: 600,
          color: 'var(--sidebar-label-color)',
          textTransform: 'uppercase', letterSpacing: '0.10em',
          padding: '8px 10px 6px',
        }}>
          General
        </div>
        {sharedNav.map((item) => (
          <SidebarLink
            key={item.to}
            {...item}
            badge={item.to === '/notifications' && unreadCount > 0 ? unreadCount : undefined}
          />
        ))}
        <SidebarLink
          to={`/profile/${currentUser.id}`}
          label="My Profile"
          icon={<User size={17} />}
        />
        <SidebarLink to="/settings" label="Settings" icon={<Settings size={17} />} />
      </nav>

      {/* ── Sign out ── */}
      <div style={{
        padding: '10px 12px 12px',
        borderTop: '1px solid var(--sidebar-border)',
        flexShrink: 0,
      }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '8px 10px',
            borderRadius: 'var(--radius)',
            color: 'rgba(255,255,255,0.55)',
            fontSize: 'var(--text-body-sm)',
            fontWeight: 500,
            background: 'none', border: 'none', cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ff6b6b';
            e.currentTarget.style.background = 'rgba(255,107,107,0.10)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
            e.currentTarget.style.background = 'none';
          }}
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>

    </aside>
  );
}

function SidebarLink({ to, label, icon, badge }: NavItem & { badge?: number }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 10px',
        borderRadius: 'var(--radius)',
        fontSize: '13.5px',
        fontWeight: isActive ? 600 : 400,
        color: isActive ? 'var(--sidebar-active-text)' : 'var(--sidebar-text)',
        background: isActive ? 'var(--sidebar-active-bg)' : 'transparent',
        borderLeft: isActive ? '3px solid var(--sidebar-active-border)' : '3px solid transparent',
        textDecoration: 'none',
        transition: 'all var(--transition-fast)',
        marginBottom: '2px',
        position: 'relative',
      })}
      end={to.endsWith('dashboard')}
      onMouseEnter={(e) => {
        if (!(e.currentTarget as HTMLElement).getAttribute('aria-current')) {
          (e.currentTarget as HTMLElement).style.background = 'var(--sidebar-bg-hover)';
        }
      }}
      onMouseLeave={(e) => {
        const isActive = (e.currentTarget as HTMLElement).getAttribute('aria-current') === 'page';
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.background = 'transparent';
        }
      }}
    >
      <span style={{ opacity: 0.85, flexShrink: 0 }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {badge !== undefined && (
        <span style={{
          background: 'var(--color-primary-container)',
          color: 'var(--color-on-primary-container)',
          borderRadius: 'var(--radius-full)',
          fontSize: '10px', fontWeight: 700,
          padding: '1px 7px',
          minWidth: '20px', textAlign: 'center',
        }}>
          {badge}
        </span>
      )}
    </NavLink>
  );
}
