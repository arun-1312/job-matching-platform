import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Download, Edit, Trash2, CheckCircle, Star, Lightbulb, AlertTriangle, X, Loader2 } from 'lucide-react';

// --- Reusable Tooltip Button ---
const TooltipButton = ({ children, tooltipText, onClick }) => (
    <div className="relative group">
        <button onClick={onClick} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md">
            {children}
        </button>
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {tooltipText}
        </div>
    </div>
);

// --- Reusable Resume Card Component ---
const ResumeCard = ({ resume, onSetDefault, onRename, onDelete, onDownload }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 group relative">
        <div className="flex items-center space-x-4">
            <FileText size={32} className="text-teal-500 flex-shrink-0" />
            <div className="flex-grow">
                <p className="font-semibold text-gray-800">{resume.resume_name}</p>
                <p className="text-xs text-gray-500">Uploaded on {new Date(resume.created_at).toLocaleDateString()}</p>
            </div>
            {resume.is_default && (
                <div className="absolute top-2 right-2 flex items-center px-2 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full">
                    <CheckCircle size={12} className="mr-1.5" /> Default
                </div>
            )}
        </div>
        <div className="absolute bottom-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <TooltipButton tooltipText="Download" onClick={() => onDownload(resume.file_path)}><Download size={16} className="text-blue-600"/></TooltipButton>
            <TooltipButton tooltipText="Rename" onClick={() => onRename(resume)}><Edit size={16} className="text-green-600"/></TooltipButton>
            {!resume.is_default && <TooltipButton tooltipText="Set as Default" onClick={() => onSetDefault(resume.id)}><Star size={16} className="text-yellow-500"/></TooltipButton>}
            <TooltipButton tooltipText="Delete" onClick={() => onDelete(resume.id)}><Trash2 size={16} className="text-red-600"/></TooltipButton>
        </div>
    </div>
);

