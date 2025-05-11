import os
import re
import requests
from urllib.parse import quote

def whatsapp_call(phone_number, use_adb=True):
    try:
        # Sanitize phone number: remove spaces, plus signs, and non-digits
        phone_number = re.sub(r'[^\d]', '', phone_number.strip())
        if not phone_number:
            return "Invalid phone number."

        if use_adb:
            # Check if ADB is available
            result = os.system('adb devices')
            if result != 0:
                return "ADB not found or no device connected."

            # Launch WhatsApp call via ADB
            os.system(f'adb shell am start -a android.intent.action.VIEW -d "https://wa.me/{phone_number}"')
            return f"Attempting WhatsApp call to {phone_number} via ADB."

        else:
            # Alternative: Use WhatsApp URL scheme (opens WhatsApp in browser or app)
            whatsapp_url = f"https://api.whatsapp.com/send?phone={phone_number}"
            response = requests.get(whatsapp_url)
            if response.status_code == 200:
                os.system(f"start {whatsapp_url}")  # Windows
                # For macOS: os.system(f"open {whatsapp_url}")
                # For Linux: os.system(f"xdg-open {whatsapp_url}")
                return f"Opening WhatsApp call to {phone_number} via URL."
            else:
                return "Failed to initiate WhatsApp call via URL."

    except Exception as e:
        return f"Error initiating call: {str(e)}"