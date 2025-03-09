
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import FreeMods from "./pages/FreeMods";
import PaidMods from "./pages/PaidMods";
import NotFound from "./pages/NotFound";
import Rules from "./pages/Rules";
import Request from "./pages/Request";
import { AdminProvider } from "./hooks/useAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AdminProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/rules" element={<Rules />} />
              <Route path="/free-mods" element={<FreeMods />} />
              <Route path="/paid-mods" element={<PaidMods />} />
              <Route path="/request" element={<Request />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </AdminProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
