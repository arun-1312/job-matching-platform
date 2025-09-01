import React, { useState } from 'react';
import { Briefcase, MoreVertical, PauseCircle, PlayCircle, X, MapPin, Calendar, Trash2 } from 'lucide-react';

// StatusBadge defined at the top
const StatusBadge = ({ status }) => {
  const statusMap = { open: 'Active', paused: 'Paused', closed: 'Closed' };
  const baseClasses = "px-2.5 py-1 text-xs font-medium rounded-full inline-flex items-center";
  let colorClasses = "";
  switch (statusMap[status] || status) {
    case 'Active': colorClasses = "bg-blue-100 text-blue-800"; break;
    case 'Paused': colorClasses = "bg-yellow-100 text-yellow-800"; break;
    case 'Closed': colorClasses = "bg-red-100 text-red-800"; break;
    default: colorClasses = "bg-gray-100 text-gray-800";
  }
  return <span className={`${baseClasses} ${colorClasses}`}>{statusMap[status] || status}</span>;
};

const JobCard = ({ job, handleEditJob }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const getBorderColor = () => {
    switch (job.status) {
      case 'open': return 'border-blue-600';
      case 'paused': return 'border-yellow-600';
      case 'closed': return 'border-red-600';
      default: return 'border-black';
    }
  };

  return (
    <div
      className={`bg-white rounded-xl ${getBorderColor()} border-2 shadow-sm hover:shadow-md transition-shadow overflow-hidden relative`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Briefcase size={18} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-gray-900">{job.title || 'Untitled'}</h3>
                <StatusBadge status={job.status} />
              </div>
              <p className="text-gray-500 text-sm flex items-center mt-1">
                <MapPin size={12} className="mr-1" />
                {job.location || 'Not specified'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">25+ new applications</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsSettingsOpen(!isSettingsOpen);
              }}
              className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            >
              <MoreVertical size={18} />
            </button>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-600 flex items-center">
          <Calendar size={14} className="mr-1" />
          {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : 'Not specified'}
        </p>
      </div>

      {isSettingsOpen && (
        <div className="absolute right-4 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditJob(job.id, 'pause');
              setIsSettingsOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          >
            {job.status === 'paused' ? <PlayCircle size={16} className="mr-2" /> : <PauseCircle size={16} className="mr-2" />}
            {job.status === 'paused' ? 'Activate' : 'Pause'}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditJob(job.id, 'close');
              setIsSettingsOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <X size={16} className="mr-2" />
            Close
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditJob(job.id, 'delete');
              setIsSettingsOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
          >
            <Trash2 size={16} className="mr-2" />
            Delete
          </button>
        </div>
      )}

      {isExpanded && (
        <div className="p-4 border-t border-gray-200 space-y-2">
          <p className="text-sm text-gray-600"><span className="font-medium">Salary:</span> {job.salaryRange ? job.salaryRange.toString() : 'Not specified'}</p>
          <p className="text-sm text-gray-600"><span className="font-medium">Type:</span> {job.jobType || 'Not specified'}</p>
          <p className="text-sm text-gray-600"><span className="font-medium">Experience:</span> {job.experience || 'Not specified'}</p>
          <p className="text-sm text-gray-600"><span className="font-medium">Skills:</span> {job.skills || 'Not specified'}</p>
        </div>
      )}
    </div>
  );
};

export default JobCard;