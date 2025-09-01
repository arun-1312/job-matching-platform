import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  BarChart2,
  Bookmark,
  Check,
  Brain,
  Filter,
  X,
  Clock,
  Building,
  Star,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  BookmarkPlus,
  ExternalLink
} from "lucide-react";

// Placeholder Data
const jobsData = [
  {
    id: 1,
    company: "Innovate Inc.",
    title: "Senior Frontend Developer",
    location: "Remote",
    match: 92,
    snippet: "Seeking an experienced React developer to build next-gen user interfaces...",
    posted: "2d ago",
    type: "Full-time",
    salary: "₹1,800,000 - ₹2,500,000",
    experience: "5+ years",
    skills: ["React", "TypeScript", "Tailwind CSS", "GraphQL"],
    description: "We're looking for a Senior Frontend Developer to join our growing team. You'll be responsible for building and maintaining high-quality web applications using modern technologies. The ideal candidate has extensive experience with React, TypeScript, and modern build tools.",
    benefits: ["Health insurance", "Flexible hours", "Remote work", "Professional development"],
    companyInfo: "Innovate Inc. is a leading tech company focused on creating innovative solutions for the digital age. We value creativity, collaboration, and cutting-edge technology."
  },
  {
    id: 2,
    company: "Tech Solutions LLC",
    title: "Full-Stack Engineer",
    location: "New York, NY",
    match: 88,
    snippet: "Join our dynamic team to work on both frontend and backend systems using Node.js...",
    posted: "4d ago",
    type: "Full-time",
    salary: "₹1,500,000 - ₹2,200,000",
    experience: "3-5 years",
    skills: ["Node.js", "React", "AWS", "PostgreSQL"],
    description: "As a Full-Stack Engineer, you'll work on both client and server-side applications. You should be comfortable with front-end and back-end coding languages, development frameworks, and third-party libraries.",
    benefits: ["Competitive salary", "Stock options", "Flexible PTO", "Learning budget"],
    companyInfo: "Tech Solutions LLC provides enterprise software solutions to businesses worldwide. Our team is distributed across multiple countries with a strong culture of innovation."
  },
  {
    id: 3,
    company: "Creative Minds",
    title: "UI/UX Designer",
    location: "San Francisco, CA",
    match: 85,
    snippet: "We are looking for a creative designer to craft beautiful and intuitive user experiences...",
    posted: "1w ago",
    type: "Contract",
    salary: "₹1,200,000 - ₹1,800,000",
    experience: "3+ years",
    skills: ["Figma", "User Research", "Prototyping", "Adobe XD"],
    description: "Join our design team to create intuitive and beautiful user experiences. You'll collaborate with product managers and engineers to deliver designs that solve real user problems.",
    benefits: ["Remote work", "Flexible schedule", "Creative freedom"],
    companyInfo: "Creative Minds is a design agency specializing in digital product design. We work with startups and enterprises to create memorable user experiences."
  },
  {
    id: 4,
    company: "Data Driven Co.",
    title: "Data Scientist",
    location: "Bangalore, IN",
    match: 95,
    snippet: "Leverage machine learning and statistical analysis to derive insights from large datasets...",
    posted: "1d ago",
    type: "Full-time",
    salary: "₹2,000,000 - ₹3,000,000",
    experience: "4+ years",
    skills: ["Python", "TensorFlow", "Scikit-learn", "SQL"],
    description: "We're seeking a Data Scientist to analyze complex datasets and build predictive models. You'll work with cross-functional teams to identify opportunities for leveraging company data.",
    benefits: ["Health insurance", "Gym membership", "Conference budget", "Stock options"],
    companyInfo: "Data Driven Co. helps businesses make data-informed decisions through advanced analytics and machine learning solutions."
  },
  {
    id: 5,
    company: "Cloud Innovations",
    title: "DevOps Engineer",
    location: "Austin, TX",
    match: 78,
    snippet: "Manage cloud infrastructure and CI/CD pipelines for high-traffic applications...",
    posted: "3d ago",
    type: "Full-time",
    salary: "₹1,600,000 - ₹2,300,000",
    experience: "4+ years",
    skills: ["AWS", "Docker", "Kubernetes", "Terraform"],
    description: "As a DevOps Engineer, you'll be responsible for maintaining our cloud infrastructure and ensuring the reliability of our services. You'll work closely with development teams to streamline deployments.",
    benefits: ["Remote work", "Unlimited PTO", "Home office stipend", "Professional coaching"],
    companyInfo: "Cloud Innovations provides cloud consulting and infrastructure management for tech companies of all sizes."
  },
  {
    id: 6,
    company: "Mobile First",
    title: "iOS Developer",
    location: "Remote",
    match: 82,
    snippet: "Build beautiful and performant iOS applications using Swift and modern frameworks...",
    posted: "5d ago",
    type: "Full-time",
    salary: "₹1,400,000 - ₹2,100,000",
    experience: "3+ years",
    skills: ["Swift", "UIKit", "SwiftUI", "Core Data"],
    description: "We're looking for an iOS Developer to create innovative mobile applications. You should be passionate about building smooth, responsive UIs and clean architecture.",
    benefits: ["Flexible hours", "Learning budget", "Health benefits", "Equity package"],
    companyInfo: "Mobile First is a product company focused on creating best-in-class mobile experiences for consumers and businesses."
  }
];

