import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getMyEstimations } from '../api/estimationAPI';
import { formatCurrency } from '../utils/formatCurrency';
import EstimationTable from '../components/admin/EstimationTable';
import { Loader } from '../components/common/Loader';
import { Plus, FileText, DollarSign, TrendingUp, Calculator } from 'lucide-react';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [estimations, setEstimations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getMyEstimations({ limit: 5 });
        setEstimations(data.data.estimations);
      } catch { /* ignore */ }
      setLoading(false);
    };
    fetch();
  }, []);

  const totalValue = estimations.reduce((sum, e) => sum + (e.calculation?.totalCost || 0), 0);

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome */}
      <div className="card bg-gradient-to-r from-indigo-500 to-indigo-600 text-white mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div><h1 className="font-heading text-2xl font-bold">Welcome back, {user?.name}!</h1><p className="text-indigo-100 mt-1">Ready to create your next project estimate?</p></div>
          <Link to="/create-estimation" className="inline-flex items-center gap-2 bg-white text-indigo-600 font-semibold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors"><Plus className="w-5 h-5" /> New Estimate</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { icon: FileText, label: 'Total Estimates', value: estimations.length, color: 'from-indigo-500 to-indigo-600' },
          { icon: DollarSign, label: 'Total Value', value: formatCurrency(totalValue), color: 'from-emerald-500 to-emerald-600' },
          { icon: Calculator, label: 'This Month', value: estimations.filter(e => new Date(e.createdAt) > new Date(new Date().setDate(1))).length, color: 'from-blue-500 to-blue-600' },
          { icon: TrendingUp, label: 'Avg Cost', value: estimations.length ? formatCurrency(totalValue / estimations.length) : '₹0', color: 'from-orange-500 to-orange-600' },
        ].map((s, i) => (
          <div key={i} className="card-hover">
            <div className="flex items-start justify-between">
              <div><p className="text-sm text-gray-500 mb-1">{s.label}</p><p className="text-2xl font-heading font-bold text-navy-800">{s.value}</p></div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}><s.icon className="w-6 h-6 text-white" /></div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Estimations */}
      <div className="card">
        <div className="flex items-center justify-between mb-6"><h2 className="font-heading font-semibold text-lg text-navy-800">Recent Estimations</h2><Link to="/estimations" className="text-sm text-indigo-500 font-medium hover:text-indigo-600">View All →</Link></div>
        {loading ? <Loader /> : <EstimationTable estimations={estimations} onView={(id) => window.location.href = `/estimations/${id}`} />}
      </div>
    </div>
  );
};

export default ClientDashboard;
