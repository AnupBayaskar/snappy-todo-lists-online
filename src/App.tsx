
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import Home from "./pages/Home";
import TeamSpace from "./pages/TeamSpace";
import DeviceSpace from "./pages/DeviceSpace";
import ComplianceSpace from "./pages/ComplianceSpace";
import ValidationSpace from "./pages/ValidationSpace";
import ReportsSpace from "./pages/ReportsSpace";
import Profile from "./pages/Profile";
import Organization from "./pages/Organization";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// App content component that uses auth context
const AppContent = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/team-space" element={
              <ProtectedRoute>
                <TeamSpace />
              </ProtectedRoute>
            } />
            <Route path="/device-space" element={
              <ProtectedRoute>
                <DeviceSpace />
              </ProtectedRoute>
            } />
            <Route path="/compliance-space" element={
              <ProtectedRoute>
                <ComplianceSpace />
              </ProtectedRoute>
            } />
            <Route path="/validation-space" element={
              <ProtectedRoute>
                <ValidationSpace />
              </ProtectedRoute>
            } />
            <Route path="/reports-space" element={
              <ProtectedRoute>
                <ReportsSpace />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/organization-space" element={
              <ProtectedRoute>
                <Organization />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
