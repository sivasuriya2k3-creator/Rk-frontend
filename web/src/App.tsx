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
import ChatBot from "./components/ChatBot";
import { useState, useEffect, Suspense, lazy } from "react";

// Lazy load other pages to prevent loading all at once
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const AllServicesPage = lazy(() => import("./pages/AllServicesPage"));
const OrderServicePage = lazy(() => import("./pages/OrderServicePage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const OrderDetailsPage = lazy(() => import("./pages/OrderDetailsPage"));
const BrandingIdentityPage = lazy(() => import("./pages/BrandingIdentityPage"));
const BrandingDetailPage = lazy(() => import("./pages/BrandingDetailPage"));
const WebDevelopmentPage = lazy(() => import("./pages/WebDevelopmentPage"));
const Animation3DPage = lazy(() => import("./pages/Animation3DPage"));
const UIUXDesignPage = lazy(() => import("./pages/UIUXDesignPage"));
const AccountPage = lazy(() => import("./pages/AccountPage"));
const VerifyOTP = lazy(() => import("./pages/VerifyOTP"));
const ManagementDashboard = lazy(() => import("./pages/ManagementDashboard"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const CaseStudiesPage = lazy(() => import("./pages/CaseStudiesPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsOfServicePage = lazy(() => import("./pages/TermsOfServicePage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const ApplyForEmployee = lazy(() => import("./pages/ApplyForEmployee"));
const ApplyForPosition = lazy(() => import("./pages/ApplyForPosition"));
const EmployeeDetailsPage = lazy(() => import("./pages/EmployeeDetailsPage"));
const ChatbotDashboard = lazy(() => import("./pages/ChatbotDashboard"));

const queryClient = new QueryClient();

// Loading component for lazy loaded pages
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent mx-auto mb-4" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const AppContent = () => {
  const [authPopupOpen, setAuthPopupOpen] = useState(false);

  useEffect(() => {
    // Listen for auth popup events
    const handleShowAuthPopup = (event: any) => {
      console.log('Auth popup event received:', event);
      setAuthPopupOpen(true);
    };

    // Use 'showAuthPopup' as custom event name
    window.addEventListener('showAuthPopup', handleShowAuthPopup as EventListener);
    
    return () => {
      window.removeEventListener('showAuthPopup', handleShowAuthPopup as EventListener);
    };
  }, []);

  return (
    <>
      <AuthPopupModal 
        isOpen={authPopupOpen} 
        onClose={() => setAuthPopupOpen(false)}
      />
      <Routes>
        {/* Public Routes - No Login Required */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<Suspense fallback={<PageLoader />}><VerifyOTP /></Suspense>} />
        <Route path="/services" element={<Suspense fallback={<PageLoader />}><AllServicesPage /></Suspense>} />
        <Route path="/services-overview" element={<Suspense fallback={<PageLoader />}><ServicesPage /></Suspense>} />
        <Route path="/branding-identity" element={<Suspense fallback={<PageLoader />}><BrandingIdentityPage /></Suspense>} />
        <Route path="/branding-identity/:id" element={<Suspense fallback={<PageLoader />}><BrandingDetailPage /></Suspense>} />
        <Route path="/web-development" element={<Suspense fallback={<PageLoader />}><WebDevelopmentPage /></Suspense>} />
        <Route path="/3d-animation" element={<Suspense fallback={<PageLoader />}><Animation3DPage /></Suspense>} />
        <Route path="/uiux-design" element={<Suspense fallback={<PageLoader />}><UIUXDesignPage /></Suspense>} />
        <Route path="/blog" element={<Suspense fallback={<PageLoader />}><BlogPage /></Suspense>} />
        <Route path="/case-studies" element={<Suspense fallback={<PageLoader />}><CaseStudiesPage /></Suspense>} />
        <Route path="/privacy-policy" element={<Suspense fallback={<PageLoader />}><PrivacyPolicyPage /></Suspense>} />
        <Route path="/terms-of-service" element={<Suspense fallback={<PageLoader />}><TermsOfServicePage /></Suspense>} />
        <Route path="/contact" element={<Suspense fallback={<PageLoader />}><ContactPage /></Suspense>} />
        <Route path="/apply-employee" element={<Suspense fallback={<PageLoader />}><ApplyForEmployee /></Suspense>} />
        <Route path="/apply-position/:positionId" element={<Suspense fallback={<PageLoader />}><ApplyForPosition /></Suspense>} />
        <Route path="/employee/:id" element={<Suspense fallback={<PageLoader />}><EmployeeDetailsPage /></Suspense>} />

        {/* Protected Routes - Login Required */}
        <Route path="/account" element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <AccountPage />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/services/order/:serviceName" element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <OrderServicePage />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <OrdersPage />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/orders/:id" element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <OrderDetailsPage />
            </Suspense>
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <AdminRoute>
            <Suspense fallback={<PageLoader />}>
              <AdminDashboard />
            </Suspense>
          </AdminRoute>
        } />
        <Route path="/management" element={
          <AdminRoute>
            <Suspense fallback={<PageLoader />}>
              <ManagementDashboard />
            </Suspense>
          </AdminRoute>
        } />
        <Route path="/chatbot-dashboard" element={
          <AdminRoute>
            <Suspense fallback={<PageLoader />}>
              <ChatbotDashboard />
            </Suspense>
          </AdminRoute>
        } />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ChatBot />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="rajkayal-theme-v2">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
