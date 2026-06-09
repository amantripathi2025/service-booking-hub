import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Store, MapPin, Plus, Save, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import api from "../api";

function AddService() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    shopName: "",
    category: "",
    description: "",
    maxDailyBookings: 10,
  });

  const [menuItems, setMenuItems] = useState([{ name: "", price: "" }]);
  const [location, setLocation] = useState(null); // [longitude, latitude]

  // Handlers
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMenuChange = (index, field, value) => {
    const newMenu = [...menuItems];
    newMenu[index][field] = value;
    setMenuItems(newMenu);
  };

  const handleAddMenuItem = () => {
    setMenuItems([...menuItems, { name: "", price: "" }]);
  };

  const handleRemoveMenuItem = (index) => {
    setMenuItems(menuItems.filter((_, i) => i !== index));
  };

  // 🔥 Browser GeoLocation API Magic 🔥
  const fetchLocation = () => {
    if (!navigator.geolocation) {
      alert("Bhai tera browser location support nahi karta!");
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // MongoDB ko [Longitude, Latitude] format pasand hai
        setLocation([position.coords.longitude, position.coords.latitude]);
        setGeoLoading(false);
        alert("Location track ho gayi! 📍");
      },
      (error) => {
        console.error("Location Error:", error);
        alert("Location access denied ya error aaya. Please allow location!");
        setGeoLoading(false);
      }
    );
  };

  // Final Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) {
      alert("Bhai pehle 'Fetch My Shop Location' button par click karke location save kar!");
      return;
    }

    const payload = {
      ...formData,
      menuItems,
      location, // Ye gaya tera naya GeoJSON data backend mein
    };

    try {
      setLoading(true);
      await api.post("/services", payload);
      alert("Mubarak ho! Nayi dukan register ho gayi 🎉");
      navigate("/dashboard"); // Wapas dashboard pe bhej do
    } catch (error) {
      console.error("Save Error:", error);
      alert("Dukan save hone mein dikkat aayi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-12 font-sans selection:bg-blue-500">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard" className="p-2 bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors">
            <ArrowLeft size={20} className="text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2"><Store className="text-blue-500" /> Add New Shop/Service</h1>
            <p className="text-gray-400 text-sm mt-1">Apni dukan ki details aur live location enter karein.</p>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-8">
          
          {/* Basic Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold border-b border-gray-800 pb-2">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Shop Name</label>
                <input type="text" name="shopName" value={formData.shopName} onChange={handleChange} required placeholder="Tripathi Salon" className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg px-4 py-3 outline-none focus:border-blue-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Category</label>
                <input type="text" name="category" value={formData.category} onChange={handleChange} required placeholder="Salon, Plumber, etc." className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg px-4 py-3 outline-none focus:border-blue-500 transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required placeholder="Hamari dukan sabse best hai..." rows="3" className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg px-4 py-3 outline-none focus:border-blue-500 transition-all"></textarea>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Max Daily Auto-Accept Bookings</label>
              <input type="number" name="maxDailyBookings" value={formData.maxDailyBookings} onChange={handleChange} min="1" className="w-full md:w-1/2 bg-gray-950 border border-gray-700 text-white rounded-lg px-4 py-3 outline-none focus:border-blue-500 transition-all" />
            </div>
          </div>

          {/* Location Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold border-b border-gray-800 pb-2">Shop Location</h2>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <button type="button" onClick={fetchLocation} disabled={geoLoading} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all ${location ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700'}`}>
                {geoLoading ? <Loader2 className="animate-spin" size={20} /> : <MapPin size={20} />}
                {location ? "Location Saved 📍" : "Fetch My Shop Location"}
              </button>
              {location && (
                <div className="text-xs text-gray-400 font-mono bg-gray-950 p-3 rounded-lg border border-gray-800">
                  Lng: {location[0].toFixed(4)} <br/> Lat: {location[1].toFixed(4)}
                </div>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold border-b border-gray-800 pb-2">Menu & Pricing</h2>
            <div className="space-y-3">
              {menuItems.map((item, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <input type="text" value={item.name} onChange={(e) => handleMenuChange(index, "name", e.target.value)} required placeholder="Service Name (e.g. Haircut)" className="flex-1 bg-gray-950 border border-gray-700 text-white rounded-lg px-4 py-3 outline-none focus:border-blue-500" />
                  <input type="number" value={item.price} onChange={(e) => handleMenuChange(index, "price", e.target.value)} required placeholder="Price ₹" className="w-32 bg-gray-950 border border-gray-700 text-white rounded-lg px-4 py-3 outline-none focus:border-blue-500" />
                  {menuItems.length > 1 && (
                    <button type="button" onClick={() => handleRemoveMenuItem(index)} className="p-3 text-red-400 hover:bg-red-500/20 rounded-lg transition-all"><Trash2 size={20} /></button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={handleAddMenuItem} className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium mt-2"><Plus size={18} /> Add Another Service</button>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-900/20 transition-all disabled:opacity-70">
            {loading ? <Loader2 className="animate-spin" /> : <Save />}
            Register Shop
          </button>

        </form>
      </div>
    </div>
  );
}

export default AddService;