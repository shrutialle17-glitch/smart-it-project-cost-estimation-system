import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAdminStats } from '../../api/adminAPI';
import StatsCard from '../../components/admin/StatsCard';
import { Loader } from '../../components/common/Loader';
import { formatCurrency } from '../../utils/formatCurrency';
import { 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Eye, 
  Download,
  Sparkles,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  ArrowRight,
  Clock,
  Layers,
  Zap,
  LayoutDashboard,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Home,
  FolderTree,
  Cpu,
  ListChecks
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const AdminDashboard = () => {
  const location = useLocation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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

  // Navigation items
  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { to: '/admin/project-types', icon: FolderTree, label: 'Project Types' },
    { to: '/admin/tech-stacks', icon: Cpu, label: 'Tech Stacks' },
    { to: '/admin/features', icon: ListChecks, label: 'Manage Features' },
    { to: '/admin/estimations', icon: Eye, label: 'All Estimations' },
    { to: '/admin/clients', icon: Users, label: 'View Clients' },
  ];

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Menu className="w-5 h-5 text-navy-700" />
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 rounded-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-bold text-navy-800 text-sm">Admin Panel</span>
          </div>
          <div className="w-8"></div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-50"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`
        lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-bold text-navy-800">Admin Panel</span>
            </div>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-navy-700" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${isActive(item.to, item.exact) 
                      ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 font-medium shadow-sm' 
                      : 'text-navy-600 hover:bg-gray-50 hover:text-navy-800'
                    }
                  `}
                >
                  <item.icon className={`w-5 h-5 ${isActive(item.to, item.exact) ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <span className="text-sm">{item.label}</span>
                  {isActive(item.to, item.exact) && (
                    <div className="ml-auto w-1.5 h-8 rounded-full bg-gradient-to-b from-indigo-500 to-purple-600"></div>
                  )}
                </Link>
              ))}
            </div>
          </div>
          <div className="p-4 border-t border-gray-100">
            <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className={`
          hidden lg:flex flex-col fixed left-0 top-0 bottom-0 bg-white border-r border-gray-200/50 shadow-lg transition-all duration-300 z-40
          ${sidebarOpen ? 'w-64' : 'w-20'}
        `}>
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className={`
                font-heading font-bold text-navy-800 transition-all duration-300 whitespace-nowrap
                ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0'}
              `}>
                Admin Panel
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors flex-shrink-0"
            >
              {sidebarOpen ? (
                <ChevronLeft className="w-4 h-4 text-navy-700" />
              ) : (
                <ChevronRight className="w-4 h-4 text-navy-700" />
              )}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                    ${isActive(item.to, item.exact) 
                      ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 font-medium shadow-sm' 
                      : 'text-navy-600 hover:bg-gray-50 hover:text-navy-800'
                    }
                  `}
                  title={!sidebarOpen ? item.label : ''}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive(item.to, item.exact) ? 'text-indigo-600' : 'text-gray-400 group-hover:text-navy-600'}`} />
                  <span className={`
                    text-sm transition-all duration-300 whitespace-nowrap
                    ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0'}
                  `}>
                    {item.label}
                  </span>
                  {isActive(item.to, item.exact) && sidebarOpen && (
                    <div className="ml-auto w-1.5 h-8 rounded-full bg-gradient-to-b from-indigo-500 to-purple-600"></div>
                  )}
                  {isActive(item.to, item.exact) && !sidebarOpen && (
                    <div className="absolute left-0 w-1 h-8 rounded-r-full bg-gradient-to-b from-indigo-500 to-purple-600"></div>
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="p-3 border-t border-gray-100">
            <button className={`
              flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors
              ${!sidebarOpen && 'justify-center'}
            `}>
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className={`
                text-sm font-medium transition-all duration-300 whitespace-nowrap
                ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0'}
              `}>
                Logout
              </span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`
          flex-1 transition-all duration-300
          ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}
          pt-16 lg:pt-0
        `}>
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header - Premium */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="font-heading text-3xl font-bold bg-gradient-to-r from-navy-900 to-navy-700 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                </div>
                <p className="text-gray-500 text-sm ml-1 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Overview of your platform performance
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link 
                  to="/admin/features" 
                  className="inline-flex items-center gap-2 bg-white text-navy-700 font-medium px-5 py-2.5 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 shadow-sm hover:shadow-md text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Feature</span>
                </Link>
                <Link 
                  to="/admin/clients" 
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium px-5 py-2.5 rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 text-sm"
                >
                  <Users className="w-4 h-4" />
                  <span>View Clients</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Stats Grid - Premium */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100/50 hover:border-indigo-200">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-indigo-50 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-6 h-6 text-indigo-600" />
                    </div>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">+12%</span>
                  </div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Total Clients</p>
                  <p className="text-3xl font-heading font-bold text-navy-800 tracking-tight">{stats.totalClients}</p>
                  <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000 w-3/4"></div>
                  </div>
                </div>
              </div>

              <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100/50 hover:border-blue-200">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-blue-50 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">+8%</span>
                  </div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Total Estimations</p>
                  <p className="text-3xl font-heading font-bold text-navy-800 tracking-tight">{stats.totalEstimations}</p>
                  <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full transition-all duration-1000 w-2/3"></div>
                  </div>
                </div>
              </div>

              <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100/50 hover:border-emerald-200">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-teal-500/0 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-emerald-50 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      <DollarSign className="w-6 h-6 text-emerald-600" />
                    </div>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">+15%</span>
                  </div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Revenue Estimated</p>
                  <p className="text-3xl font-heading font-bold text-navy-800 tracking-tight">{formatCurrency(stats.totalRevenue)}</p>
                  <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-1000 w-4/5"></div>
                  </div>
                </div>
              </div>

              <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100/50 hover:border-orange-200">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-amber-500/0 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-orange-50 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      <TrendingUp className="w-6 h-6 text-orange-600" />
                    </div>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">Active</span>
                  </div>
                  <p className="text-sm text-gray-500 font-medium mb-1">This Month</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-heading font-bold text-navy-800 tracking-tight">{stats.thisMonthEstimations}</p>
                    <p className="text-sm text-gray-400">estimates</p>
                  </div>
                  <p className="text-xs text-emerald-600 mt-1">{stats.thisMonthClients} new clients</p>
                  <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-amber-600 rounded-full transition-all duration-1000 w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts - Premium */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100/50">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-navy-800">Estimations Over Time</h3>
                      <p className="text-xs text-gray-400">Monthly trend analysis</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Live
                    </span>
                  </div>
                </div>
                {stats.estimationsOverTime?.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={stats.estimationsOverTime.map(d => ({ date: d._id.slice(5), count: d.count }))}>
                      <defs>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#6366F1" />
                          <stop offset="100%" stopColor="#8B5CF6" />
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 11, fill: '#94A3B8' }} 
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        tick={{ fontSize: 11, fill: '#94A3B8' }} 
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: 12, 
                          border: '1px solid #E2E8F0',
                          background: 'white',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="count" 
                        stroke="url(#lineGradient)" 
                        strokeWidth={3} 
                        dot={{ fill: '#6366F1', r: 5, strokeWidth: 2, stroke: 'white' }}
                        activeDot={{ r: 7, strokeWidth: 2, stroke: 'white' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="bg-gray-50 p-4 rounded-full mb-3">
                      <BarChart3 className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-400 text-sm">No data available yet</p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100/50">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl">
                      <PieChartIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-navy-800">By Project Type</h3>
                      <p className="text-xs text-gray-400">Distribution analysis</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {COLORS.slice(0, 3).map((color, idx) => (
                      <div key={idx} className="w-3 h-3 rounded-full" style={{ background: color }}></div>
                    ))}
                  </div>
                </div>
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie 
                        data={pieData} 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={60} 
                        outerRadius={100} 
                        dataKey="value"
                        paddingAngle={2}
                      >
                        {pieData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                            stroke="white"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: 12, 
                          border: '1px solid #E2E8F0',
                          background: 'white',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="bg-gray-50 p-4 rounded-full mb-3">
                      <PieChartIcon className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-400 text-sm">No data available yet</p>
                  </div>
                )}
                {pieData.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-4 mt-2 pt-3 border-t border-gray-100">
                    {pieData.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: COLORS[idx % COLORS.length] }}></div>
                        <span className="text-xs text-gray-600">{item.name}</span>
                        <span className="text-xs font-semibold text-navy-700">{item.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Links - Now integrated into sidebar, keeping for reference */}
            <div className="lg:hidden relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-2 rounded-xl">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-navy-800">Quick Access</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { to: '/admin/project-types', icon: Layers, label: 'Project Types', color: 'from-emerald-500 to-emerald-600', desc: 'Manage types' },
                  { to: '/admin/tech-stacks', icon: FileText, label: 'Tech Stacks', color: 'from-blue-500 to-blue-600', desc: 'Configure stacks' },
                  { to: '/admin/features', icon: Plus, label: 'Manage Features', color: 'from-indigo-500 to-indigo-600', desc: 'Add/Edit features' },
                  { to: '/admin/estimations', icon: Eye, label: 'All Estimations', color: 'from-orange-500 to-orange-600', desc: 'View all' },
                ].map((item, i) => (
                  <Link 
                    key={i} 
                    to={item.to} 
                    className="group relative bg-white rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100/50 hover:border-indigo-200 text-center overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-indigo-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative">
                      <div className={`w-14 h-14 mx-auto mb-3 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300`}>
                        <item.icon className="w-7 h-7 text-white" />
                      </div>
                      <p className="text-sm font-semibold text-navy-800 group-hover:text-indigo-600 transition-colors">
                        {item.label}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
                      <div className="mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                        <ArrowRight className="w-4 h-4 text-indigo-500 mx-auto" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;