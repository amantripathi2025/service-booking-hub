import { useState } from "react";
import { ArrowLeft, Calendar, Clock, CreditCard, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import api from "../api"; // Asli Spring Boot Axios instance

// 🔥 FIX: Render cycle se bahar rakhne se hook warning bilkul khatam!
const TIME_SLOTS = ["10:00 AM", "11:30 AM", "01:00 PM", "03:30 PM", "05:00 PM", "07:00 PM"];

const generateAvailableDates = () => {
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
      dateNum: d.getDate(),
      fullDate: d.toISOString().split("T")[0], // Format: YYYY-MM-DD
    };
  });
};

function CustomerCheckout() {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const location = useLocation();

  const { selectedServices, totalCartPrice } = location.state || { selectedServices: [], totalCartPrice: 0 };
  const availableDates = generateAvailableDates();

  const [selectedDate, setSelectedDate] = useState(availableDates[0]?.fullDate || "");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [paymentMode, setPaymentMode] = useState("CASH"); 
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const customerEmail = localStorage.getItem("userEmail") || "aman@example.com";
  const customerPhone = localStorage.getItem("userPhone") || "Not Provided";
  const savedProfile = localStorage.getItem("customerProfile");
  const customerAddress = savedProfile ? JSON.parse(savedProfile).address : "Sector 14, Main Market, India";

  const handleConfirmBooking = async () => {
    if (!selectedSlot) {
      alert("Bhai, pehle appointment ka Time Slot select karo!");
      return;
    }

    setLoading(true);
    const bookingPayload = {
      shopId: String(id), // 🔥 FORCE STRING: Taaki Java backend par hamesha clean mapping ho
      customerEmail: customerEmail,
      customerPhone: customerPhone,
      serviceName: selectedServices.map(s => s.name).join(", "),
      price: Number(totalCartPrice), // Numbers checking
      bookingDate: selectedDate,
      bookingTime: selectedSlot,
      paymentMode: paymentMode,
      status: "PENDING"
    };
    try {
      await api.post("/bookings/create", bookingPayload);
      setSuccess(true);
      setTimeout(() => {
        navigate("/customer-bookings");
      }, 1500);
    } catch (error) {
      console.error("Booking Creation Failed:", error);
      alert("Booking fail ho gayi bhai! Check backend server connection.");
    } finally {
      setLoading(false);
    }
  };

  if (selectedServices.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-gray-500 font-bold text-lg">Bhai, checkout ke liye koi service select nahi ki tune!</p>
        <button onClick={() => navigate("/customer-home")} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold">Go Select Services</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-32">
      <header className="bg-blue-600 text-white p-4 shadow-md flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1 hover:bg-blue-700 rounded-full transition">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">Checkout</h1>
      </header>

      {success && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white p-8 rounded-2xl text-center max-w-sm w-full space-y-4 shadow-2xl">
            <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 animate-bounce">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-xl font-black text-gray-900">Booking Confirmed! 🎉</h2>
            <p className="text-sm text-gray-500 font-medium">Teri entry database me save ho gayi hai. Redirecting...</p>
          </div>
        </div>
      )}

      <main className="px-5 mt-6 space-y-6 max-w-md mx-auto">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <MapPin size={14} className="text-blue-500" /> Service Location
          </h3>
          <p className="text-sm font-bold text-gray-900 leading-snug">{customerAddress}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <Calendar size={14} className="text-blue-500" /> Select Date
          </h3>
          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
            {availableDates.map((d, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedDate(d.fullDate)}
                className={`flex flex-col items-center p-3 rounded-xl border min-w-[65px] transition-all ${
                  selectedDate === d.fullDate 
                    ? "bg-blue-600 border-blue-600 text-white shadow-md font-bold" 
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <span className="text-[10px] uppercase font-bold opacity-80">{d.dayName}</span>
                <span className="text-base font-extrabold mt-1">{d.dateNum}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <Clock size={14} className="text-blue-500" /> Select Time Slot
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedSlot(slot)}
                className={`py-2.5 text-xs font-bold rounded-xl border transition-all text-center ${
                  selectedSlot === slot 
                    ? "bg-blue-600 border-blue-600 text-white shadow-sm" 
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <CreditCard size={14} className="text-blue-500" /> Payment Method
          </h3>
          <div className="space-y-2">
            <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${paymentMode === "CASH" ? "border-blue-600 bg-blue-50/10" : "border-gray-100"}`}>
              <div className="flex items-center gap-3">
                <input type="radio" name="payment" checked={paymentMode === "CASH"} onChange={() => setPaymentMode("CASH")} className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-bold text-gray-900">Pay after Service (Cash/COD)</p>
                  <p className="text-[10px] text-gray-400 font-medium">Direct professional ko pay karein</p>
                </div>
              </div>
            </label>

            <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${paymentMode === "UPI" ? "border-blue-600 bg-blue-50/10" : "border-gray-100"}`}>
              <div className="flex items-center gap-3">
                <input type="radio" name="payment" checked={paymentMode === "UPI"} onChange={() => setPaymentMode("UPI")} className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-bold text-gray-900">Pay via UPI / QR Code</p>
                  <p className="text-[10px] text-gray-400 font-medium">Instant verify on service completion</p>
                </div>
              </div>
            </label>
          </div>
        </div>

        <div className="bg-gray-900 text-white p-4 rounded-2xl shadow-inner space-y-3">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Bill Details</h4>
          <div className="space-y-1.5 border-b border-gray-800 pb-3">
            {selectedServices.map((srv, i) => (
              <div key={i} className="flex justify-between text-xs text-gray-300 font-medium">
                <span>{srv.name}</span>
                <span className="font-bold">₹{srv.price}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-sm font-bold text-white">To Pay</span>
            <span className="text-xl font-black text-blue-400">₹{totalCartPrice}</span>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleConfirmBooking}
            disabled={loading}
            className="w-full bg-gray-950 hover:bg-black text-white py-4 rounded-xl font-bold text-sm tracking-tight transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <><Loader2 className="animate-spin" size={18} /> Reserving your slot...</>
            ) : (
              `Confirm Booking • ₹${totalCartPrice}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomerCheckout;