import { useState, useEffect } from "react";
import {
  getAdminTechStacks,
  createTechStack,
  updateTechStack,
  deleteTechStack,
  getAdminProjectTypes,
} from "../../api/adminAPI";
import TechStackForm from "../../components/admin/TechStackForm";
//import TechStackBadges from '../../components/estimation/TechStackBadges';
import Button from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";
import * as Icons from "lucide-react";
import toast from "react-hot-toast";

const AdminTechStacks = () => {
  const [techStacks, setTechStacks] = useState([]);
  const [projectTypes, setProjectTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStack, setEditingStack] = useState(null);

  const fetchData = async () => {
    try {
      const [stacksRes, ptsRes] = await Promise.all([
        getAdminTechStacks(),
        getAdminProjectTypes(),
      ]);
      setTechStacks(stacksRes.data.data.techStacks);
      setProjectTypes(ptsRes.data.data.projectTypes);
    } catch {
      toast.error("Failed to load data");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (formData) => {
    try {
      if (editingStack) {
        await updateTechStack(editingStack._id, formData);
        toast.success("Tech stack updated");
      } else {
        await createTechStack(formData);
        toast.success("Tech stack created");
      }
      setIsFormOpen(false);
      setEditingStack(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save");
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this tech stack recommendation?",
      )
    )
      return;
    try {
      await deleteTechStack(id);
      fetchData();
      toast.success("Tech stack deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (loading) return <Loader text="Loading tech stacks..." />;

  // Filter project types that don't have a tech stack yet
  const availableProjectTypes = projectTypes.filter(
    (pt) =>
      !techStacks.some((ts) => ts.projectType?._id === pt._id) ||
      (editingStack && editingStack.projectType._id === pt._id),
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy-900">
            Tech Stacks
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage recommended tech stacks per project type.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingStack(null);
            setIsFormOpen(true);
          }}
          disabled={availableProjectTypes.length === 0}
        >
          <Icons.Plus className="w-5 h-5 mr-2" /> Add Tech Stack
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {techStacks.map((ts) => {
          const Icon = ts.projectType?.icon
            ? Icons[ts.projectType.icon] || Icons.Code2
            : Icons.Code2;
          return (
            <div
              key={ts._id}
              className="card flex flex-col h-full relative group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-semibold text-navy-800">
                    {ts.projectType?.name || "Unknown Type"}
                  </h3>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditingStack(ts);
                      setIsFormOpen(true);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Icons.Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(ts._id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Icons.Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 mt-2">
                <p>
                  <strong>Frontend:</strong> {ts.frontend?.join(", ")}
                </p>
                <p>
                  <strong>Backend:</strong> {ts.backend?.join(", ")}
                </p>
                <p>
                  <strong>Database:</strong> {ts.database?.join(", ")}
                </p>
              </div>

              {ts.notes && (
                <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                  <span className="font-medium text-gray-700">Notes:</span>{" "}
                  {ts.notes}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {techStacks.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500 mb-4">No tech stacks defined yet.</p>
          <Button
            onClick={() => {
              setEditingStack(null);
              setIsFormOpen(true);
            }}
          >
            <Icons.Plus className="w-5 h-5 mr-2" /> Add Your First Tech Stack
          </Button>
        </div>
      )}

      {isFormOpen && (
        <TechStackForm
          initialData={editingStack}
          projectTypes={availableProjectTypes}
          onSave={handleSave}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingStack(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminTechStacks;
