import { useState, useEffect } from 'react';
import { getAdminProjectTypes, createProjectType, updateProjectType, toggleProjectType, deleteProjectType } from '../../api/adminAPI';
import ProjectTypeForm from '../../components/admin/ProjectTypeForm';
import Button from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { formatCurrency } from '../../utils/formatCurrency';
import * as Icons from 'lucide-react';
import toast from 'react-hot-toast';

const AdminProjectTypes = () => {
  const [projectTypes, setProjectTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);

  const fetchProjectTypes = async () => {
    try {
      const { data } = await getAdminProjectTypes();
      setProjectTypes(data.data.projectTypes);
    } catch { toast.error('Failed to load project types'); }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjectTypes();
  }, []);

  const handleSave = async (formData) => {
    try {
      if (editingType) {
        await updateProjectType(editingType._id, formData);
        toast.success('Project type updated');
      } else {
        await createProjectType(formData);
        toast.success('Project type created');
      }
      setIsFormOpen(false);
      setEditingType(null);
      fetchProjectTypes();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
  };

  const handleToggle = async (id) => {
    try {
      await toggleProjectType(id);
      fetchProjectTypes();
      toast.success('Status updated');
    } catch { toast.error('Failed to update status'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this project type?')) return;
    try {
      await deleteProjectType(id);
      fetchProjectTypes();
      toast.success('Project type deactivated');
    } catch { toast.error('Failed to deactivate'); }
  };

  const renderIcon = (iconName) => {
    const Icon = Icons[iconName] || Icons.Code2;
    return <Icon className="w-5 h-5 text-indigo-500" />;
  };

  if (loading) return <Loader text="Loading project types..." />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div><h1 className="font-heading text-2xl font-bold text-navy-900">Project Types</h1><p className="text-gray-500 text-sm mt-1">Manage project types, pricing, and complexity rules.</p></div>
        <Button onClick={() => { setEditingType(null); setIsFormOpen(true); }}><Icons.Plus className="w-5 h-5 mr-2" /> Add Project Type</Button>
      </div>

      <div className="card overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4 text-center">Hours</th>
                <th className="px-6 py-4 text-center">Rate/hr</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projectTypes.map((pt) => (
                <tr key={pt._id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">{renderIcon(pt.icon)}</div>
                      <div><p className="font-medium text-navy-900">{pt.name}</p><p className="text-xs text-gray-500">Min: {formatCurrency(pt.minimumBudget)}</p></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-medium">{pt.baseProjectHours}h</td>
                  <td className="px-6 py-4 text-center font-medium">{formatCurrency(pt.baseHourlyRate)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${pt.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{pt.isActive ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleToggle(pt._id)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Toggle Status">{pt.isActive ? <Icons.EyeOff className="w-4 h-4" /> : <Icons.Eye className="w-4 h-4" />}</button>
                      <button onClick={() => { setEditingType(pt); setIsFormOpen(true); }} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit"><Icons.Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(pt._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Deactivate"><Icons.Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {projectTypes.length === 0 && (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">No project types found. Create your first one!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && <ProjectTypeForm initialData={editingType} onSave={handleSave} onCancel={() => { setIsFormOpen(false); setEditingType(null); }} />}
    </div>
  );
};

export default AdminProjectTypes;
