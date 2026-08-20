import { Navigate, Outlet, useLocation } from 'react-router-dom';
import ROUTES from '../../utils/Routes';
import { useAuth } from './AuthProvider';

export const AuthGuard = () => {
  const auth = useAuth();
  const location = useLocation();

  if (!auth?.isAuthReady) {
    return null;
  }

  if (!auth?.isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  return <Outlet />;
};
