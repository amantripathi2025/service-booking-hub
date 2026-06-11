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
import CustomerChat from './pages/CustomerChat'; 

// --- Components ---
import CustomerBottomNav from './Component/CustomerBottomNav';
import VendorChat from './pages/VendorCustomerChat'; 

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

        {/* 🔥 FIX: Customer Routes Sync with Navigation 🔥 */}
        <Route path="/customer-home" element={<CustomerHome />} />
        <Route path="/customer-profile" element={<CustomerProfile />} />
        
        {/* Isko theek kiya taaki Home se shop profile khul sake */}
        <Route path="/customer-vendor-profile/:id" element={<CustomerVendorProfile />} />
        
        {/* Isko theek kiya taaki Checkout page bina error khule */}
        <Route path="/customer-checkout" element={<CustomerCheckout />} />
        
        <Route path="/customer-bookings" element={<CustomerBookings />} />
        
        {/* Isko theek kiya taaki Review page open ho */}
        <Route path="/customer-review/:shopId" element={<CustomerReview />} />
        
        <Route path="/customer-account" element={<CustomerAccount />} />
        
        {/* CHAT/AI ROUTES */}
        <Route path="/chat/:vendorId" element={<CustomerChat />} />
        <Route path="/vendor-chat/:customerId" element={<VendorChat />} />
      </Routes>

      <CustomerBottomNav />
    </Router>
  );
}

export default App;