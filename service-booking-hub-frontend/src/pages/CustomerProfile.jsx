import { useState } from "react";
import { User, Phone, Mail, MapPin, Camera, Save, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CustomerProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState("");

  // 🔥 THE ULTIMATE FIX: Linter ki bolti band! 
  // Humne useEffect hata kar localStorage ko seedha state ke andar load kar diya.
  const [profileData, setProfileData] = useState(() => {
    const savedProfile = localStorage.getItem("customerProfile");
    if (savedProfile) {
      try {
        return JSON.parse(savedProfile);
      } catch (err) {
        console.error("Local storage error:", err);
      }
    }
    return {
      name: "",
      email: localStorage.getItem("userEmail") || "",
      phone: "",
      gender: "",
      profilePic: null,
      address: "",
      latitude: null,
      longitude: null
    };
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Live Location Tracker Function
  const detectLocation = () => {
    setLocationStatus("Locating...");
    if (!navigator.geolocation) {
      setLocationStatus("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setProfileData(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          address: "Live Location Tracked ✓" 
        }));
        setLocationStatus("Location found!");
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationStatus("Please allow location access in your browser.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      localStorage.setItem("customerProfile", JSON.stringify(profileData));
      setLoading(false);
      alert("Profile and Location saved successfully!");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-10">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md flex items-center gap-3">
        <button type="button" onClick={() => navigate(-1)} className="p-1 hover:bg-blue-700 rounded-full transition">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">My Profile</h1>
      </header>

      <main className="max-w-md mx-auto mt-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleSaveProfile} className="space-y-6">
          
          {/* Profile Photo Element */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-gray-200 border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
                {profileData.profilePic ? (
                  <img src={profileData.profilePic} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <User size={40} className="text-gray-400" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white shadow-lg cursor-pointer hover:bg-blue-700 transition">
                <Camera size={14} />
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2">Upload Profile Photo</p>
          </div>

          {/* Core Profile Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Full Name</label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <User size={18} className="text-gray-400 mr-2" />
                <input type="text" name="name" value={profileData.name} onChange={handleInputChange} placeholder="Enter your name" className="bg-transparent w-full outline-none text-sm" required />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email Address</label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                <Mail size={18} className="text-gray-400 mr-2" />
                <input type="email" name="email" value={profileData.email} disabled className="bg-transparent w-full outline-none text-sm text-gray-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Mobile Number</label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Phone size={18} className="text-gray-400 mr-2" />
                <input type="tel" name="phone" value={profileData.phone} onChange={handleInputChange} placeholder="+91 XXXXX XXXXX" className="bg-transparent w-full outline-none text-sm" required />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Gender (Optional)</label>
              <select name="gender" value={profileData.gender} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* GPS Detection UI Area */}
          <div className="pt-4 border-t border-gray-100">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Address & Location</label>
            
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-blue-900 flex items-center gap-1">
                  <MapPin size={16} /> GPS Detection
                </span>
                <button type="button" onClick={detectLocation} className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-medium transition-all shadow-sm">
                  Detect Now
                </button>
              </div>
              
              {locationStatus && (
                <p className={`text-xs mt-2 ${locationStatus.includes("Error") || locationStatus.includes("Please allow") ? "text-red-500" : "text-emerald-600 font-medium"}`}>
                  {locationStatus}
                </p>
              )}

              {profileData.latitude && profileData.longitude && (
                <div className="mt-3 bg-white p-2 rounded border border-blue-100 text-[10px] text-gray-500 font-mono">
                  Lat: {profileData.latitude.toFixed(6)} <br />
                  Lng: {profileData.longitude.toFixed(6)}
                </div>
              )}
            </div>
          </div>

          {/* Submission Button */}
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 flex justify-center items-center gap-2 transition-all mt-4">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {loading ? "Saving Profile..." : "Save & Continue"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default CustomerProfile;