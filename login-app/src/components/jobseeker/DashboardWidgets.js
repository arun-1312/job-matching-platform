import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Eye, TrendingUp, ChevronRight, Briefcase, MessageSquare, FileText, Bookmark } from 'lucide-react';

// --- Reusable Circular Progress Bar Component ---
const CircularProgressBar = ({ percentage, size = 64 }) => {
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
            <svg className="w-full h-full transform -rotate-90">
                <circle className="text-gray-200" strokeWidth={strokeWidth} stroke="currentColor" fill="transparent" r={radius} cx={size / 2} cy={size / 2} />
                <motion.circle 
                    className="text-blue-500" strokeWidth={strokeWidth} strokeDasharray={circumference}
                    strokeLinecap="round" stroke="currentColor" fill="transparent" r={radius} cx={size / 2} cy={size / 2}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                />
            </svg>
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-blue-600">{`${percentage}%`}</span>
        </div>
    );
};

// Widget Card Component
const WidgetCard = ({ children, className = "", onClick }) => {
    const baseClasses = "bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200";
    const combinedClasses = `${baseClasses} ${className} ${onClick ? "cursor-pointer" : ""}`;
    
    return (
        <div className={combinedClasses} onClick={onClick}>
            {children}
        </div>
    );
};

const DashboardWidgets = ({ user, setActivePage }) => {
    const [isBannerVisible, setIsBannerVisible] = useState(true);

    // Calculate profile completion score
    const calculateProfileScore = () => {
        let score = 20; // Base score for name/email
        if (user?.professional_title) score += 20;
        if (user?.experience) score += 20;
        if (user?.skills) score += 20;
        if (user?.location) score += 20;
        return score;
    };

    const profileScore = calculateProfileScore();
    
    // Placeholder data for widgets
    const recommendedJobs = [
        { id: 1, title: 'Senior Frontend Developer', company: 'Innovate Inc.', match: 92 },
        { id: 2, title: 'Full-Stack Engineer', company: 'Tech Solutions LLC', match: 88 },
        { id: 3, title: 'UX/UI Designer', company: 'Creative Labs', match: 85 },
    ];

    const statsData = [
        { label: 'New AI Matches', value: 5, icon: <TrendingUp size={20} className="text-blue-600" />, action: 'find-jobs' },
        { label: 'Applications Viewed', value: 7, icon: <Eye size={20} className="text-green-600" />, action: 'applications' },
        { label: 'Unread Messages', value: 1, icon: <MessageSquare size={20} className="text-purple-600" />, action: 'messages' }
    ];

    return (
        <main className="flex-1 p-6 sm:p-8 bg-gray-50">
            {/* I. "Complete Your Profile" Banner */}
            {profileScore < 100 && isBannerVisible && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 bg-blue-50 border border-blue-200 p-5 rounded-xl flex items-center justify-between"
                >
                    <div className="flex items-center">
                        <CircularProgressBar percentage={profileScore} />
                        <div className="ml-5">
                            <h3 className="font-semibold text-gray-800">Complete Your Profile</h3>
                            <p className="text-sm text-gray-600 mt-1">A complete profile increases your job match chances by 70%.</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                         <button 
                            onClick={() => setActivePage('profile')} 
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                         >
                            Complete Profile
                        </button>
                        <button 
                            onClick={() => setIsBannerVisible(false)} 
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </motion.div>
            )}

            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-600 mt-1">Welcome back, {user?.name || 'User'}. Here's your career snapshot.</p>
            </div>
            
            <div className="space-y-8">
                {/* II. Stats Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {statsData.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <WidgetCard 
                                onClick={() => setActivePage(stat.action)}
                                className="flex items-center justify-between hover:border-blue-300 transition-colors"
                            >
                                <div>
                                    <div className="flex items-center mb-2">
                                        <div className="p-2 bg-gray-100 rounded-lg mr-3">
                                            {stat.icon}
                                        </div>
                                        <span className="text-sm font-medium text-gray-500">{stat.label}</span>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                                <ChevronRight size={20} className="text-gray-400" />
                            </WidgetCard>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* AI-Recommended Jobs Widget */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <WidgetCard>
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-lg font-semibold text-gray-800">AI-Recommended Jobs</h2>
                                <button 
                                    onClick={() => setActivePage('find-jobs')}
                                    className="text-sm text-blue-600 font-medium hover:text-blue-800 flex items-center"
                                >
                                    View all
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                            <div className="space-y-4">
                                {recommendedJobs.map(job => (
                                    <div 
                                        key={job.id} 
                                        className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                        onClick={() => setActivePage('find-jobs')}
                                    >
                                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                            <Briefcase size={18} className="text-blue-600" />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <p className="font-medium text-gray-900 truncate">{job.title}</p>
                                            <p className="text-sm text-gray-500 truncate">{job.company}</p>
                                        </div>
                                        <div className="flex-shrink-0 ml-4 text-right">
                                            <div className="w-20 bg-gray-200 rounded-full h-1.5 mb-1">
                                                <div 
                                                    className="bg-blue-500 h-1.5 rounded-full" 
                                                    style={{width: `${job.match}%`}}
                                                ></div>
                                            </div>
                                            <p className="text-xs font-medium text-blue-600">{job.match}% Match</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </WidgetCard>
                    </motion.div>

                    {/* Recent Activity Widget */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <WidgetCard>
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
                                <button className="text-sm text-gray-500 font-medium hover:text-gray-700">
                                    Clear all
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                                        <Send size={18} className="text-green-600" />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-sm text-gray-700">You applied to <span className="font-medium">Senior Frontend Developer</span>.</p>
                                        <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                                        <Eye size={18} className="text-blue-600" />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-sm text-gray-700"><span className="font-medium">Innovate Inc.</span> viewed your application.</p>
                                        <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                                        <FileText size={18} className="text-purple-600" />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-sm text-gray-700">Your resume was downloaded by a recruiter.</p>
                                        <p className="text-xs text-gray-400 mt-1">2 days ago</p>
                                    </div>
                                </div>
                            </div>
                        </WidgetCard>
                    </motion.div>
                </div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <WidgetCard>
                        <h2 className="text-lg font-semibold text-gray-800 mb-5">Quick Actions</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <button 
                                onClick={() => setActivePage('resumes')}
                                className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors"
                            >
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                                    <FileText size={20} className="text-blue-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">Upload Resume</span>
                            </button>
                            <button 
                                onClick={() => setActivePage('prep')}
                                className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors"
                            >
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                                    <Briefcase size={20} className="text-green-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">Practice Interview</span>
                            </button>
                            <button 
                                onClick={() => setActivePage('analytics')}
                                className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors"
                            >
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                                    <TrendingUp size={20} className="text-purple-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">View Analytics</span>
                            </button>
                            <button 
                                onClick={() => setActivePage('saved-jobs')}
                                className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors"
                            >
                                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                                    <Bookmark size={20} className="text-amber-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">Saved Jobs</span>
                            </button>
                        </div>
                    </WidgetCard>
                </motion.div>
            </div>
        </main>
    );
};

export default DashboardWidgets;