
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
import VerifyOTP from './pages/VerifyOTP';
import ResetPassword from './pages/ResetPassword';
import Admin from './pages/Admin';
import Rules from './pages/Rules';
import WorkInProgress from './pages/WorkInProgress';
import Request from './pages/Request';
import TicketSystem from './pages/TicketSystem';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import UserPurchases from './pages/UserPurchases';
import UserProfile from './pages/UserProfile';
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
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/free-mods" element={<FreeMods />} />
          <Route path="/paid-mods" element={<PaidMods />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/wip" element={<WorkInProgress />} />
          <Route path="/request" element={<Request />} />
          <Route path="/tickets" element={<TicketSystem />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/purchases" element={<UserPurchases />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </AdminProvider>
  );
}

export default App;
