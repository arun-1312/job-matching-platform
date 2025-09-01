import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'; // UPDATED Library
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Clock, MessageSquare, FileText, Lightbulb, Bell, Archive } from 'lucide-react';
import '../../styles/MyApplicationsPage.css'; 

// Placeholder Data
const initialData = {
    applications: {
        'app-1': { id: 'app-1', company: 'Innovate Inc.', title: 'Senior Frontend Developer', match: 92, date: 'Aug 18' },
        'app-2': { id: 'app-2', company: 'Tech Solutions LLC', title: 'Full-Stack Engineer', match: 88, date: 'Aug 20' },
        'app-3': { id: 'app-3', company: 'Creative Minds', title: 'UI/UX Designer', match: 85, date: 'Aug 15' },
        'app-4': { id: 'app-4', company: 'Data Driven Co.', title: 'Data Scientist', match: 95, date: 'Aug 21' },
        'app-5': { id: 'app-5', company: 'CloudNet', title: 'DevOps Engineer', match: 90, date: 'Aug 19' },
    },
    columns: {
        'applied': { id: 'applied', title: 'Applied', applicationIds: ['app-3', 'app-5'] },
        'viewed': { id: 'viewed', title: 'Viewed by Employer', applicationIds: ['app-2'] },
        'interviewing': { id: 'interviewing', title: 'Interviewing', applicationIds: ['app-1'] },
        'offer': { id: 'offer', title: 'Offer', applicationIds: ['app-4'] },
        'archived': { id: 'archived', title: 'Archived', applicationIds: [] },
    },
    columnOrder: ['applied', 'viewed', 'interviewing', 'offer', 'archived'],
};

// --- NEW: Color mapping for columns ---
const columnColors = {
    applied: 'bg-yellow-50',
    viewed: 'bg-blue-50',
    interviewing: 'bg-teal-50',
    offer: 'bg-green-50',
    archived: 'bg-slate-100',
};

const MyApplicationsPage = () => {
    const [boardData, setBoardData] = useState(initialData);
    const [selectedApp, setSelectedApp] = useState(null);

    const onDragEnd = result => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const start = boardData.columns[source.droppableId];
        const finish = boardData.columns[destination.droppableId];

        if (start === finish) {
            const newApplicationIds = Array.from(start.applicationIds);
            newApplicationIds.splice(source.index, 1);
            newApplicationIds.splice(destination.index, 0, draggableId);

            const newColumn = { ...start, applicationIds: newApplicationIds };
            const newState = { ...boardData, columns: { ...boardData.columns, [newColumn.id]: newColumn } };
            setBoardData(newState);
            return;
        }

        const startApplicationIds = Array.from(start.applicationIds);
        startApplicationIds.splice(source.index, 1);
        const newStart = { ...start, applicationIds: startApplicationIds };

        const finishApplicationIds = Array.from(finish.applicationIds);
        finishApplicationIds.splice(destination.index, 0, draggableId);
        const newFinish = { ...finish, applicationIds: finishApplicationIds };

        const newState = { ...boardData, columns: { ...boardData.columns, [newStart.id]: newStart, [newFinish.id]: newFinish } };
        setBoardData(newState);
    };
    
    return (
        <div className="flex-1 p-6 sm:p-8 flex flex-col h-full">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
                <p className="text-gray-600 mt-1">Track your job applications through your visual pipeline.</p>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex-1 flex gap-6 overflow-x-auto pb-4 custom-scrollbar-hidden">
                    {boardData.columnOrder.map(columnId => {
                        const column = boardData.columns[columnId];
                        const applications = column.applicationIds.map(appId => boardData.applications[appId]);
                        
                        return (
                            <Droppable droppableId={column.id} key={column.id}>
                                {(provided, snapshot) => (
                                    <div 
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={`w-72 flex-shrink-0 rounded-lg p-3 transition-colors ${snapshot.isDraggingOver ? 'bg-teal-100' : columnColors[column.id]}`}
                                    >
                                        <h3 className="font-semibold text-gray-700 px-2 mb-3">{column.title} <span className="text-sm text-gray-400">{applications.length}</span></h3>
                                        <div className="space-y-3 h-full">
                                            {applications.map((app, index) => (
                                                <Draggable draggableId={app.id} index={index} key={app.id}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            onClick={() => setSelectedApp(app)}
                                                            className={`bg-white p-3 rounded-md border border-gray-200 shadow-sm hover:shadow-md cursor-pointer ${snapshot.isDragging ? 'shadow-lg ring-2 ring-teal-500' : ''}`}
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <p className="font-semibold text-sm text-gray-800">{app.title}</p>
                                                                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${app.match > 90 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{app.match}%</span>
                                                            </div>
                                                            <p className="text-xs text-gray-500 mt-1">{app.company}</p>
                                                            <div className="flex justify-between items-center mt-3">
                                                                <p className="text-xs text-gray-400">Applied: {app.date}</p>
                                                                <Bell size={14} className="text-gray-400" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                            {applications.length === 0 && !snapshot.isDraggingOver && (
                                                <div className="flex flex-col items-center justify-center h-48 text-center text-gray-400">
                                                    <Archive size={32} />
                                                    <p className="mt-2 text-sm">No applications in this stage.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        );
                    })}
                </div>
            </DragDropContext>

            <AnimatePresence>
                {selectedApp && (
                    <motion.div 
                        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="absolute top-0 right-0 h-full w-full max-w-md bg-white/80 backdrop-blur-md shadow-2xl border-l border-gray-200 flex flex-col"
                    >
                        <div className="p-6 border-b flex justify-between items-center">
                            <div><h3 className="text-xl font-bold text-gray-900">{selectedApp.title}</h3><p className="text-gray-600">{selectedApp.company}</p></div>
                            <button onClick={() => setSelectedApp(null)} className="p-2 rounded-full hover:bg-gray-100"><X size={24} /></button>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto">
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-3">Status Timeline</h4>
                                <ul className="space-y-3 text-sm"><li className="flex items-center text-teal-600"><CheckCircle size={16} className="mr-3"/>Applied</li><li className="flex items-center text-gray-500"><Clock size={16} className="mr-3"/>Resume Viewed</li></ul>
                            </div>
                            <hr className="my-6" />
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-3">Communication Hub</h4>
                                <div className="bg-gray-50 p-3 rounded-lg text-sm"><p className="font-semibold">Recruiter:</p><p className="text-gray-600">"Thanks for applying! We're reviewing your profile and will be in touch soon."</p></div>
                            </div>
                             <hr className="my-6" />
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-3 flex items-center"><Lightbulb size={16} className="mr-2 text-yellow-500"/>AI Next Move</h4>
                                <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">It's been 3 days since your resume was viewed. Consider sending a polite follow-up message.</p>
                            </div>
                             <hr className="my-6" />
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-3">Document Hub</h4>
                                <a href="#" className="flex items-center text-sm text-teal-600 hover:underline"><FileText size={16} className="mr-2"/>Arun_Resume_Frontend.pdf</a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyApplicationsPage;
