import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import SideMenu from './components/SideMenu';
import Login from './components/Login';
import CaseManagement from './components/CaseManagement';
import WorkflowManagement from './components/WorkflowManagement';
import DocumentManagement from './components/DocumentManagement';
import TeamCollaboration from './components/TeamCollaboration';
import Dashboard from './components/Dashboard';
import RealTimeMonitoringPage from './pages/RealTimeMonitoring';
import CustomerAnalysis from './pages/CustomerAnalysis';
import ReportsPage from './pages/Reports';
import { Toaster } from "@/components/ui/toaster";
import { cn } from './lib/utils';
import { Menu } from 'lucide-react';
import { Button } from './components/ui/button';
import Settings from './pages/Settings';
import { ThemeProvider } from './components/theme-provider';

// Protected Route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Main App Content Component
const AppContent = () => {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  // Close mobile menu when route changes
  const location = useLocation();
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        {isAuthenticated && (
          <>
            {/* Mobile Menu Button */}
            <Button
              className="lg:hidden fixed top-4 right-4 z-[100] bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            {/* Side Menu */}
            <div className={cn(
              "fixed lg:relative z-[90] h-full transition-transform duration-300 ease-in-out bg-background",
              isMobileMenuOpen ? "translate-x-0 shadow-xl" : "-translate-x-full lg:translate-x-0",
              isMenuCollapsed ? "w-16" : "w-64"
            )}>
              <SideMenu onCollapseChange={setIsMenuCollapsed} />
            </div>
            
            {/* Overlay for mobile menu */}
            {isMobileMenuOpen && (
              <div
                className="fixed inset-0 bg-black/50 lg:hidden z-[80]"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}
          </>
        )}
        
        <main 
          className={cn(
            "flex-1 relative w-full transition-all duration-300",
            isAuthenticated ? (
              isMenuCollapsed ? "lg:pl-16" : "lg:pl-64"
            ) : "pl-0"
          )}
        >
          <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8 min-h-screen">
            <Routes>
              <Route 
                path="/login" 
                element={
                  isAuthenticated ? 
                    <Navigate to="/dashboard" replace /> : 
                    <Login onLoginSuccess={handleLoginSuccess} />
                } 
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/monitoring"
                element={
                  <ProtectedRoute>
                    <RealTimeMonitoringPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analysis"
                element={
                  <ProtectedRoute>
                    <CustomerAnalysis />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <ReportsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cases"
                element={
                  <ProtectedRoute>
                    <CaseManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/workflow"
                element={
                  <ProtectedRoute>
                    <WorkflowManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/documents"
                element={
                  <ProtectedRoute>
                    <DocumentManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/team"
                element={
                  <ProtectedRoute>
                    <TeamCollaboration />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
};

// Root App Component
const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="system">
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
};

export default App;
