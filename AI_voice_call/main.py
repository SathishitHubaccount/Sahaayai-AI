from speech_to_text import listen_and_convert
from intent_parser import parse_intent
from call_handler import find_contact, simulate_call
from tts_feedback import speak

def main(prompt=None, use_adb=True):
    try:
        if prompt:
            command = prompt
        else:
            command = listen_and_convert()

        if not command:
            message = "No speech detected."
            speak(message)
            return message

        intent, target = parse_intent(command)
        if intent == "call" and target:
            contact = find_contact(command)
            message = simulate_call(contact, use_adb=use_adb)
            speak(message)
            return message
        else:
            message = "Sorry, I didn’t understand that."
            speak(message)
            return message
    except Exception as e:
        message = f"Error: {str(e)}"
        speak(message)
        return message
