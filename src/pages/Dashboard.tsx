import { useATM } from '@/context/ATMContext';
import { BookOpen, Calendar, ClipboardList } from 'lucide-react';

export default function Dashboard() {
  const { atm } = useATM();
  const moduleCount = atm.modules.length;
  const sessionCount = atm.derived.sessions.length;
  const hasContext = !!atm.context.programName;

  const stats = [
    { label: 'Modules', value: moduleCount, icon: BookOpen, color: 'bg-primary/10 text-primary' },
    { label: 'Sessions', value: sessionCount, icon: Calendar, color: 'bg-accent/10 text-accent' },
    { label: 'Documents', value: sessionCount > 0 ? 3 : 0, icon: ClipboardList, color: 'bg-destructive/10 text-destructive' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold text-foreground">Dashboard</h2>
      <p className="text-muted-foreground mt-1 text-sm">Overview of your academic program setup</p>

      {hasContext && (
        <div className="mt-6 p-4 rounded-md bg-card border border-border">
          <p className="text-sm font-medium">{atm.context.programName}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {atm.context.programCode} · NVQ Level {atm.context.nvsLevel} · {atm.context.duration}
          </p>
          <p className="text-xs text-muted-foreground">{atm.context.institutionName}</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mt-6">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-5 rounded-md bg-card border border-border">
            <div className={`inline-flex p-2 rounded-md ${color} mb-3`}>
              <Icon size={18} />
            </div>
            <p className="text-2xl font-semibold tabular-nums">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {!hasContext && (
        <div className="mt-8 p-6 rounded-md border border-dashed border-border text-center">
          <p className="text-muted-foreground text-sm">Start by setting up your <strong>Program Scope</strong>, then add <strong>Modules</strong>.</p>
        </div>
      )}
    </div>
  );
}
