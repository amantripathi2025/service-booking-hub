import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, User, Mail, Phone, ShieldCheck, Edit3 } from "lucide-react";
import { Link } from "react-router-dom";

function Profile() {
  // Abhi dummy data hai, baad mein API se fetch karenge
    const [userData] = useState({
    name: "Aman Pati Tripathi",
    email: "aman@example.com",
    phone: "+91 9876543210",
    role: "VENDOR (Service Provider)",
    joined: "June 2026"
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white flex justify-center p-4 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-[10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full blur-[150px] opacity-20 animate-pulse"></div>

      {/* Back to Dashboard */}
      <Link to="/dashboard" className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors z-20">
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>

      {/* Profile Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl mt-20 z-10"
      >
        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 relative">
            <button className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 p-2 rounded-lg backdrop-blur-sm transition-all flex items-center gap-2 text-sm font-medium">
              <Edit3 size={16} /> Edit Profile
            </button>
          </div>

          {/* Profile Info */}
          <div className="p-8 relative">
            {/* Avatar */}
            <div className="absolute -top-16 left-8 w-24 h-24 bg-gray-800 border-4 border-gray-900 rounded-full flex items-center justify-center shadow-lg">
              <User size={40} className="text-gray-400" />
            </div>

            <div className="mt-8">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                {userData.name} 
                <ShieldCheck className="text-green-500" size={24} title="Verified User" />
              </h2>
              <p className="text-blue-400 font-medium mt-1">{userData.role}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-gray-950/50 p-4 rounded-xl border border-gray-800/50">
                <div className="flex items-center gap-3 text-gray-400 mb-1">
                  <Mail size={16} /> <span className="text-sm">Email Address</span>
                </div>
                <div className="text-lg font-medium pl-7">{userData.email}</div>
              </div>

              <div className="bg-gray-950/50 p-4 rounded-xl border border-gray-800/50">
                <div className="flex items-center gap-3 text-gray-400 mb-1">
                  <Phone size={16} /> <span className="text-sm">Phone Number</span>
                </div>
                <div className="text-lg font-medium pl-7">{userData.phone}</div>
              </div>
            </div>

            <div className="mt-8 text-center text-sm text-gray-500 border-t border-gray-800/50 pt-6">
              Member since {userData.joined}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Profile;