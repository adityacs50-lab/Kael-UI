from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import sys
import datetime
import subprocess
import webbrowser
import threading
import logging
import requests
import json
import random
import re
from urllib.parse import quote_plus

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# EMBEDDED CONFIGURATION - No need for .env file
SEARCH_ENABLED = True
NEWS_ENABLED = True
WEATHER_ENABLED = True
GEMINI_ENABLED = True

# EMBEDDED API KEY - Replace with your actual key
GEMINI_API_KEY = "your-api-key"
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"

# Check if text-to-speech is available
try:
    import pyttsx3
    has_tts = True
    logger.info("Text-to-speech engine initialized successfully")
except ImportError:
    has_tts = False
    logger.warning("pyttsx3 not found, text-to-speech will be disabled")

app = Flask(__name__, static_folder='dist')
# Enable CORS for all routes
CORS(app, resources={r"/*": {"origins": "*", "allow_headers": ["Content-Type"], "methods": ["GET", "POST", "OPTIONS"]}})

# Gemini API function
def ask_gemini(prompt, temperature=0.7):
    """
    Send a prompt to the Google Gemini API and get a response.
    
    Args:
        prompt (str): The prompt to send to Gemini
        temperature (float): Controls randomness in the response (0.0 to 1.0)
        
    Returns:
        str: The response from Gemini, or an error message if the request fails
    """
    if not GEMINI_ENABLED or not GEMINI_API_KEY:
        return "Gemini API is not available in offline mode."
    
    try:
        logger.info(f"Sending prompt to Gemini API: {prompt[:50]}...")
        
        headers = {
            "Content-Type": "application/json",
        }
        
        data = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": prompt
                        }
                    ]
                }
            ],
            "generationConfig": {
                "temperature": temperature,
                "maxOutputTokens": 800,
                "topP": 0.95,
                "topK": 40
            }
        }
        
        # Add API key as a query parameter
        url = f"{GEMINI_API_URL}?key={GEMINI_API_KEY}"
        
        response = requests.post(url, headers=headers, json=data)
        
        if response.status_code != 200:
            logger.error(f"Gemini API error: {response.status_code} - {response.text}")
            return f"I encountered an error while processing your request. Status code: {response.status_code}"
        
        response_data = response.json()
        
        # Extract the text from the response
        if "candidates" in response_data and len(response_data["candidates"]) > 0:
            candidate = response_data["candidates"][0]
            if "content" in candidate and "parts" in candidate["content"]:
                parts = candidate["content"]["parts"]
                if len(parts) > 0 and "text" in parts[0]:
                    return parts[0]["text"]
        
        return "I received a response from Gemini, but couldn't extract the text. Please try again."
    
    except Exception as e:
        logger.error(f"Error in Gemini API request: {str(e)}")
        return f"I'm currently in offline mode. I'll use my built-in knowledge to help you instead."

# Web search and information retrieval functions
def search_web(query):
    """Search the web for information."""
    try:
        logger.info(f"Searching web for: {query}")
        
        try:
            # Use DuckDuckGo for search (no API key needed)
            search_url = f"https://api.duckduckgo.com/?q={quote_plus(query)}&format=json"
            response = requests.get(search_url, headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            })
            
            if response.status_code != 200:
                raise Exception("Search service unavailable")
            
            data = response.json()
            
            # Extract the abstract text if available
            if data.get('Abstract'):
                return data['Abstract']
            
            # If no abstract, try to get information from related topics
            if data.get('RelatedTopics') and len(data['RelatedTopics']) > 0:
                topics = data['RelatedTopics']
                results = []
                
                for topic in topics[:3]:  # Get first 3 topics
                    if 'Text' in topic:
                        results.append(topic['Text'])
                
                if results:
                    return "Here's what I found: " + " ".join(results)
            
            # If all else fails, use offline mode
            raise Exception("No results found")
            
        except Exception as search_error:
            # OFFLINE MODE - Return predefined responses for common queries
            logger.warning(f"Using offline mode for search: {str(search_error)}")
            
            # Dictionary of common search queries and responses
            offline_responses = {
                "weather": "I'm in offline mode and can't check the weather right now. When online, I can provide real-time weather information for any location.",
                "news": "I'm in offline mode and can't fetch the latest news. When online, I can provide current news headlines on various topics.",
                "time": f"The current time is {datetime.datetime.now().strftime('%I:%M %p')}.",
                "date": f"Today is {datetime.datetime.now().strftime('%A, %B %d, %Y')}.",
                "joke": "Why did the AI go to art school? To improve its neural network!",
                "quantum computing": "Quantum computing uses quantum bits or qubits that can exist in multiple states simultaneously, unlike classical bits. This allows quantum computers to solve certain problems much faster than traditional computers.",
                "artificial intelligence": "Artificial Intelligence (AI) refers to systems designed to mimic human intelligence. It encompasses machine learning, natural language processing, computer vision, and more.",
                "jarvis": "JARVIS (Just A Rather Very Intelligent System) is a fictional AI assistant created by Tony Stark in the Marvel universe. I'm KAEL, inspired by similar principles but designed for real-world use.",
                "kael": "I am KAEL (Knowledge and Artificially Enhanced Logic), your AI assistant. I can help with information, perform tasks, and assist with various queries even in offline mode."
            }
            
            # Check if any keywords from the query match our offline responses
            for keyword, response in offline_responses.items():
                if keyword in query.lower():
                    return response
            
            # Generic offline response
            return "I'm currently in offline mode and can't search the web. I can still help with basic questions using my built-in knowledge."
    
    except Exception as e:
        logger.error(f"Error in web search: {str(e)}")
        return "I'm currently in offline mode and can't search the web. I can still help with basic questions using my built-in knowledge."

