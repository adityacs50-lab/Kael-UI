// KAEL UI Dashboard - Futuristic Sci-Fi Layout
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "./ui/card";
import { motion } from "framer-motion";

// Lucide icons (simplified versions since we're not importing the actual package)
const MicIcon = () => (
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

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

export default function KAELDashboard() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [cpuUsage, setCpuUsage] = useState(24);
  const [latency, setLatency] = useState(32);
  const [internetConnected, setInternetConnected] = useState(true);
  const [searchResults, setSearchResults] = useState('');
  const [geminiEnabled, setGeminiEnabled] = useState(false);
  const [geminiStatus, setGeminiStatus] = useState('Checking...');
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

  // Check internet connection
  const checkInternetConnection = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/test');
      setInternetConnected(response.ok);
      return response.ok;
    } catch (error) {
      setInternetConnected(false);
      return false;
    }
  };

  // Check Gemini API status
  const checkGeminiStatus = async () => {
    try {
      // Simple test prompt to check if Gemini is working
      const response = await fetch('http://localhost:5000/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: "Respond with 'GEMINI_ONLINE' if you can read this message.",
          temperature: 0.1
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.result && data.result.includes('GEMINI_ONLINE')) {
          setGeminiEnabled(true);
          setGeminiStatus('Connected');
          return true;
        } else {
          setGeminiEnabled(true);
          setGeminiStatus('Connected');
          return true;
        }
      } else {
        setGeminiEnabled(false);
        setGeminiStatus('Disabled');
        return false;
      }
    } catch (error) {
      console.error('Error checking Gemini status:', error);
      setGeminiEnabled(false);
      setGeminiStatus('Error');
      return false;
    }
  };

  // Effect to check internet connection and Gemini status on component mount
  useEffect(() => {
    const initializeSystem = async () => {
      await checkInternetConnection();
      if (internetConnected) {
        await checkGeminiStatus();
      }
    };
    
    initializeSystem();
  }, []);

  // Send command to KAEL backend
  const handleCommand = async (command) => {
    setListening(false);
    addLog(`Command received: ${command}`);
    
    // Clear previous search results if this isn't a search-related command
    if (!command.includes("search") && !command.includes("look up") && 
        !command.includes("find") && !command.includes("what is") && 
        !command.includes("who is") && !command.includes("tell me about")) {
      setSearchResults('');
    }
    
    try {
      console.log("Sending command to backend:", command);
      
      // Check internet connection first
      const isConnected = await checkInternetConnection();
      if (!isConnected) {
        throw new Error("No connection to KAEL backend");
      }
      
      // Try to connect to the backend API
      // First attempt with localhost:5000
      let response;
      try {
        response = await fetch('http://localhost:5000/api/command', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ command }),
        });
      } catch (fetchError) {
        console.log("Failed to connect to localhost:5000, trying 127.0.0.1:5000");
        // If localhost fails, try with 127.0.0.1
        response = await fetch('http://127.0.0.1:5000/api/command', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ command }),
        });
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const kaelResponse = data.response;
      
      console.log("Received response from backend:", kaelResponse);
      setResponse(kaelResponse);
      addLog(`Response sent: ${kaelResponse}`);
      
      // If this is a search-related command, store the result in searchResults
      if (command.includes("search") || command.includes("look up") || 
          command.includes("find") || command.includes("what is") || 
          command.includes("who is") || command.includes("tell me about") ||
          command.includes("weather") || command.includes("news")) {
        setSearchResults(kaelResponse);
      }
      
      // Browser-based text-to-speech
      if ('speechSynthesis' in window) {
        const speech = new SpeechSynthesisUtterance(kaelResponse);
        speech.rate = 1;
        speech.pitch = 1;
        speech.volume = 1;
        window.speechSynthesis.speak(speech);
      }
    } catch (error) {
      console.error('Error communicating with KAEL:', error);
      setInternetConnected(false);
      
      // Fallback mode - simulate responses locally when server is unavailable
      console.log("Using fallback mode with local responses");
      let kaelResponse;
      
      if (command.includes("hello") || command.includes("hi")) {
        kaelResponse = "Hello sir. I'm currently in offline mode, but I'll try to assist you.";
      } else if (command.includes("time")) {
        const now = new Date();
        kaelResponse = `The current time is ${now.toLocaleTimeString()}.`;
      } else if (command.includes("date")) {
        const now = new Date();
        kaelResponse = `Today is ${now.toLocaleDateString()}.`;
      } else if (command.includes("joke")) {
        kaelResponse = "Why did the AI go to art school? To improve its neural network!";
      } else if (command.includes("weather")) {
        kaelResponse = "I'm sorry, I don't have access to weather data in offline mode.";
      } else if (command.includes("help")) {
        kaelResponse = "I'm in offline mode. My backend server isn't connected. Please start the server with 'python server.py' to enable full functionality.";
      } else {
        kaelResponse = "I'm having trouble connecting to my systems. Please check if the server is running with 'python server.py'.";
      }
      
      setResponse(kaelResponse);
      addLog(`Offline response: ${kaelResponse}`);
      
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

  // Function to handle form submission
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (transcript.trim()) {
      handleCommand(transcript.toLowerCase());
      setTranscript('');
    }
  };

  // Toggle listening state
  const toggleListening = () => {
    if (listening) {
      setListening(false);
      addLog("Voice recognition deactivated");
    } else {
      startListening();
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white font-['Orbitron'] overflow-hidden relative">
      {/* Main Content Area - JARVIS-Style Core */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] relative">
        {/* Central JARVIS-style Ring */}
        <div 
          className={`relative w-80 h-80 flex items-center justify-center cursor-pointer ${
            listening ? 'animate-pulse-slow' : ''
          }`}
          onClick={toggleListening}
        >
          {/* Outer Ring */}
          <div className="absolute w-full h-full rounded-full border-4 border-[#00C6FF]/30 animate-slow-spin"></div>
          
          {/* Middle Ring */}
          <div className="absolute w-[90%] h-[90%] rounded-full border-2 border-[#00C6FF]/40 animate-reverse-spin"></div>
          
          {/* Inner Ring */}
          <div className="absolute w-[80%] h-[80%] rounded-full border border-[#00C6FF]/60"></div>
          
          {/* Core Circle */}
          <div className="absolute w-[70%] h-[70%] rounded-full bg-[#000000] border border-[#00C6FF]/80 flex items-center justify-center relative overflow-hidden">
            {/* Animated scanner lines */}
            <div className="absolute w-full h-0.5 bg-[#00C6FF]/60 top-1/2 transform -translate-y-1/2 animate-scanner-line"></div>
            <div className="absolute w-0.5 h-full bg-[#00C6FF]/60 left-1/2 transform -translate-x-1/2 animate-scanner-line-vertical"></div>
            
            {/* Diagonal scanner lines */}
            <div className="absolute w-[141%] h-0.5 bg-[#00C6FF]/40 top-1/2 transform -translate-y-1/2 rotate-45 animate-scanner-diagonal"></div>
            <div className="absolute w-[141%] h-0.5 bg-[#00C6FF]/40 top-1/2 transform -translate-y-1/2 -rotate-45 animate-scanner-diagonal-reverse"></div>
            
            {/* Central logo */}
            <div className="z-10 text-center">
              <div className="text-3xl font-bold text-[#00C6FF] tracking-widest">KAEL</div>
              <div className="text-xs text-[#00C6FF]/80 mt-1">Knowledge and Artificially Enhanced Logic</div>
            </div>
          </div>
          
          {/* Orbiting particles */}
          <div className="absolute w-full h-full animate-orbit">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-[#9F5FFF]"></div>
          </div>
          <div className="absolute w-full h-full animate-orbit-slow">
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#00C6FF]"></div>
          </div>
          <div className="absolute w-full h-full animate-orbit-reverse">
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-1 h-1 rounded-full bg-[#00C6FF]/80"></div>
          </div>
          
          {/* Status indicator */}
          <div className="absolute -bottom-6 left-0 right-0 flex justify-center">
            <div className="text-sm text-[#00C6FF]">
              {listening ? "Listening..." : "Click to activate voice"}
            </div>
          </div>
        </div>
        
        {/* Audio visualization */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center">
          <div className="flex items-end space-x-1 h-10">
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i}
                className={`w-1 ${listening ? 'bg-[#00C6FF]' : 'bg-[#00C6FF]/40'}`}
                style={{ 
                  height: `${listening ? Math.random() * 100 : 10}%`,
                  transition: 'height 0.1s ease-in-out'
                }}
              ></div>
            ))}
          </div>
        </div>
        
        {/* Transcript Display */}
        {transcript && (
          <div className="mt-8 text-center">
            <p className="text-[#9F5FFF] text-lg">"{transcript}"</p>
          </div>
        )}
        
        {/* Response Area */}
        <div className="mt-16 w-full max-w-2xl">
          <div className={`bg-[#0A0F1C]/80 backdrop-blur-sm border border-[#00C6FF]/30 rounded-lg p-4 min-h-[100px] transition-all duration-500 ${response ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-md whitespace-pre-line text-[#00C6FF]/90">{response}</p>
          </div>
        </div>
      </div>
      
      {/* Bottom Control Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0A0F1C]/80 backdrop-blur-md border-t border-[#00C6FF]/30 p-2">
        <div className="container mx-auto flex justify-between items-center">
          {/* Text Input */}
          <div className="flex-1 max-w-2xl mx-auto flex items-center gap-2">
            <input 
              type="text" 
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="w-full bg-[#0A0F1C] border border-[#00C6FF]/30 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#00C6FF]/60"
              placeholder="Type a command..."
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <button 
              onClick={handleSubmit}
              className="bg-[#00C6FF]/20 hover:bg-[#00C6FF]/30 border border-[#00C6FF]/30 rounded-full p-2"
            >
              <SendIcon />
            </button>
            <button 
              onClick={toggleListening}
              className={`rounded-full p-2 ${
                listening 
                  ? "bg-red-500/20 hover:bg-red-500/30 border border-red-500/30" 
                  : "bg-[#00C6FF]/20 hover:bg-[#00C6FF]/30 border border-[#00C6FF]/30"
              }`}
            >
              <MicIcon />
            </button>
          </div>
          
          {/* Control Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <button 
              onClick={() => alert('Settings panel would open here')}
              className="bg-[#0A0F1C] hover:bg-[#00C6FF]/10 border border-[#00C6FF]/30 rounded-full p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button 
              onClick={() => alert('History panel would open here')}
              className="bg-[#0A0F1C] hover:bg-[#00C6FF]/10 border border-[#00C6FF]/30 rounded-full p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Status Indicators (Top Right) */}
      <div className="fixed top-4 right-4 flex flex-col items-end space-y-2">
        <div className="flex items-center gap-2 bg-[#0A0F1C]/80 backdrop-blur-sm border border-[#00C6FF]/30 rounded-full px-3 py-1 text-xs">
          <span>Gemini: </span>
          <span className={geminiEnabled ? "text-green-400" : "text-red-400"}>
            {geminiStatus}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-[#0A0F1C]/80 backdrop-blur-sm border border-[#00C6FF]/30 rounded-full px-3 py-1 text-xs">
          <span>Internet: </span>
          <span className={internetConnected ? "text-green-400" : "text-red-400"}>
            {internetConnected ? "Connected" : "Offline"}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-[#0A0F1C]/80 backdrop-blur-sm border border-[#00C6FF]/30 rounded-full px-3 py-1 text-xs">
          <span>CPU: </span>
          <span className="text-[#00C6FF]">{cpuUsage}%</span>
        </div>
      </div>
      
      {/* Quick Commands Panel (Bottom Left) */}
      <div className="fixed bottom-20 left-4 bg-[#0A0F1C]/80 backdrop-blur-sm border border-[#00C6FF]/30 rounded-lg p-3 max-w-xs">
        <h3 className="text-xs text-[#00C6FF] mb-2">QUICK COMMANDS</h3>
        <div className="grid grid-cols-2 gap-1">
          {[
            'Weather', 
            'Time', 
            'News', 
            'Joke', 
            'Help',
            'Status',
            'Quantum',
            'Poem'
          ].map((cmd) => (
            <button 
              key={cmd}
              className="text-xs bg-[#00C6FF]/10 hover:bg-[#00C6FF]/30 border border-[#00C6FF]/30 rounded-full px-2 py-1"
              onClick={() => handleCommand(cmd.toLowerCase())}
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>
      
      {/* Command Log (Top Left) */}
      <div className="fixed top-4 left-4 bg-[#0A0F1C]/80 backdrop-blur-sm border border-[#00C6FF]/30 rounded-lg p-3 max-w-xs">
        <h3 className="text-xs text-[#00C6FF] mb-2">COMMAND LOG</h3>
        <div className="text-xs space-y-1 max-h-32 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-[#00C6FF]"></div>
              <p className="text-gray-300">{log}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Search Results Overlay - Only show if there are search results */}
      {searchResults && (
        <div className="fixed bottom-20 right-4 bg-[#0A0F1C]/90 backdrop-blur-md border border-[#00C6FF]/30 rounded-lg p-3 max-w-md max-h-60 overflow-y-auto">
          <h3 className="text-xs text-[#00C6FF] mb-2">INFORMATION MODULE</h3>
          <div className="text-xs text-gray-300">
            {searchResults.split('\n').map((line, index) => (
              <p key={index} className="mb-1">{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}