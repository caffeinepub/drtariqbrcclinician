import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import Footer from "./components/Footer";
import Header from "./components/Header";
import OfflineIndicator from "./components/OfflineIndicator";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import ProfileSetupModal from "./components/ProfileSetupModal";
import WhatsAppButton from "./components/WhatsAppButton";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useKeepAlive } from "./hooks/useKeepAlive";
import { useGetCallerUserProfile, useIsCallerAdmin } from "./hooks/useQueries";
import AboutPage from "./pages/AboutPage";
import AdminAppointmentHistoryPage from "./pages/AdminAppointmentHistoryPage";
import AdminAppointmentsPage from "./pages/AdminAppointmentsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminPatientsPage from "./pages/AdminPatientsPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import TestimonialsPage from "./pages/TestimonialsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5000,
    },
  },
});

function Layout() {
  const { identity } = useInternetIdentity();
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();

  // Initialize keep-alive mechanism to prevent app hibernation
  useKeepAlive();

  const isAuthenticated = !!identity;
  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header isAdmin={isAdmin || false} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {showProfileSetup && <ProfileSetupModal />}
      <WhatsAppButton />
      <PWAInstallPrompt />
      <OfflineIndicator />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const servicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services",
  component: ServicesPage,
});

const appointmentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/appointments",
  component: AppointmentsPage,
});

const testimonialsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/testimonials",
  component: TestimonialsPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/dashboard",
  component: AdminDashboardPage,
});

const adminAppointmentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/appointments",
  component: AdminAppointmentsPage,
});

const adminAppointmentHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/appointment-history",
  component: AdminAppointmentHistoryPage,
});

const adminPatientsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/patients",
  component: AdminPatientsPage,
});

const adminSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/settings",
  component: AdminSettingsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  servicesRoute,
  appointmentsRoute,
  testimonialsRoute,
  aboutRoute,
  contactRoute,
  adminDashboardRoute,
  adminAppointmentsRoute,
  adminAppointmentHistoryRoute,
  adminPatientsRoute,
  adminSettingsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
