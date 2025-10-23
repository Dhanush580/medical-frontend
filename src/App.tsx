import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Partner from "./pages/Partner";
import PartnerRegister from "./pages/PartnerRegister";
import PartnerLogin from "./pages/PartnerLogin";
import PartnerDashboard from "./pages/PartnerDashboard";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import NotFound from "./pages/NotFound";
import AboutUs from "./pages/AboutUs";
import HowItWorks from "./pages/HowItWorks";
import MembershipFee from "./pages/MembershipFee";
import MembershipComingSoon from "./pages/MembershipComingSoon";
import FAQ from "./pages/FAQ";
import ContactUs from "./pages/ContactUs";

const queryClient = new QueryClient();

import NavLayout from "./components/NavLayout";

const router = createBrowserRouter([
  {
    path: '/',
    element: <NavLayout />,
    children: [
      { path: '/', element: <Index /> },
      { path: '/about', element: <AboutUs /> },
      { path: '/how-it-works', element: <HowItWorks /> },
      { path: '/membership-fee', element: <MembershipFee /> },
      { path: '/faq', element: <FAQ /> },
      { path: '/contact', element: <ContactUs /> },
    ],
  },
  { path: '/login', element: <MembershipComingSoon /> },
        { path: '/coming-soon', element: <MembershipComingSoon /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/partner', element: <Partner /> },
  { path: '/partner/register', element: <PartnerRegister /> },
  { path: '/partner/login', element: <PartnerLogin /> },
  { path: '/partner/dashboard', element: <PartnerDashboard /> },
  { path: '/admin/login', element: <AdminLogin /> },
  { path: '/admin/register', element: <AdminRegister /> },
  { path: '/admin', element: <Admin /> },
  { path: '*', element: <NotFound /> },
]);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ErrorBoundary>
          <RouterProvider
            router={router}
            future={{ v7_startTransition: true }}
          />
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