// --- Upload/Rename Modal Component ---
const Modal = ({ mode, resume, isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');

    useEffect(() => {
        if (isOpen) {
            setName(mode === 'rename' ? resume.resume_name : '');
            setFile(null);
            setFileName('');
        }
    }, [isOpen, mode, resume]);

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setFileName(e.target.files[0].name);
        }
    };

    const handleSubmit = () => {
        if (mode === 'upload' && name && file) {
            onSave({ resumeName: name, file });
        }
        if (mode === 'rename' && name) {
            onSave({ newName: name });
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800">{mode === 'upload' ? 'Upload New Resume' : 'Rename Resume'}</h3>
                    <button onClick={onClose}><X size={24} className="text-gray-500" /></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Resume Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={mode === 'upload' ? "e.g., My Frontend Resume" : ""} className="w-full p-2 border rounded-md" />
                    </div>
                    {mode === 'upload' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Resume File</label>
                            <label htmlFor="resume-upload" className="w-full flex items-center justify-center px-4 py-6 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50">
                                <div className="text-center">
                                    <Upload size={32} className="mx-auto text-gray-400" />
                                    <p className="mt-2 text-sm text-gray-600">{fileName || "Click to browse"}</p>
                                    <p className="text-xs text-gray-500 mt-1">PDF, DOC, or DOCX only, max 5MB</p>
                                </div>
                                <input id="resume-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                            </label>
                        </div>
                    )}
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 text-sm font-semibold text-white bg-teal-500 rounded-md hover:bg-teal-600">Save</button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// --- Main Resume Manager Page Component ---
const ResumeManagerPage = ({ token }) => {
    const [resumes, setResumes] = useState([]);
    const [modalState, setModalState] = useState({ isOpen: false, mode: 'upload', resume: null });
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Start with loading true
    const [isActionLoading, setIsActionLoading] = useState(false); // For card actions

    const fetchResumes = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/resumes', { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await response.json();
            if (Array.isArray(data)) {
                setResumes(data);
            } else {
                setResumes([]);
            }
        } catch (error) {
            console.error("Failed to fetch resumes:", error);
            setResumes([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchResumes();
    }, [token]);

    const performAction = async (action) => {
        setIsActionLoading(true);
        try {
            await action();
            await fetchResumes();
        } catch (error) {
            console.error("Action failed:", error);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleUpload = (data) => performAction(async () => {
        const formData = new FormData();
        formData.append('resumeName', data.resumeName);
        formData.append('file', data.file);
        await fetch('http://localhost:5000/api/resumes/upload', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData });
    });

    const handleDelete = (resumeId) => performAction(async () => {
        await fetch(`http://localhost:5000/api/resumes/${resumeId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    });

    const handleSetDefault = (resumeId) => performAction(async () => {
        await fetch(`http://localhost:5000/api/resumes/${resumeId}/default`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}` } });
    });

    const handleRename = (data) => performAction(async () => {
        await fetch(`http://localhost:5000/api/resumes/${modalState.resume.id}/rename`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ newName: data.newName }),
        });
    });

    const handleDownload = (filePath) => {
        const supabaseUrl = 'YOUR_SUPABASE_PROJECT_URL'; // IMPORTANT: Replace with your Supabase URL
        const fullUrl = `${supabaseUrl}/storage/v1/object/public/resumes/${filePath}`;
        window.open(fullUrl, '_blank');
    };

    const handleAnalyze = () => {
        setIsLoading(true);
        // Simulate AI analysis
        setTimeout(() => {
            setAnalysisResult({
                matchScore: 85,
                missingKeywords: ['CI/CD pipelines', 'GraphQL', 'Automated Testing'],
                suggestions: [
                    "Consider rephrasing your experience at 'Innovate Inc.' to highlight your achievements with `React Hooks`.",
                    "The job description mentions `CI/CD pipelines` multiple times. Adding a project that showcases this skill would strengthen your application."
                ]
            });
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="flex-1 p-6 sm:p-8 relative">
            <AnimatePresence>
                {isActionLoading && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-20"
                    >
                        <Loader2 className="w-12 h-12 text-teal-500 animate-spin" />
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                <Modal 
                    isOpen={modalState.isOpen} 
                    mode={modalState.mode}
                    resume={modalState.resume}
                    onClose={() => setModalState({ isOpen: false, mode: 'upload', resume: null })} 
                    onSave={modalState.mode === 'upload' ? handleUpload : handleRename} 
                />
            </AnimatePresence>

            <div className="flex justify-between items-center mb-8">
                <div><h1 className="text-3xl font-bold text-gray-900">Resume Manager</h1><p className="text-gray-600 mt-1">Upload, manage, and let our AI help you tailor your resumes. You can upload upto 4 resumes only.</p></div>
                <button onClick={() => setModalState({ isOpen: true, mode: 'upload', resume: null })} className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-teal-500 rounded-md hover:bg-teal-600 disabled:bg-teal-300" disabled={resumes.length >= 4}>
                    <Upload size={16} className="mr-2" /> Upload New Resume
                </button>
            </div>

            <div className="mb-12">
                <h2 className="text-xl font-bold text-gray-800 mb-4">My Resumes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {resumes.map(r => <ResumeCard key={r.id} resume={r} onDelete={handleDelete} onRename={() => setModalState({isOpen: true, mode: 'rename', resume: r})} onSetDefault={handleSetDefault} onDownload={handleDownload} />)}
                </div>
            </div>
            
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">AI Resume Analyzer</h2>
                {resumes.length > 0 ? (
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select a Resume to Analyze</label>
                                <select className="w-full p-2 border rounded-md">
                                    {resumes.map(r => <option key={r.id} value={r.id}>{r.resume_name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Paste a Job Description to Compare</label>
                                <textarea className="w-full p-2 border rounded-md h-24" placeholder="Paste the full job description here..."></textarea>
                            </div>
                        </div>
                        <div className="mt-4 text-center">
                            <button onClick={handleAnalyze} disabled={isLoading} className="px-6 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400">
                                {isLoading ? 'Analyzing...' : 'Analyze & Get Feedback'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed">
                        <FileText size={48} className="mx-auto" />
                        <h3 className="mt-4 text-lg font-semibold">Upload a Resume to Get Started</h3>
                        <p className="mt-1 text-sm">Once you've uploaded a resume, you can use our AI Analyzer here.</p>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {analysisResult && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 bg-white p-6 rounded-lg border border-gray-200"
                    >
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Analysis Results</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center p-4 bg-slate-50 rounded-lg">
                                <p className="text-sm font-medium text-gray-500">Overall Match Score</p>
                                <p className="text-5xl font-bold text-teal-600 mt-2">{analysisResult.matchScore}%</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-lg">
                                <h4 className="font-semibold text-gray-800 flex items-center"><AlertTriangle size={16} className="mr-2 text-yellow-500"/>Missing Keywords</h4>
                                <ul className="mt-2 space-y-1 text-sm text-gray-600 list-disc list-inside">
                                    {analysisResult.missingKeywords.map(kw => <li key={kw}>{kw}</li>)}
                                </ul>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-lg">
                                <h4 className="font-semibold text-gray-800 flex items-center"><Lightbulb size={16} className="mr-2 text-green-500"/>AI Suggestions</h4>
                                <ul className="mt-2 space-y-2 text-sm text-gray-600">
                                    {analysisResult.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ResumeManagerPage;
