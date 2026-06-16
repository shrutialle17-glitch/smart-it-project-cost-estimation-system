import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEstimation } from '../hooks/useEstimation';
import { getFeatures, getProjectTypes, calculateEstimation, saveEstimation } from '../api/estimationAPI';
import ProjectTypeCard from '../components/estimation/ProjectTypeCard';
import FeatureSelector from '../components/estimation/FeatureSelector';
import CostBreakdownTable from '../components/estimation/CostBreakdownTable';
import TechStackBadges from '../components/estimation/TechStackBadges';
import TimelineChart from '../components/estimation/TimelineChart';
import Button from '../components/common/Button';
import { Loader } from '../components/common/Loader';

import { formatCurrency } from '../utils/formatCurrency';
import toast from 'react-hot-toast';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

const CreateEstimation = () => {
  const { currentStep, projectName, projectType, selectedFeatures, notes, result, dispatch } = useEstimation();
  const [features, setFeatures] = useState([]);
  const [projectTypes, setProjectTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const [featRes, priceRes] = await Promise.all([getFeatures(), getProjectTypes()]);
        setFeatures(featRes.data.data.features);
        setProjectTypes(priceRes.data.data.projectTypes);
      } catch { toast.error('Failed to load data'); }
      setLoading(false);
    };
    fetch();
    dispatch({ type: 'RESET' });
  }, []);


  const steps = ['Project Details', 'Select Features', 'Additional Info', 'Review & Generate'];

  const canProceed = () => {
    if (currentStep === 1) return projectName.length >= 3 && projectType;
    if (currentStep === 2) return selectedFeatures.length >= 1;
    return true;
  };

  const handleCalculate = async () => {
    setCalculating(true);
    try {
      const { data } = await calculateEstimation({ projectName, projectType, selectedFeatures });
      dispatch({ type: 'SET_RESULT', payload: data.data.estimation });
      dispatch({ type: 'SET_STEP', payload: 5 });
    } catch (err) { toast.error(err.response?.data?.message || 'Calculation failed'); }
    setCalculating(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await saveEstimation({ projectName, projectType, selectedFeatures, notes });
      toast.success('Estimation saved!');
      navigate(`/estimations/${data.data.estimation._id}`);
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    setSaving(false);
  };

  if (loading) return <Loader text="Loading features and pricing..." />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Progress Bar */}
      {currentStep <= 4 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">{steps.map((s, i) => (<div key={i} className="flex items-center gap-2"><div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${i + 1 <= currentStep ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-500'}`}>{i + 1 < currentStep ? <CheckCircle2 className="w-5 h-5" /> : i + 1}</div><span className="hidden sm:block text-xs font-medium text-gray-500">{s}</span>{i < steps.length - 1 && <div className={`w-8 sm:w-16 h-0.5 ${i + 1 < currentStep ? 'bg-indigo-500' : 'bg-gray-200'}`} />}</div>))}</div>
        </div>
      )}

      {/* Step 1 */}
      {currentStep === 1 && (
        <div className="animate-fade-in">
          <h2 className="font-heading text-2xl font-bold text-navy-900 mb-2">Project Details</h2>
          <p className="text-gray-500 mb-8">Tell us about your project to get started.</p>
          <div className="mb-8"><label className="label">Project Name</label><input type="text" value={projectName} onChange={e => dispatch({ type: 'SET_PROJECT_NAME', payload: e.target.value })} className="input-field" placeholder="e.g. E-Commerce Marketplace" /></div>
          <div><label className="label mb-4">Project Type</label><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{projectTypes.map(pt => (<ProjectTypeCard key={pt._id} pt={pt} selected={projectType === pt._id} onClick={() => dispatch({ type: 'SET_PROJECT_TYPE', payload: pt._id })} />))}</div></div>
        </div>
      )}

      {/* Step 2 */}
      {currentStep === 2 && (
        <div className="animate-fade-in">
          <h2 className="font-heading text-2xl font-bold text-navy-900 mb-2">Select Features</h2>
          <p className="text-gray-500 mb-8">Choose the features you need for your project.</p>
          <FeatureSelector features={features} selectedFeatures={selectedFeatures} onToggle={(id) => dispatch({ type: 'TOGGLE_FEATURE', payload: id })} />
        </div>
      )}

      {/* Step 3 */}
      {currentStep === 3 && (
        <div className="animate-fade-in">
          <h2 className="font-heading text-2xl font-bold text-navy-900 mb-2">Additional Information</h2>
          <p className="text-gray-500 mb-8">Any extra details or requirements.</p>
          <div><label className="label">Notes / Special Requirements</label><textarea value={notes} onChange={e => dispatch({ type: 'SET_NOTES', payload: e.target.value })} className="input-field" rows="5" placeholder="Any specific requirements, deadlines, or constraints..." /></div>
        </div>
      )}

      {/* Step 4: Review */}
      {currentStep === 4 && (
        <div className="animate-fade-in">
          <h2 className="font-heading text-2xl font-bold text-navy-900 mb-6">Review & Generate</h2>
          <div className="card mb-6">
            <h3 className="font-semibold text-navy-800 mb-3">Project Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">Project:</span> <span className="font-medium">{projectName}</span></div>
              <div><span className="text-gray-500">Type:</span> <span className="font-medium">{projectTypes.find(pt => pt._id === projectType)?.name || 'Unknown'}</span></div>
              <div><span className="text-gray-500">Features:</span> <span className="font-medium">{selectedFeatures.length} selected</span></div>
            </div>
            {notes && <div className="mt-3 text-sm"><span className="text-gray-500">Notes:</span> <span className="text-gray-700">{notes}</span></div>}
          </div>
          <Button onClick={handleCalculate} loading={calculating} className="w-full !py-4 !text-base">
            {calculating ? 'Calculating...' : '🚀 Generate Estimation'}
          </Button>
        </div>
      )}

      {/* Step 5: Result */}
      {currentStep === 5 && result && (
        <div className="animate-fade-in space-y-8">
          <div className="card bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-center py-10">
            <p className="text-indigo-100 mb-2">Estimated Total Cost</p>
            <p className="text-5xl font-heading font-bold mb-3">{formatCurrency(result.calculation.totalCost)}</p>
            <div className="flex justify-center gap-6 text-sm"><span>⏱ {result.timeline.totalWeeks} weeks</span><span>📊 {result.complexity.level.toUpperCase()} complexity</span><span>⚡ {result.calculation.totalHours} hours</span></div>
          </div>
          <div className="card"><h3 className="font-heading font-semibold text-lg text-navy-800 mb-4">Cost Breakdown</h3><CostBreakdownTable calculation={result.calculation} selectedFeatures={result.selectedFeatures} /></div>
          <div className="card"><h3 className="font-heading font-semibold text-lg text-navy-800 mb-4">Project Timeline</h3><TimelineChart phases={result.timeline.phases} /></div>
          <div className="card"><h3 className="font-heading font-semibold text-lg text-navy-800 mb-4">Recommended Tech Stack</h3><TechStackBadges techStack={result.recommendedTechStack} /></div>
          <div className="flex gap-4">
            <Button onClick={handleSave} loading={saving} className="flex-1">Save Estimation</Button>
            <Button variant="outline" onClick={() => { dispatch({ type: 'RESET' }); }} className="flex-1">Create New</Button>
          </div>
        </div>
      )}

      {/* Navigation */}
      {currentStep <= 4 && (
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => dispatch({ type: 'SET_STEP', payload: Math.max(1, currentStep - 1) })} disabled={currentStep === 1}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
          {currentStep < 4 && <Button onClick={() => dispatch({ type: 'SET_STEP', payload: currentStep + 1 })} disabled={!canProceed()}>Next <ArrowRight className="w-4 h-4 ml-2" /></Button>}
        </div>
      )}
    </div>
  );
};

export default CreateEstimation;
