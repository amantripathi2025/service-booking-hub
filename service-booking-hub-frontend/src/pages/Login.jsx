import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Lock, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api"; 

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Backend ko hit maar rahe hain
      const response = await api.post("/users/login", {
        email: email,
        password: password,
      });

      console.log("Backend Response:", response.data);
      
      // 🔥 MAIN LOGIC: Role aur Name ko localStorage mein store karo
      let userRole = "VENDOR"; // Default fallback
      
      if (response.data && response.data.role) {
        userRole = response.data.role;
        localStorage.setItem("userRole", userRole);
        localStorage.setItem("userName", response.data.name || email.split('@')[0]);
      } else {
        localStorage.setItem("userRole", userRole); 
        localStorage.setItem("userName", email.split('@')[0]);
      }
      
      // Success text set karo
      setSuccessMessage("Login Successful! Redirecting..."); 
      
      // 🔥 THE FIX: Role ke hisaab se sahi page par bhejo
      setTimeout(() => {
        if (userRole === "CUSTOMER") {
          navigate("/customer-home"); // Customer apne radar page par
        } else {
          navigate("/dashboard"); // Vendor apne dashboard par
        }
      }, 1500);
      
    } catch (error) {
      console.error("Login Error:", error);
      // Backend errors handles (404, 401)
      setErrorMessage(error.response?.data || "Email ya Password galat hai bhai!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4 relative overflow-hidden selection:bg-blue-500">
      
      {/* Animated Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full blur-[150px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600 rounded-full blur-[150px] opacity-20 animate-pulse"></div>

      {/* Back Button */}
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
        <ArrowLeft size={20} /> Back to Home
      </Link>

      {/* Login Box */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 shadow-[0_0_40px_rgba(0,0,0,0.5)] z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
          <p className="text-gray-400">Sign in to your ServiceHub account</p>
        </div>

        {/* Success Message Box */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm text-center font-semibold">
            {successMessage}
          </div>
        )}

        {/* Error Message Box */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="aman@example.com"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Login Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Connecting...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Don't have an account? <Link to="/register" className="text-blue-500 hover:underline cursor-pointer">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;