import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet, Plus, MapPin, Trash2, Moon, Globe, LogOut, IndianRupee, User } from "lucide-react";

function CustomerAccount() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "Guest User";
  
  // Wallet state (init from localStorage to avoid setState inside useEffect)
  const [walletBalance, setWalletBalance] = useState(() => {
    const savedWallet = localStorage.getItem("walletBalance");
    const parsed = savedWallet != null ? Number(savedWallet) : 0;
    return Number.isFinite(parsed) ? parsed : 0;
  });

  // Address state (Linked to Checkout Page)
  const [address, setAddress] = useState(() => {
    try {
      const profileData = localStorage.getItem("customerProfile");
      if (!profileData) return "";
      const savedProfile = JSON.parse(profileData);
      const savedAddress = savedProfile?.address;
      return savedAddress != null ? String(savedAddress) : "";
    } catch {
      return "";
    }
  });



  const handleAddMoney = () => {
    const amount = window.prompt("Enter amount to add to wallet (₹):");
    if (amount && !isNaN(amount)) {
      const newBalance = walletBalance + Number(amount);
      setWalletBalance(newBalance);
      localStorage.setItem("walletBalance", newBalance);
      alert(`₹${amount} added successfully!`);
    }
  };

  const handleAddAddress = () => {
    const newAddress = window.prompt("Apna naya Full Address type karo (e.g., Sector 14, Main Market):");
    if (newAddress && newAddress.trim() !== "") {
      setAddress(newAddress);
      // Save it globally so Checkout page can use it!
      const profile = JSON.parse(localStorage.getItem("customerProfile")) || {};
      profile.address = newAddress;
      localStorage.setItem("customerProfile", JSON.stringify(profile));
      alert("Address updated! Ab Checkout par yahi address jayega.");
    }
  };

  const handleDeleteAddress = () => {
    if (window.confirm("Are you sure you want to delete your saved address?")) {
      setAddress("");
      const profile = JSON.parse(localStorage.getItem("customerProfile")) || {};
      profile.address = "";
      localStorage.setItem("customerProfile", JSON.stringify(profile));
    }
  };

  const handleLogout = () => {
    if (window.confirm("Bhai, sach mein logout karna hai?")) {
      localStorage.clear(); // Saara session kachra saaf
      navigate("/"); // Seedha login/home page par
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24">
      {/* Header */}
      <header className="bg-blue-600 text-white p-5 shadow-md flex items-center gap-3">
        <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
          <User size={20} />
        </div>
        <div>
          <h1 className="text-lg font-bold">My Account</h1>
          <p className="text-xs text-blue-200">{userEmail}</p>
        </div>
      </header>

      <main className="p-5 max-w-md mx-auto space-y-6">
        
        {/* Wallet Section */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1 mb-1">
              <Wallet size={14} className="text-blue-500" /> My Wallet
            </h3>
            <p className="text-3xl font-black text-gray-900 flex items-center">
              <IndianRupee size={22} className="text-gray-900"/>{walletBalance}
            </p>
          </div>
          <button 
            onClick={handleAddMoney}
            className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-1 transition-colors"
          >
            <Plus size={16} /> Add Money
          </button>
        </div>

        {/* Addresses Section */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1">
              <MapPin size={14} className="text-emerald-500" /> Saved Addresses
            </h3>
            <button 
              onClick={handleAddAddress}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Plus size={14} /> {address ? "Change" : "Add New"}
            </button>
          </div>

          <div className="space-y-3">
            {address ? (
              <div className="flex justify-between items-center p-3 border border-gray-100 rounded-xl bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-500">
                    <MapPin size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Primary Address</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{address}</p>
                  </div>
                </div>
                <button onClick={handleDeleteAddress} className="text-red-400 hover:bg-red-50 p-2 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200 cursor-pointer" onClick={handleAddAddress}>
                <p className="text-sm font-bold text-gray-500">+ Add your address here</p>
                <p className="text-[10px] text-gray-400 mt-1">Needed for Checkout</p>
              </div>
            )}
          </div>
        </div>

        {/* App Settings */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">App Settings</h3>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 text-gray-700 font-medium text-sm">
              <Moon size={18} /> Dark Mode
            </div>
            <div className="w-10 h-6 bg-gray-200 rounded-full relative cursor-not-allowed opacity-50">
              <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow-sm"></div>
            </div>
          </div>

          <div className="w-full h-px bg-gray-50"></div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 text-gray-700 font-medium text-sm">
              <Globe size={18} /> Language
            </div>
            <span className="text-xs font-bold text-blue-600 cursor-pointer">English (UK)</span>
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-4 rounded-xl font-black text-sm shadow-sm transition-all flex justify-center items-center gap-2 mt-4"
        >
          <LogOut size={18} /> Secure Logout
        </button>

      </main>
    </div>
  );
}

export default CustomerAccount;