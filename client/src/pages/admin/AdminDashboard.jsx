import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats } from '../../api/adminAPI';
import StatsCard from '../../components/admin/StatsCard';
import { Loader } from '../../components/common/Loader';
import { formatCurrency } from '../../utils/formatCurrency';
import { Users, FileText, DollarSign, TrendingUp, Plus, Eye, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try { const { data } = await getAdminStats(); setStats(data.data); } catch { toast.error('Failed to load stats'); }
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <Loader text="Loading dashboard..." />;
  if (!stats) return <div className="text-center py-20 text-gray-500">Failed to load dashboard.</div>;

  const pieData = stats.byProjectType?.map((p, i) => ({ name: p.projectTypeName || 'Unknown', value: p.count })) || [];

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="font-heading text-2xl font-bold text-navy-900">Admin Dashboard</h1><p className="text-gray-500 text-sm mt-1">Overview of your platform</p></div>
        <div className="flex gap-3">
          <Link to="/admin/features" className="btn-secondary text-sm !py-2"><Plus className="w-4 h-4 mr-1" /> Add Feature</Link>
          <Link to="/admin/clients" className="btn-primary text-sm !py-2"><Users className="w-4 h-4 mr-1" /> View Clients</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard icon={Users} label="Total Clients" value={stats.totalClients} color="indigo" />
        <StatsCard icon={FileText} label="Total Estimations" value={stats.totalEstimations} color="blue" />
        <StatsCard icon={DollarSign} label="Revenue Estimated" value={formatCurrency(stats.totalRevenue)} color="emerald" />
        <StatsCard icon={TrendingUp} label="This Month" value={stats.thisMonthEstimations} trend={`${stats.thisMonthClients} new clients`} color="orange" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="font-heading font-semibold text-lg text-navy-800 mb-4">Estimations Over Time</h3>
          {stats.estimationsOverTime?.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats.estimationsOverTime.map(d => ({ date: d._id.slice(5), count: d.count }))}>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0' }} />
                <Line type="monotone" dataKey="count" stroke="#6366F1" strokeWidth={2} dot={{ fill: '#6366F1', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-sm py-12 text-center">No data yet</p>}
        </div>
        <div className="card">
          <h3 className="font-heading font-semibold text-lg text-navy-800 mb-4">By Project Type</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-sm py-12 text-center">No data yet</p>}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { to: '/admin/project-types', icon: DollarSign, label: 'Project Types', color: 'from-emerald-500 to-emerald-600' },
          { to: '/admin/tech-stacks', icon: FileText, label: 'Tech Stacks', color: 'from-blue-500 to-blue-600' },
          { to: '/admin/features', icon: Plus, label: 'Manage Features', color: 'from-indigo-500 to-indigo-600' },
          { to: '/admin/estimations', icon: Eye, label: 'All Estimations', color: 'from-orange-500 to-orange-600' },
        ].map((item, i) => (
          <Link key={i} to={item.to} className="card-hover text-center group">
            <div className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}><item.icon className="w-6 h-6 text-white" /></div>
            <p className="text-sm font-medium text-navy-800">{item.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;