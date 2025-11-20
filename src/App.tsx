import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute, AdminRoute } from "@/components/ProtectedRoute";
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
import ApplyForEmployee from "./pages/ApplyForEmployee";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="rajkayal-theme">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
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
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/account" element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              } />
              <Route path="/services" element={<AllServicesPage />} />
              <Route path="/services-overview" element={<ServicesPage />} />
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
              <Route path="/branding-identity" element={<BrandingIdentityPage />} />
              <Route path="/branding-identity/:id" element={<BrandingDetailPage />} />
              <Route path="/web-development" element={<WebDevelopmentPage />} />
              <Route path="/3d-animation" element={<Animation3DPage />} />
              <Route path="/uiux-design" element={<UIUXDesignPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/case-studies" element={<CaseStudiesPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-of-service" element={<TermsOfServicePage />} />
              <Route path="/apply-employee" element={<ApplyForEmployee />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
