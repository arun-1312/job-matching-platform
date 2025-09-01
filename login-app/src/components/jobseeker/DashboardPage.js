import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, Search, Briefcase, User, FileText, BarChart2, 
    ClipboardCheck, Bookmark, MessageSquare, Settings, LogOut, 
    Bell, HelpCircle, Mail, ChevronRight, Home, Work, TrendingUp,
    FileBadge, Calendar, Star, Download, Upload, Building, Eye, X
} from 'lucide-react';
import '../../styles/DashboardPage.css';
import ProfilePage from './ProfilePage';
import ResumeManagerPage from './ResumeManagerPage';
import InterviewPrepPage from './InterviewPrepPage';
import FindJobsPage from './FindJobsPage';
import MyApplicationsPage from './MyApplicationsPage';
import SkillAnalyticsPage from './SkillAnalyticsPage';
import DashboardWidgets from './DashboardWidgets';
import SavedJobsPage from './SavedJobsPage';
import MessagesPage from './MessagesPage';

// --- Reusable Sub-Components ---
const NavLink = ({ icon, text, active, isSidebarExpanded, onClick, showChevron = false }) => (
    <button 
        onClick={onClick} 
        className={`w-full flex items-center px-4 py-3 text-sm rounded-lg transition-all duration-200 ${
            active 
                ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-500' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
        } ${isSidebarExpanded ? 'justify-between' : 'justify-center'}`}
    >
        <div className="flex items-center">
            <div className={`${active ? 'text-blue-600' : 'text-gray-500'}`}>
                {icon}
            </div>
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
        </div>
        {showChevron && isSidebarExpanded && (
            <ChevronRight size={16} className="text-gray-400" />
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

const NotificationsPanel = ({ isOpen }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute top-16 right-6 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
            >
                <div className="p-4 border-b bg-white">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                </div>
                <div className="py-2 max-h-96 overflow-y-auto">
                    <a href="#" className="flex items-start px-4 py-3 hover:bg-gray-50 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                            <Briefcase size={16} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-800">New Job Match!</p>
                            <p className="text-xs text-gray-500 mt-1">A 'Senior Frontend Developer' role matches your profile.</p>
                            <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                        </div>
                    </a>
                    <a href="#" className="flex items-start px-4 py-3 hover:bg-gray-50 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                            <Eye size={16} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-800">Application Viewed</p>
                            <p className="text-xs text-gray-500 mt-1">Google viewed your application for UX Designer.</p>
                            <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                        </div>
                    </a>
                    <a href="#" className="flex items-start px-4 py-3 hover:bg-gray-50 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                            <Mail size={16} className="text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-800">New Message</p>
                            <p className="text-xs text-gray-500 mt-1">You have a new message from a recruiter.</p>
                            <p className="text-xs text-gray-400 mt-1">2 days ago</p>
                        </div>
                    </a>
                </div>
                <div className="p-3 border-t bg-gray-50">
                    <button className="text-sm text-blue-600 font-medium hover:text-blue-800 w-full text-center">
                        View All Notifications
                    </button>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
);

// --- Notice Banner Component ---
const NoticeBanner = ({ onCancel }) => (
    <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        className="bg-blue-50 border-b border-blue-200 p-4 flex items-center justify-between shadow-md z-40"
    >
        <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Building size={16} className="text-blue-600" />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-800">
                    Notice: Platform Under Development
                </p>
                <p className="text-xs text-gray-600 mt-1">
                    We sincerely apologize for the inconvenience. The core features of Zolabz AI Career Platform are still under development. However, you are welcome to explore most functionalities, including job applications and profile management. Thank you for your patience!
                </p>
            </div>
        </div>
        <button
            onClick={onCancel}
            className="text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-200 transition-colors"
        >
            <X size={16} />
        </button>
    </motion.div>
);

// --- Main Dashboard Component ---
const DashboardPage = ({ user, token, onLogout, onProfileUpdate }) => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [activePage, setActivePage] = useState('dashboard');
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isActivelySeeking, setIsActivelySeeking] = useState(true);
    const [isNoticeVisible, setIsNoticeVisible] = useState(true); // State to control notice visibility

    const renderActivePage = () => {
        switch (activePage) {
            case 'profile':
                return <ProfilePage user={user} token={token} onProfileUpdate={onProfileUpdate} />;
            case 'resumes':
                return <ResumeManagerPage token={token} />;
            case 'prep':
                return <InterviewPrepPage user={user} />;
            case 'find-jobs':
                return <FindJobsPage />;
            case 'applications':
                return <MyApplicationsPage />;
            case 'analytics':
                return <SkillAnalyticsPage />;
            case 'saved-jobs':
                return <SavedJobsPage />;
            case 'messages':
                return <MessagesPage />;
            case 'dashboard':
            default:
                return <DashboardWidgets user={user} setActivePage={setActivePage} />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            {/* Sidebar */}
            <motion.aside 
                onMouseEnter={() => setIsSidebarExpanded(true)}
                onMouseLeave={() => setIsSidebarExpanded(false)}
                className="flex-shrink-0 bg-white border-r border-gray-200 flex flex-col shadow-sm"
                animate={{ width: isSidebarExpanded ? 280 : 72 }}
                transition={{ duration: 0.2 }}
            >
                <div className="h-16 flex items-center px-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3 overflow-hidden">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white flex-shrink-0">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        {isSidebarExpanded && (
                            <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-900 truncate">{user?.name || 'User'}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                    <span className={`text-xs px-2 py-1 rounded-full ${isActivelySeeking ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {isActivelySeeking ? 'Actively Seeking' : 'Paused'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                    <div className="px-3 py-2">
                        {isSidebarExpanded && (
                            <motion.h3 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2"
                            >
                                Core Tools
                            </motion.h3>
                        )}
                        <div className="space-y-1">
                            <NavLink 
                                icon={<LayoutDashboard size={20} />} 
                                text="Dashboard" 
                                active={activePage === 'dashboard'} 
                                isSidebarExpanded={isSidebarExpanded} 
                                onClick={() => setActivePage('dashboard')} 
                            />
                            <NavLink 
                                icon={<Search size={20} />} 
                                text="Find Jobs" 
                                active={activePage === 'find-jobs'} 
                                isSidebarExpanded={isSidebarExpanded} 
                                onClick={() => setActivePage('find-jobs')} 
                            />
                            <NavLink 
                                icon={<Briefcase size={20} />} 
                                text="My Applications" 
                                active={activePage === 'applications'} 
                                isSidebarExpanded={isSidebarExpanded} 
                                onClick={() => setActivePage('applications')} 
                            />
                        </div>
                    </div>
                    
                    <div className="px-3 py-2">
                        {isSidebarExpanded && (
                            <motion.h3 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2"
                            >
                                Career Growth
                            </motion.h3>
                        )}
                        <div className="space-y-1">
                            <NavLink 
                                icon={<User size={20} />} 
                                text="My Profile" 
                                active={activePage === 'profile'} 
                                isSidebarExpanded={isSidebarExpanded} 
                                onClick={() => setActivePage('profile')} 
                            />
                            <NavLink 
                                icon={<FileText size={20} />} 
                                text="Resume Manager" 
                                active={activePage === 'resumes'} 
                                isSidebarExpanded={isSidebarExpanded} 
                                onClick={() => setActivePage('resumes')} 
                            />
                            <NavLink 
                                icon={<BarChart2 size={20} />} 
                                text="Skill Analytics" 
                                active={activePage === 'analytics'} 
                                isSidebarExpanded={isSidebarExpanded} 
                                onClick={() => setActivePage('analytics')} 
                            />
                            <NavLink 
                                icon={<ClipboardCheck size={20} />} 
                                text="Interview Prep" 
                                active={activePage === 'prep'} 
                                isSidebarExpanded={isSidebarExpanded} 
                                onClick={() => setActivePage('prep')} 
                            />
                        </div>
                    </div>
                    
                    <div className="px-3 py-2">
                        {isSidebarExpanded && (
                            <motion.h3 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2"
                            >
                                Library
                            </motion.h3>
                        )}
                        <div className="space-y-1">
                            <NavLink 
                                icon={<Bookmark size={20} />} 
                                text="Saved Jobs" 
                                active={activePage === 'saved-jobs'} 
                                isSidebarExpanded={isSidebarExpanded} 
                                onClick={() => setActivePage('saved-jobs')} 
                            />
                            <NavLink 
                                icon={<MessageSquare size={20} />} 
                                text="Messages" 
                                active={activePage === 'messages'} 
                                isSidebarExpanded={isSidebarExpanded} 
                                onClick={() => setActivePage('messages')} 
                                showChevron={true}
                            />
                        </div>
                    </div>
                </nav>
                
                <div className="px-3 py-4 border-t border-gray-200">
                    <NavLink 
                        icon={<Settings size={20} />} 
                        text="Settings" 
                        active={activePage === 'settings'} 
                        isSidebarExpanded={isSidebarExpanded} 
                        onClick={() => setActivePage('settings')} 
                    />
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
                    <div className="flex items-center space-x-2">
                        <h1 className="text-xl font-medium text-gray-900">Zolabz AI Career Platform</h1>
                    </div>
                    <div className="flex items-center space-x-3">
                        <TooltipButton tooltipText="Notifications" onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} count={3}>
                            <Bell size={20} className="text-gray-600" />
                        </TooltipButton>
                        <TooltipButton tooltipText="Help">
                            <HelpCircle size={20} className="text-gray-600" />
                        </TooltipButton>
                        <TooltipButton tooltipText="Logout" onClick={onLogout}>
                            <LogOut size={20} className="text-gray-600" />
                        </TooltipButton>
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center font-bold text-white text-sm">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                    </div>
                </header>
                
                <div className="flex-1 overflow-y-auto bg-gray-50 relative">
                    {/* Notice Banner */}
                    <AnimatePresence>
                        {isNoticeVisible && (
                            <NoticeBanner onCancel={() => setIsNoticeVisible(false)} />
                        )}
                    </AnimatePresence>
                    {renderActivePage()}
                    <NotificationsPanel isOpen={isNotificationsOpen} />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;