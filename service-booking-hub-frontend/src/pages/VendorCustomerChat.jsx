import { useState, useRef } from "react";
import { ArrowLeft, Mic, Send, Paperclip, Play, PhoneCall, X, Check } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

function VendorChat() {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const { bookingId } = useParams();

  const [messageInput, setMessageInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [incomingCall, setIncomingCall] = useState(false); // Simulated call state
  
  const recorderRef = useRef(null);
  const streamRef = useRef(null);

  // Simulated Shared State: Jo customer ne bheja tha, wo yahan dikhega
  const [messages, setMessages] = useState([
    { id: 1, sender: "VENDOR", text: "Hello! Main 15 minute mein pohoch raha hoon.", time: "10:00 AM", type: "text" },
    { id: 2, sender: "CUSTOMER", text: "Theek hai, main wait kar raha hoon.", time: "10:02 AM", type: "text" },
  ]);

  const playAudio = (url) => {
    if (!url) return;
    const audio = new Audio(url);
    audio.play().catch(err => console.error("Audio playback error:", err));
  };

  // Real Mic Recording for Vendor
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      let options = {};
      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        options = { mimeType: "audio/webm;codecs=opus" };
      }

      const recorder = new MediaRecorder(stream, options);
      recorderRef.current = recorder;
      
      let chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: options.mimeType || "audio/webm" });
        const audioUrl = URL.createObjectURL(blob);

        setMessages(prev => [...prev, {
          id: Date.now(),
          sender: "VENDOR",
          type: "audio",
          audioUrl: audioUrl,
          duration: "Voice Reply",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic error:", err);
      alert("Mic access allow karo setting se!");
    }
  };

  const stopRecording = () => {
    if (recorderRef.current && isRecording) {
      recorderRef.current.stop();
      streamRef.current.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    setMessages([...messages, {
      id: Date.now(),
      sender: "VENDOR",
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: "text"
    }]);
    setMessageInput("");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col font-sans relative">
      
      {/* Simulation Trigger Button (Call Test Karne Ke liye) */}
      <button 
        onClick={() => setIncomingCall(true)}
        className="absolute top-20 right-4 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-2 py-1 rounded-full z-50 animate-bounce"
      >
        Simulate Cust Call 📞
      </button>

      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 p-4 shadow-md flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-800 rounded-full transition">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold leading-tight">Customer: Aman</h1>
            <p className="text-[10px] text-green-400 font-medium">Active Booking: #BOK-9821</p>
          </div>
        </div>
      </header>

      {/* Chat Messages Panel */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "VENDOR" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-md relative ${
              msg.sender === "VENDOR" 
                ? "bg-purple-600 text-white rounded-tr-sm" 
                : "bg-gray-900 border border-gray-800 text-gray-200 rounded-tl-sm"
            }`}>
              
              {msg.type === "audio" ? (
                <div className="flex items-center gap-3 w-48">
                  <button 
                    type="button"
                    onClick={() => playAudio(msg.audioUrl)}
                    className={`p-2 rounded-full shadow-sm transition ${msg.sender === "VENDOR" ? "bg-purple-500 text-white" : "bg-gray-800 text-purple-400"}`}
                  >
                    <Play size={14} className="fill-current ml-0.5" />
                  </button>
                  <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden relative">
                    <div className="h-full absolute left-0 top-0 bg-purple-400 w-1/2"></div>
                  </div>
                  <span className="text-[10px] font-extrabold whitespace-nowrap">{msg.duration}</span>
                </div>
              ) : (
                <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
              )}
              
              <span className="text-[9px] font-bold block mt-1 text-right text-gray-400">
                {msg.time}
              </span>
            </div>
          </div>
        ))}
      </main>

      {/* Input Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-800 p-3 pb-safe z-20">
        <form onSubmit={handleSendMessage} className="max-w-md mx-auto flex items-end gap-2">
          
          <button type="button" className="p-3 text-gray-500 hover:text-purple-400 transition flex-shrink-0">
            <Paperclip size={20} />
          </button>

          <div className="flex-1 bg-gray-950 rounded-2xl flex items-center px-4 py-1 border border-gray-800 focus-within:border-purple-500 transition-all">
            <textarea 
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type reply to customer..."
              className="w-full bg-transparent outline-none text-sm py-2 max-h-24 Jane text-white resize-none"
              rows="1"
            />
          </div>

          {messageInput.trim() ? (
            <button type="submit" className="h-12 w-12 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 transition shadow-md flex-shrink-0">
              <Send size={18} className="ml-1" />
            </button>
          ) : (
            <button 
              type="button" 
              onClick={isRecording ? stopRecording : startRecording}
              className={`h-12 w-12 rounded-full flex items-center justify-center transition shadow-md flex-shrink-0 ${
                isRecording ? "bg-red-600 text-white animate-pulse ring-4 ring-red-950" : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              <Mic size={20} />
            </button>
          )}
        </form>
      </div>

      {/* 🔥 POINT 10: INCOMING AUDIO CALL POP-UP SCREEN 🔥 */}
      {incomingCall && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center z-50 animate-in fade-in">
          <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl max-w-sm w-full text-center space-y-6 shadow-2xl">
            <div className="mx-auto h-20 w-20 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-400 ring-4 ring-purple-500/20 animate-bounce">
              <PhoneCall size={36} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold">Incoming Call</h2>
              <p className="text-sm text-gray-400 mt-1">Customer: Aman Pati Tripathi</p>
            </div>
            <div className="flex justify-center gap-6 pt-4">
              <button 
                onClick={() => setIncomingCall(false)}
                className="h-14 w-14 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white transition shadow-lg"
              >
                <X size={24} />
              </button>
              <button 
                onClick={() => { alert("Call Connected! Connecting WebRTC audio stream..."); setIncomingCall(false); }}
                className="h-14 w-14 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center text-white transition shadow-lg ring-4 ring-green-500/20"
              >
                <Check size={24} />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default VendorChat;