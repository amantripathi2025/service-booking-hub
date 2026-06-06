import { motion } from "framer-motion";
import { ArrowRight, Wrench, ShieldCheck, Zap } from "lucide-react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-blue-500 selection:text-white">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center p-6 lg:px-20 border-b border-gray-800">
        <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
          <Wrench className="text-blue-500" />
          <span>Service<span className="text-blue-500">Hub</span></span>
        </div>
        <div className="space-x-4 hidden md:block text-sm font-medium text-gray-400">
          <a href="#" className="hover:text-white transition-colors">Services</a>
          <a href="#" className="hover:text-white transition-colors">For Vendors</a>
          <a href="#" className="hover:text-white transition-colors">Reviews</a>
        </div>
        <div className="space-x-3 text-sm">
        <Link to="/login" className="px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">Log In</Link>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center px-4 pt-32 pb-20">
        {/* Animated Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium mb-8"
        >
          <Zap size={16} />
          <span>The #1 Local Service Booking Platform</span>
        </motion.div>

        {/* Animated Main Heading */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl"
        >
          Find Expert Professionals <br />
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Instantly for Everything.
          </span>
        </motion.h1>

        {/* Animated Subtext */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10"
        >
          From home repairs to IT support, book verified experts in your area. Fast, reliable, and completely transparent.
        </motion.p>

        {/* Animated CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-black rounded-lg font-bold hover:scale-105 transition-transform">
            Book a Service <ArrowRight size={20} />
          </button>
          <button className="flex items-center justify-center gap-2 px-8 py-4 border border-gray-700 bg-gray-900 rounded-lg font-bold hover:bg-gray-800 transition-colors">
            <ShieldCheck size={20} className="text-green-400" /> Become a Vendor
          </button>
        </motion.div>
      </main>
    </div>
  );
}

export default Home;