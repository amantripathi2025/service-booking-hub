import { Home, CalendarClock, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function CustomerBottomNav() {
  const location = useLocation();

  // Yeh check karta hai ki abhi hum kis page par hain, taaki us icon ko blue kar sake
  const isActive = (path) => location.pathname === path;

  // Agar user checkout ya review page par hai, toh bottom nav hide kar do (clean UI ke liye)
 // Sirf in 3 pages par Bottom Nav dikhega, baaki poore app mein GAYAB rahega!
  const allowedPaths = ['/customer-home', '/customer-bookings', '/customer-account'];
  if (!allowedPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-40">
      <div className="flex justify-around items-center px-2 py-3">
        
        {/* Home Button */}
        <Link 
          to="/customer-home" 
          className={`flex flex-col items-center gap-1 w-16 transition-all ${isActive('/customer-home') ? "text-blue-600 scale-110" : "text-gray-400 hover:text-gray-600"}`}
        >
          <Home size={24} className={isActive('/customer-home') ? "fill-blue-100" : ""} />
          <span className="text-[10px] font-bold">Home</span>
        </Link>

        {/* Bookings Button */}
        <Link 
          to="/customer-bookings" 
          className={`flex flex-col items-center gap-1 w-16 transition-all ${isActive('/customer-bookings') ? "text-blue-600 scale-110" : "text-gray-400 hover:text-gray-600"}`}
        >
          <CalendarClock size={24} className={isActive('/customer-bookings') ? "fill-blue-100" : ""} />
          <span className="text-[10px] font-bold">Bookings</span>
        </Link>

        {/* Account Button */}
        <Link 
          to="/customer-account" 
          className={`flex flex-col items-center gap-1 w-16 transition-all ${isActive('/customer-account') ? "text-blue-600 scale-110" : "text-gray-400 hover:text-gray-600"}`}
        >
          <User size={24} className={isActive('/customer-account') ? "fill-blue-100" : ""} />
          <span className="text-[10px] font-bold">Account</span>
        </Link>

      </div>
    </div>
  );
}

export default CustomerBottomNav;