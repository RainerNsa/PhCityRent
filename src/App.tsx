
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import Escrow from "./pages/Escrow";
import Agents from "./pages/Agents";
import Landlords from "./pages/Landlords";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import VerificationStatus from "./pages/VerificationStatus";
import AgentDashboard from "./pages/AgentDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/escrow" element={<Escrow />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/landlords" element={<Landlords />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/verification-status" element={<VerificationStatus />} />
          <Route path="/agent-dashboard" element={<AgentDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
