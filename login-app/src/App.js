// App.js
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

// Import your components
import LandingPage from "./components/LandingPage";
import AuthModal from "./components/common/AuthModal";
import EmployerDashboard from "./components/employer/EmployerDashboardPage";
import JobSeekerDashboard from "./components/jobseeker/DashboardPage.js";

const App = () => {
  return (
    <Router>
      <AuthStateManager />
    </Router>
  );
};

// Handles all auth + routing
const AuthStateManager = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  // Rehydrate session on reload
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      setAuthToken(token);
      setCurrentUser(JSON.parse(user));
    }
    setIsLoading(false);
  }, []);

  // Called after login/signup success
  const handleAuthSuccess = (authData) => {
    const { user, token } = authData;

    // Persist session
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    setCurrentUser(user);
    setAuthToken(token);
    setIsAuthModalOpen(false);

    // Redirect immediately based on role
    if (user.role === "employer") {
      navigate("/employer/dashboard");
    } else if (user.role === "seeker") {
      navigate("/jobseeker/dashboard");
    }

    console.log("✅ Login successful -> Redirecting user");
  };

  const handleProfileUpdate = (updatedUser) => {
    // Update state and localStorage
    setCurrentUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    setAuthToken(null);
    navigate("/"); // go back to landing
  };

  // Wrapper to protect routes
  const PrivateRoute = ({ children, allowedRole }) => {
    if (isLoading) return <div>Loading...</div>;

    if (!authToken || !currentUser) {
      return <Navigate to="/" replace />;
    }

    if (allowedRole && currentUser.role !== allowedRole) {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  return (
    <>
      <Routes>
        {/* Public Route */}
        <Route
          path="/"
          element={<LandingPage openAuthModal={() => setIsAuthModalOpen(true)} />}
        />

        {/* Employer Dashboard */}
        <Route
          path="/employer/dashboard"
          element={
            <PrivateRoute allowedRole="employer">
              <EmployerDashboard
                user={currentUser}
                token={authToken}
                onLogout={handleLogout}
                onProfileUpdate={handleProfileUpdate}
              />
            </PrivateRoute>
          }
        />

        {/* Job Seeker Dashboard */}
        <Route
          path="/jobseeker/dashboard"
          element={
            <PrivateRoute allowedRole="seeker">
              <JobSeekerDashboard
                user={currentUser}
                token={authToken}
                onLogout={handleLogout}
                onProfileUpdate={handleProfileUpdate}
              />
            </PrivateRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default App;