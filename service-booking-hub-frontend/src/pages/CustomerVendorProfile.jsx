import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, MapPin, Clock, ShieldCheck, CheckCircle, IndianRupee, Store, Loader2 } from "lucide-react";
import api from "../api";

function CustomerVendorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedServices, setSelectedServices] = useState([]);

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/services/${id}`);
        setShop(response.data);
      } catch (firstError) {
        console.log("Single fetch failed:", firstError);
        try {
          const allShopsRes = await api.get("/services/all");
          const foundShop = allShopsRes.data.find(s => String(s.id) === String(id));
          setShop(foundShop || null);
        } catch (secondError) {
          console.error("Fallback fetch failed:", secondError);
        }
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchShopDetails();
  }, [id]);

  const toggleService = (service) => {
    if (!service || !service.name) return;
    if (selectedServices.some(s => s.name === service.name)) {
      setSelectedServices(selectedServices.filter(s => s.name !== service.name));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleProceedToCheckout = () => {
    if (selectedServices.length === 0) return;
    navigate("/customer-checkout", {
      state: {
        selectedServices: selectedServices,
        shopId: shop?.id || id,
        shopName: shop?.shopName || "Unnamed Hub"
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-blue-600">
        <Loader2 className="animate-spin mb-2" size={32} />
        <span className="font-bold text-sm">Loading Hub Profile...</span>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-5">
        <Store size={64} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-900">Hub Not Found</h2>
        <p className="text-gray-500 mb-6">Yeh dukan database mein nahi mili.</p>
        <button onClick={() => navigate(-1)} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold">Go Back</button>
      </div>
    );
  }

  const totalCartValue = selectedServices.reduce((sum, item) => sum + (Number(item?.price) || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-32">
      <div className="relative h-64 bg-gray-900">
        {(Array.isArray(shop?.shopPhotos) && shop.shopPhotos.length > 0) ? (
          <img src={shop.shopPhotos[0]} alt="Shop Cover" className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-700">
            <Store size={64} />
          </div>
        )}
        <button onClick={() => navigate(-1)} className="absolute top-5 left-5 h-10 w-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition">
          <ArrowLeft size={20} />
        </button>
        <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-gray-900 to-transparent text-white">
          <div className="flex gap-2 mb-2">
            <span className="bg-blue-600 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">{shop?.category || "Service"}</span>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck size={12} /> Verified
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">{shop?.shopName || "Service Hub"}</h1>
          <p className="text-sm font-medium text-gray-300 mt-1 flex items-center gap-1"><MapPin size={14}/> {shop?.description || "Location not provided"}</p>
        </div>
      </div>

      <main className="px-5 mt-6">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-around items-center mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
              <Star size={18} className="fill-yellow-500" />
              <span className="font-black text-lg text-gray-900">4.8</span>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Ratings</p>
          </div>
          <div className="w-px h-8 bg-gray-100"></div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
              <Clock size={18} />
              <span className="font-black text-lg text-gray-900">~30m</span>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Avg Time</p>
          </div>
        </div>

        <h2 className="text-xl font-black text-gray-900 mb-4">Select Services</h2>
        
        {(!Array.isArray(shop?.menuItems) || shop.menuItems.length === 0) ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500 font-bold">Menu is empty.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {shop.menuItems.map((item, idx) => {
              if (!item) return null;
              const isSelected = selectedServices.some(s => s.name === item.name);
              return (
                <div 
                  key={idx} 
                  onClick={() => toggleService(item)}
                  className={`bg-white p-4 rounded-2xl border-2 transition-all cursor-pointer flex gap-4 items-center ${
                    isSelected ? "border-blue-600 shadow-md" : "border-gray-100 shadow-sm hover:border-gray-300"
                  }`}
                >
                  <div className="h-16 w-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                    {(Array.isArray(item?.photos) && item.photos.length > 0) ? (
                      <img src={item.photos[0]} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-300"><Store size={24}/></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{item?.name || "Service"}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Estimated Time: {item?.estimatedTime || "15"} mins</p>
                    <p className="text-sm font-black text-blue-600 mt-1 flex items-center"><IndianRupee size={12}/>{item?.price || "0"}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isSelected ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300 text-transparent"
                    }`}>
                      <CheckCircle size={14} className={isSelected ? "block" : "hidden"} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {selectedServices.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-gray-200 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-50 animate-in slide-in-from-bottom">
          <div className="max-w-md mx-auto flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{selectedServices.length} Items Selected</p>
              <p className="text-xl font-black text-gray-900 flex items-center"><IndianRupee size={18}/>{totalCartValue}</p>
            </div>
            <button 
              onClick={handleProceedToCheckout}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all"
            >
              Checkout Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerVendorProfile;