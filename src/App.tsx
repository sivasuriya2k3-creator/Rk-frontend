import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute, AdminRoute } from "@/components/ProtectedRoute";
import AuthPopupModal from "./components/AuthPopupModal";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import ServicesPage from "./pages/ServicesPage";
import AllServicesPage from "./pages/AllServicesPage";
import OrderServicePage from "./pages/OrderServicePage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import BrandingIdentityPage from "./pages/BrandingIdentityPage";
import BrandingDetailPage from "./pages/BrandingDetailPage";
import WebDevelopmentPage from "./pages/WebDevelopmentPage";
import Animation3DPage from "./pages/Animation3DPage";
import UIUXDesignPage from "./pages/UIUXDesignPage";
import AccountPage from "./pages/AccountPage";
import VerifyOTP from "./pages/VerifyOTP";
import ManagementDashboard from "./pages/ManagementDashboard";
import BlogPage from "./pages/BlogPage";
import CaseStudiesPage from "./pages/CaseStudiesPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import ContactPage from "./pages/ContactPage";
import ApplyForEmployee from "./pages/ApplyForEmployee";
import ApplyForPosition from "./pages/ApplyForPosition";
import EmployeeDetailsPage from "./pages/EmployeeDetailsPage";
import ChatBot from "./components/ChatBot";
import ChatbotDashboard from "./pages/ChatbotDashboard";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [authPopupOpen, setAuthPopupOpen] = useState(false);

  useEffect(() => {
    // Listen for auth popup events
    const handleShowAuthPopup = () => {
      setAuthPopupOpen(true);
    };

    window.addEventListener('showAuthPopup', handleShowAuthPopup);
    return () => window.removeEventListener('showAuthPopup', handleShowAuthPopup);
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="rajkayal-theme-v2">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthPopupModal 
            isOpen={authPopupOpen} 
            onClose={() => setAuthPopupOpen(false)}
          />
          <BrowserRouter>
            <Routes>
              {/* Public Routes - No Login Required */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/services" element={<AllServicesPage />} />
              <Route path="/services-overview" element={<ServicesPage />} />
              <Route path="/branding-identity" element={<BrandingIdentityPage />} />
              <Route path="/branding-identity/:id" element={<BrandingDetailPage />} />
              <Route path="/web-development" element={<WebDevelopmentPage />} />
              <Route path="/3d-animation" element={<Animation3DPage />} />
              <Route path="/uiux-design" element={<UIUXDesignPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/case-studies" element={<CaseStudiesPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-of-service" element={<TermsOfServicePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/apply-employee" element={<ApplyForEmployee />} />
              <Route path="/apply-position/:positionId" element={<ApplyForPosition />} />
              <Route path="/employee/:id" element={<EmployeeDetailsPage />} />

              {/* Protected Routes - Login Required */}
              <Route path="/account" element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              } />
              <Route path="/services/order/:serviceName" element={
                <ProtectedRoute>
                  <OrderServicePage />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              } />
              <Route path="/orders/:id" element={
                <ProtectedRoute>
                  <OrderDetailsPage />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="/management" element={
                <AdminRoute>
                  <ManagementDashboard />
                </AdminRoute>
              } />
              <Route path="/chatbot-dashboard" element={
                <AdminRoute>
                  <ChatbotDashboard />
                </AdminRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ChatBot />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
  );
};

export default App;
