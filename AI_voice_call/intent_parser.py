def parse_intent(text):
    if "call" in text:
        words = text.split()
        for i in range(len(words)):
            if words[i] == "call" and i + 1 < len(words):
                return "call", words[i + 1]
    return None, None