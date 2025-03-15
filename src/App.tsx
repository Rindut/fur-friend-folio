
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import HealthRecords from "./pages/HealthRecords";
import Reminders from "./pages/Reminders";
import PetProfile from "./pages/PetProfile";
import AddHealthRecord from "./pages/AddHealthRecord";
import LocalServices from "./pages/LocalServices";
import NotFound from "./pages/NotFound";
import Navbar from "./components/layout/Navbar";
import PageBreadcrumb from "./components/layout/PageBreadcrumb";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Show loading state while auth is being checked
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  // Redirect to auth page if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Navbar />
            <main className="pt-20">
              <PageBreadcrumb />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/health" 
                  element={
                    <ProtectedRoute>
                      <HealthRecords />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/health/add" 
                  element={
                    <ProtectedRoute>
                      <AddHealthRecord />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/reminders" 
                  element={
                    <ProtectedRoute>
                      <Reminders />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/pets/:id" 
                  element={
                    <ProtectedRoute>
                      <PetProfile />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/services" element={<LocalServices />} />
                <Route 
                  path="/analytics" 
                  element={
                    <ProtectedRoute>
                      <HealthRecords />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
