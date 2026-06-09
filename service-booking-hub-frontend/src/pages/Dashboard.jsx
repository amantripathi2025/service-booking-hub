import { useState, useEffect } from "react";
import { LogOut, Calendar, Wrench, User, Store, IndianRupee, Edit2, Trash2, X, Plus, QrCode, Sliders, MessageSquare, Star, Bell } from "lucide-react";
import api from "../api"; 
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ bookings: 0, active: 0, pending: 0, revenue: 0, daily: 0, weekly: 0 });
  const [myShops, setMyShops] = useState([]);
  const [myBookings, setMyBookings] = useState([]); 
  const [myReviews, setMyReviews] = useState([]);
  const [replyInputs, setReplyInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  
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
        const shopRes = await api.get("/services/all");
        const shops = shopRes.data;
        setMyShops(shops);

        let allBookings = [];
        let allReviews = []; 

        for (let shop of shops) {
          try {
            const bookingRes = await api.get(`/bookings/shop/${shop.id}`);
            allBookings = [...allBookings, ...bookingRes.data];
          } catch (bErr) {
            console.error("Booking fetch failed for shop:", shop.id, bErr);
          }

          try {
            const reviewRes = await api.get(`/reviews/shop/${shop.id}`);
            if(reviewRes.data) {
                allReviews = [...allReviews, ...reviewRes.data];
            }
          } catch (e) {
             console.error(e);
          }
        }
        
        setMyBookings(allBookings);
        setMyReviews(allReviews);

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

  // Review Handlers
  const handleReplyChange = (reviewId, text) => {
    setReplyInputs(prev => ({ ...prev, [reviewId]: text }));
  };

  const handleReplySubmit = async (reviewId) => {
    const replyText = replyInputs[reviewId];
    if (!replyText) return;
    try {
      await api.put(`/reviews/${reviewId}/reply`, replyText, {
        headers: { "Content-Type": "text/plain" }
      });
      alert("Reply sent to customer!");
      triggerRefresh(); 
    } catch (error) {
      console.error("Reply error:", error);
      alert("Reply bhejne mein dikkat aayi.");
    }
  };

  // Hub Settings Handlers (QR & Time)
  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/services/update/${settingsShop.id}`, settingsShop);
      alert("Hub configuration & UPI QR updated successfully!");
      setShowSettings(false);
      triggerRefresh(); 
    } catch (error) {
      console.error("Settings error:", error);
      alert("Configuration save nahi ho payi!");
    }
  };

  const handleQrImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettingsShop({ ...settingsShop, upiQrImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMenuTimeChange = (index, value) => {
    const newMenu = [...settingsShop.menuItems];
    newMenu[index].estimatedTime = value;
    setSettingsShop({ ...settingsShop, menuItems: newMenu });
  };

  // General Shop Handlers
  const handleLogout = () => navigate("/");

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
      
      {/* Sidebar */}
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
                onClick={() => { 
                  if(myShops.length > 0) {
                    setSettingsShop(JSON.parse(JSON.stringify(myShops[0]))); 
                    setShowSettings(true); 
                  } else {
                    alert("Bhai pehle ek dukan toh bana lo!");
                  }
                }} 
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

      {/* Main UI Body */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto relative">
        <header className="flex justify-between items-center mb-10 relative">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vendor Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Manage configurations, auto-limits, and live financial analytics.</p>
          </div>
          
          {/* 🔥 NOTIFICATION BELL SYSTEM 🔥 */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-3 bg-gray-900 border border-gray-800 rounded-full hover:bg-gray-800 transition-all relative"
            >
              <Bell size={22} className="text-gray-300" />
              {stats.pending > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-gray-950">
                  {stats.pending}
                </span>
              )}
            </button>

            {/* Dropdown Menu */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="p-4 border-b border-gray-800 bg-gray-950 flex justify-between items-center">
                  <h3 className="font-bold text-white">Notifications</h3>
                  <span className="text-xs text-gray-400 cursor-pointer hover:text-white" onClick={() => setShowNotifications(false)}>Close</span>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {myBookings.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">No new notifications</div>
                  ) : (
                    myBookings.slice(0, 5).map((booking, idx) => (
                      <div key={idx} className="p-4 border-b border-gray-800/50 hover:bg-gray-800 transition-colors cursor-pointer">
                        {booking.status === 'PENDING' || booking.status === 'WAITING' ? (
                          <div>
                            <p className="text-sm text-white"><span className="font-bold text-yellow-500">New Request</span> from {booking.customerEmail || "Guest"}</p>
                            <p className="text-xs text-gray-500 mt-1">Needs your approval.</p>
                          </div>
                        ) : booking.status === 'COMPLETED' ? (
                          <div>
                            <p className="text-sm text-white"><span className="font-bold text-emerald-500">Payment Received!</span></p>
                            <p className="text-xs text-gray-500 mt-1">{booking.customerEmail || "Guest"} paid ₹{booking.price}</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm text-white">Booking {booking.status.toLowerCase()}</p>
                            <p className="text-xs text-gray-500 mt-1">For {booking.serviceName}</p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Analytics Grid */}
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

        {/* Customer Bookings Table */}
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
                      <td className="p-4 font-medium text-gray-200">
                        <div className="flex flex-col">
                          <span>{booking.customerEmail || "Guest User"}</span>
                          {booking.customerPhone && (
                            <a 
                              href={`https://wa.me/${booking.customerPhone}`} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-xs text-green-400 hover:text-green-300 flex items-center gap-1 mt-1 w-fit bg-green-500/10 px-2 py-0.5 rounded"
                            >
                              <MessageSquare size={12} /> WhatsApp
                            </a>
                          )}
                        </div>
                      </td>
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
                            <span className="text-xs text-gray-400 flex items-center gap-1"><QrCode size={14}/> QR Ready</span>
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

        {/* Listed Shops Block */}
       {/* Listed Shops Block */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><Store className="text-blue-500"/> My Listed Shops & Menu</h3>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {myShops.map((shop) => (
              <div key={shop.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg relative group">
                
                {/* Action Buttons Top Right */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* 🔥 VIP UPDATE: Har shop ka apna unique settings trigger */}
                  <button 
                    onClick={() => { setSettingsShop(JSON.parse(JSON.stringify(shop))); setShowSettings(true); }} 
                    className="p-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                  >
                    <Sliders size={14} /> Hub Settings
                  </button>
                  <button onClick={() => handleDeleteShop(shop.id)} className="p-2 bg-gray-800 hover:bg-red-600 rounded-lg text-gray-300 hover:text-white transition-all"><Trash2 size={16} /></button>
                </div>

                <h4 className="text-xl font-bold text-white mb-2">{shop.shopName || "Unnamed Hub"}</h4>
                <p className="text-gray-400 text-sm mb-4">{shop.description}</p>
                
                {/* Services List Inside Card */}
                {shop.menuItems && shop.menuItems.length > 0 ? (
                  shop.menuItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-950 p-2.5 rounded-lg border border-gray-800 mt-2">
                      <span className="text-sm">{item.name} {item.estimatedTime && <span className="text-gray-500 text-xs ml-2">({item.estimatedTime} mins)</span>}</span>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-blue-400 flex items-center"><IndianRupee size={12}/> {item.price}</span>
                        <button onClick={() => setEditingShop({...shop})} className="text-gray-500 hover:text-blue-400 p-1 bg-gray-900 rounded"><Edit2 size={14} /></button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 italic mt-2">Is dukan mein koi menu item nahi hai.</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white"><MessageSquare className="text-blue-500"/> Customer Reviews</h3>
          <div className="space-y-4">
            {myReviews.length === 0 ? <p className="text-gray-500 py-4">No reviews yet.</p> : 
              myReviews.map(review => (
              <div key={review.id} className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-bold text-gray-200">{review.customerEmail || "Anonymous"}</span>
                  <div className="flex gap-1 items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={14} className={star <= (review.rating || 0) ? "text-yellow-500 fill-yellow-500" : "text-gray-700"} />
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

      {/* MODAL 1: EDIT SHOP MENU */}
      {editingShop && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl">
            <button onClick={() => setEditingShop(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white p-2"><X size={24} /></button>
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

      {/* MODAL 2: VIP HUB SETTINGS (ETA & QR Image) */}
      {showSettings && settingsShop && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            <button onClick={() => setShowSettings(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
            <h2 className="text-xl font-bold mb-4 border-b border-gray-800 pb-2">Hub Management</h2>
            <form onSubmit={handleUpdateSettings} className="space-y-6">
              
              {/* ETA System */}
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">Set Estimated Time (Mins) per Service</label>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                  {settingsShop.menuItems && settingsShop.menuItems.length > 0 ? (
                    settingsShop.menuItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-gray-950 p-2.5 rounded-lg border border-gray-800">
                        <span className="text-sm text-gray-300 font-medium">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            placeholder="Mins" 
                            value={item.estimatedTime || ""}
                            onChange={(e) => handleMenuTimeChange(idx, e.target.value)}
                            className="w-20 bg-gray-900 border border-gray-700 text-white rounded px-2 py-1 text-sm outline-none focus:border-blue-500 text-center"
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 bg-gray-950 rounded-xl border border-dashed border-gray-800">
                      <p className="text-xs text-gray-500">Bhai, is shop mein koi menu items nahi hain!</p>
                      <p className="text-[10px] text-blue-400 mt-1">Pehle dukan ka Menu Edit karke items add karo.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* QR Upload System */}
              <div className="border-t border-gray-800 pt-4">
                <label className="block text-sm font-bold text-gray-400 mb-2 flex items-center gap-2"><QrCode size={16}/> Upload UPI QR Code</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleQrImageUpload}
                  className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                />a
                {settingsShop.upiQrImage && (
                  <div className="mt-3 p-2 bg-gray-950 border border-gray-800 rounded-lg flex items-center gap-4">
                    <img src={settingsShop.upiQrImage} alt="QR Preview" className="h-16 w-16 object-cover rounded-md border border-gray-700" />
                    <span className="text-sm text-green-400 font-medium">QR Uploaded ✓</span>
                  </div>
                )}
                <div className="mt-4">
                  <label className="block text-xs text-gray-500 mb-1">Or Alternate UPI ID</label>
                  <input 
                    type="text" 
                    value={settingsShop.upiQrCode || ""} 
                    onChange={(e) => setSettingsShop({...settingsShop, upiQrCode: e.target.value})} 
                    placeholder="paise@upi" 
                    className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" 
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg transition-all">Save Config</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;