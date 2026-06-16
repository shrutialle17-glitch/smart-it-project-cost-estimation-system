import { Link } from "react-router-dom";
import { getAdminStats } from "../../api/adminAPI";
import StatsCard from "../../components/admin/StatsCard";
import { Loader } from "../../components/common/Loader";
import { useState, useEffect } from "react";
import { FileText, Users, TrendingUp } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState();

  useEffect(() => {
  const fetchStats = async () => {
    const { data } = await getAdminStats();
    setStats(data.data);
  };
  fetchStats();
  }, []);

  if (!stats) {
    return <Loader text="Loading dashboard..." />;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <StatsCard
        icon={FileText}
        label="Total Features"
        value={stats.totalFeatures}
      />

      <StatsCard
        icon={Users}
        label="Total Clients"
        value={stats.totalClients}
      />

      <StatsCard
        icon={TrendingUp}
        label="Total Estimations"
        value={stats.totalEstimations}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/admin/features"
          className="p-6 border rounded-lg shadow hover:bg-gray-50"
        >
          <h2 className="font-semibold text-lg">Features</h2>
          <p>Manage Features</p>
        </Link>

        <Link
          to="/admin/project-types"
          className="p-6 border rounded-lg shadow hover:bg-gray-50"
        >
          <h2 className="font-semibold text-lg">Project Types</h2>
          <p>Manage Project Types</p>
        </Link>

        <Link
          to="/admin/tech-stacks"
          className="p-6 border rounded-lg shadow hover:bg-gray-50"
        >
          <h2 className="font-semibold text-lg">Tech Stacks</h2>
          <p>Manage Tech Stacks</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
