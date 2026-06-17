import { useState, useEffect } from 'react';
//import { getFeatures } from '../../api/estimationAPI';
import { getFeatures,createFeature, updateFeature, deleteFeature } from '../../api/adminAPI';
import FeatureForm from '../../components/admin/FeatureForm';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminFeatures = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editFeature, setEditFeature] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
      try {
    const response = await getFeatures();
    console.log(response.data);

    setFeatures(response.data.data.features);
  } catch (error) {
    console.log(error);
    toast.error('Failed to load features');
  }
  setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (form) => {
    setSaving(true);
    try {
      if (editFeature) { await updateFeature(editFeature._id, form); toast.success('Feature updated'); }
      else { await createFeature(form); toast.success('Feature created'); }
      setModalOpen(false); setEditFeature(null); fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Deactivate this feature?')) return;
    try { await deleteFeature(id); toast.success('Feature deactivated'); fetch(); } catch { toast.error('Failed'); }
  };

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="font-heading text-2xl font-bold text-navy-900">Features</h1><p className="text-gray-500 text-sm mt-1">{features.length} features</p></div>
        <Button onClick={() => { setEditFeature(null); setModalOpen(true); }}><Plus className="w-5 h-5 mr-2" /> Add Feature</Button>
      </div>
      <div className="card">
        {loading ? <Loader /> : features.length === 0 ? <p className="text-center py-12 text-gray-400">No features</p> : (
          <table className="w-full">
            <thead><tr className="border-b border-gray-200"><th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Name</th><th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Category</th><th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Hours</th><th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Weight</th><th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Actions</th></tr></thead>
            <tbody>{features.map(f => (<tr key={f._id} className="border-b border-gray-100 hover:bg-indigo-50/30"><td className="py-3 px-4 text-sm font-medium text-navy-800">{f.name}</td><td className="py-3 px-4"><span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-medium capitalize">{f.category}</span></td><td className="py-3 px-4 text-sm text-center">{f.baseHours}h</td><td className="py-3 px-4 text-sm text-center">{f.complexityWeight}/10</td><td className="py-3 px-4 text-right"><div className="flex items-center justify-end gap-2"><button onClick={() => { setEditFeature(f); setModalOpen(true); }} className="p-1.5 rounded-lg hover:bg-indigo-100 text-indigo-600"><Edit className="w-4 h-4" /></button><button onClick={() => handleDelete(f._id)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-500"><Trash2 className="w-4 h-4" /></button></div></td></tr>))}</tbody>
          </table>
        )}
      </div>
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditFeature(null); }} title={editFeature ? 'Edit Feature' : 'Add Feature'}>
        <FeatureForm feature={editFeature} onSubmit={handleSubmit} onCancel={() => { setModalOpen(false); setEditFeature(null); }} loading={saving} />
      </Modal>
    </div>
  );
};

export default AdminFeatures;
