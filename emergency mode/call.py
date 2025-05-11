import os
from twilio.rest import Client

def send_sms():
    account_sid = os.environ.get("TWILIO_SID")
    auth_token = os.environ.get("TWILIO_AUTH_TOKEN")
    client = Client(account_sid, auth_token)

    message = client.messages.create(
        body="🚨 This is an emergency message sent using Twilio!",
        from_="",  # Your Twilio phone number
        to=""      # Your verified phone number
    )

    print(f"Message sent! SID: {message.sid}")

send_sms()