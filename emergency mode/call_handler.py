import json

def find_contact(spoken_phrase): 
    with open("contacts.json") as f: 
        contacts = json.load(f)

    spoken_phrase_lower = spoken_phrase.lower()

    # Try to match by full name
    for contact in contacts:
        if contact["name"].lower() in spoken_phrase_lower:
            return contact

    # Try to match by relation (like 'daughter', 'police', etc.)
    for contact in contacts:
        if contact.get("relation", "").lower() in spoken_phrase_lower:
            return contact

    # Try to match by first name
    for contact in contacts:
        first_name = contact["name"].split()[0].lower()
        if first_name in spoken_phrase_lower:
            return contact

    return None

def simulate_call(contact): 
    if contact: 
        print(f"Calling {contact['name']} at {contact['phone']}...") 
        return f"Calling {contact['name']}." 
    else: 
        return "Sorry, I couldn’t find that contact."
