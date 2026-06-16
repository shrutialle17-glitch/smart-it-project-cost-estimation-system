import { useContext } from 'react';
import { EstimationContext } from '../context/EstimationContext';
export const useEstimation = () => { const context = useContext(EstimationContext); if (!context) throw new Error('useEstimation must be used within EstimationProvider'); return context; };
