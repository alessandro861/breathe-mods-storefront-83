
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from './pages/Index';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import NotFound from './pages/NotFound';
import FreeMods from './pages/FreeMods';
import PaidMods from './pages/PaidMods';
import ComingSoon from './pages/ComingSoon';
import ForgotPassword from './pages/ForgotPassword';
import Admin from './pages/Admin';
import Rules from './pages/Rules';
import WorkInProgress from './pages/WorkInProgress';
import Request from './pages/Request';
import TicketSystem from './pages/TicketSystem';
import { AdminProvider } from './hooks/useAdmin';
import { addSampleData } from './services/userService';

function App() {
  useEffect(() => {
    // Initialize sample data on first load if needed
    addSampleData();
  }, []);

  return (
    <AdminProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/free-mods" element={<FreeMods />} />
          <Route path="/paid-mods" element={<PaidMods />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/wip" element={<WorkInProgress />} />
          <Route path="/request" element={<Request />} />
          <Route path="/tickets" element={<TicketSystem />} />
          <Route path="/privacy" element={<ComingSoon />} />
          <Route path="/terms" element={<ComingSoon />} />
          <Route path="/contact" element={<ComingSoon />} />
          <Route path="/faq" element={<ComingSoon />} />
          <Route path="/about" element={<ComingSoon />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </AdminProvider>
  );
}

export default App;
