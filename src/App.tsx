
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
import AddPet from "./pages/AddPet";
import EditPet from "./pages/EditPet";
import OwnerProfile from "./pages/OwnerProfile";
import AddReminder from "./pages/AddReminder";
import PetFamily from "./pages/PetFamily";

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
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
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
                  path="/pet-family" 
                  element={
                    <ProtectedRoute>
                      <PetFamily />
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
                  path="/reminders/new" 
                  element={
                    <ProtectedRoute>
                      <AddReminder />
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
                <Route 
                  path="/pets/new" 
                  element={
                    <ProtectedRoute>
                      <AddPet />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/pets/:id/edit" 
                  element={
                    <ProtectedRoute>
                      <EditPet />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <OwnerProfile />
                    </ProtectedRoute>
                  } 
                />
                {/* Local Services route hidden
                <Route path="/services" element={<LocalServices />} />
                */}
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
          </TooltipProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
