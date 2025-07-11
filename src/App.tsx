
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { TranslationProvider } from "@/components/localization/LanguageManager";
import { AuthProvider } from "@/hooks/useAuth";
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
import AdvancedFeaturesTest from "./pages/AdvancedFeaturesTest";
import PaymentDashboard from "./pages/PaymentDashboard";
import ScalingOptimization from "./pages/ScalingOptimization";
import AdvancedBusinessLogic from "./pages/AdvancedBusinessLogic";
import RentalApplication from "./pages/RentalApplication";
import VerificationStatus from "./pages/VerificationStatus";
import Escrow from "./pages/Escrow";
import PaymentCallback from "./pages/PaymentCallback";
import PaymentDebug from "./pages/PaymentDebug";
import ReceiptDemo from "./pages/ReceiptDemo";
import PaymentTest from "./pages/PaymentTest";
import AppStatus from "./pages/AppStatus";
import CreateAlert from "./pages/CreateAlert";
import ContactAgent from "./pages/ContactAgent";
import MaintenanceDashboard from "./pages/MaintenanceDashboard";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <TranslationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
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
                <Route path="/advanced-features-test" element={<AdvancedFeaturesTest />} />
                <Route path="/payment-dashboard" element={<PaymentDashboard />} />
                <Route path="/scaling-optimization" element={<ScalingOptimization />} />
                <Route path="/advanced-business-logic" element={<AdvancedBusinessLogic />} />
                <Route path="/rental-application" element={<RentalApplication />} />
                <Route path="/verification-status" element={<VerificationStatus />} />
                <Route path="/escrow" element={<Escrow />} />
                <Route path="/payment/callback" element={<PaymentCallback />} />
                <Route path="/payment/debug" element={<PaymentDebug />} />
                <Route path="/receipt/demo" element={<ReceiptDemo />} />
                <Route path="/payment/test" element={<PaymentTest />} />
                <Route path="/app-status" element={<AppStatus />} />
                <Route path="/create-alert" element={<CreateAlert />} />
                <Route path="/contact-agent" element={<ContactAgent />} />
                <Route path="/maintenance-dashboard" element={<MaintenanceDashboard />} />
                <Route path="*" element={<NotFound />} />
        </Routes>
        </TooltipProvider>
      </TranslationProvider>
    </AuthProvider>
  );
}

export default App;
