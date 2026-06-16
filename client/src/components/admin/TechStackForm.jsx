import { useState, useEffect } from 'react';
import Button from '../common/Button';
import { X, Tag } from 'lucide-react';

const TagInput = ({ label, tags, onChange, placeholder }) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = input.trim();
      if (val && !tags.includes(val)) {
        onChange([...tags, val]);
      }
      setInput('');
    }
  };

  const removeTag = (indexToRemove) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div>
      <label className="label">{label}</label>
      <div className="p-2 border border-gray-200 rounded-xl bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all flex flex-wrap gap-2 min-h-[42px] items-center">
        {tags.map((tag, index) => (
          <span key={index} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-sm font-medium">
            {tag}
            <button type="button" onClick={() => removeTag(index)} className="hover:text-indigo-900"><X className="w-3 h-3" /></button>
          </span>
        ))}
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} className="flex-1 bg-transparent border-none p-0 focus:ring-0 text-sm min-w-[120px]" placeholder={tags.length === 0 ? placeholder : ''} />
      </div>
    </div>
  );
};

const TechStackForm = ({ initialData, projectTypes, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    projectType: '',
    frontend: [],
    backend: [],
    database: [],
    mobile: [],
    devops: [],
    thirdParty: [],
    notes: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        projectType: initialData.projectType?._id || initialData.projectType || '',
        frontend: initialData.frontend || [],
        backend: initialData.backend || [],
        database: initialData.database || [],
        mobile: initialData.mobile || [],
        devops: initialData.devops || [],
        thirdParty: initialData.thirdParty || [],
        notes: initialData.notes || '',
      });
    } else if (projectTypes.length > 0) {
      setFormData(prev => ({ ...prev, projectType: projectTypes[0]._id }));
    }
  }, [initialData, projectTypes]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto my-8">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="font-heading text-xl font-bold text-navy-900">{initialData ? 'Edit Tech Stack' : 'Add Tech Stack'}</h2>
          <button onClick={onCancel} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="label">Project Type</label>
            <select value={formData.projectType} onChange={(e) => setFormData({ ...formData, projectType: e.target.value })} className="input-field" required disabled={!!initialData}>
              {projectTypes.map(pt => <option key={pt._id} value={pt._id}>{pt.name}</option>)}
            </select>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-navy-800 text-sm flex items-center gap-2"><Tag className="w-4 h-4" /> Technologies (Press Enter to add)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TagInput label="Frontend" tags={formData.frontend} onChange={(tags) => setFormData({ ...formData, frontend: tags })} placeholder="React, Vue..." />
              <TagInput label="Backend" tags={formData.backend} onChange={(tags) => setFormData({ ...formData, backend: tags })} placeholder="Node.js, Express..." />
              <TagInput label="Database" tags={formData.database} onChange={(tags) => setFormData({ ...formData, database: tags })} placeholder="MongoDB, PostgreSQL..." />
              <TagInput label="Mobile (Optional)" tags={formData.mobile} onChange={(tags) => setFormData({ ...formData, mobile: tags })} placeholder="React Native..." />
              <TagInput label="DevOps" tags={formData.devops} onChange={(tags) => setFormData({ ...formData, devops: tags })} placeholder="Docker, AWS..." />
              <TagInput label="Third Party / Integrations" tags={formData.thirdParty} onChange={(tags) => setFormData({ ...formData, thirdParty: tags })} placeholder="Stripe, Twilio..." />
            </div>
          </div>

          <div>
            <label className="label">Admin Notes</label>
            <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="input-field" rows="2" placeholder="Why is this stack recommended?" />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Save Tech Stack</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TechStackForm;