def get_weather(location=""):
    """Get weather information for a location."""
    try:
        if not WEATHER_ENABLED:
            return "Weather information is currently disabled."
        
        if not location:
            return "I need a location to check the weather. For example, 'weather in New York'."
        
        try:
            # Try to get real weather data
            # This would use a weather API in a real implementation
            raise Exception("Offline mode")
            
        except Exception:
            # OFFLINE MODE - Return simulated weather
            logger.info("Using offline weather simulation")
            weather_conditions = ["sunny", "partly cloudy", "cloudy", "rainy", "stormy", "snowy", "windy", "foggy"]
            temperatures = range(0, 35)  # 0 to 35 degrees Celsius
            
            condition = random.choice(weather_conditions)
            temperature = random.choice(temperatures)
            
            return f"I'm in offline mode, so here's a simulated weather report for {location}: Currently {condition} with a temperature of {temperature}°C."
    
    except Exception as e:
        logger.error(f"Error in weather: {str(e)}")
        return f"I'm in offline mode and can't check the weather for {location} right now."

def get_news(topic=""):
    """Get latest news headlines."""
    try:
        if not NEWS_ENABLED:
            return "News retrieval is currently disabled."
        
        try:
            # Try to get real news data
            # This would use a news API in a real implementation
            raise Exception("Offline mode")
            
        except Exception:
            # OFFLINE MODE - Return simulated news
            logger.info("Using offline news simulation")
            
            general_news = [
                "Scientists discover new renewable energy source that could revolutionize power generation.",
                "Global tech companies announce collaboration on AI safety standards.",
                "New study suggests regular exercise may improve cognitive function more than previously thought.",
                "Space agency announces plans for the next lunar mission with international partners.",
                "Breakthrough in quantum computing achieved by university researchers."
            ]
            
            tech_news = [
                "New smartphone with revolutionary battery technology unveiled today.",
                "Major software company releases significant update to its operating system.",
                "Artificial intelligence system beats human experts in complex problem-solving competition.",
                "Tech startup receives record funding for innovative augmented reality platform.",
                "New cybersecurity threat identified, experts recommend immediate system updates."
            ]
            
            science_news = [
                "Researchers identify potential new treatment for common neurological disorder.",
                "New species of deep-sea creatures discovered in ocean exploration mission.",
                "Climate scientists report unexpected changes in global weather patterns.",
                "Astronomers observe unusual stellar phenomenon never before documented.",
                "Breakthrough in renewable materials could reduce plastic waste significantly."
            ]
            
            if "tech" in topic.lower():
                news_items = tech_news
                topic_name = "technology"
            elif "science" in topic.lower():
                news_items = science_news
                topic_name = "science"
            else:
                news_items = general_news
                topic_name = "general"
            
            # Select 3 random news items
            selected_news = random.sample(news_items, min(3, len(news_items)))
            
            news_text = f"I'm in offline mode, so here are some simulated {topic_name} headlines:\n\n"
            for i, item in enumerate(selected_news, 1):
                news_text += f"{i}. {item}\n"
            
            return news_text
    
    except Exception as e:
        logger.error(f"Error in news: {str(e)}")
        return f"I'm in offline mode and can't retrieve news about {topic if topic else 'current events'} right now."

# Initialize text-to-speech engine if available
if has_tts:
    engine = pyttsx3.init()
    engine.setProperty('rate', 170)
    voices = engine.getProperty('voices')
    if len(voices) > 1:
        engine.setProperty('voice', voices[1].id)  # British female if available

def speak(text):
    print("KAEL:", text)
    # Disable TTS for the standalone server to avoid threading issues
    # if has_tts:
    #     engine.say(text)
    #     engine.runAndWait()
    return text

