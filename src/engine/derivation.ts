// Pure derivation functions - no side effects, no UI coupling
import type { ModuleData, SessionData, LessonSkeleton, LessonSegment, AssessmentItem } from './atm';

const DEFAULT_SESSION_HOURS = 1.5;

const DEFAULT_LESSON_SEGMENTS: LessonSegment[] = [
  { activity: 'Welcome & Introduction', duration: 5, description: 'Greet students, outline session objectives' },
  { activity: 'Review Previous Session', duration: 5, description: 'Recap key points from last session' },
  { activity: 'Teaching / Theory', duration: 30, description: 'Deliver theoretical content' },
  { activity: 'Practical Activity', duration: 40, description: 'Hands-on exercises and application' },
  { activity: 'Recap & Closing', duration: 10, description: 'Summarize key takeaways, preview next session' },
];

export function calculateSessions(module: ModuleData): number {
  return Math.ceil(module.totalHours / DEFAULT_SESSION_HOURS);
}

export function deriveSessions(modules: ModuleData[]): SessionData[] {
  const sessions: SessionData[] = [];
  for (const mod of modules) {
    const count = calculateSessions(mod);
    for (let i = 1; i <= count; i++) {
      sessions.push({
        sessionNumber: i,
        moduleId: mod.id,
        topic: `${mod.name} - Session ${i}`,
      });
    }
  }
  return sessions;
}

export function deriveLessonSkeletons(sessions: SessionData[]): LessonSkeleton[] {
  return sessions.map((s) => ({
    sessionNumber: s.sessionNumber,
    moduleId: s.moduleId,
    segments: DEFAULT_LESSON_SEGMENTS.map((seg) => ({ ...seg })),
  }));
}

export function deriveDefaultAssessments(modules: ModuleData[]): AssessmentItem[] {
  return modules.flatMap((mod) => {
    const theoryRatio = mod.theoryHours / mod.totalHours;
    const theoryWeight = Math.round(theoryRatio * 100);
    const practicalWeight = 100 - theoryWeight;
    return [
      { moduleId: mod.id, type: 'theory' as const, method: 'Written Test', weight: theoryWeight },
      { moduleId: mod.id, type: 'practical' as const, method: 'Practical Assessment', weight: practicalWeight },
    ];
  });
}
