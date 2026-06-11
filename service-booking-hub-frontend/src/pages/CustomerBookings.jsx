import { useState, useEffect } from "react";
import { ArrowLeft, MessageSquare, Loader2, QrCode, X, Clock, IndianRupee } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function CustomerBookings() {
  const navigate = useNavigate();
  const customerEmail = localStorage.getItem("userEmail") || "";
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrShopData, setQrShopData] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        setLoading(true);
        const res = await api.get("/bookings/all");
        const allData = res.data || [];
        let myData = allData.filter(b => b.customerEmail?.toLowerCase() === customerEmail.toLowerCase());
        if (myData.length === 0 && allData.length > 0) myData = allData;
        myData.sort((a, b) => b.id - a.id);
        setBookings(myData);
      } catch (error) {
        console.error("Tracker fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyBookings();
  }, [customerEmail]);

  const activeBookings = bookings.filter(b => ["PENDING", "WAITING", "ACCEPTED"].includes((b.status || "").toUpperCase()));
  const historyBookings = bookings.filter(b => ["COMPLETED", "REJECTED"].includes((b.status || "").toUpperCase()));

  const handleShowQr = async (shopId) => {
    setQrModalOpen(true);
    setQrLoading(true);
    try {
      const qrRes = await api.get(`/services/${shopId}`);
      setQrShopData(qrRes.data);
    } catch (qrErr) {
      console.error("QR Fetch failed:", qrErr);
    } finally {
      setQrLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24">
      <header className="bg-blue-600 text-white p-4 shadow-md flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate("/customer-home")} className="p-1 hover:bg-blue-700 rounded-full transition"><ArrowLeft size={20} /></button>
        <h1 className="text-xl font-bold">My Live Tracker</h1>
      </header>

      <main className="p-5 max-w-md mx-auto space-y-8">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
        ) : (
          <>
            {/* 🟢 LIVE TRACKING SECTION */}
            <section>
              <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                <div className="h-2 w-2 bg-red-500 rounded-full animate-ping"></div> Live Tracking
              </h2>

              {activeBookings.length === 0 ? (
                <p className="text-center text-gray-400 py-10 bg-white rounded-2xl border border-dashed">No active orders found.</p>
              ) : (
                <div className="space-y-6">
                  {activeBookings.map((booking, idx) => {
                    const step = (booking.status || "").toUpperCase() === "ACCEPTED" ? 2 : 1;
                    return (
                      <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className={`p-4 text-white ${step === 2 ? 'bg-emerald-600' : 'bg-blue-600'}`}>
                          <h3 className="text-lg font-black">{booking.shopName || "Service Hub"}</h3>
                          <p className="text-xs font-medium opacity-80">{booking.serviceName}</p>
                        </div>
                        <div className="p-5">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-bold text-gray-400 flex items-center gap-1"><Clock size={14}/> Queue ETA</span>
                            <span className="text-xl font-black text-gray-900">{30 + (booking.delayMinutes || 0)} Mins</span>
                          </div>
                          <div className="flex gap-3">
                            <button onClick={() => navigate(`/chat/${booking.shopId}`)} className="flex-1 bg-blue-50 text-blue-600 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"><MessageSquare size={16} /> Chat</button>
                            {step === 2 && (
                              <button onClick={() => handleShowQr(booking.shopId)} className="flex-1 bg-gray-950 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"><QrCode size={16} /> Show QR</button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* ⚪ HISTORY SECTION (Wapas add kar diya jisse error na aaye) */}
            <section className="pt-6 border-t border-gray-200">
              <h2 className="text-lg font-black text-gray-900 mb-4">Past History</h2>
              
              {historyBookings.length === 0 ? (
                <p className="text-gray-500 text-sm text-center">Koi purani booking nahi hai.</p>
              ) : (
                <div className="space-y-4">
                  {historyBookings.map((booking, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-gray-900">{booking.shopName || "Service Hub"}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{booking.serviceName}</p>
                        <span className={`inline-block mt-2 text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          (booking.status || "").toUpperCase() === "COMPLETED" ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-600"
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-gray-900 flex items-center justify-end"><IndianRupee size={12}/>{booking.price}</p>
                        {(booking.status || "").toUpperCase() === "COMPLETED" && (
                          <button 
                            onClick={() => navigate(`/customer-review/${booking.shopId}`)}
                            className="text-xs font-bold text-blue-600 underline underline-offset-2 mt-2 inline-block"
                          >
                            Rate Work
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* QR MODAL */}
      {qrModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[999] p-6 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-8 relative flex flex-col items-center shadow-2xl">
            <button onClick={() => setQrModalOpen(false)} className="absolute top-4 right-4 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-950 hover:bg-gray-200 transition-all"><X size={20} /></button>
            <h3 className="text-xl font-black text-gray-900 mb-6">Vendor QR Payment</h3>
            <div className="h-56 w-56 bg-gray-50 rounded-2xl border-4 border-gray-100 mb-6 flex items-center justify-center overflow-hidden p-2">
              {qrLoading ? <Loader2 className="animate-spin text-blue-600" /> : 
               qrShopData?.upiQrImage ? <img src={qrShopData.upiQrImage} alt="QR" className="h-full w-full object-contain" /> : 
               <div className="text-center text-gray-400"><QrCode size={40} className="mx-auto mb-2 opacity-30"/><p className="text-[10px] font-bold">QR NOT UPLOADED BY VENDOR</p></div>
              }
            </div>
            <div className="w-full bg-blue-50 p-4 rounded-2xl text-center border border-blue-100">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Payment Amount</p>
              <p className="text-2xl font-black text-blue-700 flex items-center justify-center"><IndianRupee size={20}/> {qrShopData?.price || "Pending"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerBookings;