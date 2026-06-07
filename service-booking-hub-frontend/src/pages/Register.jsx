import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Lock, User, Phone, Briefcase, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("CUSTOMER"); // Default role
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Backend DTO ke according data bhej rahe hain
      const response = await api.post("/users/register", {
        name: name,
        email: email,
        password: password,
        phone: phone,
        role: role
      });

      console.log("Registration Response:", response.data);
      setSuccessMessage("Account created successfully! Ab login karo aur bhaukaal machao.");
      
      // Fields khali kar do register hone ke baad
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
    } catch (error) {
      console.error("Registration Error:", error);
      
      const serverError = error.response?.data;
      // Agar backend se direct string text aaya hai
      if (typeof serverError === "string") {
        setErrorMessage(serverError);
      } 
      // Agar backend se koi error object aaya hai jisme message hai
      else if (serverError && serverError.message) {
        setErrorMessage(serverError.message);
      } 
      // Agar network hi gayab hai ya server band hai
      else {
        setErrorMessage("Backend server se connect nahi ho pa raha! Check karo server chal raha hai ya nahi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4 relative overflow-hidden selection:bg-blue-500">
      
      {/* Background Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-600 rounded-full blur-[150px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full blur-[150px] opacity-20 animate-pulse"></div>

      {/* Back Button */}
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
        <ArrowLeft size={20} /> Back to Home
      </Link>

      {/* Register Box */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 shadow-[0_0_40px_rgba(0,0,0,0.5)] z-10 my-10"
      >
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2">Create Account</h2>
          <p className="text-gray-400">Join ServiceHub platform today</p>
        </div>

        {/* Success Box */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm text-center font-semibold">
            {successMessage}
          </div>
        )}

        {/* Error Box */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" required disabled={loading} value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 transition-all"
                placeholder="Aman Tripathi"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="email" required disabled={loading} value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 transition-all"
                placeholder="aman@example.com"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" required disabled={loading} value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 transition-all"
                placeholder="9876543210"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="password" required disabled={loading} value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Role Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">I want to join as a</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                disabled={loading}
                className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
              >
                <option value="CUSTOMER">Customer (Book Services)</option>
                <option value="VENDOR">Vendor (Provide Services)</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" disabled={loading}
            className="w-full mt-2 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold shadow-[0_0_15px_rgba(147,51,234,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400 text-sm">
          Already have an account? <Link to="/login" className="text-purple-400 hover:underline">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;