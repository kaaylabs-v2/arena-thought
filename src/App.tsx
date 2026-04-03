import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { WorkspaceProvider } from "@/context/WorkspaceContext";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import Library from "./pages/Library";
import Workspace from "./pages/Workspace";
import Notebook from "./pages/Notebook";
import Reflections from "./pages/Reflections";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import StudyPlan from "./pages/StudyPlan";
import AdminStudio from "./pages/AdminStudio";
import NotFound from "./pages/NotFound";

// Admin Studio
import { AdminLayout } from "@/admin/components/AdminLayout";
import AdminDashboard from "@/admin/pages/AdminDashboard";
import AdminCoursesPage from "@/admin/pages/AdminCourses";
import AdminMembersPage from "@/admin/pages/AdminMembers";
import AdminContentLibraryPage from "@/admin/pages/AdminContentLibrary";
import AdminDepartmentsPage from "@/admin/pages/AdminDepartmentsPage";
import AdminOutcomesPage from "@/admin/pages/AdminOutcomesPage";
import AdminAnalyticsPage from "@/admin/pages/AdminAnalyticsPage";
import AdminAnnouncementsPage from "@/admin/pages/AdminAnnouncementsPage";
import AdminSettingsPage from "@/admin/pages/AdminSettingsPage";
import AdminHelpPage from "@/admin/pages/AdminHelpPage";
import AdminAccessDenied from "@/admin/pages/AdminAccessDenied";
import { useAdminAuth } from "@/admin/hooks/useAdminAuth";

const queryClient = new QueryClient();

function AdminGuard() {
  const { isAdmin } = useAdminAuth();
  if (!isAdmin) return <AdminAccessDenied />;
  return <AdminLayout />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Learner Arena */}
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/library" element={<Library />} />
              <Route path="/workspace/:id" element={<Workspace />} />
              <Route path="/notebook" element={<Notebook />} />
              <Route path="/reflections" element={<Reflections />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/study-plan" element={<StudyPlan />} />
            </Route>

            {/* Admin Studio — completely separate layout */}
            <Route element={<AdminGuard />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/courses" element={<AdminCoursesPage />} />
              <Route path="/admin/library" element={<AdminContentLibraryPage />} />
              <Route path="/admin/members" element={<AdminMembersPage />} />
              <Route path="/admin/departments" element={<AdminDepartmentsPage />} />
              <Route path="/admin/outcomes" element={<AdminOutcomesPage />} />
              <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
              <Route path="/admin/announcements" element={<AdminAnnouncementsPage />} />
              <Route path="/admin/settings" element={<AdminSettingsPage />} />
              <Route path="/admin/help" element={<AdminHelpPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
