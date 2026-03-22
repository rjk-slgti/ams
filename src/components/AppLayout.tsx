import { Link, useLocation } from 'react-router-dom';
import { FileText, BookOpen, Calendar, ClipboardList, Home, Download, Upload } from 'lucide-react';
import { useATM } from '@/context/ATMContext';
import { exportATMToJSON, importATMFromFile } from '@/engine/storage';
import { useRef } from 'react';
import { toast } from 'sonner';

const navItems = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/scope', label: 'Program Scope', icon: FileText },
  { to: '/modules', label: 'Modules', icon: BookOpen },
  { to: '/sessions', label: 'Sessions', icon: Calendar },
  { to: '/documents', label: 'Documents', icon: ClipboardList },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { atm, setATM } = useATM();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importATMFromFile(file);
      setATM(imported);
      toast.success('ATM data imported successfully');
    } catch {
      toast.error('Failed to import file');
    }
    e.target.value = '';
  };

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-60 bg-sidebar text-sidebar-foreground flex flex-col shrink-0">
        <div className="p-5 border-b border-sidebar-border">
          <h1 className="text-base font-semibold tracking-tight">SLGTI</h1>
          <p className="text-xs opacity-75 mt-0.5">Academic Document System</p>
        </div>
        <nav className="flex-1 py-3">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                  active ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : 'hover:bg-sidebar-accent/50'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <button
            onClick={() => exportATMToJSON(atm)}
            className="flex items-center gap-2 text-xs w-full px-3 py-2 rounded-md hover:bg-sidebar-accent/50 transition-colors"
          >
            <Download size={14} /> Export JSON
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 text-xs w-full px-3 py-2 rounded-md hover:bg-sidebar-accent/50 transition-colors"
          >
            <Upload size={14} /> Import JSON
          </button>
          <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-8">{children}</div>
      </main>
    </div>
  );
}
