import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Clock, CreditCard, ShieldCheck, CheckCircle2, Loader2, IndianRupee, Calendar as CalendarIcon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api";

function CustomerCheckout() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const selectedServices = location.state?.selectedServices || [];
  const shopId = location.state?.shopId || "";
  const shopName = location.state?.shopName || "Service Professional";

  const customerEmail = localStorage.getItem("userEmail") || "";
  const customerPhone = localStorage.getItem("userPhone") || "";
  const savedProfileStr = localStorage.getItem("customerProfile");
  const savedProfile = savedProfileStr ? JSON.parse(savedProfileStr) : {};
  
  const realAddress = savedProfile.address || "";

  const totalAmount = selectedServices.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState("");
  
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // 🔥 REAL SLOT TRACKING STATE
  const [bookedSlotsForDate, setBookedSlotsForDate] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Default Daily Slots
  const ALL_SLOTS = ["10:00 AM", "11:30 AM", "01:00 PM", "03:30 PM", "05:00 PM", "07:00 PM"];

  useEffect(() => {
    if (selectedServices.length === 0) {
      alert("Bhai, koi service toh select kar lo!");
      navigate("/customer-home");
    }
  }, [selectedServices, navigate]);

  // 🔥 ENGINE: Fetch Booked Slots for the selected Date & Shop
  useEffect(() => {
    const fetchBookingsForDate = async () => {
      if (!shopId) return;
      try {
        setSlotsLoading(true);
        // Hum saari bookings nikalte hain is shop ki
        const res = await api.get(`/bookings/shop/${shopId}`);
        const allShopBookings = res.data || [];
        
        // Filter karte hain jo is selected date ki hain
        const bookedTimes = allShopBookings
          .filter(b => b.bookingDate && b.bookingDate.includes(selectedDate) && b.status !== "REJECTED")
          .map(b => {
            // String format assumed: "YYYY-MM-DD | HH:MM AM/PM"
            const parts = b.bookingDate.split(" | ");
            return parts.length > 1 ? parts[1].trim() : "";
          })
          .filter(Boolean); // Remove empty strings
          
        setBookedSlotsForDate(bookedTimes);
        setSelectedTime(""); // Date badalne par time reset kar do
      } catch (error) {
        console.error("Failed to fetch live slots:", error);
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchBookingsForDate();
  }, [shopId, selectedDate]);

  const handleConfirmBooking = async () => {
    if (!realAddress) {
      alert("Bhai, pehle Profile me jaakar apna asli Address save kar lo!");
      navigate("/customer-profile");
      return;
    }
    if (!selectedTime) {
      alert("Bhai, ek time slot toh choose kar lo!");
      return;
    }

    setLoading(true);
    const serviceNames = selectedServices.map(s => s.name).join(", ");

    const bookingPayload = {
      shopId: String(shopId),
      shopName: shopName,
      customerEmail: customerEmail,
      customerPhone: customerPhone,
      serviceName: serviceNames,
      price: totalAmount,
      paymentMode: paymentMethod,
      status: "PENDING",
      bookingDate: `${selectedDate} | ${selectedTime}` // Format for tracking
    };

    try {
      await api.post("/bookings/create", bookingPayload);
      setSuccess(true);
      setTimeout(() => navigate("/customer-bookings"), 2000);
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Booking fail ho gayi bhai, backend server check kar!");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-5 animate-in fade-in">
        <div className="h-24 w-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce shadow-lg">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-500 font-medium text-center max-w-xs">Tera order vendor ko bhej diya gaya hai. Ab live tracking page par chalte hain...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-32">
      <header className="bg-blue-600 text-white p-4 shadow-md flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-1 hover:bg-blue-700 rounded-full transition">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">Secure Checkout</h1>
      </header>

      <main className="p-5 space-y-6 max-w-md mx-auto">
        
        {/* REAL LOCATION CARD */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
          <h3 className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest flex items-center gap-1 mb-2">
            <MapPin size={14}/> Service Location
          </h3>
          {realAddress ? (
            <p className="text-sm font-bold text-gray-900 pr-8 leading-relaxed">
              {realAddress}
            </p>
          ) : (
            <p className="text-sm font-bold text-red-500 pr-8 leading-relaxed">
              Please update your address in Profile before booking.
            </p>
          )}
          <button onClick={() => navigate("/customer-profile")} className="text-xs text-blue-600 font-bold mt-3 underline underline-offset-2">
            Change Address
          </button>
        </div>

        {/* FULL CALENDAR DATE PICKER */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1 mb-4">
            <CalendarIcon size={14}/> Select Date
          </h3>
          <input 
            type="date" 
            min={today}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 font-bold rounded-xl p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
          />
        </div>

        {/* REAL DYNAMIC TIME SLOTS GRID */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1 mb-4">
            <Clock size={14}/> Select Time Slot
          </h3>
          {slotsLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="animate-spin text-blue-500" size={24} />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {ALL_SLOTS.map((time, idx) => {
                const isBooked = bookedSlotsForDate.includes(time);
                const isSelected = selectedTime === time;
                
                return (
                  <button 
                    key={idx}
                    disabled={isBooked}
                    onClick={() => setSelectedTime(time)}
                    className={`relative p-3 rounded-xl border-2 text-left transition-all flex flex-col items-center justify-center gap-1 ${
                      isBooked ? "bg-gray-100 border-gray-100 opacity-50 cursor-not-allowed" : 
                      isSelected ? "bg-blue-50 border-blue-600 shadow-sm" : 
                      "bg-white border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <span className={`text-sm font-bold ${isSelected ? "text-blue-700" : isBooked ? "text-gray-400" : "text-gray-900"}`}>
                      {time}
                    </span>
                    
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                      isBooked ? "text-red-600 bg-red-50" : "text-green-600 bg-green-50"
                    }`}>
                      {isBooked ? "Booked Out" : "Available"}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* PAYMENT METHOD */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1 mb-4">
            <CreditCard size={14}/> Payment Method
          </h3>
          <div className="space-y-3">
            <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "CASH" ? "border-blue-600 bg-blue-50" : "border-gray-100 hover:border-gray-200"}`}>
              <input type="radio" name="payment" checked={paymentMethod === "CASH"} onChange={() => setPaymentMethod("CASH")} className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
              <div>
                <p className="font-bold text-gray-900 text-sm">Pay after Service (Cash/COD)</p>
                <p className="text-xs text-gray-500">Direct professional ko pay karein</p>
              </div>
            </label>
            <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "UPI" ? "border-purple-600 bg-purple-50" : "border-gray-100 hover:border-gray-200"}`}>
              <input type="radio" name="payment" checked={paymentMethod === "UPI"} onChange={() => setPaymentMethod("UPI")} className="h-4 w-4 text-purple-600 focus:ring-purple-500" />
              <div>
                <p className="font-bold text-purple-900 text-sm">Pay via UPI / QR Code</p>
                <p className="text-xs text-purple-600/70">Instant verify on service completion</p>
              </div>
            </label>
          </div>
        </div>

        {/* BILL DETAILS */}
        <div className="bg-gray-900 p-5 rounded-2xl shadow-lg text-white">
          <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-4">Bill Details</h3>
          <div className="space-y-3 mb-4 border-b border-gray-800 pb-4">
            {selectedServices.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-300">{item.name}</span>
                <span className="text-sm font-bold flex items-center"><IndianRupee size={12}/>{item.price}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-base font-black">To Pay</span>
            <span className="text-xl font-black text-blue-400 flex items-center"><IndianRupee size={18}/>{totalAmount}</span>
          </div>
          <div className="mt-4 bg-gray-800/50 p-3 rounded-lg flex items-start gap-2 border border-gray-700/50">
            <ShieldCheck size={16} className="text-emerald-400 mt-0.5" />
            <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
              Safe and secure booking. Professional verification code will be generated on confirmation.
            </p>
          </div>
        </div>

      </main>

      {/* STICKY BOTTOM BUTTON */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-gray-200 z-50">
        <button 
          onClick={handleConfirmBooking}
          disabled={loading}
          className="w-full max-w-md mx-auto bg-gray-950 hover:bg-black text-white py-4 rounded-xl font-black text-sm tracking-wide shadow-2xl transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <><Loader2 className="animate-spin" size={18}/> Processing Securely...</>
          ) : (
            `Confirm Booking • ₹${totalAmount}`
          )}
        </button>
      </div>
    </div>
  );
}

export default CustomerCheckout;