def execute_command(command):
    # Basic system commands
    if "open" in command:
        app = command.replace("open", "").strip()
        response = f"Opening {app}"
        threading.Thread(target=lambda: os.system(f"start {app}")).start()
    
    # Web search commands
    elif any(x in command for x in ["search for", "search", "look up", "find information", "tell me about"]):
        # Extract the search query
        for prefix in ["search for", "search", "look up", "find information about", "find information on", "tell me about"]:
            if prefix in command:
                query = command.replace(prefix, "").strip()
                break
        else:
            query = command.replace("find", "").strip()
        
        # If it's a simple web search request, open the browser
        if any(x in command for x in ["search the web", "in browser", "open browser"]):
            response = f"Searching Google for {query}"
            threading.Thread(target=lambda: webbrowser.open(f"https://www.google.com/search?q={query}")).start()
        # Otherwise, try to answer directly
        else:
            response = search_web(query)
    
    # Weather information
    elif "weather" in command:
        # Extract location from command
        location_match = re.search(r"weather (?:in|for|at) ([\w\s]+)", command)
        if location_match:
            location = location_match.group(1).strip()
            response = get_weather(location)
        else:
            response = "I need a location to check the weather. For example, try asking 'What's the weather in New York?'"
    
    # News information
    elif "news" in command:
        # Extract topic from command
        topic_match = re.search(r"news (?:about|on|regarding) ([\w\s]+)", command)
        if topic_match:
            topic = topic_match.group(1).strip()
            response = get_news(topic)
        else:
            response = get_news()  # Get general news
    
    # Time and date commands
    elif "time" in command:
        now = datetime.datetime.now().strftime("%I:%M %p")
        response = f"The current time is {now}, sir."
    
    elif "date" in command or "day" in command:
        now = datetime.datetime.now().strftime("%A, %B %d, %Y")
        response = f"Today is {now}, sir."
    
    # Greeting commands
    elif "hello" in command or "hi" in command or "hey" in command or "greetings" in command:
        greetings = [
            "Hello, sir. How may I assist you today?",
            "Greetings. I am at your service.",
            "Hello. All systems are operational and ready for your commands.",
            "Good day, sir. How can I be of assistance?"
        ]
        response = random.choice(greetings)
    
    # Identity commands
    elif "who are you" in command or "your name" in command or "introduce yourself" in command:
        response = "I am KAEL, Knowledge and Artificially Enhanced Logic. I was designed to assist you with a variety of tasks, much like my inspiration, J.A.R.V.I.S. I can search the web, check the weather, get news updates, and perform various system functions."
    
    # Entertainment commands
    elif "joke" in command or "funny" in command:
        jokes = [
            "Why did the AI go to art school? To improve its neural network!",
            "I would tell you a joke about artificial intelligence, but I'm afraid you wouldn't get it.",
            "Why don't scientists trust atoms? Because they make up everything!",
            "What do you call an AI that sings? Artificial Harmonies!",
            "Why was the computer cold? It left its Windows open.",
            "What's a computer's favorite snack? Microchips.",
            "Why did the computer go to the doctor? Because it had a virus!",
            "How many programmers does it take to change a light bulb? None, that's a hardware problem."
        ]
        response = random.choice(jokes)
    
    # Help commands
    elif "help" in command or "what can you do" in command:
        response = "I can assist with various tasks, sir. I can:\n\n" + \
                  "1. Search the web for information\n" + \
                  "2. Check the weather in any location\n" + \
                  "3. Get the latest news headlines\n" + \
                  "4. Tell you the time and date\n" + \
                  "5. Open applications\n" + \
                  "6. Tell jokes\n" + \
                  "7. Control system functions\n\n" + \
                  "Just ask me what you need, and I'll do my best to assist you."
    
    # Gratitude responses
    elif "thank" in command:
        thanks_responses = [
            "You're welcome, sir. Always a pleasure to be of service.",
            "Happy to assist, sir. That's what I'm here for.",
            "No need for thanks, sir. Serving you is my primary function.",
            "Of course, sir. Is there anything else you require?"
        ]
        response = random.choice(thanks_responses)
    
    # Exit commands
    elif "exit" in command or "quit" in command or "goodbye" in command or "bye" in command:
        exit_responses = [
            "Goodbye, sir. I'll be here when you need me.",
            "Entering standby mode. Call me when you need assistance.",
            "I'll be here monitoring systems while you're away, sir.",
            "Until next time, sir."
        ]
        response = random.choice(exit_responses)
    
    # System status commands
    elif "system" in command or "status" in command:
        response = "All systems are functioning within normal parameters, sir. CPU usage is optimal, memory allocation is stable, and all subsystems are online. Internet connectivity is active, and I am able to access web services."
    
    # Use Gemini for complex queries or unknown commands
    else:
        # Check if it's a question or complex query
        is_question = command.startswith(("what", "who", "how", "why", "when", "where")) or "?" in command
        
        # If Gemini is enabled, use it for complex queries
        if GEMINI_ENABLED and (is_question or len(command.split()) > 3):
            try:
                # Create a prompt for Gemini
                prompt = f"""You are KAEL (Knowledge and Artificially Enhanced Logic), an AI assistant inspired by J.A.R.V.I.S.
                
Please respond to the following user query in a helpful, concise, and slightly formal manner:

"{command}"

Keep your response under 150 words and maintain a slightly technical, assistant-like tone.
"""
                response = ask_gemini(prompt)
                
                # Add a prefix to indicate this came from Gemini
                if not response.startswith("I encountered an error") and not response.startswith("I'm currently in offline mode"):
                    response = f"{response}"
            except Exception as e:
                logger.error(f"Error using Gemini: {str(e)}")
                # Fall back to offline mode
                response = "I'm currently in offline mode. I can still help with basic questions using my built-in knowledge."
        
        # Fall back to web search for questions if Gemini is not available
        elif is_question:
            response = search_web(command)
        
        # Default fallback responses
        else:
            default_responses = [
                "I'm not sure I understand. Could you please rephrase your request?",
                "I don't have that information in my database. I can help with other queries though.",
                "I'm still learning, sir. Could you try a different command?",
                "I don't have a specific response for that. Try asking me something else."
            ]
            response = random.choice(default_responses)
    
    return speak(response)

