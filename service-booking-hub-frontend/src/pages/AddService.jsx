import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, PlusCircle, FileText, IndianRupee, Tag, Loader2, Trash2, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api";

function AddService() {
  // Shop ki basic details
  const [shopName, setShopName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  
  // 🔥 ASLI JADOO: Dynamic Menu List (List of objects)
  const [menuItems, setMenuItems] = useState([{ name: "", price: "" }]);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Naya Item row add karne ka function
  const handleAddMenuItem = () => {
    setMenuItems([...menuItems, { name: "", price: "" }]);
  };

  // Item row delete karne ka function
  const handleRemoveMenuItem = (index) => {
    const newMenu = menuItems.filter((_, i) => i !== index);
    setMenuItems(newMenu);
  };

  // Item ka naam ya price update karne ka function
  const handleMenuChange = (index, field, value) => {
    const newMenu = [...menuItems];
    newMenu[index][field] = value;
    setMenuItems(newMenu);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validation: Check karega ki kisi ne khali price toh nahi chhod diya
    if (menuItems.some(item => !item.name || !item.price)) {
       setMessage("Error: Saari services ka naam aur price theek se bhar bhai!");
       setLoading(false);
       return;
    }

    try {
      // Backend ko poora data bhejeinge (Shop details + array of menu items)
      await api.post("/services", {
        shopName,
        category,
        description,
        menuItems // Yeh backend mein List/Array ban kar jayega
      });
      
      setMessage("Shop aur saari services successfully publish ho gayin! 🎉");
      setShopName(""); setCategory(""); setDescription("");
      setMenuItems([{ name: "", price: "" }]); // Form reset
    } catch (error) {
      console.error("Error adding service:", error);
      setMessage("Publish nahi ho paya, kuch gadbad hai.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 relative overflow-y-auto selection:bg-blue-500">
      
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-600 rounded-full blur-[150px] opacity-20 animate-pulse"></div>
      
      <Link to="/dashboard" className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto p-8 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 shadow-2xl z-10 my-16"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2 text-blue-400">Set Up Your Shop</h2>
          <p className="text-gray-400">Add your business details and list your service pricing</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg text-sm text-center font-bold border ${message.includes('successfully') ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Business Details */}
          <div className="p-6 bg-gray-950/50 border border-gray-800 rounded-xl space-y-5">
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-800 pb-2">1. Business Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Business / Shop Name</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-gray-500" size={18} />
                  <input 
                    type="text" required value={shopName} onChange={(e) => setShopName(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:border-blue-500 transition-all outline-none"
                    placeholder="e.g. Tripathi Ji Pooja Wale"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-3 text-gray-500" size={18} />
                  <input 
                    type="text" required value={category} onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:border-blue-500 transition-all outline-none"
                    placeholder="e.g. Pandit Ji, Barber..."
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">About Your Work</label>
              <textarea 
                required value={description} onChange={(e) => setDescription(e.target.value)} rows="2"
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3 focus:border-blue-500 transition-all resize-none outline-none"
                placeholder="Briefly describe your expertise..."
              ></textarea>
            </div>
          </div>

          {/* Section 2: Menu / Pricing (DYNAMIC) */}
          <div className="p-6 bg-gray-950/50 border border-gray-800 rounded-xl">
            <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
              <h3 className="text-lg font-semibold text-white">2. Service Menu & Pricing</h3>
            </div>

            <div className="space-y-4">
              {menuItems.map((item, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      value={item.name}
                      onChange={(e) => handleMenuChange(index, "name", e.target.value)}
                      placeholder="Service Name (e.g. Shaadi, Haircut)"
                      className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>
                  <div className="w-32 relative">
                    <IndianRupee className="absolute left-3 top-3 text-gray-500" size={16} />
                    <input 
                      type="number" 
                      value={item.price}
                      onChange={(e) => handleMenuChange(index, "price", e.target.value)}
                      placeholder="Amount"
                      className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg pl-9 pr-3 py-2.5 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>
                  {/* Delete Button (Sirf tab dikhega jab 1 se zyada items hon) */}
                  {menuItems.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveMenuItem(index)}
                      className="p-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button 
              type="button" 
              onClick={handleAddMenuItem}
              className="mt-4 flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              <Plus size={16} /> Add Another Service
            </button>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : <PlusCircle size={24} />}
            Publish My Shop & Menu
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default AddService;6