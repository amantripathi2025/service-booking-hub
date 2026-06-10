import { useState } from "react";
import { ArrowLeft, Star, Camera, X, Send, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

function CustomerReview() {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const { id } = useParams(); // URL se booking ID aayegi (e.g., BOK-6511)
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Vendor Name API se aayega, abhi hardcode kar rahe hain display ke liye
  const vendorName = "Urban Cleaners"; 

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (indexToRemove) => {
    setPhotos(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Bhai, kam se kam 1 star toh de do rating mein!");
      return;
    }

    setLoading(true);
    
    // Yahan Spring Boot ki API hit hogi: POST /reviews/add
    setTimeout(() => {
      setLoading(false);
      alert("Review successfully posted! Vendor ke dashboard par update ho gaya.");
      navigate("/customer-bookings");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1 hover:bg-blue-700 rounded-full transition">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">Write a Review</h1>
      </header>

      <main className="max-w-md mx-auto mt-6 px-5">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">How was your experience?</h2>
            <p className="text-sm text-gray-500 mt-1">Rate your service with <span className="font-bold text-blue-600">{vendorName}</span></p>
          </div>

          <form onSubmit={handleSubmitReview} className="space-y-6">
            
            {/* 1-5 Star Interactive Rating System */}
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star 
                    size={36} 
                    className={`transition-colors ${
                      star <= (hoverRating || rating) 
                        ? "fill-yellow-400 text-yellow-400" 
                        : "fill-gray-100 text-gray-300"
                    }`} 
                  />
                </button>
              ))}
            </div>

            {/* Text Review Box */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Share details of your experience</label>
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="The service was excellent, professional was on time..." 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                rows="4"
              />
            </div>

            {/* Multi-Photo Upload System */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Add Photos (Optional)</label>
              
              <div className="flex flex-wrap gap-3">
                {/* Upload Button */}
                <label className="h-20 w-20 flex flex-col items-center justify-center bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl text-blue-600 cursor-pointer hover:bg-blue-100 transition">
                  <Camera size={24} />
                  <span className="text-[10px] font-bold mt-1">Add Photo</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </label>

                {/* Image Previews */}
                {photos.map((src, idx) => (
                  <div key={idx} className="relative h-20 w-20 rounded-xl overflow-hidden border border-gray-200 group">
                    <img src={src} alt="Review upload" className="h-full w-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => removePhoto(idx)}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 flex justify-center items-center gap-2 transition-all mt-4"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              {loading ? "Posting Review..." : "Submit Review"}
            </button>

          </form>
        </div>
      </main>
    </div>
  );
}

export default CustomerReview;