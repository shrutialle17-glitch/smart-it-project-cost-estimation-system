import { useState, useEffect } from 'react';
import Button from '../common/Button';

const FeatureForm = ({ feature, onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState({ name: '', description: '', category: 'core', baseHours: '', complexityWeight: '', icon: 'box' });

  useEffect(() => {
    if (feature) setForm({ name: feature.name, description: feature.description || '', category: feature.category, baseHours: feature.baseHours, complexityWeight: feature.complexityWeight, icon: feature.icon || 'box' });
  }, [feature]);

  const handleSubmit = (e) => { e.preventDefault(); onSubmit(form); };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Feature Name</label>
        <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows="2" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Category</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
            {['core', 'security', 'integration', 'ai', 'communication', 'analytics', 'storage', 'localization'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Base Hours</label>
          <input type="number" value={form.baseHours} onChange={(e) => setForm({ ...form, baseHours: e.target.value })} className="input-field" min="1" required />
        </div>
      </div>
      <div>
        <label className="label">Complexity Weight (1-10)</label>
        <input type="number" value={form.complexityWeight} onChange={(e) => setForm({ ...form, complexityWeight: e.target.value })} className="input-field" min="1" max="10" required />
      </div>
      <div className="flex gap-3 pt-4">
        <Button type="submit" loading={loading}>{feature ? 'Update Feature' : 'Create Feature'}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
};

export default FeatureForm;
