import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ATMProvider } from "@/context/ATMContext";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import ScopePage from "@/pages/ScopePage";
import ModulesPage from "@/pages/ModulesPage";
import SessionsPage from "@/pages/SessionsPage";
import DocumentsPage from "@/pages/DocumentsPage";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ATMProvider>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/scope" element={<ScopePage />} />
              <Route path="/modules" element={<ModulesPage />} />
              <Route path="/sessions" element={<SessionsPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </ATMProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
