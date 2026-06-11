import { useState, useEffect } from "react";
import { Search, MapPin, Star, Filter, Loader2, ArrowRight, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api"; 

function CustomerHome() {
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const userName = localStorage.getItem("userName") || "Aman";

  // 🚀 ENGINE: Fetch All Live Shops From Database
  useEffect(() => {
    const fetchLiveShops = async () => {
      try {
        setLoading(true);
        const res = await api.get("/services/all");
        setShops(res.data || []);
      } catch (error) {
        console.error("Failed to fetch live shops from DB:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveShops();
  }, []);

  // 🧠 SMART FILTERING: Dynamic Categories from Data
  const categories = ["All", ...new Set(shops.map(shop => shop.category).filter(Boolean))];

  // Search & Category Logic
  const filteredShops = shops.filter(shop => {
    const matchesSearch = shop.shopName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          shop.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || shop.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24">
      {/* 🔵 HERO HEADER */}
      <header className="bg-blue-600 text-white px-5 pt-12 pb-6 rounded-b-[2rem] shadow-lg relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-blue-200 text-sm font-medium">Welcome back,</p>
            <h1 className="text-2xl font-black tracking-tight">{userName}! 👋</h1>
          </div>
          <div 
            onClick={() => navigate("/customer-profile")}
            className="h-10 w-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center font-bold text-lg border border-white/30 cursor-pointer shadow-sm hover:bg-white/30 transition"
          >
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative flex items-center w-full">
          <div className="absolute left-4 text-gray-400">
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search for services or hubs..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-gray-900 rounded-2xl py-3.5 pl-12 pr-12 font-medium shadow-xl outline-none focus:ring-4 focus:ring-blue-400/30 transition-all placeholder:text-gray-400 text-sm"
          />
          <button className="absolute right-3 bg-blue-50 p-2 rounded-xl text-blue-600">
            <Filter size={18} />
          </button>
        </div>
      </header>

      <main className="px-5 mt-6 relative z-0">
        
        {/* 🟡 DYNAMIC CATEGORY SCROLL */}
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-5 px-5">
          {categories.map((cat, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm border ${
                activeCategory === cat 
                  ? "bg-gray-900 text-white border-gray-900" 
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <h2 className="text-lg font-black text-gray-900 mt-2 mb-4">Top Rated Hubs</h2>

        {/* 🟢 REAL DATABASE CARDS RENDER */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="animate-spin mb-2" size={32} />
            <p className="font-bold text-sm">Loading live database...</p>
          </div>
        ) : filteredShops.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-500 font-bold">Koi dukan nahi mili bhai!</p>
            <p className="text-xs text-gray-400 mt-1">Try searching something else.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredShops.map((shop) => (
              <div 
                key={shop.id} 
                onClick={() => navigate(`/customer-vendor-profile/${shop.id}`)}
                className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all group"
              >
                {/* Shop Cover Photo Logic */}
                <div className="h-36 w-full bg-gray-100 rounded-2xl mb-4 overflow-hidden relative">
                  {shop.shopPhotos && shop.shopPhotos.length > 0 ? (
                    <img src={shop.shopPhotos[0]} alt="Hub Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gradient-to-br from-gray-50 to-gray-100">
                      <Store size={32} className="mb-2" />
                      <span className="text-xs font-bold uppercase tracking-wider">No Cover Image</span>
                    </div>
                  )}
                  {/* Category Badge overlay */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-black text-blue-600 uppercase tracking-widest shadow-sm">
                    {shop.category || "Service"}
                  </div>
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors">{shop.shopName || "Unnamed Hub"}</h3>
                    <p className="text-xs text-gray-500 mt-1 font-medium flex items-center gap-1">
                      <MapPin size={12} className="text-gray-400"/> {shop.description?.substring(0, 40) || "Location not provided"}...
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 bg-yellow-50 text-yellow-600 px-2 py-1 rounded-lg">
                      <Star size={12} className="fill-yellow-500" />
                      <span className="text-xs font-black">4.8</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Strip */}
                <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400">
                    {shop.menuItems?.length || 0} services available
                  </span>
                  <div className="h-8 w-8 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors text-gray-400">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default CustomerHome;