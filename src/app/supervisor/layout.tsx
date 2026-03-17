import { Sidebar } from '@/components/Sidebar';

export default function SupervisorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F0F4F8]">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
