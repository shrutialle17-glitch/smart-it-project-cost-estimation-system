import { Link } from 'react-router-dom';
import { Globe, MessageCircle, Briefcase, Mail } from 'lucide-react';

const Footer = () => (
  <footer className="bg-navy-900 text-white pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SE</span>
            </div>
            <span className="font-heading font-bold text-lg">SmartEstimate</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">Professional IT project cost estimation platform. Get accurate quotes in minutes, not days.</p>
        </div>
        <div>
          <h4 className="font-heading font-semibold mb-4">Product</h4>
          <div className="flex flex-col gap-2">
            <Link to="/register" className="text-gray-400 text-sm hover:text-indigo-400 transition-colors">Get Started</Link>
            <Link to="/" className="text-gray-400 text-sm hover:text-indigo-400 transition-colors">How It Works</Link>
            <Link to="/" className="text-gray-400 text-sm hover:text-indigo-400 transition-colors">Pricing</Link>
          </div>
        </div>
        <div>
          <h4 className="font-heading font-semibold mb-4">Company</h4>
          <div className="flex flex-col gap-2">
            <Link to="/" className="text-gray-400 text-sm hover:text-indigo-400 transition-colors">About Us</Link>
            <Link to="/" className="text-gray-400 text-sm hover:text-indigo-400 transition-colors">Contact</Link>
            <Link to="/" className="text-gray-400 text-sm hover:text-indigo-400 transition-colors">Careers</Link>
          </div>
        </div>
        <div>
          <h4 className="font-heading font-semibold mb-4">Connect</h4>
          <div className="flex gap-3">
            <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-indigo-500 transition-colors"><MessageCircle className="w-4 h-4" /></a>
            <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-indigo-500 transition-colors"><Globe className="w-4 h-4" /></a>
            <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-indigo-500 transition-colors"><Briefcase className="w-4 h-4" /></a>
            <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-indigo-500 transition-colors"><Mail className="w-4 h-4" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 pt-8 text-center">
        <p className="text-gray-500 text-sm">© {new Date().getFullYear()} SmartEstimate Pro. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
