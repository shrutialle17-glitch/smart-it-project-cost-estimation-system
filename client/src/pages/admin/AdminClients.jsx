import { useState, useEffect } from 'react';
import { getAdminClients } from '../../api/adminAPI';
import { Loader } from '../../components/common/Loader';
import { formatDate } from '../../utils/formatDate';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const fetch = async (p = 1, s = '') => {
    setLoading(true);
    try {
      const { data } = await getAdminClients({ page: p, limit: 10, search: s });
      setClients(data.data.clients);
      setPagination(data.pagination);
    } catch { toast.error('Failed to load clients'); }
    setLoading(false);
  };

  useEffect(() => { fetch(page, search); }, [page]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetch(1, search); };

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="font-heading text-2xl font-bold text-navy-900">Clients</h1><p className="text-gray-500 text-sm mt-1">{pagination?.total || 0} total clients</p></div>
        <form onSubmit={handleSearch} className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} className="input-field !pl-10 !py-2 w-64" placeholder="Search clients..." /></form>
      </div>
      <div className="card">
        {loading ? <Loader /> : clients.length === 0 ? <p className="text-center py-12 text-gray-400">No clients found</p> : (
          <table className="w-full">
            <thead><tr className="border-b border-gray-200"><th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Name</th><th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Email</th><th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Company</th><th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Estimates</th><th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Joined</th></tr></thead>
            <tbody>{clients.map(c => (<tr key={c._id} className="border-b border-gray-100 hover:bg-indigo-50/30"><td className="py-3 px-4 text-sm font-medium text-navy-800">{c.name}</td><td className="py-3 px-4 text-sm text-gray-600">{c.email}</td><td className="py-3 px-4 text-sm text-gray-600">{c.company || '-'}</td><td className="py-3 px-4 text-sm text-center"><span className="bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full text-xs font-medium">{c.estimationCount}</span></td><td className="py-3 px-4 text-sm text-gray-500">{formatDate(c.createdAt)}</td></tr>))}</tbody>
          </table>
        )}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">{Array.from({ length: pagination.pages }, (_, i) => (<button key={i} onClick={() => setPage(i+1)} className={`w-9 h-9 rounded-lg text-sm font-medium ${page === i+1 ? 'bg-indigo-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{i+1}</button>))}</div>
        )}
      </div>
    </div>
  );
};

export default AdminClients;
