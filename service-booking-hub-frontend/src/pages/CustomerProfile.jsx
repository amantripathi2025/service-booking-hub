import { useState } from "react";
import { ArrowLeft, User, Phone, MapPin, Mail, Save, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CustomerProfile() {
  const navigate = useNavigate();

  // 1. Initial Load: LocalStorage se real account data nikalo
  const savedEmail = localStorage.getItem("userEmail") || "";
  const savedName = localStorage.getItem("userName") || "";
  const savedPhone = localStorage.getItem("userPhone") || "";
  
  const savedProfileStr = localStorage.getItem("customerProfile");
  const savedProfile = savedProfileStr ? JSON.parse(savedProfileStr) : {};

  const [formData, setFormData] = useState({
    name: savedName || "Guest User",
    email: savedEmail || "Not registered",
    phone: savedPhone || savedProfile.phone || "",
    address: savedProfile.address || ""
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Save Engine: Form submit hone par global access ke liye update karo
  const handleSaveProfile = (e) => {
    e.preventDefault();
    
    localStorage.setItem("userName", formData.name);
    localStorage.setItem("userPhone", formData.phone);
    localStorage.setItem("customerProfile", JSON.stringify({
      phone: formData.phone,
      address: formData.address
    }));
    
    setSuccess(true);
    // 2 second baad success animation hide
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md flex items-center gap-3">
        <button onClick={() => navigate("/customer-home")} className="p-1 hover:bg-blue-700 rounded-full transition">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">My Profile</h1>
      </header>

      {/* Success Popup */}
      {success && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-2xl z-50 animate-in slide-in-from-top fade-in">
          <CheckCircle2 size={18} className="text-green-400" />
          <span className="text-sm font-bold tracking-wide">Profile Saved Successfully!</span>
        </div>
      )}

      <main className="p-5 max-w-md mx-auto mt-2">
        {/* Profile Avatar Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center mb-6">
          <div className="h-20 w-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-black mb-3 border-4 border-white shadow-md">
            {formData.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-lg font-black text-gray-900">{formData.name}</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{formData.email}</p>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSaveProfile} className="space-y-4">
          {/* Name Field */}
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-50 transition-all">
            <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1 mb-1">
              <User size={14} className="text-blue-500" /> Full Name
            </label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-bold text-gray-900 outline-none"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email Field (Disabled) */}
          <div className="bg-gray-100 p-4 rounded-xl border border-gray-200 shadow-sm cursor-not-allowed opacity-70">
            <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1 mb-1">
              <Mail size={14} className="text-gray-500" /> Registered Email
            </label>
            <input 
              type="email" 
              value={formData.email}
              className="w-full bg-transparent text-sm font-bold text-gray-900 outline-none cursor-not-allowed"
              disabled
            />
          </div>

          {/* Phone Field */}
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-50 transition-all">
            <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1 mb-1">
              <Phone size={14} className="text-blue-500" /> Phone Number
            </label>
            <input 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-bold text-gray-900 outline-none"
              placeholder="10-digit mobile number"
              required
            />
          </div>

          {/* Address Field */}
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-50 transition-all">
            <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1 mb-1">
              <MapPin size={14} className="text-blue-500" /> Service Location
            </label>
            <textarea 
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-bold text-gray-900 outline-none resize-none h-16"
              placeholder="House/Flat No, Area, Landmark"
              required
            />
          </div>

          {/* Save Button */}
          <button 
            type="submit" 
            className="w-full bg-gray-950 hover:bg-black text-white py-4 rounded-xl font-bold text-sm tracking-tight transition-all flex items-center justify-center gap-2 shadow-md mt-6"
          >
            <Save size={18} /> Save & Update Profile
          </button>
        </form>
      </main>
    </div>
  );
}

export default CustomerProfile;