import { useState, useEffect } from "react";
import { ArrowLeft, Star, MapPin, ShieldCheck, Clock, Check } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api"; // Asli Spring Boot Axios instance

function CustomerVendorProfile() {
  const navigate = useNavigate();
  const { id } = useParams(); // URL se real shop ID utha rahe hain

  const [shop, setShop] = useState(null); // Real Shop Data State
  const [loading, setLoading] = useState(true);
  const [selectedServices, setSelectedServices] = useState([]); // Cart Logic

  // 🚀 ENGINE: Fetch Single Shop Details From Spring Boot
// 🔥 ABSOLUTE FIX FOR CUSTOMER VENDOR PROFILE RED LINE
  // 🔥 ABSOLUTE FIX FOR CUSTOMER VENDOR PROFILE RED LINE
  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/services/${id}`);
        setShop(response.data);
      } catch (firstError) {
        // 🔥 FIX: firstError ko console.log ke andar daal diya taaki linter roye na
        console.log("Single fetch checking standard error, extraction matching fallback pipeline...", firstError);
        try {
          const allShopsRes = await api.get("/services/all");
          const foundShop = allShopsRes.data.find(s => String(s.id) === String(id));
          setShop(foundShop || null);
        } catch (secondError) {
          console.error("Absolute profile extraction failed:", secondError);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchShopDetails();
  }, [id]);


  // Multi-Select Cart Logic
  const toggleService = (serviceItem) => {
    const isAlreadySelected = selectedServices.find(item => item.name === serviceItem.name);
    if (isAlreadySelected) {
      setSelectedServices(selectedServices.filter(item => item.name !== serviceItem.name));
    } else {
      setSelectedServices([...selectedServices, serviceItem]);
    }
  };

  // Calculate Total Cart Price
  const totalCartPrice = selectedServices.reduce((sum, item) => sum + (item.price || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-medium text-gray-500 animate-pulse">
        Dukan ka asli data load ho raha hai...
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-gray-500 font-bold text-lg">Bhai, yeh dukan database mein nahi mili!</p>
        <button onClick={() => navigate("/customer-home")} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold">Go Back Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-32">
      
      {/* Upper Hero Image Cover */}
      <div className="h-56 bg-gradient-to-r from-blue-700 to-purple-800 p-4 relative flex flex-col justify-between text-white">
        <button 
          onClick={() => navigate("/customer-home")} 
          className="h-9 w-9 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/50 transition"
        >
          <ArrowLeft size={18} />
        </button>
        
        <div className="relative z-10">
          <span className="text-[10px] font-extrabold bg-blue-600/90 border border-blue-400 px-2 py-0.5 rounded uppercase tracking-wider">
            {shop.category || "Verified Hub"}
          </span>
          <h1 className="text-2xl font-black mt-1 tracking-tight">{shop.shopName || "Unnamed Shop"}</h1>
          <p className="text-xs text-gray-200 mt-1 flex items-center gap-1">
            <MapPin size={12} className="text-blue-400" /> {shop.description || "No address provided"}
          </p>
        </div>
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Trust & Meta Info Badge Row */}
      <div className="bg-white px-5 py-3 border-b border-gray-100 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-1.5">
          <Star size={16} className="text-yellow-500 fill-yellow-400" />
          <span className="text-sm font-bold text-gray-900">{shop.rating || "4.5"}</span>
          <span className="text-xs text-gray-400 font-medium">(Verified)</span>
        </div>
        <div className="text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
          <ShieldCheck size={14} /> Professional Match
        </div>
      </div>

      {/* Main Services Body Directory */}
      <main className="px-5 mt-6">
        <h2 className="text-lg font-extrabold text-gray-900 mb-4">Select Services</h2>
        
        {(!shop.menuItems || shop.menuItems.length === 0) ? (
          <div className="text-center py-8 bg-white border border-dashed border-gray-200 rounded-2xl">
            <p className="text-sm text-gray-400 font-medium">Is dukan par abhi koi menu items listed nahi hain.</p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {shop.menuItems.map((item, idx) => {
              const isSelected = selectedServices.find(s => s.name === item.name);
              
              return (
                <div 
                  key={idx}
                  onClick={() => toggleService(item)}
                  className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center shadow-2xl/5 ${
                    isSelected ? 'border-blue-600 ring-1 ring-blue-600 bg-blue-50/10' : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <div className="space-y-1 max-w-[75%]">
                    <h3 className="font-bold text-gray-900 text-sm">{item.name}</h3>
                    <div className="flex items-center gap-3 text-xs font-bold text-blue-600">
                      <span>₹{item.price}</span>
                      {item.estimatedTime > 0 && (
                        <span className="text-gray-400 font-medium flex items-center gap-1">
                          <Clock size={12} /> {item.estimatedTime} mins
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tick Selector Checkbox Circle */}
                  <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-200 bg-white'
                  }`}>
                    {isSelected && <Check size={14} strokeWidth={3} />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 🔥 THE REAL STICKY BOTTOM CART BAR 🔥 */}
      {selectedServices.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-40 animate-in slide-in-from-bottom">
          <div className="max-w-md mx-auto flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 font-semibold">{selectedServices.length} Service Selected</p>
              <p className="text-xl font-black text-gray-900">Total: ₹{totalCartPrice}</p>
            </div>
            
            {/* Proceed To Checkout, passing real State parameters */}
            <button 
              onClick={() => navigate(`/checkout/${shop.id}`, { state: { selectedServices, totalCartPrice } })}
              className="bg-gray-950 hover:bg-black text-white px-6 py-3.5 rounded-xl font-bold text-sm tracking-tight transition-all shadow-md"
            >
              Proceed to Book
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default CustomerVendorProfile;