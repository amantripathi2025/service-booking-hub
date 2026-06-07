import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LogOut, Calendar, Wrench, User, ShieldAlert } from "lucide-react";

import api from "../api"; 
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ bookings: 0, active: 0, pending: 0 });

  // Yeh raha tera role wala variable, yahan return se UPAR aayega!
  // Ise 'CUSTOMER' ya 'VENDOR' karke test kar sakta hai
  const userRole = "CUSTOMER"; 

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/bookings/stats");
        setStats(response.data);
      } catch (error) {
        console.log("Stats fetch nahi ho paye, backend endpoint check kar.", error);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col justify-between hidden md:flex">
        <div className="space-y-8">
          <div className="text-xl font-bold tracking-tighter text-blue-500 flex items-center gap-2">
            <Wrench /> <span>ServiceHub</span>
          </div>
          <nav className="space-y-4">
            
            {/* 1. Bookings - Sabko dikhega */}
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 bg-blue-600 rounded-lg font-medium text-white transition-all">
              <Calendar size={18} /> Bookings
            </Link>
            
            {/* 2. Add Service - SIRF VENDOR KO DIKHEGA */}
            {userRole === "VENDOR" && (
              <Link to="/add-service" className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white rounded-lg font-medium transition-all">
                <Wrench size={18} /> Add Service
              </Link>
            )}
            
            {/* 3. Profile - Sabko dikhega */}
            <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white rounded-lg font-medium transition-all">
              <User size={18} /> Profile
            </Link>

          </nav>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-red-300 font-medium transition-all">
          <LogOut size={18} /> Log Out
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome to Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Manage your bookings and service requests here.</p>
          </div>
        </header>

        {/* Dynamic Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <motion.div whileHover={{ y: -4 }} className="p-6 bg-gray-900 border border-gray-800 rounded-xl">
            <div className="text-gray-400 text-sm font-medium">Total Bookings</div>
            <div className="text-3xl font-bold mt-2 text-blue-400">{stats.bookings}</div>
          </motion.div>
          <motion.div whileHover={{ y: -4 }} className="p-6 bg-gray-900 border border-gray-800 rounded-xl">
            <div className="text-gray-400 text-sm font-medium">Active Services</div>
            <div className="text-3xl font-bold mt-2 text-purple-400">{stats.active}</div>
          </motion.div>
          <motion.div whileHover={{ y: -4 }} className="p-6 bg-gray-900 border border-gray-800 rounded-xl">
            <div className="text-gray-400 text-sm font-medium">Pending Approvals</div>
            <div className="text-3xl font-bold mt-2 text-yellow-500">{stats.pending}</div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="text-center py-10 text-gray-500 flex flex-col items-center gap-2">
            <ShieldAlert size={32} className="text-gray-600" />
            <span>No recent bookings found.</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;