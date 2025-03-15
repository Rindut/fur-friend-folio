import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { ClerkProvider } from "@clerk/clerk-react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import HealthRecords from "./pages/HealthRecords";
import Reminders from "./pages/Reminders";
import PetProfile from "./pages/PetProfile";
import AddHealthRecord from "./pages/AddHealthRecord";
import NotFound from "./pages/NotFound";
import Navbar from "./components/layout/Navbar";
import PageBreadcrumb from "./components/layout/PageBreadcrumb";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || ""; 

const queryClient = new QueryClient();

// Create a wrapper component that conditionally renders ClerkProvider
const AuthProvider = ({ children }) => {
  // If we don't have a publishable key, just render children directly
  if (!PUBLISHABLE_KEY) {
    return <>{children}</>;
  }

  // Otherwise, use ClerkProvider
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      clerkJSVersion="5.56.0-snapshot.v20250312225817"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/"
      signInForceRedirectUrl="/dashboard"
      signUpForceRedirectUrl="/"
      afterSignOutUrl="/"
      waitlistUrl="/"
    >
      {children}
    </ClerkProvider>
  );
};

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
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
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/health" element={<HealthRecords />} />
                <Route path="/health/add" element={<AddHealthRecord />} />
                <Route path="/reminders" element={<Reminders />} />
                <Route path="/pets/:id" element={<PetProfile />} />
                <Route path="/analytics" element={<HealthRecords />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
