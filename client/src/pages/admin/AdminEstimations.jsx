import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminEstimations, updateEstimationStatus } from '../../api/adminAPI';
import EstimationTable from '../../components/admin/EstimationTable';
import { Loader } from '../../components/common/Loader';
import toast from 'react-hot-toast';

const AdminEstimations = () => {
  const [estimations, setEstimations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({ status: '', projectType: '' });
  const navigate = useNavigate();

  const fetch = async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 10, ...filters };
      Object.keys(params).forEach(k => !params[k] && delete params[k]);
      const { data } = await getAdminEstimations(params);
      setEstimations(data.data.estimations);
      setPagination(data.pagination);
    } catch { toast.error('Failed to load estimations'); }
    setLoading(false);
  };

  useEffect(() => { fetch(page); }, [page, filters]);

  const handleStatusChange = async (id, status) => {
    try { await updateEstimationStatus(id, status); toast.success('Status updated'); fetch(page); } catch { toast.error('Failed to update'); }
  };

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div><h1 className="font-heading text-2xl font-bold text-navy-900">All Estimations</h1><p className="text-gray-500 text-sm mt-1">{pagination?.total || 0} total</p></div>
        <div className="flex gap-3">
          <select value={filters.status} onChange={e => { setFilters({...filters, status: e.target.value}); setPage(1); }} className="input-field !py-2 !w-36"><option value="">All Status</option>{['draft','saved','sent','accepted','rejected'].map(s => <option key={s} value={s}>{s}</option>)}</select>
          <select value={filters.projectType} onChange={e => { setFilters({...filters, projectType: e.target.value}); setPage(1); }} className="input-field !py-2 !w-44"><option value="">All Types</option>{['website','mobile_app','web_application','ecommerce_platform','custom_software'].map(t => <option key={t} value={t}>{t.replace(/_/g,' ')}</option>)}</select>
        </div>
      </div>
      <div className="card">
        {loading ? <Loader /> : <EstimationTable estimations={estimations} showClient onView={(id) => navigate(`/estimations/${id}`)} onStatusChange={handleStatusChange} />}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">{Array.from({ length: pagination.pages }, (_, i) => (<button key={i} onClick={() => setPage(i+1)} className={`w-9 h-9 rounded-lg text-sm font-medium ${page === i+1 ? 'bg-indigo-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{i+1}</button>))}</div>
        )}
      </div>
    </div>
  );
};

export default AdminEstimations;
