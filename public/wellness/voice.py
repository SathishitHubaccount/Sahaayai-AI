from gtts import gTTS

text = """Namaste! I’m SahaayAI — your voice-based companion here to make life easier. You can talk to me like a friend — no typing needed! I can share religious stories, remind you about medicines, give health tips, answer questions about government schemes, or help you place orders on Swiggy, Amazon, and more — all in your language. You can even hear me in the voice of your loved one. Now, which mode would you like to try — Religious, Wellness, Information, or Ordering?"""

tts = gTTS(text, lang='en')
tts.save("sahaayai_intro.mp3")
