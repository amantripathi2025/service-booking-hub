import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, PlusCircle, FileText, IndianRupee, Tag, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api";

function AddService() {
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("HOME_REPAIR");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Backend ke LocalServiceController par request bhej rahe hain
      await api.post("/services", {
        serviceName,
        description,
        price: Number(price),
        category
      });
      
      setMessage("Service successfully add ho gayi! Bhaukaal!");
      setServiceName(""); setDescription(""); setPrice("");
    } catch (error) {
      console.error("Error adding service:", error);
      setMessage("Service add nahi ho payi, kuch gadbad hai.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-600 rounded-full blur-[150px] opacity-20 animate-pulse"></div>
      
      {/* Back to Dashboard */}
      <Link to="/dashboard" className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>

      {/* Form Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg p-8 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 shadow-2xl z-10 my-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-blue-400">Add New Service</h2>
          <p className="text-gray-400">List your skills and get hired instantly</p>
        </div>

        {message && (
          <div className={`mb-6 p-3 rounded-lg text-sm text-center font-medium border ${message.includes('successfully') ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Service Name */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Service Title</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-500" size={18} />
              <input 
                type="text" required value={serviceName} onChange={(e) => setServiceName(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg pl-10 pr-4 py-2.5 focus:border-blue-500 transition-all"
                placeholder="e.g. Expert AC Repair"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
            <div className="relative">
              <Tag className="absolute left-3 top-3 text-gray-500" size={18} />
              <select 
                value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg pl-10 pr-4 py-2.5 focus:border-blue-500 transition-all appearance-none"
              >
                <option value="HOME_REPAIR">Home Repair</option>
                <option value="CLEANING">Cleaning & Maid</option>
                <option value="TUTORING">Tutoring</option>
                <option value="IT_SUPPORT">IT & Tech Support</option>
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Price (₹)</label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-3 text-gray-500" size={18} />
              <input 
                type="number" required value={price} onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg pl-10 pr-4 py-2.5 focus:border-blue-500 transition-all"
                placeholder="500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
            <textarea 
              required value={description} onChange={(e) => setDescription(e.target.value)} rows="3"
              className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg p-3 focus:border-blue-500 transition-all resize-none"
              placeholder="Describe what is included in this service..."
            ></textarea>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" disabled={loading}
            className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <PlusCircle size={18} />}
            Publish Service
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default AddService;