const userSkills = ["React", "TypeScript", "Node.js", "Python"]; // Placeholder for logged-in user's skills

const FindJobsPage = () => {
  const [selectedJob, setSelectedJob] = useState(jobsData[0]);
  const [activeTab, setActiveTab] = useState("details"); // "details" | "insights" | "company"
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    jobType: [],
    experience: [],
    salaryRange: [0, 5000000]
  });
  const [savedJobs, setSavedJobs] = useState([]);

  const toggleSaveJob = (jobId) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter(id => id !== jobId));
    } else {
      setSavedJobs([...savedJobs, jobId]);
    }
  };

  const JobCard = ({ job, isSelected }) => (
    <motion.button
      onClick={() => setSelectedJob(job)}
      whileHover={{ y: -2 }}
      className={`p-5 w-full rounded-xl border transition-all text-left ${
        isSelected
          ? "bg-white shadow-md border-blue-500"
          : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
              <Building size={16} className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 truncate">{job.title}</p>
              <p className="text-sm text-gray-600 truncate">{job.company}</p>
            </div>
          </div>
          
          <div className="flex items-center mt-3 text-sm text-gray-500">
            <MapPin size={14} className="mr-1.5" />
            <span className="truncate">{job.location}</span>
          </div>
          
          <div className="mt-3 flex flex-wrap gap-1.5">
            {job.skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className={`px-2 py-1 text-xs rounded-full ${
                  userSkills.includes(skill)
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded-full">
                +{job.skills.length - 3}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-end ml-3 flex-shrink-0">
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
            job.match >= 90 ? "bg-green-100 text-green-800" :
            job.match >= 80 ? "bg-blue-100 text-blue-800" :
            "bg-amber-100 text-amber-800"
          }`}>
            {job.match}% Match
          </span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveJob(job.id);
            }}
            className="mt-2 p-1.5 text-gray-400 hover:text-blue-500 rounded-full hover:bg-blue-50 transition-colors"
          >
            <Bookmark size={16} fill={savedJobs.includes(job.id) ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center">
          <Clock size={12} className="mr-1" />
          <span>{job.posted}</span>
        </div>
        <span className="bg-gray-100 px-2 py-1 rounded">{job.type}</span>
      </div>
    </motion.button>
  );

  // Filter jobs based on search and filters
  const filteredJobs = jobsData.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLocation = locationQuery === "" || 
                           job.location.toLowerCase().includes(locationQuery.toLowerCase());
    
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="flex-1 p-6 sm:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Find Your Next Opportunity</h1>
        <p className="text-gray-600 mt-1">
          Discover roles that match your skills and career goals
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Job title, skills, or company"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative flex-grow">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Location (City, State, or Remote)"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
            />
          </div>
          <button 
            className="px-6 py-3 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} className="mr-2" />
            Filters
          </button>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                  <div className="space-y-2">
                    {['Full-time', 'Part-time', 'Contract', 'Internship'].map(type => (
                      <label key={type} className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="rounded text-blue-600 focus:ring-blue-500"
                          checked={filters.jobType.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({...filters, jobType: [...filters.jobType, type]});
                            } else {
                              setFilters({...filters, jobType: filters.jobType.filter(t => t !== type)});
                            }
                          }}
                        />
                        <span className="ml-2 text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                  <div className="space-y-2">
                    {['Entry', 'Mid', 'Senior', 'Lead'].map(level => (
                      <label key={level} className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{level} Level</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                  <div className="space-y-2">
                    <input 
                      type="range" 
                      min="0" 
                      max="5000000" 
                      step="100000"
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>₹0</span>
                      <span>₹5M+</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Briefcase size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Jobs</p>
              <p className="text-xl font-semibold text-gray-900">{filteredJobs.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <TrendingUp size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Best Match</p>
              <p className="text-xl font-semibold text-gray-900">
                {filteredJobs.length > 0 ? Math.max(...filteredJobs.map(j => j.match)) : 0}%
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <Bookmark size={18} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Saved Jobs</p>
              <p className="text-xl font-semibold text-gray-900">{savedJobs.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-amber-100 rounded-lg mr-3">
              <Star size={18} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg. Match</p>
              <p className="text-xl font-semibold text-gray-900">
                {filteredJobs.length > 0 
                  ? Math.round(filteredJobs.reduce((sum, job) => sum + job.match, 0) / filteredJobs.length) 
                  : 0
                }%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Job Cards Grid */}
        <div className="lg:col-span-1">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-4">
            <h3 className="font-medium text-gray-800">
              Matching Jobs <span className="text-gray-500">({filteredJobs.length})</span>
            </h3>
          </div>
          
          <div className="space-y-4 h-[calc(100vh-22rem)] overflow-y-auto pr-2">
            <AnimatePresence>
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSelected={selectedJob?.id === job.id}
                />
              ))}
            </AnimatePresence>
            
            {filteredJobs.length === 0 && (
              <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
                <Search size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="font-medium text-gray-800 mb-2">No jobs found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or filters</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Job Details + AI Insights */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[calc(100vh-22rem)] overflow-hidden flex flex-col">
            {selectedJob ? (
              <div className="flex flex-col h-full">
                {/* Tabs */}
                <div className="flex border-b">
                  <button
                    onClick={() => setActiveTab("details")}
                    className={`px-6 py-3 font-medium flex items-center ${
                      activeTab === "details"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Briefcase size={18} className="mr-2" />
                    Job Details
                  </button>
                  <button
                    onClick={() => setActiveTab("insights")}
                    className={`px-6 py-3 font-medium flex items-center ${
                      activeTab === "insights"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Brain size={18} className="mr-2" />
                    AI Insights
                  </button>
                  <button
                    onClick={() => setActiveTab("company")}
                    className={`px-6 py-3 font-medium flex items-center ${
                      activeTab === "company"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Building size={18} className="mr-2" />
                    Company
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <AnimatePresence mode="wait">
                    {activeTab === "details" && (
                      <motion.div
                        key="details"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="h-full"
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                          <div>
                            <h2 className="text-2xl font-semibold text-gray-900">
                              {selectedJob.title}
                            </h2>
                            <p className="text-lg text-gray-600 mt-1">
                              {selectedJob.company} • {selectedJob.location}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                              selectedJob.match >= 90 ? "bg-green-100 text-green-800" :
                              selectedJob.match >= 80 ? "bg-blue-100 text-blue-800" :
                              "bg-amber-100 text-amber-800"
                            }`}>
                              {selectedJob.match}% Match
                            </span>
                            <button 
                              onClick={() => toggleSaveJob(selectedJob.id)}
                              className={`p-2 rounded-lg ${
                                savedJobs.includes(selectedJob.id)
                                  ? "bg-blue-100 text-blue-600"
                                  : "text-gray-400 hover:bg-gray-100"
                              }`}
                            >
                              <Bookmark size={20} fill={savedJobs.includes(selectedJob.id) ? "currentColor" : "none"} />
                            </button>
                          </div>
                        </div>

                        {/* Apply Button */}
                        <div className="mb-6">
                          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center">
                            Apply Now
                            <ExternalLink size={18} className="ml-2" />
                          </button>
                        </div>

                        {/* Key Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-y border-gray-200 mb-6">
                          <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg mr-3">
                              <DollarSign size={18} className="text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Salary</p>
                              <p className="font-medium text-gray-900">{selectedJob.salary}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg mr-3">
                              <Briefcase size={18} className="text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Type</p>
                              <p className="font-medium text-gray-900">{selectedJob.type}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg mr-3">
                              <BarChart2 size={18} className="text-purple-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Experience</p>
                              <p className="font-medium text-gray-900">{selectedJob.experience}</p>
                            </div>
                          </div>
                        </div>

                        {/* Skills */}
                        <div className="mb-6">
                          <h3 className="font-semibold text-gray-800 mb-3">Required Skills</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedJob.skills.map((skill) => (
                              <span
                                key={skill}
                                className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
                                  userSkills.includes(skill)
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {userSkills.includes(skill) && (
                                  <Check size={14} className="inline mr-1.5" />
                                )}
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-3">Job Description</h3>
                          <p className="text-gray-700 leading-relaxed">{selectedJob.description}</p>
                        </div>

                        {/* Benefits */}
                        {selectedJob.benefits && (
                          <div className="mt-6">
                            <h3 className="font-semibold text-gray-800 mb-3">Benefits & Perks</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {selectedJob.benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center">
                                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                                    <Check size={12} className="text-green-600" />
                                  </div>
                                  <span className="text-gray-700">{benefit}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {activeTab === "insights" && (
                      <motion.div
                        key="insights"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <div className="flex items-center mb-6">
                          <div className="p-2 bg-blue-100 rounded-lg mr-3">
                            <Brain size={24} className="text-blue-600" />
                          </div>
                          <div>
                            <h2 className="text-xl font-semibold text-gray-900">AI Match Analysis</h2>
                            <p className="text-gray-600">How your profile compares to this role</p>
                          </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
                          <div className="flex items-center justify-between mb-4">
                            <span className="font-medium text-blue-800">Overall Match Score</span>
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                              selectedJob.match >= 90 ? "bg-green-100 text-green-800" :
                              selectedJob.match >= 80 ? "bg-blue-100 text-blue-800" :
                              "bg-amber-100 text-amber-800"
                            }`}>
                              {selectedJob.match}%
                            </span>
                          </div>
                          
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div 
                              className={`h-2 rounded-full ${
                                selectedJob.match >= 90 ? "bg-green-500" :
                                selectedJob.match >= 80 ? "bg-blue-500" :
                                "bg-amber-500"
                              }`}
                              style={{ width: `${selectedJob.match}%` }}
                            ></div>
                          </div>
                          
                          <p className="text-sm text-blue-700">
                            {selectedJob.match >= 90 
                              ? "Excellent match! You meet or exceed all key requirements."
                              : selectedJob.match >= 80
                              ? "Strong match. You have most of the required skills and experience."
                              : "Good potential match. Consider developing a few key skills."
                            }
                          </p>
                        </div>

                        <div className="space-y-6">
                          <div>
                            <h3 className="font-semibold text-gray-800 mb-3">Skill Analysis</h3>
                            <div className="space-y-3">
                              {selectedJob.skills.map((skill) => {
                                const hasSkill = userSkills.includes(skill);
                                return (
                                  <div key={skill} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium text-gray-700">{skill}</span>
                                    <div className="flex items-center">
                                      {hasSkill ? (
                                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full flex items-center">
                                          <Check size={12} className="mr-1" /> Matched
                                        </span>
                                      ) : (
                                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                          Not in your profile
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold text-gray-800 mb-3">Recommendations</h3>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <ul className="space-y-2 text-gray-700">
                                <li className="flex items-start">
                                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                    <TrendingUp size={12} className="text-blue-600" />
                                  </div>
                                  <span>Highlight your experience with <strong>{userSkills.filter(skill => selectedJob.skills.includes(skill))[0]}</strong> in your application</span>
                                </li>
                                <li className="flex items-start">
                                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                    <TrendingUp size={12} className="text-blue-600" />
                                  </div>
                                  <span>Consider developing skills in <strong>{selectedJob.skills.find(skill => !userSkills.includes(skill))}</strong> to increase your match score</span>
                                </li>
                                <li className="flex items-start">
                                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                    <TrendingUp size={12} className="text-blue-600" />
                                  </div>
                                  <span>Emphasize your {selectedJob.experience} of experience in your cover letter</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "company" && (
                      <motion.div
                        key="company"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <div className="flex items-center mb-6">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                            <Building size={24} className="text-blue-600" />
                          </div>
                          <div>
                            <h2 className="text-xl font-semibold text-gray-900">{selectedJob.company}</h2>
                            <p className="text-gray-600">Company Information</p>
                          </div>
                        </div>

                        <div className="prose prose-sm max-w-none text-gray-700">
                          <p>{selectedJob.companyInfo}</p>
                          
                          <h3 className="font-semibold text-gray-800 mt-6">Company Details</h3>
                          <div className="grid grid-cols-2 gap-4 mt-3">
                            <div>
                              <p className="text-sm text-gray-600">Industry</p>
                              <p className="font-medium">Technology</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Company Size</p>
                              <p className="font-medium">201-500 employees</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Founded</p>
                              <p className="font-medium">2015</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Website</p>
                              <a href="#" className="font-medium text-blue-600 hover:underline">companywebsite.com</a>
                            </div>
                          </div>
                          
                          <h3 className="font-semibold text-gray-800 mt-6">Similar Roles</h3>
                          <div className="mt-3 space-y-2">
                            {jobsData
                              .filter(job => job.company === selectedJob.company && job.id !== selectedJob.id)
                              .slice(0, 3)
                              .map(job => (
                                <div key={job.id} className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                                  <p className="font-medium text-gray-900">{job.title}</p>
                                  <div className="flex items-center justify-between mt-2">
                                    <span className="text-sm text-gray-600">{job.location} • {job.type}</span>
                                    <span className="text-sm font-medium text-blue-600">{job.match}% Match</span>
                                  </div>
                                </div>
                              ))
                            }
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center p-6">
                <div>
                  <Search size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="font-medium text-gray-800 mb-2">Select a job to view details</h3>
                  <p className="text-gray-600">Choose a job from the list to see the full description and AI insights</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindJobsPage;