import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ArrowLeft, Send, CheckCircle2, Loader2, Store } from "lucide-react";
import api from "../api";

function CustomerReview() {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const customerEmail = localStorage.getItem("userEmail") || "";

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Bhai, kam se kam 1 star toh dena padega!");
      return;
    }

    setLoading(true);
    
    // 🔥 100% REAL PAYLOAD: Converting ID and Rating strictly to Numbers for Spring Boot!
    const payload = {
      shopId: parseInt(shopId, 10), // Spring Boot expects Long/Integer, NOT String
      customerEmail: customerEmail,
      rating: parseInt(rating, 10), // Strictly Integer
      comment: comment,
      reviewDate: new Date().toISOString() // Standard format for Java LocalDateTime/Date
    };

    try {
      await api.post("/reviews/add", payload);
      setSuccess(true);
      setTimeout(() => {
        navigate("/customer-bookings");
      }, 2000);
    } catch (error) {
      console.error("FULL BACKEND ERROR:", error.response?.data || error);
      alert(`Backend Error: ${error.response?.data?.message || "Check Spring Boot terminal. Endpoint ya data type issue hai!"}`);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-5 animate-in fade-in">
        <div className="h-24 w-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce shadow-lg">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Review Submitted!</h1>
        <p className="text-gray-500 font-medium text-center max-w-xs">Thank you for your feedback. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <header className="bg-blue-600 text-white p-4 shadow-md flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1 hover:bg-blue-700 rounded-full transition">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">Rate Your Experience</h1>
      </header>

      <main className="flex-1 p-5 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 w-full flex flex-col items-center text-center">
          
          <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <Store size={32} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">How was the service?</h2>
          <p className="text-sm text-gray-500 mb-8">Your feedback helps vendors improve.</p>

          {/* Interactive Stars */}
          <div className="flex gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={40}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className={`cursor-pointer transition-all duration-200 ${
                  (hoveredRating || rating) >= star 
                    ? "fill-yellow-400 text-yellow-400 scale-110 drop-shadow-sm" 
                    : "text-gray-200 hover:text-gray-300"
                }`}
              />
            ))}
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="relative">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your experience here... (Optional)"
                rows="4"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={loading || rating === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-black text-sm shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 className="animate-spin" size={18} /> Submitting...</>
              ) : (
                <><Send size={18} className="ml-1" /> Submit Review</>
              )}
            </button>
          </form>

        </div>
      </main>
    </div>
  );
}

export default CustomerReview;