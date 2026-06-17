import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEstimation, downloadPDF } from '../api/estimationAPI';
import CostBreakdownTable from '../components/estimation/CostBreakdownTable';
import TimelineChart from '../components/estimation/TimelineChart';
import TechStackBadges from '../components/estimation/TechStackBadges';
import { Loader } from '../components/common/Loader';
import Button from '../components/common/Button';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import { complexityLabel, complexityColor, projectTypeLabel, statusColor } from '../utils/complexityLabel';
import { Download, ArrowLeft, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const EstimationResult = () => {
  const { id } = useParams();
  const [estimation, setEstimation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getEstimation(id);
        setEstimation(data.data.estimation);
      } catch { toast.error('Failed to load estimation'); }
      setLoading(false);
    };
    fetch();
  }, [id]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await downloadPDF(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `estimation-${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('PDF downloaded!');
    } catch { toast.error('Failed to download PDF'); }
    setDownloading(false);
  };

  if (loading) return <Loader text="Loading estimation..." />;
  if (!estimation) return <div className="text-center py-20"><p className="text-gray-500">Estimation not found.</p><Link to="/dashboard" className="text-indigo-500 font-medium mt-4 inline-block">Back to Dashboard</Link></div>;

  const { calculation, complexity, timeline, recommendedTechStack, selectedFeatures } = estimation;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link to="/estimations" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-500"><ArrowLeft className="w-4 h-4" /> Back to History</Link>

      {/* Hero */}
      <div className="card bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div><h1 className="font-heading text-2xl font-bold">{estimation.projectName}</h1><p className="text-indigo-100 mt-1">{projectTypeLabel(estimation.projectType)} • {formatDate(estimation.createdAt)}</p></div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(estimation.status)} !bg-white/20 !text-white`}>{estimation.status}</span>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div><p className="text-indigo-200 text-xs">Total Cost</p><p className="text-3xl font-heading font-bold">{formatCurrency(calculation.totalCost)}</p></div>
          <div><p className="text-indigo-200 text-xs">Timeline</p><p className="text-2xl font-heading font-bold">{timeline.totalWeeks}w</p></div>
          <div><p className="text-indigo-200 text-xs">Complexity</p><p className="text-2xl font-heading font-bold">{complexityLabel(complexity.level)}</p></div>
        </div>
      </div>

      {/* Complexity Meter */}
      <div className="card">
        <h3 className="font-heading font-semibold text-lg text-navy-800 mb-4">Complexity Analysis</h3>
        <div className="flex items-center gap-4 mb-3">
          {['low', 'medium', 'high', 'enterprise'].map(l => (
            <div key={l} className={`flex-1 h-3 rounded-full ${l === complexity.level ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-indigo' : 'bg-gray-200'}`} />
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500"><span>Low</span><span>Medium</span><span>High</span><span>Enterprise</span></div>
        <p className="text-sm text-gray-600 mt-3">{complexity.breakdown}</p>
      </div>

      <div className="card"><h3 className="font-heading font-semibold text-lg text-navy-800 mb-4">Cost Breakdown</h3><CostBreakdownTable calculation={calculation} selectedFeatures={selectedFeatures} /></div>
      <div className="card"><h3 className="font-heading font-semibold text-lg text-navy-800 mb-4">Project Timeline</h3><TimelineChart phases={timeline.phases} /></div>
      <div className="card"><h3 className="font-heading font-semibold text-lg text-navy-800 mb-4">Recommended Tech Stack</h3><TechStackBadges techStack={recommendedTechStack} /></div>

      <div className="flex gap-4">
        <Button onClick={handleDownload} loading={downloading} className="flex-1"><Download className="w-5 h-5 mr-2" /> Download PDF</Button>
        <Link to="/estimate/new" className="flex-1"><Button variant="secondary" className="w-full"><Plus className="w-5 h-5 mr-2" /> New Estimate</Button></Link>
      </div>
    </div>
  );
};

export default EstimationResult;
