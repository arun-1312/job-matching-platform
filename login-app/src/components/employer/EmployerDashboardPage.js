import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Briefcase, Users, Building, MessageSquare, 
  Settings, LogOut, Bell, HelpCircle, AlertCircle, Loader
} from 'lucide-react';

// Import child page components
import JobListingPage from './JobListingPage';
import CompanyProfilePage from './CompanyProfilePage';

// --- Placeholder Page Components ---
const CandidatesPage = ({ token }) => {
  console.log("CandidatesPage token:", token ? "Token exists" : "NO TOKEN");
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Candidates</h1>
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center text-gray-500">
        <Users size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="font-semibold">Candidate Management</h3>
        <p className="text-sm mt-1">View and manage your job applicants here.</p>
      </div>
    </div>
  );
};

const EmployerMessagesPage = ({ token }) => {
  console.log("EmployerMessagesPage token:", token ? "Token exists" : "NO TOKEN");
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Messages</h1>
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center text-gray-500">
        <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="font-semibold">Employer Messages</h3>
        <p className="text-sm mt-1">Communicate with candidates here.</p>
      </div>
    </div>
  );
};

const EmployerDashboardWidgets = ({ user, token }) => {
  console.log("DashboardWidgets - User:", user);
  console.log("DashboardWidgets - Token:", token ? "Present" : "Missing");

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Here's a snapshot of your hiring activity.</p>
        
        {!user && (
          <div className="mt-4 flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle size={20} className="text-yellow-600 mr-3" />
            <p className="text-yellow-700">User data is loading...</p>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-4">
              <Briefcase size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Jobs</p>
              <p className="text-xl font-semibold text-gray-900">3</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-4">
              <Users size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Applicants</p>
              <p className="text-xl font-semibold text-gray-900">47</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-4">
              <MessageSquare size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Unread Messages</p>
              <p className="text-xl font-semibold text-gray-900">5</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center text-sm p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <Users size={14} className="text-blue-600" />
            </div>
            <div>
              <p className="font-medium">New application for Senior Developer position</p>
              <p className="text-gray-500 text-xs">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center text-sm p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <Briefcase size={14} className="text-green-600" />
            </div>
            <div>
              <p className="font-medium">Job listing for UX Designer published</p>
              <p className="text-gray-500 text-xs">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Reusable UI Components ---
const NavLink = ({ icon, text, active, isSidebarExpanded, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center px-4 py-3 text-sm rounded-lg transition-all duration-200 ${
      active 
        ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-500' 
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
    } ${isSidebarExpanded ? 'justify-start' : 'justify-center'}`}
  >
    <div className={`${active ? 'text-blue-600' : 'text-gray-500'}`}>{icon}</div>
    {isSidebarExpanded && (
      <motion.span 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="ml-3 whitespace-nowrap"
      >
        {text}
      </motion.span>
    )}
  </button>
);

const TooltipButton = ({ children, tooltipText, onClick = () => {}, count = 0 }) => (
  <div className="relative group">
    <button 
      onClick={onClick} 
      className="p-2 rounded-full hover:bg-gray-100 relative"
    >
      {children}
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
      {tooltipText}
    </div>
  </div>
);

// --- Main Employer Dashboard Component ---
const EmployerDashboardPage = ({ user, token, onLogout, onProfileUpdate }) => {
  console.log("EmployerDashboardPage props:", { 
    user: user ? "User exists" : "No user", 
    token: token ? "Token exists" : "NO TOKEN"
  });

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(!user);
  const [userData, setUserData] = useState(user);

  // Fetch user data if not provided
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user && token) {
        console.log("Fetching user data...");
        setIsLoading(true);
        try {
          const response = await fetch('http://localhost:5000/api/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUserData(userData);
            console.log("User data fetched successfully:", userData);
          } else {
            console.error("Failed to fetch user data:", response.status);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setUserData(user);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user, token]);

  const renderActivePage = () => {
    console.log(`Rendering page: ${activePage}, Token: ${token ? "exists" : "missing"}`);
    
    switch (activePage) {
      case 'listings': 
        return <JobListingPage token={token} />;
      
      case 'candidates': 
        return <CandidatesPage token={token} />;

      case 'company-profile': 
        return <CompanyProfilePage user={userData} token={token} onProfileUpdate={onProfileUpdate} />;
      
      case 'messages': 
        return <EmployerMessagesPage token={token} />;
      
      case 'dashboard':
      default: 
        return <EmployerDashboardWidgets user={userData} token={token} />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <Loader size={32} className="animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <motion.aside 
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
        className="flex-shrink-0 bg-white border-r border-gray-200 flex flex-col shadow-sm z-40"
        animate={{ width: isSidebarExpanded ? 280 : 72 }}
        transition={{ duration: 0.2 }}
      >
        <div className="h-16 flex items-center px-4 border-b border-gray-200">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white flex-shrink-0">
              {userData?.company_name?.charAt(0) || userData?.name?.charAt(0) || 'E'}
            </div>
            {isSidebarExpanded && (
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 truncate">{userData?.company_name || userData?.name || 'Employer'}</p>
                <p className="text-xs text-gray-500">Hiring Team</p>
              </div>
            )}
          </div>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1">
          <NavLink 
            icon={<LayoutDashboard size={20} />} 
            text="Dashboard" 
            active={activePage === 'dashboard'} 
            isSidebarExpanded={isSidebarExpanded} 
            onClick={() => setActivePage('dashboard')} 
          />
          <NavLink 
            icon={<Briefcase size={20} />} 
            text="Job Listings" 
            active={activePage === 'listings'} 
            isSidebarExpanded={isSidebarExpanded} 
            onClick={() => setActivePage('listings')} 
          />
          <NavLink 
            icon={<Users size={20} />} 
            text="Candidates" 
            active={activePage === 'candidates'} 
            isSidebarExpanded={isSidebarExpanded} 
            onClick={() => setActivePage('candidates')} 
          />
           <NavLink 
            icon={<Building size={20} />} 
            text="Company Profile" 
            active={activePage === 'company-profile'} 
            isSidebarExpanded={isSidebarExpanded} 
            onClick={() => setActivePage('company-profile')} 
          />
          <NavLink 
            icon={<MessageSquare size={20} />} 
            text="Messages" 
            active={activePage === 'messages'} 
            isSidebarExpanded={isSidebarExpanded} 
            onClick={() => setActivePage('messages')} 
          />
        </nav>
        
        <div className="px-2 py-4 border-t border-gray-200">
          <NavLink 
            icon={<Settings size={20} />} 
            text="Settings" 
            active={activePage === 'settings'} 
            isSidebarExpanded={isSidebarExpanded} 
            onClick={() => setActivePage('settings')} 
          />
          <button
            onClick={onLogout}
            className="w-full flex items-center px-4 py-3 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-800 rounded-lg transition-all duration-200"
          >
            <LogOut size={20} className="text-gray-500" />
            {isSidebarExpanded && (
              <span className="ml-3 whitespace-nowrap">Logout</span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-medium text-gray-900">Employer Dashboard</h1>
          </div>
          <div className="flex items-center space-x-3">
            <TooltipButton tooltipText="Notifications" count={3}>
              <Bell size={20} className="text-gray-600" />
            </TooltipButton>
            <TooltipButton tooltipText="Help">
              <HelpCircle size={20} className="text-gray-600" />
            </TooltipButton>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center font-bold text-white text-sm">
              {userData?.name?.charAt(0) || 'E'}
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto">
          {renderActivePage()}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboardPage;