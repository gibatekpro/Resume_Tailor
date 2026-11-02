import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { TailorResumePage } from './pages/TailorResumePage';
import { CreateCV } from './pages/CreateCV';
import { MyJobApplications } from './pages/MyJobApplications';
import { JobApplicationPreviewPage } from './pages/JobApplicationPreviewPage';
import { ResumePrintPage } from './pages/ResumePrintPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { SettingsPage } from './pages/SettingsPage';
import AppRoutes from './utils/Routes';
import { AuthGuard } from './context/auth/AuthGuard';

export default function App() {
  return (
    <Routes>
      <Route path={AppRoutes.home} element={<HomePage />} />

      <Route element={<AuthGuard />}>
        <Route path={AppRoutes.resumeInputPage} element={<TailorResumePage />} />
        <Route path={AppRoutes.newCvPage} element={<CreateCV />} />
        <Route path={AppRoutes.myJobApplications} element={<MyJobApplications />} />
        <Route path={AppRoutes.profile} element={<ProfilePage />} />
        <Route path={AppRoutes.adminUsers} element={<AdminUsersPage />} />
        <Route path={AppRoutes.settings} element={<SettingsPage />} />
        <Route path={AppRoutes.applicationPreview} element={<JobApplicationPreviewPage />} />
        <Route path={AppRoutes.resumePrintPage} element={<ResumePrintPage />} />
      </Route>

      <Route path={AppRoutes.login} element={<LoginPage />} />
      <Route path={AppRoutes.register} element={<RegisterPage />} />
      <Route path={AppRoutes.passwordReset} element={<ResetPasswordPage />} />
      <Route path="*" element={<Navigate to={AppRoutes.home} replace />} />
    </Routes>
  );
}
