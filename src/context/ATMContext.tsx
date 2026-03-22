import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { ATM, ModuleData, ATMContext as ATMContextData } from '@/engine/atm';
import { createEmptyATM, generateId } from '@/engine/atm';
import { deriveSessions, deriveLessonSkeletons, deriveDefaultAssessments } from '@/engine/derivation';
import { saveATM, loadATM } from '@/engine/storage';
import type { AssessmentItem } from '@/engine/atm';

interface ATMContextValue {
  atm: ATM;
  updateContext: (ctx: ATMContextData) => void;
  addModule: (mod: Omit<ModuleData, 'id'>) => void;
  removeModule: (id: string) => void;
  updateModule: (mod: ModuleData) => void;
  recalculateDerived: () => void;
  updateAssessments: (items: AssessmentItem[]) => void;
  resetATM: () => void;
  setATM: (atm: ATM) => void;
}

const ATMCtx = createContext<ATMContextValue | null>(null);

export function ATMProvider({ children }: { children: ReactNode }) {
  const [atm, setAtmState] = useState<ATM>(() => loadATM());

  useEffect(() => { saveATM(atm); }, [atm]);

  const updateContext = useCallback((ctx: ATMContextData) => {
    setAtmState((prev) => ({ ...prev, context: ctx }));
  }, []);

  const addModule = useCallback((mod: Omit<ModuleData, 'id'>) => {
    setAtmState((prev) => ({
      ...prev,
      modules: [...prev.modules, { ...mod, id: generateId() }],
    }));
  }, []);

  const removeModule = useCallback((id: string) => {
    setAtmState((prev) => ({
      ...prev,
      modules: prev.modules.filter((m) => m.id !== id),
    }));
  }, []);

  const updateModule = useCallback((mod: ModuleData) => {
    setAtmState((prev) => ({
      ...prev,
      modules: prev.modules.map((m) => (m.id === mod.id ? mod : m)),
    }));
  }, []);

  const recalculateDerived = useCallback(() => {
    setAtmState((prev) => {
      const sessions = deriveSessions(prev.modules);
      const lessonSkeletons = deriveLessonSkeletons(sessions);
      const assessments = deriveDefaultAssessments(prev.modules);
      return { ...prev, derived: { sessions, lessonSkeletons, assessments } };
    });
  }, []);

  const updateAssessments = useCallback((items: AssessmentItem[]) => {
    setAtmState((prev) => ({
      ...prev,
      derived: { ...prev.derived, assessments: items },
    }));
  }, []);

  const resetATM = useCallback(() => setAtmState(createEmptyATM()), []);
  const setATM = useCallback((a: ATM) => setAtmState(a), []);

  return (
    <ATMCtx.Provider value={{ atm, updateContext, addModule, removeModule, updateModule, recalculateDerived, updateAssessments, resetATM, setATM }}>
      {children}
    </ATMCtx.Provider>
  );
}

export function useATM() {
  const ctx = useContext(ATMCtx);
  if (!ctx) throw new Error('useATM must be used within ATMProvider');
  return ctx;
}
