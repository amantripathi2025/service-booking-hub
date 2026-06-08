import { useState, useEffect } from "react";
import { LogOut, Calendar, Wrench, User, Store, IndianRupee, Edit2, Trash2, X, Plus, QrCode, Sliders, MessageSquare, Star } from "lucide-react";
import api from "../api"; 
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ bookings: 0, active: 0, pending: 0, revenue: 0, daily: 0, weekly: 0 });
  const [myShops, setMyShops] = useState([]);
  const [myBookings, setMyBookings] = useState([]); 
  
  // 🔥 Bas ye do naye state add kiye Reviews ke liye 🔥
  const [myReviews, setMyReviews] = useState([]);
  const [replyInputs, setReplyInputs] = useState({});

  const [loading, setLoading] = useState(true);
  
  // Modals Configuration States
  const [editingShop, setEditingShop] = useState(null);
  const [settingsShop, setSettingsShop] = useState(null); 
  const [showSettings, setShowSettings] = useState(false);
  const [refresh, setRefresh] = useState(0); 

  const userRole = localStorage.getItem("userRole") || "VENDOR"; 
  const userEmail = localStorage.getItem("userEmail") || "";

  // Data Fetching Engine 
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        console.log("Fetching data for user:", userEmail);
        
        const shopRes = await api.get("/services/all");
        const shops = shopRes.data;
        setMyShops(shops);

        let allBookings = [];
        let allReviews = []; // Reviews ka array

        for (let shop of shops) {
          try {
            const bookingRes = await api.get(`/bookings/shop/${shop.id}`);
            allBookings = [...allBookings, ...bookingRes.data];
          } catch (bErr) {
            console.error("Booking fetch failed for shop:", shop.id, bErr);
          }

          // 🔥 Reviews Fetch Logic 🔥
          try {
            const reviewRes = await api.get(`/reviews/shop/${shop.id}`);
            if(reviewRes.data) {
                allReviews = [...allReviews, ...reviewRes.data];
            }
          } catch (e) { console.error("Review fetch error:", e); }
        }
        
        setMyBookings(allBookings);
        setMyReviews(allReviews); // Set Reviews

        const completedBookings = allBookings.filter(b => b.status === 'COMPLETED');
        const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.price || 0), 0);

        const today = new Date();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 7);

        const dailyEarnings = completedBookings
          .filter(b => new Date(b.bookingDate).toDateString() === today.toDateString())
          .reduce((sum, b) => sum + (b.price || 0), 0);

        const weeklyEarnings = completedBookings
          .filter(b => new Date(b.bookingDate) >= oneWeekAgo)
          .reduce((sum, b) => sum + (b.price || 0), 0);

        setStats({
          bookings: allBookings.length,
          active: shops.length,
          pending: allBookings.filter(b => b.status === 'WAITING' || b.status === 'PENDING').length,
          revenue: totalRevenue,
          daily: dailyEarnings,
          weekly: weeklyEarnings
        });

      } catch (error) {
        console.error("Dashboard core loop error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userEmail, refresh]);

  const triggerRefresh = () => setRefresh(prev => prev + 1);

  // 🔥 Reply Submit Handlers 🔥
  const handleReplyChange = (reviewId, text) => {
    setReplyInputs(prev => ({ ...prev, [reviewId]: text }));
  };

  
const handleReplySubmit = async (reviewId) => {
    const replyText = replyInputs[reviewId];
    if (!replyText) return;
    
    try {
      // Ek hi baar headers pass karna hai
      await api.put(`/reviews/${reviewId}/reply`, replyText, {
        headers: { "Content-Type": "text/plain" }
      });
      
      alert("Reply sent to customer!");
      triggerRefresh(); // Taaki reply screen par turant dikhe
    } catch (error) {
      console.error("Reply failed:", error);
      alert("Reply bhejne mein dikkat aayi.");
    }
  };
  // Handlers
  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/services/update/${settingsShop.id}`, settingsShop);
      alert("Automation configuration & UPI QR updated successfully!");
      setShowSettings(false);
      triggerRefresh(); 
    } catch (error) {
      console.error("Automation save logic failure:", error);
      alert("Configuration save nahi ho payi!");
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleDeleteShop = async (id) => {
    if (!window.confirm("Bhai, sach mein shop delete karni hai?")) return;
    try {
      await api.delete(`/services/delete/${id}`);
      setMyShops(myShops.filter(shop => shop.id !== id));
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/services/update/${editingShop.id}`, editingShop);
      setMyShops(myShops.map(s => s.id === editingShop.id ? res.data : s));
      setEditingShop(null); 
    } catch (error) {
      console.error("Update Error:", error);
    }
  };

  const handleMenuChange = (index, field, value) => {
    const newMenu = [...editingShop.menuItems];
    newMenu[index][field] = value;
    setEditingShop({ ...editingShop, menuItems: newMenu });
  };

  const handleAddMenuItem = () => {
    setEditingShop({ 
      ...editingShop, 
      menuItems: [...(editingShop.menuItems || []), { name: "", price: "" }] 
    });
  };

  const handleRemoveMenuItem = (index) => {
    const newMenu = editingShop.menuItems.filter((_, i) => i !== index);
    setEditingShop({ ...editingShop, menuItems: newMenu });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans flex selection:bg-blue-500 relative">
      
      {/* Sidebar - TERA ORIGINAL */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col justify-between hidden md:flex">
        <div className="space-y-8">
          <div className="text-xl font-bold tracking-tighter text-blue-500 flex items-center gap-2">
            <Wrench /> <span>ServiceHub</span>
          </div>
          
          <nav className="space-y-4">
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 bg-blue-600 rounded-lg font-medium text-white transition-all">
              <Calendar size={18} /> Dashboard
            </Link>
            {userRole === "VENDOR" && (
              <Link to="/add-service" className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white rounded-lg font-medium transition-all">
                <Wrench size={18} /> Add Service
              </Link>
            )}
            <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white rounded-lg font-medium transition-all">
              <User size={18} /> Profile
            </Link>
            {myShops.length > 0 && (
              <button 
                onClick={() => { setSettingsShop({...myShops[0]}); setShowSettings(true); }} 
                className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white rounded-lg font-medium transition-all text-left"
              >
                <Sliders size={18} /> Hub Settings
              </button>
            )}
          </nav>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-red-300 font-medium transition-all">
          <LogOut size={18} /> Log Out
        </button>
      </aside>

      {/* Main UI Body - TERA ORIGINAL */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto relative">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vendor Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Manage configurations, auto-limits, and live financial analytics.</p>
          </div>
        </header>

        {/* Analytics Grid - TERA ORIGINAL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-10">
          <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl">
            <div className="text-gray-400 text-xs font-medium">Total Bookings</div>
            <div className="text-2xl font-bold mt-1 text-blue-400">{stats.bookings}</div>
          </div>
          <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl">
            <div className="text-gray-400 text-xs font-medium">Active Hubs</div>
            <div className="text-2xl font-bold mt-1 text-purple-400">{stats.active}</div>
          </div>
          <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl">
            <div className="text-gray-400 text-xs font-medium">Waitlisted Jobs</div>
            <div className="text-2xl font-bold mt-1 text-yellow-500">{stats.pending}</div>
          </div>
          <div className="p-4 bg-gray-900 border border-emerald-900/30 bg-emerald-950/10 rounded-xl">
            <div className="text-emerald-400 text-xs font-medium">Today's Cash</div>
            <div className="text-2xl font-bold mt-1 text-emerald-400 flex items-center"><IndianRupee size={18}/>{stats.daily}</div>
          </div>
          <div className="p-4 bg-gray-900 border border-emerald-900/30 bg-emerald-950/10 rounded-xl">
            <div className="text-emerald-400 text-xs font-medium">Weekly Earnings</div>
            <div className="text-2xl font-bold mt-1 text-emerald-400 flex items-center"><IndianRupee size={18}/>{stats.weekly}</div>
          </div>
          <div className="p-4 bg-gray-900 border border-blue-900/30 bg-blue-950/10 rounded-xl">
            <div className="text-blue-400 text-xs font-medium">Total Revenue</div>
            <div className="text-2xl font-bold mt-1 text-blue-400 flex items-center"><IndianRupee size={18}/>{stats.revenue}</div>
          </div>
        </div>

        {/* Customer Bookings Table - TERA ORIGINAL */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><Calendar className="text-blue-500"/> Recent Customer Bookings</h3>
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading bookings...</div>
            ) : myBookings.length === 0 ? (
              <div className="p-8 text-center text-gray-500">Abhi tak koi booking nahi aayi hai.</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-950 border-b border-gray-800 text-gray-400 text-sm uppercase tracking-wider">
                    <th className="p-4 font-medium">Customer</th>
                    <th className="p-4 font-medium">Service</th>
                    <th className="p-4 font-medium">Price</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Actions / QR Automation</th>
                  </tr>
                </thead>
                <tbody>
                  {myBookings.map((booking, idx) => (
                    <tr key={idx} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                      <td className="p-4 font-medium text-gray-200">{booking.customerEmail || "Guest User"}</td>
                      <td className="p-4 text-gray-300">{booking.serviceName || "Full Package"}</td>
                      <td className="p-4 font-bold text-blue-400 flex items-center mt-1"><IndianRupee size={14}/>{booking.price}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                          booking.status === 'ACCEPTED' ? 'bg-green-500/10 text-green-400' :
                          booking.status === 'COMPLETED' ? 'bg-blue-500/10 text-blue-400' :
                          booking.status === 'REJECTED' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-4 flex gap-4 items-center">
                        {(booking.status === 'PENDING' || booking.status === 'WAITING') && (
                          <div className="flex gap-2">
                            <button onClick={async () => { await api.put(`/bookings/${booking.id}/accept`); triggerRefresh(); }} className="px-3 py-1 bg-green-600 hover:bg-green-700 text-xs font-bold rounded">Accept</button>
                            <button onClick={async () => { if(window.confirm("Reject karna hai?")) { await api.put(`/bookings/${booking.id}/reject`); triggerRefresh(); } }} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-xs font-bold rounded">Reject</button>
                          </div>
                        )}
                        {booking.status === 'ACCEPTED' && (
                          <div className="flex items-center gap-3">
                            <button onClick={async () => { await api.put(`/bookings/${booking.id}/complete`); triggerRefresh(); }} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-xs font-bold rounded">Mark Complete</button>
                            <span className="text-xs text-gray-400 flex items-center gap-1"><QrCode size={14}/> QR Sent to Customer</span>
                          </div>
                        )}
                        {booking.status === 'COMPLETED' && (
                          <span className="text-xs text-emerald-400">Paid & Resolved</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Listed Shops Block - TERA ORIGINAL */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><Store className="text-blue-500"/> My Listed Shops & Menu</h3>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {myShops.map((shop) => (
              <div key={shop.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg relative group">
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleDeleteShop(shop.id)} className="p-2 bg-gray-800 hover:bg-red-600 rounded-lg text-gray-300 hover:text-white"><Trash2 size={16} /></button>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{shop.shopName || "Unnamed Hub"}</h4>
                <p className="text-gray-400 text-sm mb-4">{shop.description}</p>
                {shop.menuItems?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-950 p-2.5 rounded-lg border border-gray-800 mt-2">
                    <span className="text-sm">{item.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-blue-400 flex items-center"><IndianRupee size={12}/> {item.price}</span>
                      <button onClick={() => setEditingShop({...shop})} className="text-gray-500 hover:text-blue-400 p-1 bg-gray-900 rounded"><Edit2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 🔥 WORKING REVIEWS SECTION 🔥 - TERA CSS, NAYA DYNAMIC STAR LOGIC */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white"><MessageSquare className="text-blue-500"/> Customer Reviews</h3>
          <div className="space-y-4">
            {myReviews.length === 0 ? <p className="text-gray-500 py-4">No reviews yet.</p> : 
              myReviews.map(review => (
              <div key={review.id} className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-bold text-gray-200">{review.customerEmail || "Anonymous"}</span>
                  
                  {/* DYNAMIC 5-STAR SYSTEM */}
                  <div className="flex gap-1 items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={14} 
                        className={star <= (review.rating || 0) ? "text-yellow-500 fill-yellow-500" : "text-gray-700"} 
                      />
                    ))}
                    <span className="text-xs text-gray-400 ml-2 font-medium">({review.rating || 0}/5)</span>
                  </div>

                </div>
                <p className="text-sm italic text-gray-300">"{review.comment || "No comment provided"}"</p>
                
                {review.vendorReply ? (
                  <div className="mt-3 border-l-2 border-blue-500 pl-3">
                    <span className="text-xs font-bold text-blue-400 uppercase">Your Reply:</span>
                    <p className="text-sm text-gray-400">{review.vendorReply}</p>
                  </div>
                ) : (
                  <div className="mt-4 flex gap-2">
                    <input 
                      type="text" 
                      value={replyInputs[review.id] || ""}
                      onChange={(e) => handleReplyChange(review.id, e.target.value)}
                      placeholder="Reply to customer..." 
                      className="bg-gray-950 border border-gray-700 px-3 py-1 rounded w-full text-sm outline-none focus:border-blue-500" 
                    />
                    <button onClick={() => handleReplySubmit(review.id)} className="bg-blue-600 px-4 py-1 rounded text-sm font-bold">Reply</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* MODAL 1: EDIT SHOP MENU - TERA ORIGINAL */}
      {editingShop && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl">
            
            <button onClick={() => setEditingShop(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white p-2">
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-800 pb-4">Edit Shop Details</h2>
            
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Shop Name</label>
                  <input type="text" value={editingShop.shopName} onChange={(e) => setEditingShop({...editingShop, shopName: e.target.value})} className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:border-blue-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Category</label>
                  <input type="text" value={editingShop.category} onChange={(e) => setEditingShop({...editingShop, category: e.target.value})} className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:border-blue-500 outline-none" required />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea value={editingShop.description} onChange={(e) => setEditingShop({...editingShop, description: e.target.value})} className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg p-3 focus:border-blue-500 outline-none" rows="2" required />
              </div>

              <div className="border-t border-gray-800 pt-4">
                <h3 className="text-lg font-semibold mb-4 text-white">Menu & Pricing</h3>
                <div className="space-y-3">
                  {editingShop.menuItems?.map((item, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input type="text" value={item.name} onChange={(e) => handleMenuChange(index, "name", e.target.value)} placeholder="Service Name" className="flex-1 bg-gray-950 border border-gray-700 text-white rounded-lg px-3 py-2 outline-none" required />
                      <input type="number" value={item.price} onChange={(e) => handleMenuChange(index, "price", e.target.value)} placeholder="Price" className="w-24 bg-gray-950 border border-gray-700 text-white rounded-lg px-3 py-2 outline-none" required />
                      <button type="button" onClick={() => handleRemoveMenuItem(index)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={18} /></button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={handleAddMenuItem} className="mt-4 flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-medium"><Plus size={16} /> Add More Service</button>
              </div>

              <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg transition-all">Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: HUB SETTINGS (Automation & QR) - TERA ORIGINAL */}
      {showSettings && settingsShop && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            <button onClick={() => setShowSettings(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
            <h2 className="text-xl font-bold mb-4 border-b border-gray-800 pb-2">Hub Settings & Automation</h2>
            
            <form onSubmit={handleUpdateSettings} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Daily Auto-Accept Booking Limit</label>
                <input 
                  type="number" 
                  value={settingsShop.maxDailyBookings || 5} 
                  onChange={(e) => setSettingsShop({...settingsShop, maxDailyBookings: parseInt(e.target.value) || 0})} 
                  className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg px-3 py-2 outline-none focus:border-blue-500" 
                />
                <span className="text-xs text-gray-500">Is limit tak bookings auto-accept hongi, baaki waiting mein jayengi.</span>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">UPI QR Code Data / Link</label>
                <input 
                  type="text" 
                  value={settingsShop.upiQrCode || ""} 
                  onChange={(e) => setSettingsShop({...settingsShop, upiQrCode: e.target.value})} 
                  placeholder="paise@upi ya image URL" 
                  className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg px-3 py-2 outline-none focus:border-blue-500" 
                />
                <span className="text-xs text-gray-500">Booking Confirm hone par customer ko ye QR dikhega.</span>
              </div>
              <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold">Save Controls</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;