import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import Gallery from "./pages/Gallery";
import Announcements from "./pages/Announcements";
import Research from "./pages/Research";
import Organizations from "./pages/Organizations";
import Extension from "./pages/Extension";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminResearch from "./pages/admin/AdminResearch";
import AdminOrganizations from "./pages/admin/AdminOrganizations";
import AdminExtensions from "./pages/admin/AdminExtensions";
import AdminUsers from "./pages/admin/AdminUsers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isAuth = location.pathname === "/auth";

  return (
    <>
      {!isAdmin && !isAuth && <Navbar />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/research" element={<Research />} />
        <Route path="/organizations" element={<Organizations />} />
        <Route path="/extension" element={<Extension />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="research" element={<AdminResearch />} />
          <Route path="organizations" element={<AdminOrganizations />} />
          <Route path="extensions" element={<AdminExtensions />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdmin && !isAuth && <Footer />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
