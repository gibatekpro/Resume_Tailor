import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#f6f9ff]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col lg:ml-[260px]">
        {children}
      </div>
    </div>
  );
}
