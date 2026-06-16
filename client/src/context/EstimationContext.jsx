import { createContext, useReducer } from 'react';

export const EstimationContext = createContext(null);

const initialState = {
  currentStep: 1,
  projectName: '',
  projectType: '',
  selectedFeatures: [],
  notes: '',
  result: null,
  loading: false,
  error: null,
};

const estimationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_STEP': return { ...state, currentStep: action.payload };
    case 'SET_PROJECT_NAME': return { ...state, projectName: action.payload };
    case 'SET_PROJECT_TYPE': return { ...state, projectType: action.payload };
    case 'TOGGLE_FEATURE': {
      const exists = state.selectedFeatures.includes(action.payload);
      return { ...state, selectedFeatures: exists ? state.selectedFeatures.filter(f => f !== action.payload) : [...state.selectedFeatures, action.payload] };
    }
    case 'SET_NOTES': return { ...state, notes: action.payload };
    case 'SET_RESULT': return { ...state, result: action.payload, loading: false };
    case 'SET_LOADING': return { ...state, loading: action.payload };
    case 'SET_ERROR': return { ...state, error: action.payload, loading: false };
    case 'RESET': return { ...initialState };
    default: return state;
  }
};

export const EstimationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(estimationReducer, initialState);

  return (
    <EstimationContext.Provider value={{ ...state, dispatch }}>
      {children}
    </EstimationContext.Provider>
  );
};
