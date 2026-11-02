import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/auth/AuthProvider';
import ROUTES from '../../utils/Routes';

interface NavItem {
  path: string;
  icon: string;
  label: string;
}

const baseNavItems: NavItem[] = [
  { path: ROUTES.HOME, icon: 'home', label: 'Home' },
  { path: ROUTES.RESUME_INPUT_PAGE, icon: 'edit_document', label: 'Tailor Resume' },
  { path: ROUTES.NEW_CV_PAGE, icon: 'description', label: 'New CV' },
  { path: ROUTES.MY_JOB_APPLICATIONS, icon: 'work_history', label: 'My Job Applications' },
  { path: ROUTES.PROFILE, icon: 'manage_accounts', label: 'Profile' },
  { path: ROUTES.SETTINGS, icon: 'settings', label: 'Settings' },
  { path: ROUTES.ADMIN_USERS, icon: 'admin_panel_settings', label: 'Admin Users' },
];

const authNavItems: NavItem[] = [
  { path: ROUTES.LOGIN, icon: 'login', label: 'Login' },
  { path: ROUTES.REGISTER, icon: 'person_add', label: 'Register' },
  { path: ROUTES.PASSWORD_RESET, icon: 'lock_reset', label: 'Reset Password' },
];

export default function Sidebar() {
  const auth = useAuth();
  const navItems = auth?.isAuthenticated ? baseNavItems : [...baseNavItems, ...authNavItems];

  return (
    <aside
      className="fixed left-0 top-0 z-50 hidden h-full flex-col py-2 lg:flex"
      style={{ width: '260px', backgroundColor: '#131b2e' }}
    >
      <div className="px-6 py-6 mb-2">
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', lineHeight: '28px', margin: 0 }}>
          Resume Tailor
        </h1>
        <p style={{ fontSize: '12px', color: 'rgba(124,131,155,0.7)', letterSpacing: '0.05em', fontWeight: 600, marginTop: '2px', textTransform: 'uppercase' }}>
          Talent platform
        </p>
      </div>

      <nav className="flex-1 flex flex-col gap-0.5">
        {navItems.map(({ path, icon, label }) => (
          <NavLink
            key={path}
            to={path}
            end={path === ROUTES.HOME}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              padding: '12px 24px',
              fontSize: '12px',
              fontWeight: isActive ? 700 : 500,
              letterSpacing: '0.05em',
              color: isActive ? '#ffffff' : 'rgba(124,131,155,0.7)',
              backgroundColor: isActive ? 'rgba(33,112,228,0.2)' : 'transparent',
              borderLeft: isActive ? '4px solid #0058be' : '4px solid transparent',
              textDecoration: 'none',
              transition: 'all 200ms ease',
            })}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              if (!el.getAttribute('aria-current')) {
                el.style.color = '#ffffff';
                el.style.backgroundColor = 'rgba(63,70,92,0.15)';
              }
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              if (!el.getAttribute('aria-current')) {
                el.style.color = 'rgba(124,131,155,0.7)';
                el.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span className="material-symbols-outlined" style={{ marginRight: '16px', fontSize: '20px' }}>
              {icon}
            </span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(63,70,92,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '4px',
            backgroundColor: 'rgba(33,112,228,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span className="material-symbols-outlined" style={{ color: '#ffffff', fontSize: '18px' }}>shield_person</span>
          </div>
          <div>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff', margin: 0 }}>
              {auth?.isAuthenticated ? 'Authenticated' : 'Talent Team'}
            </p>
            <p style={{ fontSize: '10px', color: 'rgba(124,131,155,0.5)', letterSpacing: '0.1em', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>
              {auth?.isAuthenticated ? 'Secure access' : 'Secure access'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
