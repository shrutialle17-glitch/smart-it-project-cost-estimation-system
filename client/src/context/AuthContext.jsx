import { createContext, useReducer, useEffect } from 'react';
import { loginUser, registerUser, logoutUser, getMe } from '../api/authAPI';

export const AuthContext = createContext(null);

const initialState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  loading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_LOADING': return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS': return { ...state, user: action.payload, isAuthenticated: true, loading: false, error: null };
    case 'AUTH_ERROR': return { ...state, loading: false, error: action.payload };
    case 'LOGOUT': return { ...state, user: null, isAuthenticated: false, loading: false, error: null };
    case 'CLEAR_ERROR': return { ...state, error: null };
    case 'SET_LOADING_FALSE': return { ...state, loading: false };
    default: return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) { dispatch({ type: 'SET_LOADING_FALSE' }); return; }
      try {
        const { data } = await getMe();
        dispatch({ type: 'AUTH_SUCCESS', payload: data.data.user });
        localStorage.setItem('user', JSON.stringify(data.data.user));
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        dispatch({ type: 'SET_LOADING_FALSE' });
      }
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    dispatch({ type: 'AUTH_LOADING' });
    try {
      const { data } = await loginUser(credentials);
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      dispatch({ type: 'AUTH_SUCCESS', payload: data.data.user });
      return data.data.user;
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'AUTH_ERROR', payload: msg });
      throw error;
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'AUTH_LOADING' });
    try {
      const { data } = await registerUser(userData);
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      dispatch({ type: 'AUTH_SUCCESS', payload: data.data.user });
      return data.data.user;
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'AUTH_ERROR', payload: msg });
      throw error;
    }
  };

  const logout = async () => {
    try { await logoutUser(); } catch { /* ignore */ }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};
