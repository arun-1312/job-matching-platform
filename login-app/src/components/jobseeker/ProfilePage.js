import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Edit, Plus, Trash2, X, Upload, MapPin, Phone, Mail, Github, Linkedin, Link, Briefcase, DollarSign, Calendar } from 'lucide-react';

// Main Profile Page Component
const ProfilePage = ({ user, token, onProfileUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(user);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setProfileData(user);
  }, [user]);

  const handleDataChange = (section, data) => {
    setProfileData(prev => ({ ...prev, ...data }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setMessage('');
    try {
      const response = await fetch('https://ai-job-platform-api.onrender.com/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      onProfileUpdate(data.user);
      setMessage('Profile saved successfully!');
      setIsEditing(false);

    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 sm:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Profile Information</h1>
          <p className="text-gray-600 mt-1">Manage your professional information and preferences</p>
        </div>
        <div className="mt-4 sm:mt-0">
          {isEditing ? (
            <div className="flex space-x-3">
              <button 
                onClick={() => setIsEditing(false)} 
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
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Edit size={16} className="mr-2" /> 
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Message Alert */}
      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-6 p-4 rounded-lg ${message.startsWith('Error') ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-700 border border-green-200'}`}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <ProfileHeader user={profileData} isEditing={isEditing} onChange={handleDataChange} />
          <SkillsSection data={profileData} isEditing={isEditing} onChange={handleDataChange} />
          <SocialLinksSection data={profileData} isEditing={isEditing} onChange={handleDataChange} />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          <ExperienceSection data={profileData} isEditing={isEditing} onChange={handleDataChange} />
          <PreferencesSection data={profileData} isEditing={isEditing} onChange={handleDataChange} />
        </div>
      </div>
    </div>
  );
};

// Profile Header Component
const ProfileHeader = ({ user, isEditing, onChange }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4">
          <img 
            className="h-28 w-28 rounded-full object-cover border-4 border-white shadow-md" 
            src={`https://ui-avatars.com/api/?name=${user?.name || 'U'}&background=1e40af&color=fff&size=112`} 
            alt="Profile"
          />
          {isEditing && (
            <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 border border-gray-200">
              <Upload size={14} className="text-gray-600" />
            </button>
          )}
        </div>
        
        <div className="w-full">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">{user?.name || 'User Name'}</h2>
          
          {isEditing ? (
            <input 
              type="text" 
              name="professional_title"
              value={user?.professional_title || ''}
              onChange={(e) => onChange('header', { professional_title: e.target.value })}
              className="w-full text-center text-gray-600 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 py-1 mb-3"
              placeholder="Your Professional Title"
            />
          ) : (
            <p className="text-gray-600 mb-3">{user?.professional_title || 'Professional Title'}</p>
          )}
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center justify-center">
              <Mail size={14} className="mr-2" />
              <span>{user?.email || 'user@example.com'}</span>
            </div>
            
            {isEditing ? (
              <div className="flex items-center justify-center">
                <MapPin size={14} className="mr-2" />
                <input 
                  type="text" 
                  name="location"
                  value={user?.location || ''}
                  onChange={(e) => onChange('header', { location: e.target.value })}
                  className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 py-1 text-center"
                  placeholder="Location"
                />
              </div>
            ) : (
              user?.location && (
                <div className="flex items-center justify-center">
                  <MapPin size={14} className="mr-2" />
                  <span>{user.location}</span>
                </div>
              )
            )}
            
            {isEditing ? (
              <div className="flex items-center justify-center">
                <Phone size={14} className="mr-2" />
                <input 
                  type="tel" 
                  name="phone_number"
                  value={user?.phone_number || ''}
                  onChange={(e) => onChange('header', { phone_number: e.target.value })}
                  className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 py-1 text-center"
                  placeholder="Phone Number"
                />
              </div>
            ) : (
              user?.phone_number && (
                <div className="flex items-center justify-center">
                  <Phone size={14} className="mr-2" />
                  <span>{user.phone_number}</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Skills Section Component
const SkillsSection = ({ data, isEditing, onChange }) => {
  const skills = data?.skills ? data.skills.split(',').map(s => s.trim()).filter(s => s) : [];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Skills & Expertise</h3>
        {isEditing && (
          <span className="text-xs text-gray-500">Comma separated</span>
        )}
      </div>
      
      {isEditing ? (
        <textarea
          name="skills"
          value={data?.skills || ''}
          onChange={(e) => onChange('skills', { skills: e.target.value })}
          className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="React, JavaScript, TypeScript, Node.js, Python, etc."
        />
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.length > 0 ? (
            skills.map(skill => (
              <span 
                key={skill} 
                className="px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="text-sm text-gray-500">No skills added yet. Add your skills to improve job matches.</p>
          )}
        </div>
      )}
    </div>
  );
};

// Social Links Section Component
const SocialLinksSection = ({ data, isEditing, onChange }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Social & Professional Links</h3>
      
      <div className="space-y-4">
        {/* LinkedIn */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Linkedin size={16} className="mr-2 text-blue-600" />
            LinkedIn
          </label>
          {isEditing ? (
            <input 
              type="url" 
              name="linkedin_url"
              value={data?.linkedin_url || ''}
              onChange={(e) => onChange('links', { linkedin_url: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://linkedin.com/in/yourname"
            />
          ) : data?.linkedin_url ? (
            <a 
              href={data.linkedin_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm break-all"
            >
              {data.linkedin_url}
            </a>
          ) : (
            <p className="text-sm text-gray-500">Not provided</p>
          )}
        </div>
        
        {/* GitHub */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Github size={16} className="mr-2 text-gray-700" />
            GitHub
          </label>
          {isEditing ? (
            <input 
              type="url" 
              name="github_url"
              value={data?.github_url || ''}
              onChange={(e) => onChange('links', { github_url: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://github.com/yourusername"
            />
          ) : data?.github_url ? (
            <a 
              href={data.github_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm break-all"
            >
              {data.github_url}
            </a>
          ) : (
            <p className="text-sm text-gray-500">Not provided</p>
          )}
        </div>
        
        {/* Portfolio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Link size={16} className="mr-2 text-purple-600" />
            Portfolio
          </label>
          {isEditing ? (
            <input 
              type="url" 
              name="portfolio_url"
              value={data?.portfolio_url || ''}
              onChange={(e) => onChange('links', { portfolio_url: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://yourportfolio.com"
            />
          ) : data?.portfolio_url ? (
            <a 
              href={data.portfolio_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm break-all"
            >
              {data.portfolio_url}
            </a>
          ) : (
            <p className="text-sm text-gray-500">Not provided</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Experience Section Component
const ExperienceSection = ({ data, isEditing, onChange }) => {
  const parseExperiences = (expData) => {
    if (typeof expData === 'string') {
      try {
        return JSON.parse(expData);
      } catch (e) {
        return [];
      }
    }
    return Array.isArray(expData) ? expData : [];
  };

  const [experiences, setExperiences] = useState(parseExperiences(data?.experience));
  const [editingId, setEditingId] = useState(null);
  const [tempExperience, setTempExperience] = useState({});

  useEffect(() => {
    setExperiences(parseExperiences(data?.experience));
  }, [data]);

  const handleAddNew = () => {
    const newExp = { id: Date.now(), role: '', company: '', duration: '', description: '' };
    setExperiences([...experiences, newExp]);
    setEditingId(newExp.id);
    setTempExperience(newExp);
  };

  const handleEdit = (exp) => {
    setEditingId(exp.id);
    setTempExperience(exp);
  };

  const handleSave = (id) => {
    const updatedExperiences = experiences.map(exp => (exp.id === id ? tempExperience : exp));
    setExperiences(updatedExperiences);
    onChange('experience', { experience: updatedExperiences });
    setEditingId(null);
  };
  
  const handleCancel = () => {
    const originalExperience = data?.experience?.find(exp => exp.id === editingId);
    if (!originalExperience) {
        setExperiences(experiences.filter(exp => exp.id !== editingId));
    }
    setEditingId(null);
  };

  const handleDelete = (id) => {
    const updatedExperiences = experiences.filter(exp => exp.id !== id);
    setExperiences(updatedExperiences);
    onChange('experience', { experience: updatedExperiences });
  };

  const handleTempChange = (e) => {
    setTempExperience({ ...tempExperience, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Work Experience</h3>
        {isEditing && (
          <button 
            onClick={handleAddNew} 
            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <Plus size={16} className="mr-1.5" /> 
            Add Experience
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {experiences.length > 0 ? (
          experiences.map(exp => (
            <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
              {editingId === exp.id ? (
                <div className="space-y-4">
                  <input 
                    name="role" 
                    value={tempExperience.role} 
                    onChange={handleTempChange} 
                    placeholder="Job Title" 
                    className="w-full p-2 border-b-2 focus:outline-none focus:border-blue-500 font-medium" 
                  />
                  <input 
                    name="company" 
                    value={tempExperience.company} 
                    onChange={handleTempChange} 
                    placeholder="Company Name" 
                    className="w-full p-2 border-b-2 focus:outline-none focus:border-blue-500" 
                  />
                  <input 
                    name="duration" 
                    value={tempExperience.duration} 
                    onChange={handleTempChange} 
                    placeholder="Duration (e.g., Jan 2020 - Present)" 
                    className="w-full p-2 border-b-2 focus:outline-none focus:border-blue-500 text-sm" 
                  />
                  <textarea 
                    name="description" 
                    value={tempExperience.description} 
                    onChange={handleTempChange} 
                    placeholder="Description of your responsibilities and achievements" 
                    className="w-full p-2 border-b-2 focus:outline-none focus:border-blue-500 text-sm resize-none" 
                    rows="3"
                  />
                  
                  <div className="flex justify-end space-x-2 pt-2">
                    <button 
                      onClick={() => handleSave(exp.id)} 
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button 
                      onClick={handleCancel} 
                      className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{exp.role || 'Untitled Position'}</h4>
                    <p className="text-gray-700">{exp.company || 'Company not specified'}</p>
                    {exp.duration && (
                      <p className="text-sm text-gray-500 flex items-center mt-1">
                        <Calendar size={14} className="mr-1.5" />
                        {exp.duration}
                      </p>
                    )}
                    {exp.description && (
                      <p className="text-sm text-gray-600 mt-2">{exp.description}</p>
                    )}
                  </div>
                  
                  {isEditing && (
                    <div className="flex items-start space-x-2">
                      <button 
                        onClick={() => handleEdit(exp)} 
                        className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(exp.id)} 
                        className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
            <p>No work experience added yet</p>
            {isEditing && (
              <button 
                onClick={handleAddNew} 
                className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Add your first experience
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Preferences Section Component
const PreferencesSection = ({ data, isEditing, onChange }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Job Preferences</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Briefcase size={16} className="mr-2 text-blue-600" />
            Work Arrangement
          </label>
          {isEditing ? (
            <select 
              name="work_arrangement" 
              value={data?.work_arrangement || ''} 
              onChange={(e) => onChange('prefs', { work_arrangement: e.target.value })} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select preferred arrangement</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
            </select>
          ) : (
            <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">
              {data?.work_arrangement || 'Not specified'}
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <DollarSign size={16} className="mr-2 text-green-600" />
            Desired Salary (₹)
          </label>
          {isEditing ? (
            <input 
              type="number" 
              name="desired_salary" 
              value={data?.desired_salary || ''} 
              onChange={(e) => onChange('prefs', { desired_salary: e.target.value })} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="Expected annual salary"
            />
          ) : (
            <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">
              {data?.desired_salary ? `₹${Number(data.desired_salary).toLocaleString('en-IN')}` : 'Not specified'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;