import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f6f9ff' }}>
      <Sidebar />
      <main style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Outlet />
      </main>
    </div>
  );
}
