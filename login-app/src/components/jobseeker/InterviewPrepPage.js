import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, ClipboardList, Send, Mic, Users, MessageCircle, Check } from 'lucide-react';

const InterviewPrepPage = ({ user }) => {
    const [phase, setPhase] = useState('setup'); // setup, simulation, feedback
    const [setupData, setSetupData] = useState({ 
        role: 'Senior Software Engineer', 
        description: '',
        type: 'Behavioral' 
    });
    const [chatHistory, setChatHistory] = useState([]);
    const [userAnswer, setUserAnswer] = useState('');
    const [coachTips, setCoachTips] = useState({ analysis: '', talkingPoints: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const chatEndRef = useRef(null);

    const interviewTypes = [
        { name: 'Behavioral', icon: <Users size={24} />, description: 'Focuses on teamwork, leadership, and problem-solving.' },
        { name: 'Technical', icon: <BrainCircuit size={24} />, description: 'Tests role-specific knowledge and coding skills.' },
        { name: 'Case Study', icon: <ClipboardList size={24} />, description: 'Presents a business problem for you to solve.' },
        { name: 'Communication', icon: <MessageCircle size={24} />, description: 'Assesses your ability to articulate ideas clearly.' },
    ];

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [chatHistory]);

    const callGeminiAPI = async (prompt) => {
        // IMPORTANT: Replace with your actual Gemini API key
        const apiKey = "AIzaSyDQb4C4Pny_f3j5w25dQRsdjB2jttPhzTI"; //process.env.REACT_APP_GEMINI_API_KEY;
        
        if (apiKey === "" || !apiKey) {
            console.error("Gemini API key is missing.");
            // Return a placeholder for UI development
            return "This is a placeholder response. Please add your Gemini API key to make real API calls.";
        }
        
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const payload = { contents: [{ parts: [{ text: prompt }] }] };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(`API Error: ${errorBody.error.message}`);
            }
            const result = await response.json();
            return result.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            return `Sorry, I encountered an error: ${error.message}. Please check your API key and try again.`;
        }
    };
    
    const extractJson = (text) => {
        const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
        const match = text.match(jsonRegex);
        if (match && match[1]) {
            return match[1];
        }
        const startIndex = text.indexOf('{');
        const endIndex = text.lastIndexOf('}');
        if (startIndex !== -1 && endIndex !== -1) {
            return text.substring(startIndex, endIndex + 1);
        }
        return null;
    };

    const handleStartInterview = async () => {
        setIsLoading(true);
        const prompt = `Act as an expert interview coach. Your name is Zolabz AI. You will conduct a mock interview with a user named ${user?.name || 'there'}.
        The user is preparing for a '${setupData.role}' position.
        The interview type is '${setupData.type}'.
        Your task is to ask intermediate-level questions in simple, clear English.
        Start by greeting the user professionally and then ask the very first interview question.`;
        
        const firstQuestion = await callGeminiAPI(prompt);
        setChatHistory([{ role: 'interviewer', text: firstQuestion }]);
        
        const analysisPrompt = `Analyze this interview question: "${firstQuestion}". What is the interviewer really trying to assess? Provide a short analysis and 3 key talking points. Format your response as a valid JSON object with keys "analysis" (string) and "talkingPoints" (an array of strings).`;
        const tipsResponse = await callGeminiAPI(analysisPrompt);
        try {
            const jsonString = extractJson(tipsResponse);
            setCoachTips(JSON.parse(jsonString));
        } catch {
            setCoachTips({ analysis: 'Could not parse AI tips.', talkingPoints: [] });
        }

        setPhase('simulation');
        setIsLoading(false);
    };

    const handleSendAnswer = async () => {
        if (!userAnswer.trim()) return;
        
        const newHistory = [...chatHistory, { role: 'user', text: userAnswer }];
        setChatHistory(newHistory);
        setUserAnswer('');
        setIsLoading(true);

        const prompt = `You are an expert interview coach named Zolabz AI. You are conducting a mock interview for a '${setupData.role}' role.
        The conversation so far is: ${JSON.stringify(newHistory)}.
        Based on the user's last answer, ask the next logical, intermediate-level interview question in simple, clear English.`;
        
        const nextQuestion = await callGeminiAPI(prompt);
        setChatHistory([...newHistory, { role: 'interviewer', text: nextQuestion }]);

        const analysisPrompt = `Analyze this interview question: "${nextQuestion}". What is the interviewer trying to assess? Provide a short analysis and 3 key talking points. Format as a valid JSON object with keys "analysis" and "talkingPoints".`;
        const tipsResponse = await callGeminiAPI(analysisPrompt);
        try {
            const jsonString = extractJson(tipsResponse);
            setCoachTips(JSON.parse(jsonString));
        } catch {
             setCoachTips({ analysis: 'Could not parse AI tips.', talkingPoints: [] });
        }
        
        setIsLoading(false);
    };
    
    const handleEndInterview = async () => {
        setIsLoading(true);
        const prompt = `You are an expert interview coach. Analyze the following interview transcript for a '${setupData.role}' role: ${JSON.stringify(chatHistory)}.
        Provide a comprehensive performance report. Your response must be a single, valid JSON object with the following keys:
        - "score": An integer between 0 and 100.
        - "overallFeedback": A concise, encouraging paragraph summarizing the performance.
        - "strengths": An array of 2-3 strings highlighting what the user did well.
        - "areasForImprovement": An array of 2-3 strings with actionable advice for improvement.
        All feedback should be in simple, clear English.`;

        const feedbackResponse = await callGeminiAPI(prompt);
        try {
            const jsonString = extractJson(feedbackResponse);
            setFeedback(JSON.parse(jsonString));
        } catch {
            setFeedback({ score: 0, overallFeedback: "Could not parse the AI's feedback. The response may not have been valid JSON.", strengths: [], areasForImprovement: [] });
        }
        setPhase('feedback');
        setIsLoading(false);
    };

    const pageVariants = {
        initial: { opacity: 0, scale: 0.98 },
        animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
        exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2, ease: 'easeIn' } },
    };

    return (
        <div className="flex-1 p-6 sm:p-8 flex items-center justify-center h-full bg-slate-50">
            <AnimatePresence mode="wait">
                {phase === 'setup' && (
                    <motion.div key="setup" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full h-full flex flex-col">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-gray-900">AI Interview Coach</h1>
                            <p className="text-gray-600 mt-2">Let's prepare you for success. First, tell us about the interview.</p>
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Job Role</label>
                                    <input type="text" value={setupData.role} onChange={(e) => setSetupData({...setupData, role: e.target.value})} className="mt-1 w-full p-2 border rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Job Description (Optional)</label>
                                    <textarea className="mt-1 w-full p-2 border rounded-md h-32" placeholder="Pasting the job description will give you more relevant questions."></textarea>
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                                <label className="block text-sm font-medium text-gray-700 mb-4">Interview Type</label>
                                <div className="space-y-4">
                                    {interviewTypes.map(type => (
                                        <button key={type.name} onClick={() => setSetupData({...setupData, type: type.name})} className={`w-full p-4 rounded-lg border-2 text-left transition-all ${setupData.type === type.name ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <div className="flex items-center">
                                                <div className={`mr-4 text-indigo-600 ${setupData.type === type.name ? '' : 'text-gray-400'}`}>{type.icon}</div>
                                                <div>
                                                    <p className="font-semibold text-gray-800">{type.name}</p>
                                                    <p className="text-xs text-gray-500">{type.description}</p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mt-6">
                            <button onClick={handleStartInterview} disabled={isLoading} className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center justify-center">
                                {isLoading ? 'Preparing...' : 'Start Mock Interview'}
                            </button>
                        </div>
                    </motion.div>
                )}

                {phase === 'simulation' && (
                    <motion.div key="simulation" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full h-full grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Chat Panel */}
                        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col h-full">
                            <div className="flex-1 p-6 space-y-4 overflow-y-auto custom-scrollbar-hidden">
                                {chatHistory.map((msg, index) => (
                                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-xl px-4 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}`}>{msg.text}</div>
                                    </div>
                                ))}
                                {isLoading && <div className="flex justify-start"><div className="px-4 py-3 rounded-2xl bg-gray-100 text-gray-800">...</div></div>}
                                <div ref={chatEndRef} />
                            </div>
                            <div className="p-4 border-t bg-white rounded-b-xl">
                                <div className="relative">
                                    <textarea value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} placeholder="Type your answer here..." className="w-full p-3 pr-24 border rounded-lg resize-none" rows="3"></textarea>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex space-x-2">
                                        <button onClick={handleSendAnswer} disabled={isLoading} className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:bg-indigo-400"><Send size={20} /></button>
                                        <button className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300"><Mic size={20} /></button>
                                    </div>
                                </div>
                                <button onClick={handleEndInterview} className="mt-2 text-sm text-red-600 font-semibold hover:underline">End Interview</button>
                            </div>
                        </div>
                        {/* AI Coach Panel */}
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 text-white rounded-xl shadow-sm p-6 h-full flex flex-col">
                            <h3 className="font-bold text-lg flex-shrink-0">AI Coach</h3>
                            <div className="mt-4 space-y-6 flex-1 overflow-y-auto custom-scrollbar-hidden pr-2">
                                <div>
                                    <h4 className="font-semibold text-gray-300">Question Analysis</h4>
                                    <p className="text-sm text-gray-400 mt-1">{coachTips.analysis}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-300">Key Talking Points</h4>
                                    <ul className="mt-2 space-y-2">
                                        {(coachTips.talkingPoints || []).map((point, index) => {
                                            const pointText = typeof point === 'object' ? point.point || JSON.stringify(point) : point;
                                            return (
                                                <li key={index} className="flex items-start text-sm text-gray-400">
                                                    <Check size={16} className="mr-2 mt-0.5 text-teal-400 flex-shrink-0"/>
                                                    {pointText}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {phase === 'feedback' && (
                    <motion.div key="feedback" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-4xl">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-gray-900">Performance Report</h1>
                            <p className="text-gray-600 mt-2">Here's the AI's feedback on your mock interview.</p>
                        </div>
                        <div className="mt-8 bg-white p-8 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8">
                           <div className="text-center md:border-r md:pr-8">
                                <p className="text-sm font-medium text-gray-500">Overall Score</p>
                                <p className="text-6xl font-bold text-teal-600 mt-2">{feedback?.score || 0}<span className="text-2xl text-gray-400">/100</span></p>
                           </div>
                           <div className="md:col-span-2">
                                <h4 className="font-semibold text-gray-800">Overall Feedback</h4>
                                <p className="text-sm text-gray-600 mt-2">{feedback?.overallFeedback || "Feedback is being generated..."}</p>
                                <div className="mt-4 grid grid-cols-2 gap-4">
                                    <div>
                                        <h5 className="font-semibold text-green-600">Strengths</h5>
                                        <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                                            {(feedback?.strengths || []).map(s => <li key={s}>{s}</li>)}
                                        </ul>
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-red-600">Areas for Improvement</h5>
                                        <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                                             {(feedback?.areasForImprovement || []).map(a => <li key={a}>{a}</li>)}
                                        </ul>
                                    </div>
                                </div>
                           </div>
                        </div>
                        <div className="mt-6 text-center space-x-2">
                            <button onClick={() => setPhase('setup')} className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg">Try Again</button>
                            <button className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg">Save Report</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InterviewPrepPage;
