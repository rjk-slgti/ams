import { useState } from 'react';
import { useATM } from '@/context/ATMContext';
import type { ModuleData } from '@/engine/atm';
import { validateModule } from '@/engine/validation';
import { calculateSessions } from '@/engine/derivation';
import { Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

const emptyModule = { code: '', name: '', totalHours: 0, theoryHours: 0, practicalHours: 0 };

export default function ModulesPage() {
  const { atm, addModule, removeModule, updateModule } = useATM();
  const [form, setForm] = useState(emptyModule);
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ['totalHours', 'theoryHours', 'practicalHours'].includes(name) ? parseFloat(value) || 0 : value,
    }));
  };

  const handleAdd = () => {
    const validation = validateModule({ ...form, id: '' });
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    setErrors([]);
    addModule(form);
    setForm(emptyModule);
    toast.success('Module added');
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-foreground">Modules & Hours</h2>
      <p className="text-muted-foreground mt-1 text-sm">Define modules with theory and practical hour breakdowns</p>

      {/* Add form */}
      <div className="mt-6 bg-card border border-border rounded-md p-6 max-w-2xl">
        <h3 className="text-sm font-medium mb-4">Add New Module</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Module Code</label>
            <input name="code" value={form.code} onChange={handleChange} className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Module Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Total Hours</label>
            <input name="totalHours" type="number" min={0} value={form.totalHours || ''} onChange={handleChange} className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Theory Hours</label>
            <input name="theoryHours" type="number" min={0} value={form.theoryHours || ''} onChange={handleChange} className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Practical Hours</label>
            <input name="practicalHours" type="number" min={0} value={form.practicalHours || ''} onChange={handleChange} className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>
        {errors.length > 0 && (
          <div className="mt-3 p-3 bg-destructive/10 rounded-md">
            {errors.map((e, i) => <p key={i} className="text-xs text-destructive">{e}</p>)}
          </div>
        )}
        <button onClick={handleAdd} className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:opacity-90 active:scale-[0.98] transition-all">
          <Plus size={14} /> Add Module
        </button>
      </div>

      {/* Module list */}
      {atm.modules.length > 0 && (
        <div className="mt-6 bg-card border border-border rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Code</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Total</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Theory</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Practical</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Sessions</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {atm.modules.map((mod) => (
                <tr key={mod.id} className="border-t border-border">
                  <td className="px-4 py-3 font-mono text-xs">{mod.code}</td>
                  <td className="px-4 py-3">{mod.name}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{mod.totalHours}h</td>
                  <td className="px-4 py-3 text-right tabular-nums">{mod.theoryHours}h</td>
                  <td className="px-4 py-3 text-right tabular-nums">{mod.practicalHours}h</td>
                  <td className="px-4 py-3 text-right tabular-nums">{calculateSessions(mod)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => removeModule(mod.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
