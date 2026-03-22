// JSON Save / Load for ATM
import type { ATM } from './atm';
import { createEmptyATM } from './atm';

const STORAGE_KEY = 'slgti_atm';

export function saveATM(atm: ATM): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(atm));
  } catch (e) {
    console.error('Failed to save ATM:', e);
  }
}

export function loadATM(): ATM {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ATM;
  } catch (e) {
    console.error('Failed to load ATM:', e);
  }
  return createEmptyATM();
}

export function exportATMToJSON(atm: ATM): void {
  const blob = new Blob([JSON.stringify(atm, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `slgti-atm-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importATMFromFile(file: File): Promise<ATM> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        resolve(JSON.parse(reader.result as string) as ATM);
      } catch {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
