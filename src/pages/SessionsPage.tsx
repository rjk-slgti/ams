import { useATM } from '@/context/ATMContext';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function SessionsPage() {
  const { atm, recalculateDerived } = useATM();

  const handleGenerate = () => {
    if (atm.modules.length === 0) {
      toast.error('Add modules first');
      return;
    }
    recalculateDerived();
    toast.success('Sessions and lesson skeletons generated');
  };

  const moduleMap = Object.fromEntries(atm.modules.map((m) => [m.id, m]));

  return (
    <div>
      <h2 className="text-2xl font-semibold text-foreground">Sessions & Lesson Skeletons</h2>
      <p className="text-muted-foreground mt-1 text-sm">Generate sessions from module hours (1 session = 1.5 hours)</p>

      <button onClick={handleGenerate} className="mt-6 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:opacity-90 active:scale-[0.98] transition-all">
        Generate / Recalculate
      </button>

      {atm.derived.sessions.length > 0 && (
        <>
          <div className="mt-6 bg-card border border-border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">#</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Module</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Topic</th>
                </tr>
              </thead>
              <tbody>
                {atm.derived.sessions.map((s, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="px-4 py-3 tabular-nums">{i + 1}</td>
                    <td className="px-4 py-3 font-mono text-xs">{moduleMap[s.moduleId]?.code}</td>
                    <td className="px-4 py-3">{s.topic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-semibold mt-8 mb-3">Lesson Skeleton (90-minute template)</h3>
          {atm.derived.lessonSkeletons.length > 0 && (
            <div className="bg-card border border-border rounded-md overflow-hidden max-w-lg">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Activity</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {atm.derived.lessonSkeletons[0].segments.map((seg, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="px-4 py-3">{seg.activity}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{seg.duration} min</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-border bg-muted/50">
                    <td className="px-4 py-3 font-medium">Total</td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums">
                      {atm.derived.lessonSkeletons[0].segments.reduce((s, seg) => s + seg.duration, 0)} min
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
