
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Search from "./pages/Search";
import Escrow from "./pages/Escrow";
import Agents from "./pages/Agents";
import Landlords from "./pages/Landlords";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import VerificationStatus from "./pages/VerificationStatus";
import AgentDashboard from "./pages/AgentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserProfile from "./pages/UserProfile";
import Auth from "./pages/Auth";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/properties" element={<Properties />} />
      <Route path="/properties/:id" element={<PropertyDetail />} />
      <Route path="/search" element={<Search />} />
      <Route path="/escrow" element={<Escrow />} />
      <Route path="/agents" element={<Agents />} />
      <Route path="/landlords" element={<Landlords />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/verification-status" element={<VerificationStatus />} />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute requireAuth={true}>
            <UserProfile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/agent-dashboard" 
        element={
          <ProtectedRoute requireAuth={true}>
            <AgentDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="/auth" element={<Auth />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </TooltipProvider>
);

export default App;
