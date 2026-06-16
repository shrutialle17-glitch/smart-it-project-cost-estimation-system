import * as Icons from 'lucide-react';
import clsx from 'clsx';

const ProjectTypeCard = ({ pt, selected, onClick }) => {
  const Icon = Icons[pt.icon] || Icons.Code2;

  return (
    <button onClick={onClick} className={clsx(
      'relative p-6 rounded-xl border-2 text-left transition-all duration-300 group flex flex-col items-start h-full',
      selected ? 'border-indigo-500 bg-indigo-50 shadow-indigo' : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md'
    )}>
      {selected && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
          <Icons.Check className="w-4 h-4 text-white" />
        </div>
      )}
      <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors shrink-0', selected ? 'bg-indigo-500' : 'bg-gradient-to-br from-indigo-100 to-indigo-50 group-hover:from-indigo-200 group-hover:to-indigo-100')}>
        <Icon className={clsx('w-6 h-6', selected ? 'text-white' : 'text-indigo-600')} />
      </div>
      <h3 className="font-heading font-semibold text-navy-800 mb-1">{pt.name}</h3>
      <p className="text-sm text-gray-500 mb-3 flex-grow">{pt.description}</p>
      {pt.minimumBudget > 0 && <p className="text-xs font-medium text-indigo-500 mt-auto">Starting from ₹{pt.minimumBudget.toLocaleString('en-IN')}</p>}
    </button>
  );
};

export default ProjectTypeCard;
