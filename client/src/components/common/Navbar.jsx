import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Menu, X, ChevronDown, LogOut, User, LayoutDashboard, Settings } from 'lucide-react';
import NotificationBell from '../notifications/NotificationBell';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setUserMenuOpen(false); }, [location]);

  const handleLogout = async () => { await logout(); navigate('/'); };

  const isHome = location.pathname === '/';
  const navBg = scrolled || !isHome ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent';
  const textColor = scrolled || !isHome ? 'text-navy-800' : 'text-white';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SE</span>
            </div>
            <span className={`font-heading font-bold text-lg ${textColor}`}>SmartEstimate</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {!isAuthenticated ? (
              <>
                <Link to="/" className={`text-sm font-medium ${textColor} hover:text-indigo-500 transition-colors`}>Home</Link>
                <Link to="/login" className={`text-sm font-medium ${textColor} hover:text-indigo-500 transition-colors`}>Login</Link>
                <Link to="/register" className="btn-primary text-sm !py-2 !px-5">Get Started</Link>
              </>
            ) : (
              <>
                <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className={`text-sm font-medium ${textColor} hover:text-indigo-500 transition-colors`}>Dashboard</Link>
                {user?.role === 'client' && <Link to="/estimate/new" className={`text-sm font-medium ${textColor} hover:text-indigo-500 transition-colors`}>New Estimate</Link>}
                {user?.role === 'client' && <Link to="/estimations" className={`text-sm font-medium ${textColor} hover:text-indigo-500 transition-colors`}>History</Link>}
                <NotificationBell />
                <div className="relative">
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)} className={`flex items-center gap-2 text-sm font-medium ${textColor} hover:text-indigo-500`}>
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-semibold text-xs">{user?.name?.charAt(0).toUpperCase()}</span>
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-fade-in">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-navy-800">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                      <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className={`w-6 h-6 ${textColor}`} /> : <Menu className={`w-6 h-6 ${textColor}`} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white rounded-xl shadow-lg border border-gray-100 mt-2 p-4 animate-slide-up">
            {!isAuthenticated ? (
              <div className="flex flex-col gap-3">
                <Link to="/" className="text-sm font-medium text-navy-800 hover:text-indigo-500 py-2">Home</Link>
                <Link to="/login" className="text-sm font-medium text-navy-800 hover:text-indigo-500 py-2">Login</Link>
                <Link to="/register" className="btn-primary text-center">Get Started</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="text-sm font-medium text-navy-800 py-2">Dashboard</Link>
                {user?.role === 'client' && <Link to="/estimate/new" className="text-sm font-medium text-navy-800 py-2">New Estimate</Link>}
                {user?.role === 'client' && <Link to="/estimations" className="text-sm font-medium text-navy-800 py-2">History</Link>}
                <button onClick={handleLogout} className="text-sm font-medium text-red-600 py-2 text-left">Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
