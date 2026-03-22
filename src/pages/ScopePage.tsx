import { useState } from 'react';
import { useATM } from '@/context/ATMContext';
import type { ATMContext } from '@/engine/atm';
import { toast } from 'sonner';

export default function ScopePage() {
  const { atm, updateContext } = useATM();
  const [form, setForm] = useState<ATMContext>({ ...atm.context });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    if (!form.programName.trim() || !form.programCode.trim()) {
      toast.error('Program name and code are required');
      return;
    }
    updateContext(form);
    toast.success('Program scope saved');
  };

  const fields = [
    { name: 'institutionName', label: 'Institution Name' },
    { name: 'programName', label: 'Program Name *' },
    { name: 'programCode', label: 'Program Code *' },
    { name: 'nvsLevel', label: 'NVQ/NVS Level' },
    { name: 'duration', label: 'Duration (e.g. 6 months)' },
  ] as const;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-foreground">Program Scope</h2>
      <p className="text-muted-foreground mt-1 text-sm">Define the academic program context</p>
      <div className="mt-6 bg-card border border-border rounded-md p-6 space-y-4 max-w-lg">
        {fields.map(({ name, label }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
            <input
              name={name}
              value={form[name]}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        ))}
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Save Scope
        </button>
      </div>
    </div>
  );
}
