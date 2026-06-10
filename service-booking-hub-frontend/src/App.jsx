import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- Vendor & Common Pages ---
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile'; 
import AddService from './Component/AddService'; 

// --- Customer Pages ---
import CustomerHome from './pages/CustomerHome';
import CustomerProfile from './pages/CustomerProfile';
import CustomerVendorProfile from './pages/CustomerVendorProfile';
import CustomerCheckout from './pages/CustomerCheckout';
import CustomerBookings from './pages/CustomerBookings';
import CustomerReview from './pages/CustomerReview';
import CustomerAccount from './pages/CustomerAccount';
import CustomerChat from './pages/CustomerChat'; // 🔥 YEH NAYA CHAT PAGE IMPORT HO GAYA

// --- Components ---
import CustomerBottomNav from './Component/CustomerBottomNav';
import VendorChat from './pages/VendorCustomerChat'; // Vendor ke liye bhi chat page hai, alag route par

function App() {
  return (
    <Router>
      <Routes>
        {/* Vendor & General Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-service" element={<AddService />} />
        <Route path="/profile" element={<Profile />} />

        {/* Customer Routes */}
        <Route path="/customer-home" element={<CustomerHome />} />
        <Route path="/customer-profile" element={<CustomerProfile />} />
        <Route path="/vendor-profile/:id" element={<CustomerVendorProfile />} />
        <Route path="/checkout/:id" element={<CustomerCheckout />} />
        <Route path="/customer-bookings" element={<CustomerBookings />} />
        <Route path="/write-review/:id" element={<CustomerReview />} />
        <Route path="/customer-account" element={<CustomerAccount />} />
        
        {/* 🔥 YEH RAHA TERA CHAT/AI ROUTE 🔥 */}
        <Route path="/chat/:vendorId" element={<CustomerChat />} />
        <Route path="/vendor-chat/:customerId" element={<VendorChat />} />
      </Routes>

      <CustomerBottomNav />
    </Router>
  );
}

export default App;