
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import HealthRecords from "./pages/HealthRecords";
import Reminders from "./pages/Reminders";
import PetProfile from "./pages/PetProfile";
import NotFound from "./pages/NotFound";
import Navbar from "./components/layout/Navbar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/health" element={<HealthRecords />} />
            <Route path="/reminders" element={<Reminders />} />
            <Route path="/pets/:id" element={<PetProfile />} />
            <Route path="/analytics" element={<HealthRecords />} /> {/* Analytics route for now points to HealthRecords until we create a dedicated page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
