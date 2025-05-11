import json
from adb_call import whatsapp_call

def find_contact(spoken_phrase):
    try:
        with open("contacts.json") as f:
            contacts = json.load(f)
    except FileNotFoundError:
        return None

    spoken_phrase_lower = spoken_phrase.lower()

    for contact in contacts:
        # Match by name, relation, or first name
        if (contact["name"].lower() in spoken_phrase_lower or
                contact.get("relation", "").lower() in spoken_phrase_lower or
                contact["name"].split()[0].lower() in spoken_phrase_lower):
            return contact
    return None

def simulate_call(contact, use_adb=True):
    if contact:
        result = whatsapp_call(contact['phone'], use_adb=use_adb)
        return result if "Error" in result else f"Placing WhatsApp call to {contact['name']}."
    else:
        return "Sorry, I couldn’t find that contact."