# Serve static files from the dist directory
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/command', methods=['POST'])
def process_command():
    try:
        logger.info("Received command request")
        data = request.json
        if not data:
            logger.warning("No JSON data in request")
            return jsonify({'error': 'No JSON data provided'}), 400
            
        command = data.get('command', '').lower()
        logger.info(f"Processing command: {command}")
        
        if not command:
            logger.warning("Empty command received")
            return jsonify({'error': 'No command provided'}), 400
        
        response = execute_command(command)
        logger.info(f"Command processed, response: {response}")
        
        return jsonify({
            'command': command,
            'response': response,
            'timestamp': datetime.datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Error processing command: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/api/status', methods=['GET'])
def get_status():
    try:
        logger.info("Status check requested")
        return jsonify({
            'status': 'online',
            'version': '1.0.0',
            'tts_available': has_tts,
            'timestamp': datetime.datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Error in status check: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500

# Add a simple test endpoint
@app.route('/api/test', methods=['GET'])
def test_endpoint():
    return jsonify({'status': 'ok', 'message': 'KAEL API is working'})

# Direct web search endpoint
@app.route('/api/search', methods=['GET'])
def api_search():
    try:
        query = request.args.get('q', '')
        if not query:
            return jsonify({'error': 'No search query provided'}), 400
            
        result = search_web(query)
        return jsonify({
            'query': query,
            'result': result,
            'timestamp': datetime.datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Error in search API: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500

# Weather endpoint
@app.route('/api/weather', methods=['GET'])
def api_weather():
    try:
        location = request.args.get('location', '')
        result = get_weather(location)
        return jsonify({
            'location': location,
            'result': result,
            'timestamp': datetime.datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Error in weather API: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500

# News endpoint
@app.route('/api/news', methods=['GET'])
def api_news():
    try:
        topic = request.args.get('topic', '')
        result = get_news(topic)
        return jsonify({
            'topic': topic,
            'result': result,
            'timestamp': datetime.datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Error in news API: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500

# Gemini API endpoint
@app.route('/api/gemini', methods=['POST'])
def api_gemini():
    try:
        if not GEMINI_ENABLED:
            return jsonify({'error': 'Gemini API is not enabled'}), 400
            
        data = request.json
        prompt = data.get('prompt', '')
        temperature = data.get('temperature', 0.7)
        
        if not prompt:
            return jsonify({'error': 'No prompt provided'}), 400
            
        result = ask_gemini(prompt, temperature)
        return jsonify({
            'prompt': prompt,
            'result': result,
            'timestamp': datetime.datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Error in Gemini API: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500

# Add CORS preflight handling
@app.route('/api/command', methods=['OPTIONS'])
def handle_options():
    return '', 204

if __name__ == '__main__':
    print("Starting KAEL Standalone Server...")
    logger.info("Starting KAEL Standalone Server on http://127.0.0.1:5000")
    
    # Open the browser automatically
    threading.Timer(1.5, lambda: webbrowser.open('http://127.0.0.1:5000')).start()
    
    # Use 0.0.0.0 to make the server accessible from other devices on the network
    app.run(host='0.0.0.0', port=5000, debug=False)
