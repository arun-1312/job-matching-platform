import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Building, Mail, KeyRound, Briefcase, Eye, EyeOff, X,
  Github, Linkedin, Chrome, ArrowRight, CheckCircle
} from 'lucide-react';

// Reusable Input Field Component
const InputField = ({ icon, type, placeholder, value, onChange, error, className = '' }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      {React.cloneElement(icon, { className: "text-gray-400 w-5 h-5" })}
    </div>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
        error ? 'border-red-500 focus:ring-red-500' : ''
      } ${className}`}
    />
    {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
  </div>
);

const AuthModal = ({ isOpen, onClose, onAuthSuccess, defaultRole = 'seeker' }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState(defaultRole);
  const [loginType, setLoginType] = useState(defaultRole);
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Error Handling
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRole(defaultRole);
      setLoginType(defaultRole);
      setIsLogin(true);
      resetForm();
    }
  }, [isOpen, defaultRole]);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setCompanyName('');
    setErrors({});
    setServerError('');
    setIsLoading(false);
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    resetForm();
  };

  const handleLoginTypeChange = (type) => {
    setLoginType(type);
    resetForm();
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Please enter a valid email address';

    if (!password.trim()) newErrors.password = 'Password is required';
    else if (!isLogin && password.length < 8) newErrors.password = 'Password must be at least 8 characters';

    if (!isLogin) {
      if (role === 'seeker' && !name.trim()) newErrors.name = 'Full name is required';
      if (role === 'employer' && !companyName.trim()) newErrors.companyName = 'Company name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setServerError('');

    const endpoint = isLogin 
      ? (loginType === 'seeker' ? '/api/login' : '/api/employer/login')
      : '/api/signup';
    
    const payload = isLogin 
      ? { email, password }
      : { 
          email, 
          password, 
          role, 
          name: role === 'seeker' ? name : undefined,
          companyName: role === 'employer' ? companyName : undefined
        };

    try {
      const response = await fetch(`https://ai-job-platform-api.onrender.com${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed. Please try again.');
      }

      // Store authentication data
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      onAuthSuccess(data);
      onClose();

    } catch (error) {
      setServerError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // Placeholder for social login functionality
    console.log(`Logging in with ${provider}`);
    setServerError(`${provider} login integration coming soon!`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex"
          >
            {/* Left Side - Branding */}
            <div className="hidden md:flex md:w-2/5 bg-gradient-to-br from-blue-600 to-purple-600 p-8 text-white flex-col justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Welcome to Zolabz AI</h2>
                <p className="text-blue-100">
                  {isLogin 
                    ? 'Sign in to access your AI-powered career platform'
                    : 'Join thousands of professionals finding their dream jobs'
                  }
                </p>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full md:w-3/5 p-8 overflow-auto max-h-[90vh]">
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
              
              <div className="text-center mb-6">
                <div className="md:hidden w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex justify-center mb-6">
                  <div className="bg-gray-100 rounded-xl p-1 flex">
                    <button 
                      onClick={() => setIsLogin(true)}
                      className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isLogin 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={() => setIsLogin(false)}
                      className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        !isLogin 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Sign Up
                    </button>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900">
                  {isLogin ? 'Welcome back' : 'Create your account'}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {isLogin ? 'Sign in to continue' : 'Join our AI-powered platform'}
                </p>
              </div>

              {/* Role Selection */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => isLogin ? handleLoginTypeChange('seeker') : handleRoleChange('seeker')}
                  className={`flex items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
                    (isLogin ? loginType === 'seeker' : role === 'seeker')
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <User size={16} className="mr-2" />
                  <span className="text-sm font-medium">Job Seeker</span>
                </button>
                <button
                  onClick={() => isLogin ? handleLoginTypeChange('employer') : handleRoleChange('employer')}
                  className={`flex items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
                    (isLogin ? loginType === 'employer' : role === 'employer')
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <Building size={16} className="mr-2" />
                  <span className="text-sm font-medium">Employer</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {!isLogin && (
                    role === 'seeker' ? (
                      <InputField
                        icon={<User size={16} />}
                        type="text"
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={errors.name}
                      />
                    ) : (
                      <InputField
                        icon={<Building size={16} />}
                        type="text"
                        placeholder="Company name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        error={errors.companyName}
                      />
                    )
                  )}

                  <InputField
                    icon={<Mail size={16} />}
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                  />

                  <div className="relative">
                    <InputField
                      icon={<KeyRound size={16} />}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      error={errors.password}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                    <button
                      type="button"
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {serverError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-600 text-center">{serverError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3.5 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      {isLogin ? 'Signing in...' : 'Creating account...'}
                    </>
                  ) : (
                    <>
                      {isLogin ? 'Sign In' : 'Create Account'}
                      <ArrowRight size={18} className="ml-2" />
                    </>
                  )}
                </button>
              </form>

              {/* Social Login - Below the form */}
              <div className="mt-6">
                <div className="relative mb-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => handleSocialLogin('Google')}
                    className="p-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    title="Sign in with Google"
                  >
                    <Chrome size={20} className="text-red-500" />
                  </button>
                  <button
                    onClick={() => handleSocialLogin('LinkedIn')}
                    className="p-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    title="Sign in with LinkedIn"
                  >
                    <Linkedin size={20} className="text-blue-600" />
                  </button>
                </div>
              </div>

              <p className="text-center text-sm text-gray-600 mt-6">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;