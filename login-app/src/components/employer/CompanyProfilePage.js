import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Edit, Building, Globe, Users, Briefcase, Upload, CheckCircle } from 'lucide-react';

// Main Company Profile Page Component
const CompanyProfilePage = ({ user, token, onProfileUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState(() => ({ ...user })); // Use callback to avoid re-creation
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showSuccess, setShowSuccess] = useState(false); // For confirmation image

    useEffect(() => {
        // Sync with user only when not editing
        if (!isEditing) {
            setProfileData({ ...user });
        }
    }, [user, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        setMessage('');
        try {
            // Filter only employers table fields
            const employerData = {
                company_website: profileData.company_website,
                company_size: profileData.company_size,
                industry: profileData.industry,
                about_company: profileData.about_company
            };
            const response = await fetch('https://ai-job-platform-api.onrender.com/api/employer/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(employerData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to update profile');

            // Update local state and notify parent
            setProfileData(prev => ({ ...prev, ...employerData }));
            if (onProfileUpdate) onProfileUpdate({ ...user, ...employerData });
            setMessage('');
            setShowSuccess(true); // Show success confirmation
            setTimeout(() => setShowSuccess(false), 3000); // Hide after 3 seconds
            setIsEditing(false);
        } catch (error) {
            setMessage(`Error: ${error.message}`);
            setShowSuccess(false);
        } finally {
            setIsLoading(false);
        }
    };

    const InfoField = ({ icon, label, value, name, isEditing }) => (
        <div>
            <label className="block text-sm font-medium text-gray-500 flex items-center mb-1">
                {icon}
                {label}
            </label>
            {isEditing ? (
                <input
                    type="text"
                    name={name}
                    value={value || ''}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Enter ${label.toLowerCase()}`}
                    // Removed autoFocus to prevent focus jumping
                />
            ) : (
                <p className="text-gray-900 p-2 bg-gray-50 rounded-md min-h-[42px]">
                    {value || 'Not provided'}
                </p>
            )}
        </div>
    );

    return (
        <div className="flex-1 p-6 sm:p-8 bg-gray-50 min-h-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Company Profile</h1>
                    <p className="text-gray-600 mt-1">Manage your company's public information.</p>
                </div>
                <div>
                    {isEditing ? (
                        <div className="flex space-x-3 mt-4 sm:mt-0">
                            <button 
                                onClick={() => {
                                    setIsEditing(false);
                                    setProfileData({ ...user }); // Reset to original data on cancel
                                }} 
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave} 
                                disabled={isLoading} 
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center"
                            >
                                <Save size={16} className="mr-2" /> 
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => setIsEditing(true)} 
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center mt-4 sm:mt-0"
                        >
                            <Edit size={16} className="mr-2" /> 
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>

            {/* Success Confirmation */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="mb-6 p-4 bg-green-100 text-green-700 border border-green-200 rounded-lg flex items-center"
                    >
                        <CheckCircle size={20} className="mr-2 text-green-500" />
                        <span>Profile saved successfully!</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error/Message Alert */}
            <AnimatePresence>
                {message && !showSuccess && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6 p-4 rounded-lg bg-red-100 text-red-700 border border-red-200"
                    >
                        {message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Profile Content */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-6 pb-6 border-b border-gray-200">
                    <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-3xl flex-shrink-0">
                            {profileData?.company_name?.charAt(0) || 'C'}
                        </div>
                        {isEditing && (
                            <button className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 border border-gray-200">
                                <Upload size={14} className="text-gray-600" />
                            </button>
                        )}
                    </div>
                    <div className="flex-grow">
                        <h2 className="text-2xl font-bold text-gray-900">{profileData?.company_name || "Company Name"}</h2>
                        <p className="text-gray-600">{profileData?.industry || "Industry not set"}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                    <InfoField icon={<Globe size={16} className="mr-2 text-gray-400"/>} label="Company Website" value={profileData.company_website} name="company_website" isEditing={isEditing} />
                    <InfoField icon={<Users size={16} className="mr-2 text-gray-400"/>} label="Company Size" value={profileData.company_size} name="company_size" isEditing={isEditing} />
                </div>
                
                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-500 flex items-center mb-1">
                        <Briefcase size={16} className="mr-2 text-gray-400"/>
                        About Company
                    </label>
                    {isEditing ? (
                        <textarea
                            name="about_company"
                            value={profileData.about_company || ''}
                            onChange={handleChange}
                            rows="5"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Describe your company culture, mission, and values."
                        />
                    ) : (
                        <p className="text-gray-900 p-3 bg-gray-50 rounded-md min-h-[120px] whitespace-pre-wrap">
                            {profileData.about_company || 'Not provided'}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompanyProfilePage;