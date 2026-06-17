import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { projectTypeLabel, statusColor } from '../../utils/complexityLabel';
import { Eye, Trash2 } from 'lucide-react';

const EstimationTable = ({ estimations, onView, onStatusChange, onDelete, showClient = false }) => {
  if (!estimations || estimations.length === 0) {
    return <div className="text-center py-12 text-gray-400"><p>No estimations found</p></div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            {showClient && <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Client</th>}
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Project</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Type</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Cost</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {estimations.map((est) => (
            <tr key={est._id} className="border-b border-gray-100 hover:bg-indigo-50/30 transition-colors">
              {showClient && <td className="py-3 px-4 text-sm text-gray-700">{est.client?.name || 'N/A'}</td>}
              <td className="py-3 px-4 text-sm font-medium text-navy-800">{est.projectName}</td>
              <td className="py-3 px-4 text-sm text-gray-600">{projectTypeLabel(est.projectType)}</td>
              <td className="py-3 px-4 text-sm text-right font-semibold text-navy-800">{formatCurrency(est.calculation?.totalCost)}</td>
              <td className="py-3 px-4 text-center">
                {onStatusChange ? (
                  <select value={est.status} onChange={(e) => onStatusChange(est._id, e.target.value)} className="text-xs font-medium rounded-full px-3 py-1 border border-gray-200 focus:ring-2 focus:ring-indigo-500">
                    {['draft', 'saved', 'sent', 'accepted', 'rejected'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                ) : (
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor(est.status)}`}>{est.status}</span>
                )}
              </td>
              <td className="py-3 px-4 text-sm text-gray-500">{formatDate(est.createdAt)}</td>
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  {onView && <button onClick={() => onView(est._id)} className="p-1.5 rounded-lg hover:bg-indigo-100 text-indigo-600 transition-colors"><Eye className="w-4 h-4" /></button>}
                  {onDelete && <button onClick={() => onDelete(est._id)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EstimationTable;
