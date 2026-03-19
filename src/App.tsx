import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/library" element={<Library />} />
              <Route path="/workspace/:id" element={<Workspace />} />
              <Route path="/notebook" element={<Notebook />} />
              <Route path="/reflections" element={<Reflections />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/settings" element={<div className="p-8"><h1 className="font-serif text-3xl">Settings</h1><p className="text-muted-foreground mt-2 font-sans text-sm">Coming soon.</p></div>} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
