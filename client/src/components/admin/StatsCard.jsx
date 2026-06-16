import clsx from 'clsx';

const StatsCard = ({ icon: Icon, label, value, trend, color = 'indigo' }) => {
  const colors = { indigo: 'from-indigo-500 to-indigo-600', emerald: 'from-emerald-500 to-emerald-600', blue: 'from-blue-500 to-blue-600', orange: 'from-orange-500 to-orange-600' };

  return (
    <div className="card-hover">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-heading font-bold text-navy-800">{value}</p>
          {trend && <p className="text-xs text-emerald-500 font-medium mt-1">↑ {trend}</p>}
        </div>
        <div className={clsx('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center', colors[color] || colors.indigo)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
