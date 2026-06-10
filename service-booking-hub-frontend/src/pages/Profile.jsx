import { useState} from "react";
import { User, Mail, Phone, Edit2, X, Loader2 } from "lucide-react";
import api from "../api";

function Profile() {
  // 1. User ka state (LocalStorage se initial data utha rahe hain)
  const [userData, setUserData] = useState({
    name: localStorage.getItem("userName") || "New User",
    email: localStorage.getItem("userEmail") || "aman@example.com", // Email backend check ke liye zaroori hai
    phone: localStorage.getItem("userPhone") || "Not Provided",
    role: localStorage.getItem("userRole") || "VENDOR",
  });

  // 2. Edit Modal (Pop-up) handle karne ke liye states
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Jab Edit button dabe, toh form mein purana data bhar do
  const openEditModal = () => {
    setEditForm({ name: userData.name, phone: userData.phone });
    setMessage("");
    setIsEditing(true);
  };

  // 3. Asli API Call jo Database mein save karega
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await api.put("/users/update", {
        email: userData.email, // Email identifier ke roop mein bhej rahe hain
        name: editForm.name,
        phone: editForm.phone,
      });

      // Agar successfully update ho gaya, toh LocalStorage aur UI dono update kar do
      const updatedUser = response.data;
      
      setUserData({
        ...userData,
        name: updatedUser.name,
        phone: updatedUser.phone,
      });

      localStorage.setItem("userName", updatedUser.name);
      localStorage.setItem("userPhone", updatedUser.phone);

      setMessage("Profile successfully updated! 🎉");
      
      // 1.5 sec baad modal band kar do
      setTimeout(() => setIsEditing(false), 1500);

    } catch (error) {
      console.error("Update failed:", error);
      setMessage("Update failed. Check your connection!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 lg:p-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-8">My Profile</h1>

        {/* Profile Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 relative overflow-hidden shadow-2xl">
          {/* Background Gradient Effect */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90"></div>
          
          <div className="relative mt-12 flex justify-between items-end">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gray-800 rounded-full border-4 border-gray-900 flex items-center justify-center text-4xl text-gray-400 shadow-lg z-10">
                <User size={40} />
              </div>
              <div className="z-10 mt-10">
                <h2 className="text-2xl font-bold text-white">{userData.name}</h2>
                {/* 🔥 THE FIX: Role ke hisaab se text change hoga 🔥 */}
                <p className="text-blue-400 font-medium text-sm mt-1">
                  {userData.role} {userData.role === "VENDOR" ? "(Service Provider)" : "(User Account)"}
                </p>
              </div>
            </div>
            
            <button 
              onClick={openEditModal}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all z-10 border border-gray-700"
            >
              <Edit2 size={16} /> Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 flex items-center gap-4">
              <div className="p-3 bg-gray-900 rounded-lg text-gray-400"><Mail size={20} /></div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Email Address</p>
                <p className="text-sm font-semibold">{userData.email}</p>
              </div>
            </div>
            
            <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 flex items-center gap-4">
              <div className="p-3 bg-gray-900 rounded-lg text-gray-400"><Phone size={20} /></div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Phone Number</p>
                <p className="text-sm font-semibold">{userData.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal (Pop-up) */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl w-full max-w-md relative shadow-2xl">
            <button onClick={() => setIsEditing(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X size={24} />
            </button>
            
            <h3 className="text-xl font-bold mb-6 text-white">Edit Profile Details</h3>
            
            {message && <div className={`mb-4 p-3 rounded-lg text-sm font-semibold text-center ${message.includes("failed") ? "bg-red-500/10 text-red-400 border border-red-500/30" : "bg-green-500/10 text-green-400 border border-green-500/30"}`}>{message}</div>}

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={editForm.name} 
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Phone Number</label>
                <input 
                  type="text" 
                  value={editForm.phone} 
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  required
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? <><Loader2 size={18} className="animate-spin"/> Saving...</> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;