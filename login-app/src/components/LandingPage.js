import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, Building, ArrowRight, Users, Brain, Target, 
  Shield, Zap, Star, ChevronRight, Menu, X, 
  Linkedin, Twitter, Github, Mail, ArrowUpRight
} from 'lucide-react';
import AuthModal from './common/AuthModal';

const LandingPage = ({ onAuthSuccess, openAuthModal }) => {
  const [modalState, setModalState] = useState({ isOpen: false, defaultRole: 'seeker' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  console.log('LandingPage mounted');

  const openModal = (role) => {
    setModalState({ isOpen: true, defaultRole: role });
    openAuthModal();
  };

  const closeModal = () => {
    setModalState({ isOpen: false, defaultRole: 'seeker' });
  };

  const handleAuthSuccess = (data) => {
    onAuthSuccess(data);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const features = [
    {
      icon: <Brain className="w-8 h-8 text-blue-400" />,
      title: "AI-Powered Matching",
      description: "Advanced algorithms match your skills with the perfect job opportunities"
    },
    {
      icon: <Target className="w-8 h-8 text-purple-400" />,
      title: "Smart Recommendations",
      description: "Get personalized job recommendations based on your profile and preferences"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-400" />,
      title: "Secure Platform",
      description: "Your data is protected with enterprise-grade security measures"
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: "Fast Hiring Process",
      description: "Streamlined application process gets you hired faster"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "5K+", label: "Companies" },
    { number: "50K+", label: "Job Matches" },
    { number: "98%", label: "Satisfaction Rate" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white font-sans relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMzNzM3NDAiIHN0cm9rZS13aWR0aD0iMC41IiBkPSJNMCwwIEw2MCw2MCBNNjAsMCBMMCw2MCIvPjwvc3ZnPg==')]"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                Zolabz AI
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('features')} className="text-gray-300 hover:text-white transition-colors">
                Features
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-gray-300 hover:text-white transition-colors">
                How It Works
              </button>
              <button onClick={() => scrollToSection('testimonials')} className="text-gray-300 hover:text-white transition-colors">
                Testimonials
              </button>
              <button onClick={() => openModal('seeker')} className="px-4 py-2 text-blue-400 hover:text-blue-300 transition-colors">
                Login
              </button>
              <button 
                onClick={() => openModal('seeker')} 
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Sign Up
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="md:hidden mt-4 space-y-4 pb-4"
            >
              <button onClick={() => scrollToSection('features')} className="block w-full text-left py-2 text-gray-300 hover:text-white">
                Features
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="block w-full text-left py-2 text-gray-300 hover:text-white">
                How It Works
              </button>
              <button onClick={() => scrollToSection('testimonials')} className="block w-full text-left py-2 text-gray-300 hover:text-white">
                Testimonials
              </button>
              <div className="pt-4 space-y-2 border-t border-gray-800">
                <button onClick={() => openModal('seeker')} className="block w-full text-left py-2 text-blue-400">
                  Login
                </button>
                <button 
                  onClick={() => openModal('seeker')} 
                  className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-center"
                >
                  Sign Up
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-20 container mx-auto px-6 py-20 md:py-32 flex flex-col items-center justify-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight"
        >
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Revolutionize
          </span>{' '}
          <span className="text-white">Your Career Journey</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="mt-6 max-w-3xl text-lg md:text-xl text-gray-300"
        >
          Zolabz AI is the next-generation platform that uses artificial intelligence to connect 
          exceptional talent with innovative companies. Experience the future of recruitment today.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="mt-12 flex flex-col md:flex-row items-center gap-6"
        >
          <button
            onClick={() => openModal('seeker')}
            className="group w-full md:w-72 p-6 bg-gray-800/50 border border-gray-700 rounded-xl hover:bg-gray-700/80 hover:border-blue-500 transition-all duration-300 backdrop-blur-sm"
          >
            <Briefcase className="w-10 h-10 mx-auto text-blue-400" />
            <h3 className="mt-4 text-xl font-semibold text-white">For Job Seekers</h3>
            <p className="mt-2 text-sm text-gray-400">Discover AI-driven job matches tailored for you.</p>
            <span className="mt-4 inline-flex items-center text-blue-400 font-medium group-hover:text-blue-300">
              Get Started <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          <button
            onClick={() => openModal('employer')}
            className="group w-full md:w-72 p-6 bg-gray-800/50 border border-gray-700 rounded-xl hover:bg-gray-700/80 hover:border-blue-500 transition-all duration-300 backdrop-blur-sm"
          >
            <Building className="w-10 h-10 mx-auto text-blue-400" />
            <h3 className="mt-4 text-xl font-semibold text-white">For Employers</h3>
            <p className="mt-2 text-sm text-gray-400">Hire top talent with smart recommendations.</p>
            <span className="mt-4 inline-flex items-center text-blue-400 font-medium group-hover:text-blue-300">
              Start Hiring <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">{stat.number}</div>
              <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-20 py-20 bg-gray-900/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Why Choose Zolabz AI?</h2>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
              Our platform is designed to transform the way you find jobs or hire talent
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-20 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white">How It Works</h2>
            <p className="mt-4 text-lg text-gray-400">Simple steps to achieve your career goals</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Create Profile</h3>
              <p className="text-gray-400">Build your comprehensive profile with skills, experience, and preferences</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AI Matching</h3>
              <p className="text-gray-400">Our algorithms find perfect matches based on your profile and requirements</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Connect & Succeed</h3>
              <p className="text-gray-400">Connect with opportunities and take your career to the next level</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative z-20 py-20 bg-gray-900/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Success Stories</h2>
            <p className="mt-4 text-lg text-gray-400">Hear from our satisfied users</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: item * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 backdrop-blur-sm"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">
                  "Zolabz AI completely transformed my job search. The AI matching found opportunities
                  I wouldn't have discovered otherwise."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    U{item}
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold text-white">User {item}</div>
                    <div className="text-sm text-gray-400">Software Developer</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-20 py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-8 md:p-12 rounded-2xl border border-gray-700 backdrop-blur-sm"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Transform Your Career?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who have found their dream jobs through our AI-powered platform
            </p>
            <button 
              onClick={() => openModal('seeker')} 
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
            >
              Get Started Free
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 bg-gray-900/80 backdrop-blur-md border-t border-gray-800">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Zolabz AI</span>
              </div>
              <p className="text-gray-400">
                Revolutionizing the way people find jobs and companies hire talent through AI.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection('features')} className="text-gray-400 hover:text-white">Features</button></li>
                <li><button onClick={() => scrollToSection('how-it-works')} className="text-gray-400 hover:text-white">How It Works</button></li>
                <li><button onClick={() => openModal('seeker')} className="text-gray-400 hover:text-white">Pricing</button></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><button className="text-gray-400 hover:text-white">About Us</button></li>
                <li><button className="text-gray-400 hover:text-white">Careers</button></li>
                <li><button className="text-gray-400 hover:text-white">Contact</button></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white"><Linkedin className="w-5 h-5" /></a>
                <a href="#" className="text-gray-400 hover:text-white"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="text-gray-400 hover:text-white"><Github className="w-5 h-5" /></a>
                <a href="#" className="text-gray-400 hover:text-white"><Mail className="w-5 h-5" /></a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 Zolabz Technologies. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onAuthSuccess={handleAuthSuccess}
        defaultRole={modalState.defaultRole}
      />
    </div>
  );
};

export default LandingPage;