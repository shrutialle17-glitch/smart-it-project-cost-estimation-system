import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const colors = ['#6366F1', '#818CF8', '#A5B4FC', '#10B981', '#34D399'];

const TimelineChart = ({ phases }) => {
  if (!phases || phases.length === 0) return null;

  const data = phases.map((p, i) => ({ name: p.name, weeks: p.weeks, description: p.description }));

  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ left: 20, right: 30, top: 10, bottom: 10 }}>
          <XAxis type="number" tick={{ fontSize: 12, fill: '#64748B' }} label={{ value: 'Weeks', position: 'insideBottom', offset: -5, style: { fontSize: 12, fill: '#94A3B8' } }} />
          <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12, fill: '#1E293B' }} />
          <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', boxShadow: '0 4px 6px rgba(0,0,0,.05)' }} formatter={(value) => [`${value} week(s)`, 'Duration']} />
          <Bar dataKey="weeks" radius={[0, 8, 8, 0]} barSize={30}>
            {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {phases.map((p, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-3 h-3 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: colors[i % colors.length] }} />
            <div>
              <p className="text-sm font-medium text-navy-800">{p.name} — {p.weeks}w</p>
              <p className="text-xs text-gray-500">{p.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineChart;
