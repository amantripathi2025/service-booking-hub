import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Bot, PhoneCall, Loader2, Store, Sparkles } from "lucide-react";


function CustomerChat() {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  const customerEmail = localStorage.getItem("userEmail") || "customer@test.com";
  
  const [messages, setMessages] = useState([
    { id: 1, sender: "VENDOR", text: "Hello! Aapki booking confirm ho gayi hai. Koi dikkat ho toh yahan message karein.", time: "Just now" }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiTyping]);

  // Simulate fetching real chat history (Ready for backend)
  useEffect(() => {
    const fetchChats = async () => {
      try {
        // Backend API hook ready: await api.get(`/chat/${vendorId}/${customerEmail}`)
        // Abhi ke liye hum UI ko zinda rakhne ke liye base message use kar rahe hain
      } catch (error) {
        console.error("Chat fetch error:", error);
      }
    };
    if (vendorId) fetchChats();
  }, [vendorId, customerEmail]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!newMessage.trim()) return;

    const newMsgObj = {
      id: Date.now(),
      sender: "CUSTOMER",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsgObj]);
    setNewMessage("");
    setLoading(true);

    try {
      // Backend API hook ready: await api.post('/chat/send', payload)
      // Simulating network delay
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Failed to send message:", error);
      setLoading(false);
    }
  };

  // 🔥 AI MAGIC ENGINE 🔥
  const handleAiSuggestion = (promptText) => {
    setAiTyping(true);
    // Simulate AI thinking time
    setTimeout(() => {
      setNewMessage(promptText);
      setAiTyping(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* 🔵 HEADER */}
      <header className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-blue-700 rounded-full transition">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
              <Store size={16} />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight">Service Hub Support</h1>
              <p className="text-[10px] text-blue-200 font-medium">Replies typically in minutes</p>
            </div>
          </div>
        </div>
        <button className="h-9 w-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition">
          <PhoneCall size={16} />
        </button>
      </header>

      {/* 💬 CHAT AREA */}
      <main className="flex-1 p-4 overflow-y-auto space-y-4 pb-32">
        <div className="text-center my-4">
          <span className="text-[10px] font-bold text-gray-400 bg-gray-200 px-3 py-1 rounded-full uppercase tracking-widest">
            Today
          </span>
        </div>

        {messages.map((msg) => {
          const isMe = msg.sender === "CUSTOMER";
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl shadow-sm relative ${
                isMe 
                  ? "bg-blue-600 text-white rounded-tr-sm" 
                  : "bg-white border border-gray-100 text-gray-900 rounded-tl-sm"
              }`}>
                <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                <p className={`text-[9px] mt-1 text-right font-bold ${isMe ? "text-blue-200" : "text-gray-400"}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          );
        })}

        {/* AI Typing Indicator */}
        {aiTyping && (
          <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-indigo-600 text-white p-3 rounded-2xl rounded-tr-sm shadow-sm flex items-center gap-2">
              <Sparkles size={14} className="animate-pulse text-indigo-300" />
              <span className="text-xs font-bold italic">AI is typing...</span>
            </div>
          </div>
        )}
        
        <div ref={chatEndRef} />
      </main>

      {/* 🤖 AI SUGGESTIONS CHIPS */}
      <div className="fixed bottom-[72px] left-0 w-full px-2 py-2 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent flex gap-2 overflow-x-auto scrollbar-hide z-10">
        <div className="flex px-2 gap-2">
          <button 
            onClick={() => handleAiSuggestion("Bhai, exact ETA kya hai? Kitna time lagega?")}
            className="whitespace-nowrap bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-indigo-100 transition-colors"
          >
            <Bot size={14} /> Ask ETA
          </button>
          <button 
            onClick={() => handleAiSuggestion("Main location par pohoch gaya hoon.")}
            className="whitespace-nowrap bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-indigo-100 transition-colors"
          >
            <Bot size={14} /> Reached
          </button>
          <button 
            onClick={() => handleAiSuggestion("Kya main order me ek aur service add karwa sakta hoon?")}
            className="whitespace-nowrap bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-indigo-100 transition-colors"
          >
            <Bot size={14} /> Add Service
          </button>
        </div>
      </div>

      {/* ⌨️ MESSAGE INPUT */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-3 z-20 shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
        <form onSubmit={handleSendMessage} className="max-w-md mx-auto flex items-center gap-2">
          <input 
            type="text" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..." 
            className="flex-1 bg-gray-100 border-none text-gray-900 font-medium rounded-full py-3 px-5 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
          />
          <button 
            type="submit" 
            disabled={!newMessage.trim() || loading}
            className="h-11 w-11 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center shadow-md transition-all flex-shrink-0"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-0.5" />}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CustomerChat;