
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/AppSidebar";
import { Navbar } from "@/components/Navbar";
import { MemberPanel } from "@/components/MemberPanel";
import Home from "./pages/Home";
import TeamSpace from "./pages/TeamSpace";
import DeviceSpace from "./pages/DeviceSpace";
import ComplianceSpace from "./pages/ComplianceSpace";
import ValidationSpace from "./pages/ValidationSpace";
import ReportsSpace from "./pages/ReportsSpace";
import Profile from "./pages/Profile";
import OrganizationSpace from "./pages/OrganizationSpace";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// App Content Component
const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex w-full">
      {isAuthenticated && <AppSidebar />}
      <div className={`flex-1 flex flex-col ${isAuthenticated ? 'ml-20' : ''}`}>
        <Navbar />
        <main className={`flex-1 overflow-auto ${isAuthenticated ? 'pt-16' : 'pt-16'}`}>
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
                <OrganizationSpace />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
      {isAuthenticated && <MemberPanel />}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
