// Validation rules - pure functions returning error messages
import type { ModuleData, LessonSkeleton, AssessmentItem } from './atm';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateModule(mod: ModuleData): ValidationResult {
  const errors: string[] = [];
  if (!mod.code.trim()) errors.push('Module code is required');
  if (!mod.name.trim()) errors.push('Module name is required');
  if (mod.totalHours <= 0) errors.push('Total hours must be positive');
  if (mod.theoryHours < 0) errors.push('Theory hours cannot be negative');
  if (mod.practicalHours < 0) errors.push('Practical hours cannot be negative');
  if (Math.abs(mod.theoryHours + mod.practicalHours - mod.totalHours) > 0.01) {
    errors.push('Theory + Practical hours must equal Total hours');
  }
  return { valid: errors.length === 0, errors };
}

export function validateLessonSkeleton(skeleton: LessonSkeleton): ValidationResult {
  const errors: string[] = [];
  const total = skeleton.segments.reduce((sum, s) => sum + s.duration, 0);
  if (total !== 90) {
    errors.push(`Lesson total time must be exactly 90 minutes (currently ${total} min)`);
  }
  if (skeleton.segments.some((s) => s.duration < 0)) {
    errors.push('No segment can have negative duration');
  }
  return { valid: errors.length === 0, errors };
}

export function validateAssessments(items: AssessmentItem[], moduleId: string): ValidationResult {
  const errors: string[] = [];
  const moduleItems = items.filter((a) => a.moduleId === moduleId);
  const total = moduleItems.reduce((sum, a) => sum + a.weight, 0);
  if (total !== 100) {
    errors.push(`Assessment weights must total 100% (currently ${total}%)`);
  }
  if (moduleItems.some((a) => a.weight < 0)) {
    errors.push('No assessment can have negative weight');
  }
  return { valid: errors.length === 0, errors };
}
