import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, Mail, Lock, Zap } from 'lucide-react';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await login(form);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) { toast.error(err.response?.data?.message || 'Login failed'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-navy-900 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(99,102,241,0.3) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="relative text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-8 animate-float"><Zap className="w-10 h-10 text-white" /></div>
          <h2 className="font-heading text-3xl font-bold text-white mb-4">Welcome Back</h2>
          <p className="text-indigo-200/70 max-w-sm">Sign in to access your project estimations.</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8"><div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-sm">SE</span></div><span className="font-heading font-bold text-lg text-navy-800">SmartEstimate</span></Link>
          <h1 className="font-heading text-2xl font-bold text-navy-900 mb-2">Sign in to your account</h1>
          <p className="text-gray-500 text-sm mb-8">Don't have an account? <Link to="/register" className="text-indigo-500 font-medium">Create one</Link></p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div><label className="label">Email</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={`input-field !pl-11 ${errors.email ? 'input-error' : ''}`} placeholder="you@example.com" /></div>{errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}</div>
            <div><label className="label">Password</label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className={`input-field !pl-11 !pr-11 ${errors.password ? 'input-error' : ''}`} placeholder="Enter your password" /><button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div>{errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}</div>
            <Button type="submit" loading={loading} className="w-full">Sign In</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
