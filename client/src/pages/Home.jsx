import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, BarChart3, Clock, CheckCircle2, Star, Globe, Layers, Users } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const AnimatedCounter = ({ end, label }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const step = Math.ceil(end / 60);
        const timer = setInterval(() => { start += step; if (start >= end) { setCount(end); clearInterval(timer); } else setCount(start); }, 20);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);
  return <div ref={ref} className="text-center"><p className="text-4xl font-heading font-bold text-white">{count}+</p><p className="text-indigo-200 text-sm mt-1">{label}</p></div>;
};

const Home = () => {
  const features = [
    { icon: Zap, title: 'Instant Estimates', desc: 'Get accurate project costs in minutes with our smart calculation engine.' },
    { icon: Shield, title: 'Secure & Private', desc: 'Enterprise-grade security. Your data is encrypted and protected.' },
    { icon: BarChart3, title: 'Detailed Analytics', desc: 'Visual cost breakdowns, timelines, and tech stack recommendations.' },
  ];

  const steps = [
    { num: '01', title: 'Select Project Type', desc: 'Choose from website, mobile app, web app, e-commerce, or custom software.' },
    { num: '02', title: 'Pick Features', desc: 'Select the features you need from our comprehensive catalog.' },
    { num: '03', title: 'Get Estimate', desc: 'Our engine calculates costs, timeline, and complexity instantly.' },
    { num: '04', title: 'Download PDF', desc: 'Export a professional quotation PDF for your stakeholders.' },
  ];

  const testimonials = [
    { name: 'Sarah Johnson', company: 'TechVentures Inc.', text: 'SmartEstimate saved us weeks of back-and-forth. The accuracy is remarkable.', avatar: 'SJ' },
    { name: 'Michael Chen', company: 'CloudFirst Solutions', text: 'The PDF quotations look incredibly professional. Our clients love them.', avatar: 'MC' },
    { name: 'Emily Davis', company: 'StartupLab', text: 'Finally, a tool that understands IT project complexity. Game changer!', avatar: 'ED' },
  ];
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  useEffect(() => { const t = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 5000); return () => clearInterval(t); }, []);

  return (
    <div  className="-mt-16">
      {/* Hero */}
      <section className="relative min-h-screen pt-16 flex items-center bg-navy-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(99,102,241,0.3) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-8xl mx-auto px-8 lg:px-16 py-32 grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-indigo-200">AI-Powered Estimation Engine</span>
            </div>
            <h1 className="font-heading text-5xl sm:text-6xl font-bold text-white leading-tight mb-6">Estimate Your IT Project in <span className="gradient-text">Minutes</span>, Not Days.</h1>
            <p className="text-lg text-indigo-200/80 mb-8 max-w-lg">Smart, dynamic cost estimation for websites, mobile apps, and custom software. Get accurate quotes with detailed breakdowns instantly.</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="btn-primary !px-8 !py-4 !text-base">Get Free Estimate <ArrowRight className="w-5 h-5 ml-2" /></Link>
              <Link to="/login" className="btn-outline !border-white/30 !text-white hover:!bg-white/10 !px-8 !py-4 !text-base">Sign In</Link>
            </div>
          </div>
          <div className="hidden lg:block animate-float">
            <div className="relative">
              <div className="card p-6 rotate-3 shadow-2xl">
                <div className="flex items-center justify-between mb-4"><span className="text-sm font-medium text-gray-500">E-Commerce Platform</span><span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">Enterprise</span></div>
                <p className="text-3xl font-heading font-bold text-navy-800 mb-3">₹47,850</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Base Setup</span><span className="font-medium">₹5,250</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Features (8)</span><span className="font-medium">₹28,000</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Complexity ×2.2</span><span className="font-medium">₹37,950</span></div>
                  <div className="h-px bg-gray-200 my-2" />
                  <div className="flex justify-between text-sm font-bold"><span>Total + Tax</span><span className="text-indigo-600">₹47,850</span></div>
                </div>
              </div>
              <div className="absolute -bottom-8 -left-8 card p-4 -rotate-6 shadow-xl">
                <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-indigo-500" /><div><p className="text-xs text-gray-500">Timeline</p><p className="font-semibold text-sm">12 Weeks</p></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-navy-900 mb-4">Why SmartEstimate?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Everything you need to create accurate, professional IT project cost estimates.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="card-hover text-center group">
                <div className="w-14 h-14 mx-auto mb-5 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <f.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-navy-800 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-navy-900 mb-4">How It Works</h2>
            <p className="text-gray-500">Four simple steps to your accurate project estimate.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="relative">
                <div className="text-5xl font-heading font-bold text-indigo-100 mb-4">{s.num}</div>
                <h3 className="font-heading font-semibold text-navy-800 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
                {i < steps.length - 1 && <div className="hidden md:block absolute top-8 right-0 w-8 h-0.5 bg-indigo-200 translate-x-4" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-indigo-700">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <AnimatedCounter end={500} label="Estimates Generated" />
            <AnimatedCounter end={50} label="Project Types" />
            <AnimatedCounter end={98} label="Accuracy Rate %" />
            <AnimatedCounter end={200} label="Happy Clients" />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-navy-900 mb-4">What Our Clients Say</h2>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="card p-8 text-center">
              <div className="flex justify-center gap-1 mb-4">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}</div>
              <p className="text-lg text-gray-700 mb-6 italic">"{testimonials[activeTestimonial].text}"</p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center"><span className="text-indigo-600 font-semibold text-sm">{testimonials[activeTestimonial].avatar}</span></div>
                <div className="text-left"><p className="font-semibold text-sm text-navy-800">{testimonials[activeTestimonial].name}</p><p className="text-xs text-gray-500">{testimonials[activeTestimonial].company}</p></div>
              </div>
              <div className="flex justify-center gap-2 mt-6">{testimonials.map((_, i) => <button key={i} onClick={() => setActiveTestimonial(i)} className={`w-2.5 h-2.5 rounded-full transition-colors ${i === activeTestimonial ? 'bg-indigo-500' : 'bg-gray-300'}`} />)}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(99,102,241,0.4) 1px, transparent 0)', backgroundSize: '30px 30px' }} />
        <div className="relative max-w-3xl mx-auto text-center px-4">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-6">Ready to Estimate Your Next Project?</h2>
          <p className="text-indigo-200/80 mb-8 text-lg">Join hundreds of businesses using SmartEstimate to plan and budget their IT projects accurately.</p>
          <Link to="/register" className="btn-primary !px-10 !py-4 !text-base">Start Free Estimate <ArrowRight className="w-5 h-5 ml-2" /></Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
