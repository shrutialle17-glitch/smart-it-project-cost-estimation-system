import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyEstimations, deleteEstimation } from '../api/estimationAPI';
import EstimationTable from '../components/admin/EstimationTable';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const EstimationHistory = () => {
  const [estimations, setEstimations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const navigate = useNavigate();

  const fetch = async (p = 1) => {
    setLoading(true);
    try {
      const { data } = await getMyEstimations({ page: p, limit: 10 });
      setEstimations(data.data.estimations);
      setPagination(data.pagination);
    } catch { toast.error('Failed to load estimations'); }
    setLoading(false);
  };

  useEffect(() => { fetch(page); }, [page]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this estimation?')) return;
    try { await deleteEstimation(id); toast.success('Deleted'); fetch(page); } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="font-heading text-2xl font-bold text-navy-900">Estimation History</h1><p className="text-gray-500 text-sm mt-1">All your project estimations in one place</p></div>
        <Button onClick={() => navigate('/create-estimation')}><Plus className="w-5 h-5 mr-2" /> New Estimate</Button>
      </div>
      <div className="card">
        {loading ? <Loader /> : <EstimationTable estimations={estimations} onView={(id) => navigate(`/estimations/${id}`)} onDelete={handleDelete} />}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {Array.from({ length: pagination.pages }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} className={`w-9 h-9 rounded-lg text-sm font-medium ${page === i + 1 ? 'bg-indigo-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{i + 1}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EstimationHistory;
