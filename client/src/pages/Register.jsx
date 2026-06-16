import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Eye, EyeOff, Mail, Lock, User, Building, Zap } from 'lucide-react';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', company: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.name || form.name.length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required';
    if (!form.password || form.password.length < 8) e.password = 'Password must be at least 8 characters';
    else if (!/[A-Z]/.test(form.password)) e.password = 'Must contain an uppercase letter';
    else if (!/[0-9]/.test(form.password)) e.password = 'Must contain a number';
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) e.password = 'Must contain a special character';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  if (!validate()) return;

  toast.success("Account created successfully!");
};

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-navy-900 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(99,102,241,0.3) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="relative text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-8 animate-float"><Zap className="w-10 h-10 text-white" /></div>
          <h2 className="font-heading text-3xl font-bold text-white mb-4">Get Started</h2>
          <p className="text-indigo-200/70 max-w-sm">Create your account and start estimating IT project costs instantly.</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8"><div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-sm">SE</span></div><span className="font-heading font-bold text-lg text-navy-800">SmartEstimate</span></Link>
          <h1 className="font-heading text-2xl font-bold text-navy-900 mb-2">Create your account</h1>
          <p className="text-gray-500 text-sm mb-8">Already have an account? <Link to="/login" className="text-indigo-500 font-medium">Sign in</Link></p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="label">Full Name</label><div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={`input-field !pl-11 ${errors.name ? 'input-error' : ''}`} placeholder="John Doe" /></div>{errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}</div>
            <div><label className="label">Email</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={`input-field !pl-11 ${errors.email ? 'input-error' : ''}`} placeholder="you@example.com" /></div>{errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}</div>
            <div><label className="label">Password</label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className={`input-field !pl-11 !pr-11 ${errors.password ? 'input-error' : ''}`} placeholder="Min 8 chars, uppercase, number, special" /><button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div>{errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}</div>
            <div><label className="label">Company <span className="text-gray-400">(optional)</span></label><div className="relative"><Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="input-field !pl-11" placeholder="Your company name" /></div></div>
            <Button type="submit" loading={loading} className="w-full !mt-6">Create Account</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
