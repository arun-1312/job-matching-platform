import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Briefcase, MoreVertical, PauseCircle, PlayCircle, X, MapPin, DollarSign, Calendar, Trash2, Award, FileText } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import JobCard from './JobCard';

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
      className={`w-full pl-10 pr-4 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
        error ? 'border-red-500 focus:ring-red-500' : ''
      } ${className}`}
    />
    {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
  </div>
);

// Main Job Listing Page Component
const JobListingPage = ({ token }) => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    jobType: '',
    location: '',
    salaryRange: '',
    experience: '',
    skills: '',
    description: '',
    applicationDeadline: null,
  });

  useEffect(() => {
    const fetchJobs = async () => {
      if (!token) {
        setError("Authentication token is missing.");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/api/employer/jobs', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch jobs');
        }

        const data = await response.json();
        console.log('Raw Fetched Jobs:', data); // Debug raw data
        const normalizedJobs = data.map(job => ({
          ...job,
          salaryRange: job.salary_range || null,
          jobType: job.job_type || null,
          applicationDeadline: job.application_deadline || null,
        }));
        console.log('Normalized Jobs:', normalizedJobs); // Debug normalized data
        setJobs(normalizedJobs);
        setError(null);
      } catch (err) {
        setError(err.message);
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [token]);

  const handleCreateJob = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Authentication token is missing.");
      return;
    }
    try {
      const payload = {
        employer_id: null, // To be set by backend from current_user
        title: newJob.title,
        description: newJob.description,
        location: newJob.location,
        salary_range: newJob.salaryRange || null,
        job_type: newJob.jobType || null,
        experience: newJob.experience || null,
        skills: newJob.skills || null,
        status: 'open',
        application_deadline: newJob.applicationDeadline ? newJob.applicationDeadline.toISOString() : null,
      };
      const response = await fetch('http://localhost:5000/api/employer/jobs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create job');
      }

      const data = await response.json();
      console.log('Created Job Response:', data); // Debug
      const newJobData = {
        ...data.job,
        salaryRange: data.job.salary_range || null,
        jobType: data.job.job_type || null,
        applicationDeadline: data.job.application_deadline || null,
      };
      setJobs([...jobs, newJobData]);
      setIsModalOpen(false);
      setNewJob({
        title: '', jobType: '', location: '', salaryRange: '', experience: '', skills: '', description: '', applicationDeadline: null
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditJob = async (jobId, action) => {
    try {
      const job = jobs.find(j => j.id === jobId);
      if (!job) throw new Error('Job not found');

      let updatedStatus;
      switch (action) {
        case 'pause':
          updatedStatus = job.status === 'paused' ? 'open' : 'paused';
          break;
        case 'close':
          updatedStatus = 'closed';
          break;
        case 'delete':
          await handleDeleteJob(jobId);
          return;
        default:
          updatedStatus = 'open';
      }
      const response = await fetch(`http://localhost:5000/api/employer/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: updatedStatus })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update job');
      }

      const updatedJob = await response.json();
      console.log('Updated Job Response:', updatedJob); // Debug
      const normalizedJob = {
        ...updatedJob.job,
        salaryRange: updatedJob.job.salary_range || null,
        jobType: updatedJob.job.job_type || null,
        applicationDeadline: updatedJob.job.application_deadline || null,
      };
      setJobs(jobs.map(j => j.id === jobId ? normalizedJob : j));
    } catch (err) {
      console.error('Error in handleEditJob:', err);
      setError(err.message);
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/employer/jobs/${jobId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete job');
      }

      setJobs(jobs.filter(job => job.id !== jobId));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex-1 p-6 sm:p-8 bg-gray-50 min-h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Job Listings</h1>
          <p className="text-gray-600 mt-1">Manage your active, paused, and archived job postings.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 sm:mt-0 px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors flex items-center shadow-sm hover:shadow-md"
        >
          <Plus size={18} className="mr-2" />
          Post a New Job
        </button>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-gray-500">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          Loading your job listings...
        </div>
      ) : error ? (
        <div className="p-12 text-center text-red-600 bg-red-50">
          <X size={48} className="mx-auto mb-4" />
          Error: {error}
        </div>
      ) : jobs.length === 0 ? (
        <div className="p-12 text-center text-gray-500">
          <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="font-semibold text-lg mb-2">No job listings yet</h3>
          <p className="text-sm">Click "Post a New Job" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => (
            <JobCard key={job.id} job={job} handleEditJob={handleEditJob} />
          ))}
        </div>
      )}

      {/* Professional Landscape Job Creation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden"
            >
              {/* Professional Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Create New Job Listing</h2>
                      <p className="text-blue-100 text-sm">Fill out the form below to post your job</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Form Content - Landscape Layout */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <form onSubmit={handleCreateJob} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Job Title */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job Title *
                        </label>
                        <InputField
                          icon={<Briefcase size={16} />}
                          type="text"
                          placeholder="e.g., Senior Frontend Developer"
                          value={newJob.title}
                          onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                          error={null}
                        />
                      </div>

                      {/* Job Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job Type *
                        </label>
                        <select
                          value={newJob.jobType}
                          onChange={(e) => setNewJob({ ...newJob, jobType: e.target.value })}
                          className="w-full p-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Job Type</option>
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract</option>
                          <option value="Internship">Internship</option>
                        </select>
                      </div>

                      {/* Location */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location *
                        </label>
                        <select
                          value={newJob.location}
                          onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                          className="w-full p-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Location</option>
                          <option value="Remote">Remote</option>
                          <option value="Hybrid">Hybrid</option>
                          <option value="On-site">On-site</option>
                        </select>
                      </div>

                      {/* Salary */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Salary Range (₹ LPA) *
                        </label>
                        <InputField
                          icon={<DollarSign size={16} />}
                          type="text"
                          placeholder="e.g., 15-20"
                          value={newJob.salaryRange}
                          onChange={(e) => setNewJob({ ...newJob, salaryRange: e.target.value })}
                          error={null}
                        />
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* Experience */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Experience Required *
                        </label>
                        <select
                          value={newJob.experience}
                          onChange={(e) => setNewJob({ ...newJob, experience: e.target.value })}
                          className="w-full p-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Experience</option>
                          <option value="Fresher">Fresher (0-1 years)</option>
                          <option value="2+ years">2+ years</option>
                          <option value="5+ years">5+ years</option>
                          <option value="10+ years">10+ years</option>
                        </select>
                      </div>

                      {/* Skills */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Required Skills *
                        </label>
                        <InputField
                          icon={<Award size={16} />}
                          type="text"
                          placeholder="e.g., React, Node.js, Python"
                          value={newJob.skills}
                          onChange={(e) => setNewJob({ ...newJob, skills: e.target.value })}
                          error={null}
                        />
                      </div>

                      {/* Deadline Date */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Application Deadline *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar size={16} className="text-gray-400" />
                          </div>
                          <DatePicker
                            selected={newJob.applicationDeadline}
                            onChange={(date) => setNewJob({ ...newJob, applicationDeadline: date })}
                            className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholderText="Select deadline date"
                            dateFormat="MMMM d, yyyy"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description - Full Width */}
                  <div className="pt-4 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Description *
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <FileText size={16} className="text-gray-400" />
                      </div>
                      <textarea
                        value={newJob.description}
                        onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                        className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none"
                        placeholder="Describe the role, responsibilities, requirements, and benefits..."
                        required
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4 pt-6">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md flex items-center"
                    >
                      <Plus size={18} className="mr-2" />
                      Publish Job
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobListingPage;