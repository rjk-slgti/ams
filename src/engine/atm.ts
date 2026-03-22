// Academic Truth Model (ATM) - Single Source of Truth
// All data flows through this model. UI reads/writes ONLY from ATM.

export interface ModuleData {
  id: string;
  code: string;
  name: string;
  totalHours: number;
  theoryHours: number;
  practicalHours: number;
}

export interface SessionData {
  sessionNumber: number;
  moduleId: string;
  topic: string;
}

export interface LessonSegment {
  activity: string;
  duration: number;
  description: string;
}

export interface LessonSkeleton {
  sessionNumber: number;
  moduleId: string;
  segments: LessonSegment[];
}

export interface AssessmentItem {
  moduleId: string;
  type: 'theory' | 'practical';
  method: string;
  weight: number;
}

export interface ATMContext {
  institutionName: string;
  programName: string;
  programCode: string;
  nvsLevel: string;
  duration: string;
}

export interface ATM {
  context: ATMContext;
  modules: ModuleData[];
  derived: {
    sessions: SessionData[];
    lessonSkeletons: LessonSkeleton[];
    assessments: AssessmentItem[];
  };
}

export function createEmptyATM(): ATM {
  return {
    context: {
      institutionName: '',
      programName: '',
      programCode: '',
      nvsLevel: '',
      duration: '',
    },
    modules: [],
    derived: {
      sessions: [],
      lessonSkeletons: [],
      assessments: [],
    },
  };
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
