from flask import Flask, request, jsonify
import google.generativeai as genai
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow frontend requests from any domain (dev only)

genai.configure(api_key="ENTER YOUR GEMINI KEY HERE")
model = genai.GenerativeModel("gemini-1.5-pro-latest")

@app.route('/api/voice-assistant', methods=['POST'])
def generate_response():
    data = request.get_json()
    prompt = data.get('prompt', '')
    try:
        response = model.generate_content(prompt)
        return jsonify({'response': response.text})
    except Exception as e:
        return jsonify({'response': f"Error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
