import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const isHome = location.pathname === "/";
  const navBg =
    scrolled || !isHome
      ? "bg-white shadow-sm border-b border-gray-100"
      : "bg-transparent";

  const textColor =
    scrolled || !isHome ? "text-gray-800" : "text-black";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SE</span>
            </div>
            <span className={`font-bold text-lg ${textColor}`}>
              SmartEstimate
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium ${textColor} hover:text-indigo-500`}
            >
              Home
            </Link>

            <Link
              to="/login"
              className={`text-sm font-medium ${textColor} hover:text-indigo-500`}
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
            >
              Register
            </Link>
          </div>

          {/* Mobile Button */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className={`w-6 h-6 ${textColor}`} />
            ) : (
              <Menu className={`w-6 h-6 ${textColor}`} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white rounded-xl shadow-lg border border-gray-100 mt-2 p-4">
            <div className="flex flex-col gap-3">
              <Link
                to="/"
                className="text-sm font-medium text-gray-800 py-2"
              >
                Home
              </Link>

              <Link
                to="/login"
                className="text-sm font-medium text-gray-800 py-2"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-center"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;