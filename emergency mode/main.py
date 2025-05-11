from speech_to_text import listen_and_convert 
from intent_parser import parse_intent 
from call_handler import find_contact, simulate_call 
from tts_feedback import speak

def main(): 
    command = listen_and_convert() 
    intent, target = parse_intent(command)

    if intent == "call" and target:
        contact = find_contact(target)
        message = simulate_call(contact)
        speak(message)
    else:
        speak("Sorry, I didn't understand that.")
    

