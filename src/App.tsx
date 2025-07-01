
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { TranslationProvider } from "@/components/localization/LanguageManager";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Agents from "./pages/Agents";
import Landlords from "./pages/Landlords";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import UserProfile from "./pages/UserProfile";
import Search from "./pages/Search";
import Messages from "./pages/Messages";
import PropertyManagement from "./pages/PropertyManagement";
import TenantPortal from "./pages/TenantPortal";
import LandlordPortal from "./pages/LandlordPortal";
import AgentDashboard from "./pages/AgentDashboard";
import EnhancedAgentDashboard from "./pages/EnhancedAgentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSeedData from "./pages/AdminSeedData";
import AdvancedFeatures from "./pages/AdvancedFeatures";
import ScalingOptimization from "./pages/ScalingOptimization";
import AdvancedBusinessLogic from "./pages/AdvancedBusinessLogic";
import RentalApplication from "./pages/RentalApplication";
import VerificationStatus from "./pages/VerificationStatus";
import Escrow from "./pages/Escrow";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TranslationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="/properties/:id" element={<PropertyDetail />} />
                <Route path="/agents" element={<Agents />} />
                <Route path="/landlords" element={<Landlords />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/search" element={<Search />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/property-management" element={<PropertyManagement />} />
                <Route path="/tenant-portal" element={<TenantPortal />} />
                <Route path="/landlord-portal" element={<LandlordPortal />} />
                <Route path="/agent-dashboard" element={<AgentDashboard />} />
                <Route path="/enhanced-agent-dashboard" element={<EnhancedAgentDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/seed-data" element={<AdminSeedData />} />
                <Route path="/advanced-features" element={<AdvancedFeatures />} />
                <Route path="/scaling-optimization" element={<ScalingOptimization />} />
                <Route path="/advanced-business-logic" element={<AdvancedBusinessLogic />} />
                <Route path="/rental-application" element={<RentalApplication />} />
                <Route path="/verification-status" element={<VerificationStatus />} />
                <Route path="/escrow" element={<Escrow />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </TranslationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
