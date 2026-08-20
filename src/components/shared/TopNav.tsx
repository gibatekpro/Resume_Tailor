import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth/AuthProvider';
import userProfileService from '../../service/UserProfileService';
import ROUTES from '../../utils/Routes';

interface TopNavProps {
  searchPlaceholder?: string;
  onSearch?: (q: string) => void;
  title?: string;
  actions?: React.ReactNode;
}

const formatUserLabel = (firstName: string, lastName: string, fallbackUserId: string | null) => {
  const fullName = `${firstName} ${lastName}`.trim();
  if (fullName.length > 0) {
    return fullName;
  }

  if (!fallbackUserId) {
    return 'Profile';
  }

  return `User ${fallbackUserId.slice(0, 6)}`;
};

export default function TopNav({ searchPlaceholder = 'Search...', onSearch, title, actions }: TopNavProps) {
  const [q, setQ] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [profileName, setProfileName] = useState('Profile');
  const [profilePermission, setProfilePermission] = useState('User');
  const auth = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const syncProfile = async () => {
      if (!auth?.isAuthenticated) {
        setProfileName('Profile');
        setProfilePermission('Not Logged In');
        return;
      }

      try {
        const profile = await userProfileService.getMyProfile();
        setProfileName(formatUserLabel(profile?.firstName ?? '', profile?.lastName ?? '', auth.user));
        setProfilePermission(profile?.permission ?? 'User');
      } catch (error) {
        console.error('Error loading top-nav profile:', error);
        setProfileName(formatUserLabel('', '', auth.user));
        setProfilePermission('User');
      }
    };

    void syncProfile();
  }, [auth?.isAuthenticated, auth?.user]);

  const userLabel = profileName;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQ(e.target.value);
    onSearch?.(e.target.value);
  };

  const handleLogout = async () => {
    setIsConfirmOpen(false);
    setIsMenuOpen(false);
    await auth?.logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const handleResetPassword = () => {
    setIsMenuOpen(false);
    navigate(ROUTES.PASSWORD_RESET, { replace: false });
  };

  return (
    <>
      <header
        className="sticky top-0 z-40 flex justify-between items-center"
        style={{
          height: '64px',
          padding: '0 24px',
          backgroundColor: '#f6f9ff',
          borderBottom: '1px solid #c6c6cd',
          boxShadow: '0px 1px 3px rgba(15,23,42,0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
          {title ? (
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#161c22', margin: 0 }}>{title}</h2>
          ) : (
            <div style={{ position: 'relative', maxWidth: '400px', width: '100%' }}>
              <span
                className="material-symbols-outlined"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', color: '#76777d' }}
              >
                search
              </span>
              <input
                value={q}
                onChange={handleChange}
                placeholder={searchPlaceholder}
                style={{
                  width: '100%',
                  backgroundColor: '#eef4fc',
                  border: '1px solid #c6c6cd',
                  borderRadius: '8px',
                  padding: '8px 16px 8px 40px',
                  fontSize: '14px',
                  color: '#161c22',
                  outline: 'none',
                }}
              />
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {actions}
          <button
            style={{
              width: '36px', height: '36px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: 'none', cursor: 'pointer',
              position: 'relative',
            }}
          >
            <span className="material-symbols-outlined" style={{ color: '#45464d' }}>notifications</span>
            <span style={{
              position: 'absolute', top: '6px', right: '6px',
              width: '8px', height: '8px', borderRadius: '50%',
              backgroundColor: '#ba1a1a', border: '2px solid #f6f9ff',
            }} />
          </button>
          <div style={{ width: '1px', height: '32px', backgroundColor: '#c6c6cd' }} />
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setIsMenuOpen((value) => !value)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
                padding: 0,
                transition: 'all 200ms ease',
                transform: isMenuOpen ? 'translateY(-1px)' : 'translateY(0)',
              }}
            >
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#161c22', margin: 0 }}>
                  {auth?.isAuthenticated ? userLabel : 'Profile'}
                </p>
                <p style={{ fontSize: '13px', color: '#45464d', margin: 0 }}>
                  {auth?.isAuthenticated ? profilePermission : 'Not Logged In'}
                </p>
              </div>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                backgroundColor: '#d8e2ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid #c6c6cd',
                boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08)',
                transition: 'all 200ms ease',
                transform: isMenuOpen ? 'scale(1.04)' : 'scale(1)',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#004395' }}>person</span>
              </div>
            </button>

            {isMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 10px)',
                  width: '210px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #c6c6cd',
                  borderRadius: '14px',
                  boxShadow: '0 12px 28px rgba(15, 23, 42, 0.12)',
                  overflow: 'hidden',
                  animation: isMounted ? 'fadeIn 180ms ease-out' : 'none',
                  zIndex: 50,
                }}
              >
                {!auth?.isAuthenticated ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate(ROUTES.LOGIN, { replace: false });
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '14px 14px',
                      border: 'none',
                      backgroundColor: '#ffffff',
                      color: '#161c22',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '14px',
                      fontWeight: 600,
                      transition: 'all 200ms ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f3f7ff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ color: '#2170e4', fontSize: '18px' }}>login</span>
                    Log in
                  </button>
                ) : (
                  <>
                    <div style={{ padding: '10px 12px', borderBottom: '1px solid #eef4fc', backgroundColor: '#f8fbff' }}>
                      <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#76777d' }}>
                        Account
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleResetPassword}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 14px',
                        border: 'none',
                        backgroundColor: '#ffffff',
                        color: '#161c22',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '14px',
                        fontWeight: 500,
                        transition: 'all 200ms ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f3f7ff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ color: '#2170e4', fontSize: '18px' }}>lock_reset</span>
                      Reset password
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsConfirmOpen(true)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 14px',
                        border: 'none',
                        backgroundColor: '#ffffff',
                        color: '#ba1a1a',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '14px',
                        fontWeight: 600,
                        transition: 'all 200ms ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#fff5f5';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
                      Sign out
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {isConfirmOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.38)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            animation: 'fadeIn 180ms ease-out',
          }}
          onClick={() => setIsConfirmOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '420px',
              maxWidth: 'calc(100vw - 32px)',
              backgroundColor: '#ffffff',
              borderRadius: '18px',
              border: '1px solid #c6c6cd',
              boxShadow: '0 16px 40px rgba(15, 23, 42, 0.2)',
              padding: '24px',
              animation: 'slideUp 220ms ease-out',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '12px',
                backgroundColor: '#fff5f5', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span className="material-symbols-outlined" style={{ color: '#ba1a1a', fontSize: '24px' }}>logout</span>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px', color: '#161c22' }}>Sign out</h3>
              </div>
            </div>

            <p style={{ margin: '0 0 20px', fontSize: '14px', color: '#45464d', lineHeight: 1.6 }}>
              Are you sure you want to sign out of your account? You can sign back in anytime.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                style={{
                  border: '1px solid #c6c6cd',
                  backgroundColor: '#ffffff',
                  color: '#161c22',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  border: 'none',
                  backgroundColor: '#ba1a1a',
                  color: '#ffffff',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                }}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}
