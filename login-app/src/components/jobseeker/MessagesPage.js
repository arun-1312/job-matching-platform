import React from 'react';
import { MessageSquare } from 'lucide-react';

const MessagesPage = () => {
    return (
        <div className="flex-1 p-6 sm:p-8">
             {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <MessageSquare size={28} className="mr-3 text-teal-500" />
                    Messages
                </h1>
                <p className="text-gray-600 mt-1">Communicate with potential employers directly.</p>
            </div>

            {/* Placeholder Content */}
            <div className="text-center py-24 text-gray-500 bg-white rounded-lg border border-gray-200">
                <MessageSquare size={48} className="mx-auto" />
                <h3 className="mt-4 text-lg font-semibold">Messaging Feature Coming Soon</h3>
                <p className="mt-1 text-sm">This is where you'll find your conversations with recruiters and hiring managers.</p>
            </div>
        </div>
    );
};

export default MessagesPage;
