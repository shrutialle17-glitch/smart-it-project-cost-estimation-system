import { useState, useEffect } from 'react';
import Button from '../common/Button';
import { X } from 'lucide-react';
import * as Icons from 'lucide-react';

const ProjectTypeForm = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'Globe',
    baseProjectHours: 0,
    baseHourlyRate: 0,
    minimumBudget: 0,
    displayOrder: 0,
    isActive: true,
    complexityMultipliers: { low: 1.0, medium: 1.3, high: 1.7, enterprise: 2.2 },
  });
  
  const [slug, setSlug] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        icon: initialData.icon || 'Globe',
        baseProjectHours: initialData.baseProjectHours || 0,
        baseHourlyRate: initialData.baseHourlyRate || 0,
        minimumBudget: initialData.minimumBudget || 0,
        displayOrder: initialData.displayOrder || 0,
        isActive: initialData.isActive !== undefined ? initialData.isActive : true,
        complexityMultipliers: initialData.complexityMultipliers || { low: 1.0, medium: 1.3, high: 1.7, enterprise: 2.2 },
      });
      setSlug(initialData.slug || '');
    }
  }, [initialData]);

  // Auto-generate slug from name if creating new
  useEffect(() => {
    if (!initialData) {
      setSlug(formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, ''));
    }
  }, [formData.name, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, slug });
  };

  const commonIcons = ['Globe', 'Smartphone', 'Monitor', 'ShoppingCart', 'Code2', 'Database', 'Cloud', 'Terminal', 'Layout', 'Settings'];

  const SelectedIcon = Icons[formData.icon] || Icons.Code2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto my-8">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="font-heading text-xl font-bold text-navy-900">{initialData ? 'Edit Project Type' : 'Add Project Type'}</h2>
          <button onClick={onCancel} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" required placeholder="e.g. Web Application" />
              <p className="text-xs text-gray-500 mt-1">Slug: {slug}</p>
            </div>
            <div>
              <label className="label">Icon</label>
              <div className="flex gap-2">
                <div className="w-11 h-11 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                  <SelectedIcon className="w-5 h-5 text-indigo-600" />
                </div>
                <select value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} className="input-field">
                  {commonIcons.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="label">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-field" rows="2" placeholder="Shown to clients during selection..." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="label">Base Project Hours</label>
              <input type="number" value={formData.baseProjectHours} onChange={(e) => setFormData({ ...formData, baseProjectHours: Number(e.target.value) })} className="input-field" required min="0" />
            </div>
            <div>
              <label className="label">Base Hourly Rate ($)</label>
              <input type="number" value={formData.baseHourlyRate} onChange={(e) => setFormData({ ...formData, baseHourlyRate: Number(e.target.value) })} className="input-field" required min="0" />
            </div>
            <div>
              <label className="label">Minimum Budget ($)</label>
              <input type="number" value={formData.minimumBudget} onChange={(e) => setFormData({ ...formData, minimumBudget: Number(e.target.value) })} className="input-field" required min="0" />
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-navy-800 mb-3 text-sm">Complexity Multipliers</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {['low', 'medium', 'high', 'enterprise'].map((level) => (
                <div key={level}>
                  <label className="label capitalize">{level}</label>
                  <input type="number" step="0.1" value={formData.complexityMultipliers[level]} onChange={(e) => setFormData({ ...formData, complexityMultipliers: { ...formData.complexityMultipliers, [level]: Number(e.target.value) } })} className="input-field" required min="0.1" />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <div>
              <label className="label">Display Order</label>
              <input type="number" value={formData.displayOrder} onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })} className="input-field" />
              <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
            </div>
            <div className="flex items-center mt-8">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Save Project Type</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectTypeForm;
