import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AccountSettings from './pages/AccountSettings';
import AdminAccountSettings from './pages/AdminAccountSettings';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import Apply from './pages/Apply';
import Contact from './pages/Contact';
import Faq from './pages/Faq';
import Index from './pages/Index';
import Organisations from './pages/Organisations';
import Report from './pages/Report';
import VendorDashboard from './pages/VendorDashboard';
import VendorDatabase from './pages/VendorDatabase';
import VendorLogin from './pages/VendorLogin';
import VendorProfile from './pages/VendorProfile';
import Verify from './pages/Verify';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/account-settings" element={<AccountSettings />} />
        <Route path="/admin-account-settings" element={<AdminAccountSettings />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/" element={<Index />} />
        <Route path="/organisations" element={<Organisations />} />
        <Route path="/report" element={<Report />} />
        <Route path="/vendor-dashboard" element={<VendorDashboard />} />
        <Route path="/vendor-database" element={<VendorDatabase />} />
        <Route path="/vendor-login" element={<VendorLogin />} />
        <Route path="/vendor-profile/:vendorId?" element={<VendorProfile />} />
        <Route path="/verify" element={<Verify />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
      />
    </Router>
  );
}

export default App;
