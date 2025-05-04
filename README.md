# KAEL UI - JARVIS-Style Interface

A futuristic JARVIS-inspired UI for the KAEL AI assistant (Knowledge and Artificially Enhanced Logic), featuring a stunning sci-fi holographic design.

![KAEL UI](https://i.imgur.com/placeholder-image.png)

## 🌟 Features

- **JARVIS-Style Interface**: Futuristic circular HUD with animated elements
- **Voice Recognition**: Speak commands directly to KAEL
- **Text Input**: Type commands when voice isn't practical
- **Offline Capabilities**: Works even without internet connection
- **Gemini AI Integration**: Uses Google's Gemini API for advanced responses
- **Web Search**: Find information from the web
- **Weather & News**: Get updates on weather and current events
- **System Commands**: Control your computer with voice
- **Animated Elements**: Scanner lines, orbiting particles, and pulsing effects
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Setup and Installation

### Prerequisites

- Node.js (v14 or higher)
- Python (v3.7 or higher)
- pip (Python package manager)

### Quick Start Options

#### Option 1: Run the Deployment Script (Recommended)

For Windows users, you can use the provided batch file to build and start KAEL:

```bash
deploy.bat
```

This will build the frontend and start the standalone server with all features enabled.

#### Option 2: Create a Portable Package

To create a portable version that can be run on any computer:

```bash
create_portable.bat
```

This creates a `portable` directory containing everything needed to run KAEL. Copy this directory to any computer with Python installed.

#### Option 3: Manual Setup

1. Install the required dependencies:

```bash
npm install
pip install flask flask-cors requests pyttsx3
```

2. For development mode:

```bash
# Terminal 1 - Start the React development server
npm start

# Terminal 2 - Start the backend server
python standalone_server.py
```

3. For production mode:

```bash
# Build the frontend
npm run build

# Start the standalone server
python standalone_server.py
```

### No API Key Required!

The standalone server includes an embedded Gemini API key for convenience. If you want to use your own:

1. Get a Gemini API key from https://makersuite.google.com/app/apikey
2. Edit `standalone_server.py` and update the `GEMINI_API_KEY` variable

### Accessing KAEL

Once running, KAEL is available at:
- **Local access**: http://localhost:5000
- **Network access**: http://[your-ip-address]:5000 (accessible from other devices on your network)

## 🔧 Troubleshooting

### Connection Issues

If you see the error "I'm having trouble connecting to my systems" or "Running in offline mode":

1. Make sure the standalone server is running with `python standalone_server.py`
2. Check if port 5000 is already in use by another application
3. Ensure no firewall is blocking the connection to port 5000
4. Try using the IP address 127.0.0.1 instead of localhost

### Speech Recognition Issues

If voice commands aren't working:

1. Make sure you're using a supported browser (Chrome works best)
2. Check if your microphone is properly connected and has permission
3. Try clicking the central JARVIS ring again to restart the listening process
4. Use the text input at the bottom of the screen as an alternative

### Offline Mode

KAEL is designed to work offline with fallback capabilities:

1. If Gemini API is unavailable, KAEL will use built-in responses
2. Weather and news will show simulated data when offline
3. Web searches will use a local knowledge base when offline

### Browser Compatibility

KAEL works best with:
- Google Chrome (recommended)
- Microsoft Edge
- Firefox (limited speech recognition support)
- Safari (limited speech synthesis support)

## 🎮 Usage

### Voice Commands
- Click on the central JARVIS-style ring to activate voice recognition
- Speak your command clearly
- The audio visualization bars will animate while listening
- Your transcript will appear above the response area

### Text Input
- Use the text input field at the bottom of the screen
- Press Enter or click the send button to submit

### Quick Commands
- Use the floating panel in the bottom left for common commands
- These provide one-click access to frequently used functions

### Status Information
- Check the top right corner for system status indicators
- View command history in the top left panel

## 🗣️ Available Commands

### Basic Commands
- "Hello" / "Hi" - Greet KAEL
- "What time is it" - Get the current time
- "What's the date today" - Get the current date
- "Open [application]" - Open an application
- "Tell me a joke" - Get a random joke
- "Help" - Learn what KAEL can do
- "Exit" / "Goodbye" - Exit the application

### Internet-Connected Commands
- "Search for [query]" - Search the web for information
- "Look up [topic]" - Find information about a topic
- "Tell me about [subject]" - Get information about a subject
- "What is [something]" - Get a definition or explanation
- "Who is [person]" - Get information about a person
- "Weather in [location]" - Get weather information for a location
- "News" - Get general news headlines
- "News about [topic]" - Get news about a specific topic

### Gemini AI Commands
- "Explain [complex topic]" - Get a detailed explanation using Gemini AI
- "Write a [creative content]" - Generate creative content with Gemini
- "Summarize [text]" - Get a summary of information
- "Compare [A and B]" - Get a comparison between two things
- "How to [do something]" - Get step-by-step instructions

The system automatically routes complex questions to Gemini AI and falls back to built-in responses when offline.

## 🧠 AI Integration

KAEL uses Google's Gemini API for advanced AI capabilities:

- Embedded API key in the standalone server
- Offline fallbacks when the API is unavailable
- Graceful degradation to built-in responses
- Natural language processing for command interpretation

## 🎨 UI Customization

You can customize the UI by modifying the following files:

- `src/components/KAELDashboard.jsx` - Main UI component with JARVIS-style interface
- `src/styles/jarvis-animations.css` - Custom animations for the JARVIS elements
- `src/index.css` - Base styling and animations
- `tailwind.config.js` - Color scheme and theme configuration
- `standalone_server.py` - Backend functionality and responses

## 🔍 Design Elements

The JARVIS-style UI features several futuristic design elements:

- Central circular HUD with multiple rotating rings
- Animated scanner lines (horizontal, vertical, and diagonal)
- Orbiting particles for visual interest
- Audio visualization bars that respond to voice input
- Glassmorphism effects with backdrop blur
- Sci-fi inspired color scheme with cyan and purple accents
- Custom Orbitron font for that perfect futuristic look
- Responsive layout that works on different screen sizes

## 🔒 Privacy

KAEL can run entirely offline for privacy-conscious users. When online, it uses:

- Google Gemini API for AI responses
- DuckDuckGo for web searches (no tracking)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by JARVIS from the Iron Man/Marvel universe
- Built with React, Flask, and Google Gemini
- Special thanks to the open-source community