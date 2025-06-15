
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import GlobalErrorHandler from "@/components/common/GlobalErrorHandler";
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
import TenantPortal from "./pages/TenantPortal";
import RentalApplication from "./pages/RentalApplication";
import Messages from "./pages/Messages";
import Auth from "./pages/Auth";

const App = () => (
  <ErrorBoundary>
    <TooltipProvider>
      <GlobalErrorHandler />
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route 
          path="/properties" 
          element={
            <ErrorBoundary>
              <Properties />
            </ErrorBoundary>
          } 
        />
        <Route 
          path="/properties/:id" 
          element={
            <ErrorBoundary>
              <PropertyDetail />
            </ErrorBoundary>
          } 
        />
        <Route path="/search" element={<Search />} />
        <Route path="/escrow" element={<Escrow />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/landlords" element={<Landlords />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/verification-status" element={<VerificationStatus />} />
        <Route 
          path="/apply/:propertyId?" 
          element={
            <ProtectedRoute requireAuth={true}>
              <ErrorBoundary>
                <RentalApplication />
              </ErrorBoundary>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/messages" 
          element={
            <ProtectedRoute requireAuth={true}>
              <ErrorBoundary>
                <Messages />
              </ErrorBoundary>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute requireAuth={true}>
              <ErrorBoundary>
                <UserProfile />
              </ErrorBoundary>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tenant-portal" 
          element={
            <ProtectedRoute requireAuth={true}>
              <ErrorBoundary>
                <TenantPortal />
              </ErrorBoundary>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/agent-dashboard" 
          element={
            <ProtectedRoute requireAuth={true}>
              <ErrorBoundary>
                <AgentDashboard />
              </ErrorBoundary>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <ErrorBoundary>
                <AdminDashboard />
              </ErrorBoundary>
            </ProtectedRoute>
          } 
        />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </ErrorBoundary>
);

export default App;
