// KAEL UI Dashboard - Futuristic Sci-Fi Layout
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "./ui/card";
import { motion } from "framer-motion";

// Lucide icons (simplified versions since we're not importing the actual package)
const Mic = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" x2="12" y1="19" y2="22"></line>
  </svg>
);

const Terminal = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 17 10 11 4 5"></polyline>
    <line x1="12" x2="20" y1="19" y2="19"></line>
  </svg>
);

export default function KAELDashboard() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [cpuUsage, setCpuUsage] = useState(24);
  const [latency, setLatency] = useState(32);
  const [logs, setLogs] = useState([
    '08:41 – Execute scan protocol',
    '08:40 – Mic activated',
    '08:39 – Wake command received'
  ]);

  // Function to add a new log entry with timestamp
  const addLog = (message) => {
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newLog = `${timestamp} – ${message}`;
    setLogs(prevLogs => [newLog, ...prevLogs.slice(0, 5)]);
    
    // Simulate changing system metrics
    setCpuUsage(Math.floor(Math.random() * 30) + 15);
    setLatency(Math.floor(Math.random() * 40) + 20);
  };

  // Send command to KAEL backend
  const handleCommand = async (command) => {
    setListening(false);
    addLog(`Command received: ${command}`);
    
    try {
      // Send command to backend API
      const response = await fetch('http://localhost:5000/api/command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const kaelResponse = data.response;
      
      setResponse(kaelResponse);
      addLog(`Response sent: ${kaelResponse}`);
      
      // Browser-based text-to-speech as fallback
      if ('speechSynthesis' in window) {
        // Only use browser TTS if the backend doesn't have TTS
        const speech = new SpeechSynthesisUtterance(kaelResponse);
        speech.rate = 1;
        speech.pitch = 1;
        speech.volume = 1;
        window.speechSynthesis.speak(speech);
      }
    } catch (error) {
      console.error('Error communicating with KAEL:', error);
      
      // Fallback responses if server is unavailable
      let kaelResponse = "I'm having trouble connecting to my systems. Please check the server connection.";
      setResponse(kaelResponse);
      addLog(`Connection error: ${error.message}`);
      
      // Text-to-speech fallback
      if ('speechSynthesis' in window) {
        const speech = new SpeechSynthesisUtterance(kaelResponse);
        speech.rate = 1;
        speech.pitch = 1;
        speech.volume = 1;
        window.speechSynthesis.speak(speech);
      }
    }
  };

  // Start listening for voice commands
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      setResponse("Speech recognition is not supported in this browser.");
      return;
    }

    setListening(true);
    setTranscript('');
    addLog("Listening for commands...");

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      setTranscript(transcript);
    };

    recognition.onend = () => {
      if (transcript) {
        handleCommand(transcript.toLowerCase());
      } else {
        setListening(false);
        addLog("No speech detected");
      }
    };

    recognition.start();
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white p-4 font-['Orbitron']">
      {/* Top Status Bar */}
      <div className="flex justify-between items-center border-b border-[#00C6FF]/30 pb-2 mb-4">
        <h1 className="text-xl tracking-widest text-[#00C6FF]">KAEL INTERFACE</h1>
        <div className="flex items-center gap-4 text-sm">
          <span>Status: <span className={listening ? "text-green-400" : "text-yellow-400"}>
            {listening ? "Listening" : "Ready"}
          </span></span>
          <span>Latency: {latency}ms</span>
          <span>CPU: {cpuUsage}%</span>
        </div>
      </div>
      
      <div className="grid grid-cols-5 gap-4">
        {/* Left Modules */}
        <div className="col-span-1 space-y-4">
          <Card className="bg-[#131A2E]/60 border-[#00C6FF]/20">
            <CardContent className="p-4">
              <h2 className="text-sm text-[#00C6FF] mb-2">MODULE: TB-3776-20Z</h2>
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full border-4 border-[#00C6FF] flex items-center justify-center text-xl">
                  {listening ? "🎤" : "🔄"}
                </div>
                <p className="mt-2 text-xs text-gray-400 text-center">
                  {listening 
                    ? "Voice recognition active. Listening..."
                    : "Biometric scanner processing module active."}
                </p>
                {transcript && (
                  <p className="mt-2 text-sm text-yellow-300 text-center">"{transcript}"</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#131A2E]/60 border-[#00C6FF]/20">
            <CardContent className="p-4">
              <h2 className="text-sm text-[#00C6FF] mb-2">MODULE: 4123 70 A</h2>
              <div className="text-xs text-gray-300">
                <p className="text-xs text-[#00C6FF] mb-1">KAEL Response:</p>
                <p className="text-sm text-white">{response || "Awaiting command input..."}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Central Scanner Ring */}
        <div className="col-span-3 flex items-center justify-center relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
            className="w-72 h-72 border-8 border-[#00C6FF] rounded-full flex items-center justify-center relative"
            onClick={startListening}
            style={{ cursor: 'pointer' }}
          >
            <motion.div
              animate={{ scale: listening ? [1, 1.1, 1] : [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: listening ? 0.8 : 2 }}
              className="w-36 h-36 bg-[#00C6FF]/20 rounded-full border-4 border-[#00C6FF]/50 flex items-center justify-center"
            >
              <div className="text-[#00C6FF] w-10 h-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Mic />
              </div>
            </motion.div>
          </motion.div>
          <p className="absolute bottom-0 text-[#00C6FF] text-sm">Click to activate voice command</p>
        </div>
        
        {/* Right Modules */}
        <div className="col-span-1 space-y-4">
          <Card className="bg-[#131A2E]/60 border-[#00C6FF]/20">
            <CardContent className="p-4">
              <h2 className="text-sm text-[#00C6FF] mb-2">COMMAND TIMELINE</h2>
              <ul className="text-xs text-gray-300 space-y-1">
                {logs.map((log, index) => (
                  <li key={index}>{log}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card className="bg-[#131A2E]/60 border-[#00C6FF]/20">
            <CardContent className="p-4">
              <h2 className="text-sm text-[#00C6FF] mb-2">MODULE: 8721 40 B</h2>
              <p className="text-xs text-gray-400">
                Quick Commands
              </p>
              <div className="mt-2 grid grid-cols-2 gap-1">
                {['Weather', 'Time', 'Search', 'Joke', 'Help', 'Exit'].map((cmd) => (
                  <button 
                    key={cmd}
                    className="text-xs bg-[#00C6FF]/10 hover:bg-[#00C6FF]/20 border border-[#00C6FF]/30 rounded px-2 py-1"
                    onClick={() => handleCommand(cmd.toLowerCase())}
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Console Area */}
      <div className="mt-6 border-t border-[#00C6FF]/20 pt-4 text-xs text-gray-400 flex items-center">
        <div className="w-4 h-4 mr-2 text-[#9F5FFF]">
          <Terminal />
        </div>
        <p>
          {listening 
            ? "Listening for voice input..." 
            : response 
              ? `Last response: "${response}"` 
              : "System log ready. Awaiting input..."}
        </p>
      </div>
    </div>
  );
}
}