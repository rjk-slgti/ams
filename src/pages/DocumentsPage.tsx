import { useATM } from '@/context/ATMContext';
import { validateAssessments, validateLessonSkeleton } from '@/engine/validation';
import { calculateSessions } from '@/engine/derivation';
import { useState } from 'react';

type DocTab = 'T1' | 'T2' | 'CA1';

export default function DocumentsPage() {
  const { atm } = useATM();
  const [tab, setTab] = useState<DocTab>('T1');
  const moduleMap = Object.fromEntries(atm.modules.map((m) => [m.id, m]));
  const hasSessions = atm.derived.sessions.length > 0;

  const tabs: DocTab[] = ['T1', 'T2', 'CA1'];

  return (
    <div>
      <h2 className="text-2xl font-semibold text-foreground">Generated Documents</h2>
      <p className="text-muted-foreground mt-1 text-sm">T1 Training Plan · T2 Lesson Plan · CA1 Assessment Plan</p>

      {!hasSessions ? (
        <div className="mt-8 p-6 rounded-md border border-dashed border-border text-center">
          <p className="text-muted-foreground text-sm">Generate sessions first from the <strong>Sessions</strong> page.</p>
        </div>
      ) : (
        <>
          <div className="flex gap-1 mt-6 bg-muted rounded-md p-1 w-fit">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
                  tab === t ? 'bg-card text-foreground font-medium shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t === 'T1' ? 'T1 – Training Plan' : t === 'T2' ? 'T2 – Lesson Plan' : 'CA1 – Assessment Plan'}
              </button>
            ))}
          </div>

          <div className="mt-4">
            {tab === 'T1' && <TrainingPlan sessions={atm.derived.sessions} moduleMap={moduleMap} context={atm.context} />}
            {tab === 'T2' && <LessonPlan skeletons={atm.derived.lessonSkeletons} moduleMap={moduleMap} context={atm.context} />}
            {tab === 'CA1' && <AssessmentPlan assessments={atm.derived.assessments} moduleMap={moduleMap} context={atm.context} />}
          </div>
        </>
      )}
    </div>
  );
}

function DocHeader({ title, context }: { title: string; context: any }) {
  return (
    <div className="mb-4">
      <p className="text-xs text-muted-foreground uppercase tracking-wider">{context.institutionName || 'Institution'}</p>
      <h3 className="text-lg font-semibold mt-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{context.programName} ({context.programCode}) · NVQ Level {context.nvsLevel}</p>
    </div>
  );
}

function TrainingPlan({ sessions, moduleMap, context }: any) {
  return (
    <div className="bg-card border border-border rounded-md p-6">
      <DocHeader title="T1 – Training Plan" context={context} />
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-muted">
            <th className="text-left px-3 py-2 border border-border font-medium">Session</th>
            <th className="text-left px-3 py-2 border border-border font-medium">Module</th>
            <th className="text-left px-3 py-2 border border-border font-medium">Topic</th>
            <th className="text-right px-3 py-2 border border-border font-medium">Duration</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s: any, i: number) => (
            <tr key={i}>
              <td className="px-3 py-2 border border-border tabular-nums">{i + 1}</td>
              <td className="px-3 py-2 border border-border font-mono text-xs">{moduleMap[s.moduleId]?.code}</td>
              <td className="px-3 py-2 border border-border">{s.topic}</td>
              <td className="px-3 py-2 border border-border text-right tabular-nums">90 min</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-xs text-muted-foreground">Total: {sessions.length} sessions · {(sessions.length * 1.5).toFixed(1)} hours</p>
    </div>
  );
}

function LessonPlan({ skeletons, moduleMap, context }: any) {
  if (skeletons.length === 0) return null;
  const sample = skeletons[0];
  const validation = validateLessonSkeleton(sample);

  return (
    <div className="bg-card border border-border rounded-md p-6">
      <DocHeader title="T2 – Lesson Plan Template" context={context} />
      {!validation.valid && (
        <div className="mb-3 p-3 bg-destructive/10 rounded-md">
          {validation.errors.map((e, i) => <p key={i} className="text-xs text-destructive">{e}</p>)}
        </div>
      )}
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-muted">
            <th className="text-left px-3 py-2 border border-border font-medium">Time (min)</th>
            <th className="text-left px-3 py-2 border border-border font-medium">Activity</th>
            <th className="text-left px-3 py-2 border border-border font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {sample.segments.map((seg: any, i: number) => (
            <tr key={i}>
              <td className="px-3 py-2 border border-border tabular-nums">{seg.duration}</td>
              <td className="px-3 py-2 border border-border font-medium">{seg.activity}</td>
              <td className="px-3 py-2 border border-border text-muted-foreground">{seg.description}</td>
            </tr>
          ))}
          <tr className="bg-muted/50">
            <td className="px-3 py-2 border border-border font-medium tabular-nums">
              {sample.segments.reduce((s: number, seg: any) => s + seg.duration, 0)}
            </td>
            <td colSpan={2} className="px-3 py-2 border border-border font-medium">Total</td>
          </tr>
        </tbody>
      </table>
      <p className="mt-3 text-xs text-muted-foreground">This template applies to all {skeletons.length} sessions</p>
    </div>
  );
}

function AssessmentPlan({ assessments, moduleMap, context }: any) {
  const moduleIds = [...new Set(assessments.map((a: any) => a.moduleId))];

  return (
    <div className="bg-card border border-border rounded-md p-6">
      <DocHeader title="CA1 – Assessment Plan" context={context} />
      {moduleIds.map((mid: string) => {
        const items = assessments.filter((a: any) => a.moduleId === mid);
        const mod = moduleMap[mid];
        const validation = validateAssessments(assessments, mid);
        return (
          <div key={mid} className="mb-6 last:mb-0">
            <h4 className="text-sm font-medium mb-2">{mod?.code} – {mod?.name}</h4>
            {!validation.valid && (
              <div className="mb-2 p-2 bg-destructive/10 rounded-md">
                {validation.errors.map((e, i) => <p key={i} className="text-xs text-destructive">{e}</p>)}
              </div>
            )}
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left px-3 py-2 border border-border font-medium">Type</th>
                  <th className="text-left px-3 py-2 border border-border font-medium">Method</th>
                  <th className="text-right px-3 py-2 border border-border font-medium">Weight (%)</th>
                </tr>
              </thead>
              <tbody>
                {items.map((a: any, i: number) => (
                  <tr key={i}>
                    <td className="px-3 py-2 border border-border capitalize">{a.type}</td>
                    <td className="px-3 py-2 border border-border">{a.method}</td>
                    <td className="px-3 py-2 border border-border text-right tabular-nums">{a.weight}%</td>
                  </tr>
                ))}
                <tr className="bg-muted/50">
                  <td colSpan={2} className="px-3 py-2 border border-border font-medium">Total</td>
                  <td className="px-3 py-2 border border-border text-right font-medium tabular-nums">
                    {items.reduce((s: number, a: any) => s + a.weight, 0)}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
