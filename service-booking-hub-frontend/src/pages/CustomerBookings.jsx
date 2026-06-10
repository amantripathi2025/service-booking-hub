import { useState, useEffect } from "react";
import { ArrowLeft, Clock, CheckCircle2, MessageSquare, AlertTriangle, MapPin, CheckCircle, Circle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // Asli Spring Boot Axios instance

const TRACKING_STEPS = [
  { checkStatus: "PENDING", title: "Booking Received", desc: "Waiting for vendor confirmation." },
  { checkStatus: "ACCEPTED", title: "Professional Confirmed", desc: "Vendor has locked your schedule slot." },
  { checkStatus: "COMPLETED", title: "Service Fulfilled", desc: "Code verified. Job closed." }
];

function CustomerBookings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Active"); 
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const customerEmail = localStorage.getItem("userEmail") || "aman@example.com";

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        setLoading(true);
        let fetchedBookings = [];
        try {
          const res = await api.get(`/bookings/customer/${customerEmail}`);
          fetchedBookings = res.data;
        } catch (err) {
          console.log("Fallback log, fetching global array...");
          const res = await api.get("/bookings/all"); 
          fetchedBookings = res.data.filter(b => b.customerEmail === customerEmail);
        }
        
        fetchedBookings.sort((a, b) => b.id - a.id);
        setBookings(fetchedBookings);
      } catch (error) {
        console.error("Failed to fetch customer bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    if (customerEmail) fetchMyBookings();
  }, [customerEmail]);

  const activeBookings = bookings.filter(b => b.status !== "COMPLETED" && b.status !== "REJECTED");
  const historyBookings = bookings.filter(b => b.status === "COMPLETED" || b.status === "REJECTED");

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-bold text-gray-500 animate-pulse">
        <Loader2 className="animate-spin text-blue-600 mr-2" size={20} />
        Aman tumhare live orders database se sync ho rahe hain...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <header className="bg-blue-600 text-white p-4 shadow-md flex items-center gap-3">
        <button onClick={() => navigate("/customer-home")} className="p-1 hover:bg-blue-700 rounded-full transition">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">My Bookings</h1>
      </header>

      <div className="flex bg-white border-b border-gray-200">
        <button 
          onClick={() => setActiveTab("Active")}
          className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === "Active" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          Active Track ({activeBookings.length})
        </button>
        <button 
          onClick={() => setActiveTab("History")}
          className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === "History" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          History & Reviews ({historyBookings.length})
        </button>
      </div>

      <main className="px-5 mt-6">
        {/* TAB 1: ACTIVE LIVE TRACKING */}
        {activeTab === "Active" && (
          <div className="space-y-5">
            {activeBookings.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 p-6">
                <p className="text-gray-500 font-medium">Bhai abhi koi ongoing service active nahi hai teri.</p>
                <p className="text-xs text-gray-400 mt-1">Nayi service book karne ke liye home page par jao!</p>
              </div>
            ) : (
              activeBookings.map((booking) => (
                <div key={booking.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-4">
                  
                  {booking.delayMinutes > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-xl flex items-start gap-3 mb-4 shadow-sm">
                      <AlertTriangle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-yellow-800">Vendor is running late!</h4>
                        <p className="text-xs text-yellow-700 mt-0.5">Bhai, vendor ne high rush ki wajah se <b>{booking.delayMinutes} mins</b> ka delay dala hai dashboard se.</p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wider">#{booking.id}</span>
                      <h2 className="text-lg font-black text-gray-900 mt-2">{booking.shopName || "Service Hub Professional"}</h2>
                      <p className="text-sm text-gray-600 font-medium mt-0.5">{booking.serviceName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-gray-900">₹{booking.price}</p>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wide mt-0.5">{booking.paymentMode || "CASH"}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 font-semibold mb-5">
                    <div className="flex items-center gap-1.5"><Clock size={14} className="text-blue-500"/> {booking.bookingTime} ({booking.bookingDate})</div>
                    <div className="flex items-center gap-1.5"><MapPin size={14} className="text-blue-500"/> Active Customer Node</div>
                  </div>

                  <div className="relative pl-3 border-l-2 border-gray-100 space-y-6 my-6">
                    {TRACKING_STEPS.map((step, idx) => {
                      const isStepCompleted = booking.status === "COMPLETED" || 
                        (step.checkStatus === "PENDING") || 
                        (step.checkStatus === "ACCEPTED" && booking.status === "ACCEPTED");

                      const isStepCurrent = booking.status === step.checkStatus;

                      return (
                        <div key={idx} className="relative">
                          <div className={`absolute -left-[22px] bg-white ${isStepCompleted ? 'text-blue-600' : 'text-gray-300'}`}>
                            {isStepCompleted ? <CheckCircle size={20} className="fill-blue-50" /> : <Circle size={20} />}
                          </div>
                          <div className="pl-4">
                            <h4 className={`text-sm font-bold ${isStepCurrent ? 'text-blue-600' : isStepCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                              {step.title}
                            </h4>
                            <p className={`text-xs mt-0.5 ${isStepCurrent || isStepCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* 🔥 FIX: Tag structure fully closed here */}
                  <button 
                    onClick={() => navigate(`/chat/${booking.shopId || 1}`)} 
                    className="mt-4 w-full bg-blue-50 hover:bg-blue-100 text-blue-600 py-3 rounded-xl text-sm font-bold flex justify-center items-center gap-2 transition-all shadow-sm"
                  >
                    <MessageSquare size={18} /> Chat / Call Professional (AI Inside)
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: HISTORY & REVIEWS */}
        {activeTab === "History" && (
          <div className="space-y-4">
            {historyBookings.length === 0 ? (
              <div className="text-center py-12 text-gray-500 font-medium bg-white rounded-2xl border border-gray-100">
                Pehle li gayi services ka koi itihas nahi hai bhai.
              </div>
            ) : (
              historyBookings.map(order => (
                <div key={order.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">{order.bookingDate}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1 ${order.status === "REJECTED" ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
                      <CheckCircle2 size={12}/> {order.status}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-gray-900 text-base">{order.shopName || "Service Professional"}</h3>
                  <p className="text-sm text-gray-600 mt-0.5">{order.serviceName}</p>
                  
                  <div className="flex justify-between items-center border-t border-gray-50 pt-3 mt-3">
                    <p className="font-black text-gray-900">₹{order.price}</p>
                    {order.status === "REJECTED" ? (
                      <span className="text-xs text-gray-400 font-bold italic">Declined by Vendor</span>
                    ) : (
                      <button 
                        onClick={() => navigate(`/write-review/${order.id}`)} 
                        className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-bold transition flex items-center gap-1.5"
                      >
                        <MessageSquare size={14}/> Write Review Feedback
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default CustomerBookings;