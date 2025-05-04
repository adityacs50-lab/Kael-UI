import requests
import json
import sys

def test_server():
    """Test if the KAEL server is running and responding correctly."""
    print("Testing KAEL server connection...")
    
    # Test the status endpoint
    try:
        status_response = requests.get('http://localhost:5000/api/status')
        if status_response.status_code == 200:
            print("✅ Status endpoint is working!")
            print(f"Server status: {status_response.json()}")
        else:
            print(f"❌ Status endpoint returned error code: {status_response.status_code}")
            print(status_response.text)
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server at http://localhost:5000/api/status")
        print("Make sure the server is running with 'python server.py'")
        return False
    
    # Test the command endpoint with a simple command
    try:
        command_data = {"command": "hello"}
        command_response = requests.post(
            'http://localhost:5000/api/command',
            headers={'Content-Type': 'application/json'},
            data=json.dumps(command_data)
        )
        
        if command_response.status_code == 200:
            print("✅ Command endpoint is working!")
            print(f"Response to 'hello': {command_response.json().get('response', 'No response')}")
        else:
            print(f"❌ Command endpoint returned error code: {command_response.status_code}")
            print(command_response.text)
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server at http://localhost:5000/api/command")
        return False
    
    print("\nServer is running correctly and responding to commands!")
    return True

if __name__ == "__main__":
    success = test_server()
    sys.exit(0 if success else 1)