import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AlertTriangle } from "lucide-react";

export default function SkillAnalyticsPage() {
  const [skillsData, setSkillsData] = useState([]);

  useEffect(() => {
    // Mock skill analytics data (replace with API later)
    setSkillsData([
      { skill: "JavaScript", level: 85 },
      { skill: "Python", level: 70 },
      { skill: "React", level: 90 },
      { skill: "SQL", level: 65 },
      { skill: "AI/ML", level: 50 },
    ]);
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Beta Banner */}
      <div className="mb-6 bg-yellow-200 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-xl flex items-center gap-2 shadow-md">
        <AlertTriangle className="w-5 h-5" />
        <span className="font-medium">Beta Version:</span> This page is under construction. Analytics may not be accurate yet.
      </div>

      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Skill Analytics</h1>
      <p className="text-gray-600 mb-6">Track your skill strengths and growth areas.</p>

      {/* Analytics Card */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Skill Proficiency Overview</h2>
        
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={skillsData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="skill" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="level" fill="#4F46E5" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Future Section Placeholder */}
      <div className="mt-8 bg-gray-100 p-6 rounded-xl border border-dashed border-gray-300 text-center text-gray-500">
        🚀 More analytics coming soon (growth tracking, industry benchmarks, recommendations).
      </div>
    </div>
  );
}
