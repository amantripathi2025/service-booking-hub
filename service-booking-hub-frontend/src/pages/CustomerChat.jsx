import { useState, useRef } from "react";
import { ArrowLeft, Phone, Mic, Send, Paperclip, Bot, User, Play } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

function CustomerChat() {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const { vendorId } = useParams();
  
  const [chatMode, setChatMode] = useState("VENDOR");
  const [messageInput, setMessageInput] = useState("");
  
  // Asli Mic Recorder States & Refs
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);

  // Messages State
  const [messages, setMessages] = useState([
    { id: 1, sender: "VENDOR", text: "Hello! Main 15 minute mein pohoch raha hoon.", time: "10:00 AM", type: "text" },
    { id: 2, sender: "CUSTOMER", text: "Theek hai, main wait kar raha hoon.", time: "10:02 AM", type: "text" },
  ]);

  const [aiMessages, setAiMessages] = useState([
    { id: 1, sender: "AI", text: "Hi Aman! Main ServiceHub AI Assistant hoon. Voice command ya text se kuch bhi pucho!", time: "10:00 AM" }
  ]);

  // Real Audio Playback Handler
  const playAudio = (url) => {
    if (!url) {
      console.error("Audio URL nahi mila bhai!");
      return;
    }
    console.log("Playing Audio URL:", url);
    const audio = new Audio(url);
    audio.play().catch(err => console.error("Audio playback me error aaya:", err));
  };

  // 🔥 EXACT FIX: Asli Audio Recording Logic with Codecs & Console Log Debugger
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Windows/Chrome ke liye best high-quality format compatibility check
      let options = {};
      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        options = { mimeType: "audio/webm;codecs=opus" };
      } else if (MediaRecorder.isTypeSupported("audio/ogg;codecs=opus")) {
        options = { mimeType: "audio/ogg;codecs=opus" };
      }
      
      const recorder = new MediaRecorder(stream, options);
      recorderRef.current = recorder;
      
      let chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        // Blob generate karna sahi mimetype ke sath
        const blob = new Blob(chunks, { type: options.mimeType || "audio/webm" });
        
        // 🔴 CONSOLE LOG DEBUGGER: F12 Inspect Console me iska size dikhega
        console.log("Aman Bhai, Recorded Audio Size:", blob.size, "bytes");

        if (blob.size < 200) {
          console.warn("Audio data bohot kam h, yad se mic permission check karo!");
          alert("Bhai mic sound catch nahi kar pa raha hai. Microphone permission verify karo!");
          return;
        }

        const audioUrl = URL.createObjectURL(blob); // Real voice file pointer
        
        const newAudioMessage = {
          id: Date.now(),
          sender: "CUSTOMER",
          type: "audio",
          audioUrl: audioUrl,
          duration: "Voice Note",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        if (chatMode === "VENDOR") {
          setMessages(prev => [...prev, newAudioMessage]);
        } else {
          setAiMessages(prev => [...prev, newAudioMessage]);
          // AI Voice Search Response Simulation
          setTimeout(() => {
            setAiMessages(prev => [...prev, {
              id: Date.now() + 1,
              sender: "AI",
              text: "Aman bhai, aapki voice command mil gayi hai. Main bta deta hu ki nearest top-rated salon 'Aman VIP Salon' hai!",
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
          }, 1200);
        }
      };

      recorder.start();
      setIsRecording(true);
      console.log("Recording started successfully...");
    } catch (err) {
      console.error("Mic Access Error:", err);
      alert("Bhai mic permission allow karo setting se!");
    }
  };

  const stopRecording = () => {
    if (recorderRef.current && isRecording) {
      recorderRef.current.stop();
      streamRef.current.getTracks().forEach(track => track.stop()); // Mic offline karo
      setIsRecording(false);
      console.log("Recording stopped.");
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: "CUSTOMER",
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: "text"
    };

    if (chatMode === "VENDOR") {
      setMessages([...messages, newMessage]);
    } else {
      setAiMessages([...aiMessages, newMessage]);
      setTimeout(() => {
        setAiMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: "AI",
          text: "Main aapke text queries ko smoothly handle kar sakta hoon. Kuch aur help chahiye bhai?",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1000);
    }
    setMessageInput("");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-blue-700 rounded-full transition">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold leading-tight">{chatMode === "VENDOR" ? "Aman VIP Salon" : "ServiceHub AI"}</h1>
            <p className="text-[10px] text-blue-200 font-medium">
              {chatMode === "VENDOR" ? "Professional • Online" : "Smart Assistant • Active"}
            </p>
          </div>
        </div>
        
        {chatMode === "VENDOR" && (
          <button onClick={() => alert("Secure call lag raha hai professional ko... 📞")} className="p-2 bg-blue-500 hover:bg-blue-400 rounded-full transition shadow-sm">
            <Phone size={18} className="fill-white" />
          </button>
        )}
      </header>

      {/* Switcher */}
      <div className="bg-white border-b border-gray-200 p-2 flex justify-center">
        <div className="bg-gray-100 rounded-xl p-1 flex gap-1 w-full max-w-sm">
          <button 
            type="button"
            onClick={() => setChatMode("VENDOR")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${chatMode === "VENDOR" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            <User size={16} /> Professional
          </button>
          <button 
            type="button"
            onClick={() => setChatMode("AI")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${chatMode === "AI" ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            <Bot size={16} /> AI Chatbot
          </button>
        </div>
      </div>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {(chatMode === "VENDOR" ? messages : aiMessages).map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "CUSTOMER" ? "justify-end" : "justify-start"}`}>
            
            {msg.sender === "AI" && (
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                <Bot size={16} className="text-white" />
              </div>
            )}

            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm relative ${
              msg.sender === "CUSTOMER" 
                ? "bg-blue-600 text-white rounded-tr-sm" 
                : "bg-white border border-gray-100 text-gray-800 rounded-tl-sm"
            }`}>
              
              {/* 🔥 LIVE AUDIO NOTE PLAYER ROW 🔥 */}
              {msg.type === "audio" ? (
                <div className="flex items-center gap-3 w-48">
                  <button 
                    type="button"
                    onClick={() => playAudio(msg.audioUrl)}
                    className={`p-2 rounded-full shadow-sm transition ${msg.sender === "CUSTOMER" ? "bg-blue-500 text-white hover:bg-blue-400" : "bg-blue-50 text-blue-600"}`}
                  >
                    <Play size={14} className="fill-current ml-0.5" />
                  </button>
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden relative">
                    <div className={`h-full absolute left-0 top-0 bg-current w-1/2`}></div>
                  </div>
                  <span className="text-[10px] font-extrabold whitespace-nowrap">{msg.duration}</span>
                </div>
              ) : (
                <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
              )}
              
              <span className={`text-[9px] font-bold block mt-1 text-right ${msg.sender === "CUSTOMER" ? "text-blue-200" : "text-gray-400"}`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}
      </main>

      {/* Bottom Input */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-3 pb-safe z-20">
        <form onSubmit={handleSendMessage} className="max-w-md mx-auto flex items-end gap-2">
          
          <button type="button" className="p-3 text-gray-400 hover:text-blue-600 transition flex-shrink-0">
            <Paperclip size={20} />
          </button>

          <div className="flex-1 bg-gray-100 rounded-2xl flex items-center px-4 py-1 border border-transparent focus-within:border-blue-300 focus-within:bg-white transition-all">
            <textarea 
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder={chatMode === "AI" ? "Ask AI Assistant..." : "Type a message..."}
              className="w-full bg-transparent outline-none text-sm py-2 max-h-24 resize-none"
              rows="1"
            />
          </div>

          {/* Dynamic Mic / Send Action */}
          {messageInput.trim() ? (
            <button type="submit" className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition shadow-md flex-shrink-0">
              <Send size={18} className="ml-1" />
            </button>
          ) : (
            <button 
              type="button" 
              onClick={toggleRecording}
              className={`h-12 w-12 rounded-full flex items-center justify-center transition shadow-md flex-shrink-0 ${
                isRecording 
                  ? "bg-red-500 text-white animate-pulse ring-4 ring-red-100" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Mic size={20} />
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default CustomerChat;