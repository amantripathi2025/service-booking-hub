import { useState } from "react";
import { ArrowLeft, Wallet, MapPin, Moon, Globe, LogOut, Plus, Trash2, Home, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CustomerAccount() {
  const navigate = useNavigate();

  // Wallet State
  const [walletBalance, setWalletBalance] = useState(1250);

  // Addresses State (Home, Office, etc.)
  const [addresses, setAddresses] = useState([
    { id: 1, type: "Home", text: "Sector 14, Main Market, City Center", icon: Home },
    { id: 2, type: "Office", text: "Tech Park, Tower B, 4th Floor", icon: Briefcase }
  ]);

  // Settings State
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("English");

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const handleAddMoney = () => {
    const amount = window.prompt("Enter amount to add to wallet:");
    if (amount && !isNaN(amount)) {
      setWalletBalance(prev => prev + parseInt(amount));
      alert(`₹${amount} added successfully!`);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("customerProfile");
      navigate("/");
    }
  };

  return (
    <div className={`min-h-screen font-sans pb-20 ${darkMode ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"}`}>
      
      {/* Header */}
      <header className={`${darkMode ? "bg-gray-900" : "bg-blue-600"} text-white p-4 shadow-md flex items-center gap-3 transition-colors`}>
        <button onClick={() => navigate(-1)} className={`p-1 rounded-full transition ${darkMode ? "hover:bg-gray-800" : "hover:bg-blue-700"}`}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">My Account</h1>
      </header>

      <main className="px-5 mt-6 space-y-6 max-w-md mx-auto">
        
        {/* WALLET COMPONENT */}
        <div className={`p-5 rounded-2xl shadow-sm border ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Wallet size={20} className={darkMode ? "text-blue-400" : "text-blue-600"}/> 
              My Wallet
            </h2>
            <span className="text-[10px] uppercase font-bold bg-green-100 text-green-700 px-2 py-1 rounded">Active</span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Available Balance</p>
              <p className="text-3xl font-extrabold mt-1">₹{walletBalance}</p>
            </div>
            <button 
              onClick={handleAddMoney}
              className={`px-4 py-2 text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-1 ${darkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`}
            >
              <Plus size={16}/> Add Money
            </button>
          </div>
        </div>

        {/* SAVED ADDRESSES COMPONENT */}
        <div className={`p-5 rounded-2xl shadow-sm border ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <MapPin size={20} className={darkMode ? "text-emerald-400" : "text-emerald-500"}/> 
              Saved Addresses
            </h2>
            <button className={`text-sm font-bold flex items-center gap-1 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
              <Plus size={16}/> New
            </button>
          </div>
          
          <div className="space-y-3">
            {addresses.map(addr => (
              <div key={addr.id} className={`flex justify-between items-center p-3 rounded-xl border ${darkMode ? "bg-gray-950 border-gray-800" : "bg-gray-50 border-gray-100"}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${darkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-500 shadow-sm"}`}>
                    <addr.icon size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{addr.type}</h3>
                    <p className={`text-xs line-clamp-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{addr.text}</p>
                  </div>
                </div>
                <button onClick={() => handleDeleteAddress(addr.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SETTINGS & ACCESSIBILITY */}
        <div className={`p-5 rounded-2xl shadow-sm border ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
          <h2 className="text-lg font-bold mb-4">App Settings</h2>
          
          <div className="space-y-4">
            {/* Dark Mode Toggle */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Moon size={18} className={darkMode ? "text-indigo-400" : "text-indigo-500"} />
                <span className="font-medium text-sm">Dark Mode</span>
              </div>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${darkMode ? "bg-blue-600" : "bg-gray-200"}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${darkMode ? "translate-x-6" : "translate-x-0"}`}></div>
              </button>
            </div>

            {/* Language Selector */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Globe size={18} className={darkMode ? "text-orange-400" : "text-orange-500"} />
                <span className="font-medium text-sm">Language</span>
              </div>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={`text-sm font-bold outline-none cursor-pointer rounded bg-transparent ${darkMode ? "text-blue-400" : "text-blue-600"}`}
              >
                <option value="English">English</option>
                <option value="Hindi">हिंदी (Hindi)</option>
              </select>
            </div>
          </div>
        </div>

        {/* LOGOUT BUTTON */}
        <button 
          onClick={handleLogout}
          className={`w-full py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-all ${darkMode ? "bg-red-950/40 text-red-400 border border-red-900 hover:bg-red-900" : "bg-red-50 text-red-600 hover:bg-red-100"}`}
        >
          <LogOut size={18} /> Logout
        </button>

      </main>
    </div>
  );
}

export default CustomerAccount;