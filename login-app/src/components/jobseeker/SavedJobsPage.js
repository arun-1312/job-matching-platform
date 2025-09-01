import React from 'react';
import { Bookmark, Briefcase, MapPin } from 'lucide-react';

// Placeholder Data
const savedJobsData = [
    { id: 1, company: 'Innovate Inc.', title: 'Senior Frontend Developer', location: 'Remote', match: 92 },
    { id: 4, company: 'Data Driven Co.', title: 'Data Scientist', location: 'Bangalore, IN', match: 95 },
];

const SavedJobsPage = () => {
    return (
        <div className="flex-1 p-6 sm:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <Bookmark size={28} className="mr-3 text-teal-500" />
                    Saved Jobs
                </h1>
                <p className="text-gray-600 mt-1">Review and manage the opportunities you're interested in.</p>
            </div>

            {/* Saved Jobs List */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
                {savedJobsData.length > 0 ? (
                    <ul className="space-y-4">
                        {savedJobsData.map(job => (
                            <li key={job.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center font-bold text-gray-500 flex-shrink-0">{job.company.charAt(0)}</div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{job.title}</p>
                                        <p className="text-sm text-gray-500 flex items-center"><Briefcase size={12} className="mr-1.5" />{job.company} <span className="mx-2">|</span> <MapPin size={12} className="mr-1.5" />{job.location}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className="px-2 py-1 text-xs font-semibold text-teal-700 bg-teal-100 rounded-full">{job.match}% Match</span>
                                    <button className="text-sm font-semibold text-teal-600 hover:underline">View</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <Bookmark size={48} className="mx-auto" />
                        <h3 className="mt-4 text-lg font-semibold">No Saved Jobs Yet</h3>
                        <p className="mt-1 text-sm">When you find a job you're interested in, save it to find it here later.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedJobsPage;
