import { useState, useEffect, useMemo } from "react";
import { Search, MapPin, Star, Navigation, SlidersHorizontal, User } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api"; // Asli Spring Boot Axios instance

// Do GPS locations ke beech ka distance nikalne ke liye formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return "N/A";
  const p = 0.017453292519943295; 
  const c = Math.cos;
  const a = 0.5 - c((lat2 - lat1) * p) / 2 + c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p)) / 2;
  return (12742 * Math.asin(Math.sqrt(a))).toFixed(1); 
};

function CustomerHome() {
  const [shops, setShops] = useState([]); // Real Backend Shops State
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Nearest");

  // LocalStorage se customer location profile nikalna
  const [profile] = useState(() => {
    const saved = localStorage.getItem("customerProfile");
    return saved ? JSON.parse(saved) : null;
  });

  // 🚀 ENGINE 1: Fetch Real Shops From Spring Boot
  useEffect(() => {
    const fetchRealShops = async () => {
      try {
        setLoading(true);
        const response = await api.get("/services/all"); // Endpoint connected
        setShops(response.data || []);
      } catch (error) {
        console.error("Failed to fetch shops from Spring Boot:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRealShops();
  }, []);

  // 🚀 ENGINE 2: DYNAMIC CATEGORIES GENERATION (No Hardcoding)
  const categories = useMemo(() => {
    const extractedCategories = shops
      .map((shop) => shop.category)
      .filter((cat) => cat && cat.trim() !== ""); // Khali fields clear kiye
    
    return ["All", ...Array.from(new Set(extractedCategories))]; // Duplicates filtered
  }, [shops]);

  // 🚀 ENGINE 3: Search, Filter, Sort & GPS Pipeline
  const filteredAndSortedShops = useMemo(() => {
    let result = shops.map(shop => {
      const prices = shop.menuItems?.map(item => item.price) || [];
      const basePrice = prices.length > 0 ? Math.min(...prices) : 0;

      return {
        ...shop,
        basePrice: basePrice,
        lat: shop.latitude || 28.7041, 
        lng: shop.longitude || 77.1025,
        distance: profile?.latitude ? parseFloat(calculateDistance(profile.latitude, profile.longitude, shop.latitude || 28.7041, shop.longitude || 77.1025)) : 999
      };
    });

    // Category Filtering
    if (activeCategory !== "All") {
      result = result.filter(shop => shop.category?.toLowerCase() === activeCategory.toLowerCase());
    }

    // Search Filtering
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(shop => 
        (shop.shopName && shop.shopName.toLowerCase().includes(q)) || 
        (shop.category && shop.category.toLowerCase().includes(q))
      );
    }

    // Sorting Logic
    if (sortBy === "Nearest") {
      result.sort((a, b) => a.distance - b.distance);
    } else if (sortBy === "Low Price") {
      result.sort((a, b) => a.basePrice - b.basePrice); // Fixed Price Sorting
    } else if (sortBy === "Ratings") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [shops, searchQuery, activeCategory, sortBy, profile]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      
      {/* Header Panel */}
      <div className="bg-blue-600 text-white p-5 rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">Current Location</p>
            <div className="flex items-center gap-1.5 font-bold">
              <Navigation size={16} />
              <span className="truncate max-w-[200px]">
                {profile?.address ? profile.address : "Location not set"}
              </span>
            </div>
          </div>
          <Link to="/customer-account" className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center border border-white/30 backdrop-blur-sm overflow-hidden">
            <User size={20} className="text-white" />
          </Link>
        </div>

        {/* Search Input */}
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search for services or shops..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-gray-900 rounded-xl py-3.5 pl-12 pr-4 shadow-sm outline-none focus:ring-2 focus:ring-blue-300 transition-all font-medium"
          />
          <Search size={20} className="absolute left-4 top-3.5 text-gray-400" />
        </div>
      </div>

      <main className="px-5 mt-6 space-y-8">
        
        {/* Dynamic Categories Scrollbar */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Categories</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button 
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-sm border ${
                  activeCategory === cat ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Services Nearby</h2>
          <div className="relative flex items-center bg-white border border-gray-200 rounded-lg px-2 shadow-sm">
            <SlidersHorizontal size={14} className="text-gray-500 mr-1" />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent py-1.5 text-xs font-bold text-gray-700 outline-none cursor-pointer"
            >
              <option value="Nearest">Nearest First</option>
              <option value="Ratings">Top Rated</option>
              <option value="Low Price">Price: Low to High</option>
            </select>
          </div>
        </div>

        {/* Active Shops Renderer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
            <div className="col-span-full text-center py-10 text-gray-500 font-medium animate-pulse">Spring Boot se data aa raha hai...</div>
          ) : filteredAndSortedShops.length === 0 ? (
            <div className="col-span-full text-center py-10 bg-white rounded-2xl border border-gray-200 border-dashed">
              <p className="text-gray-500 font-medium">Koi real dukan nahi mili database mein.</p>
            </div>
          ) : (
            filteredAndSortedShops.map(shop => (
              <Link to={`/vendor-profile/${shop.id}`} key={shop.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group block">
                <div className="h-40 w-full overflow-hidden relative bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-sm font-bold">{shop.category || "Service Hub"}</span>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <Star size={12} className="fill-yellow-400 text-yellow-500" />
                    <span className="text-xs font-bold text-gray-900">{shop.rating || "4.5"}</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg leading-tight">{shop.shopName || "Unnamed Hub"}</h3>
                      <p className="text-xs text-blue-600 font-semibold">{shop.category || "General"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Starting at</p>
                      <p className="font-bold text-gray-900">₹{shop.basePrice}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 w-fit px-2 py-1 rounded-md border border-gray-100">
                    <MapPin size={12} className="text-blue-500" />
                    {shop.distance === 999 ? "Turn on GPS to see distance" : `${shop.distance} km away`}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default CustomerHome;