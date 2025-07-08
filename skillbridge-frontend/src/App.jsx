import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UploadResume from './pages/UploadResume';
import Results from './pages/Results';
import CareerPath from './pages/CareerPath';
import AIAssistantDashboard from './pages/AIAssistantDashboard';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Navbar />
            <main className="pt-16">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/upload-resume" element={
                  <ProtectedRoute>
                    <UploadResume />
                  </ProtectedRoute>
                } />
                <Route path="/results/:resumeId" element={
                  <ProtectedRoute>
                    <Results />
                  </ProtectedRoute>
                } />
                <Route path="/career-path" element={
                  <ProtectedRoute>
                    <CareerPath />
                  </ProtectedRoute>
                } />
                <Route path="/ai-assistant" element={
                  <ProtectedRoute>
                    <AIAssistantDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
