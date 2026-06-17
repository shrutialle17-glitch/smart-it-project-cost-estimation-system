import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getMyEstimations } from '../api/estimationAPI';
import { formatCurrency } from '../utils/formatCurrency';
import EstimationTable from '../components/admin/EstimationTable';
import { Loader } from '../components/common/Loader';
import { 
  Plus, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Calculator,
  Sparkles,
  Clock,
  ArrowRight,
  BarChart3,
  PieChart
} from 'lucide-react';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [estimations, setEstimations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getMyEstimations({ limit: 5 });
        setEstimations(data.data.estimations);
        // Mock recent activity (replace with actual data)
        setRecentActivity([
          { type: 'created', label: 'New estimate created', time: '2 hours ago' },
          { type: 'updated', label: 'Estimate #1234 updated', time: '5 hours ago' },
          { type: 'shared', label: 'Estimate shared with client', time: '1 day ago' },
        ]);
      } catch { /* ignore */ }
      setLoading(false);
    };
    fetch();
  }, []);

  const totalValue = estimations.reduce((sum, e) => sum + (e.calculation?.totalCost || 0), 0);
  const thisMonthCount = estimations.filter(e => 
    new Date(e.createdAt) > new Date(new Date().setDate(1))
  ).length;

  const stats = [
    { 
      icon: FileText, 
      label: 'Total Estimates', 
      value: estimations.length, 
      color: 'from-violet-500 to-purple-600',
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-600',
      trend: '+12%',
      trendUp: true
    },
    { 
      icon: DollarSign, 
      label: 'Total Value', 
      value: formatCurrency(totalValue), 
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      trend: '+8.2%',
      trendUp: true
    },
    { 
      icon: Calculator, 
      label: 'This Month', 
      value: thisMonthCount, 
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      trend: '+3',
      trendUp: true
    },
    { 
      icon: TrendingUp, 
      label: 'Avg Cost', 
      value: estimations.length ? formatCurrency(totalValue / estimations.length) : '₹0',
      color: 'from-orange-500 to-amber-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      trend: '-2.1%',
      trendUp: false
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section - Premium */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white mb-8 shadow-2xl shadow-indigo-500/20">
          {/* Background Decor */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-300 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative px-8 py-10 sm:px-10 sm:py-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    Premium Dashboard
                  </span>
                </div>
                <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
                  Welcome back, <span className="bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">{user?.name?.split(' ')[0] || 'User'}</span>!
                </h1>
                <p className="text-indigo-100 text-lg max-w-2xl">
                  Ready to create your next project estimate? Let's build something amazing together.
                </p>
              </div>
              <Link 
                to="/create-estimation" 
                className="inline-flex items-center gap-3 bg-white text-indigo-600 font-semibold px-8 py-4 rounded-2xl hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg group"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                <span>New Estimate</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid - Premium Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100/50 hover:border-indigo-200"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500"></div>
              
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={`${stat.bgColor} p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                    stat.trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                  }`}>
                    <span>{stat.trendUp ? '↑' : '↓'}</span>
                    <span>{stat.trend}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 font-medium mb-1">{stat.label}</p>
                <p className="text-3xl font-heading font-bold text-navy-800 tracking-tight">
                  {stat.value}
                </p>
                <div className="mt-3 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${Math.min(100, (parseFloat(stat.value) || 0) * 10)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Estimations - Main */}
          <div className="lg:col-span-2">
            <div className="card bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100/50">
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-heading font-semibold text-lg text-navy-800">Recent Estimations</h2>
                      <p className="text-xs text-gray-500">Your latest project estimates</p>
                    </div>
                  </div>
                  <Link 
                    to="/estimations" 
                    className="text-sm text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1 group"
                  >
                    View All
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader />
                  </div>
                ) : (
                  <EstimationTable 
                    estimations={estimations} 
                    onView={(id) => window.location.href = `/estimations/${id}`} 
                  />
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Recent Activity & Quick Actions */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="card bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100/50">
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-heading font-semibold text-navy-800">Recent Activity</h3>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3 group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 group-hover:scale-125 transition-transform"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-navy-700">{activity.label}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
                <button className="w-full text-center text-sm text-indigo-600 font-medium hover:text-indigo-700 py-2">
                  View all activity
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-xs text-gray-400">
          <p>© 2026 Premium Dashboard • All estimates are securely stored</p>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;