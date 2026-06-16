import { Check, Shield, Zap, Brain, MessageCircle, BarChart3, HardDrive, Globe, Box } from 'lucide-react';
import clsx from 'clsx';

const categoryIcons = { core: Zap, security: Shield, integration: Box, ai: Brain, communication: MessageCircle, analytics: BarChart3, storage: HardDrive, localization: Globe };
const categoryColors = { core: 'from-blue-500 to-blue-600', security: 'from-red-500 to-red-600', integration: 'from-purple-500 to-purple-600', ai: 'from-pink-500 to-pink-600', communication: 'from-green-500 to-green-600', analytics: 'from-orange-500 to-orange-600', storage: 'from-cyan-500 to-cyan-600', localization: 'from-teal-500 to-teal-600' };

const FeatureSelector = ({ features, selectedFeatures, onToggle }) => {
  const categories = [...new Set(features.map(f => f.category))];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{selectedFeatures.length} feature{selectedFeatures.length !== 1 ? 's' : ''} selected</p>
      </div>
      {categories.map(cat => {
        const catFeatures = features.filter(f => f.category === cat);
        const CatIcon = categoryIcons[cat] || Box;
        return (
          <div key={cat}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${categoryColors[cat] || 'from-gray-500 to-gray-600'} flex items-center justify-center`}>
                <CatIcon className="w-4 h-4 text-white" />
              </div>
              <h4 className="font-heading font-semibold text-sm text-navy-800 capitalize">{cat}</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {catFeatures.map(f => {
                const selected = selectedFeatures.includes(f._id);
                return (
                  <button key={f._id} onClick={() => onToggle(f._id)} className={clsx(
                    'relative p-4 rounded-xl border-2 text-left transition-all duration-200',
                    selected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white hover:border-gray-300'
                  )}>
                    {selected && (
                      <div className="absolute top-3 right-3 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <h5 className="font-medium text-sm text-navy-800">{f.name}</h5>
                    <p className="text-xs text-gray-500 mt-1">{f.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-indigo-500 font-medium">{f.baseHours}h</span>
                      <span className="text-xs text-gray-400">Complexity: {f.complexityWeight}/10</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FeatureSelector;
