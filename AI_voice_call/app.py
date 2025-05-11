from flask import Flask, request, jsonify
from main import main
from call_handler import find_contact, simulate_call
from tts_feedback import speak
from flask_cors import CORS  # Allow CORS for frontend access

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route("/start")
def start():
    message = main(use_adb=False)  # Uses speech input
    return message

@app.route("/emergency")
def call_emergency():
    contact = find_contact("emergency")
    message = simulate_call(contact, use_adb=False)
    speak(message)
    return message

@app.route("/api/voice-assistant", methods=["POST"])
def voice_assistant():
    data = request.get_json()
    prompt = data.get("prompt", "")

    if not prompt:
        return jsonify({"response": "Sorry, I didn't receive any prompt."}), 400

    try:
        reply = main(prompt=prompt, use_adb=False)
        return jsonify({"response": reply})
    except Exception as e:
        print("Error in /api/voice-assistant:", e)
        return jsonify({"response": "Something went wrong processing your request."}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
