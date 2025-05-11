from twilio.rest import Client

def send_sms():
    account_sid = "AC6ab455d20c4036b286acc242dce5359d" 
    auth_token = "71001e27c6332d018f70b555f3acc766" 
    client = Client(account_sid, auth_token)

    message = client.messages.create(
        body="🚨 This is an emergency message sent using Twilio!",
        from_="+918431637797",        # Your Twilio phone number
        to="+916361002354"            # Your verified phone number
    )

    print(f"Message sent! SID: {message.sid}")

send_sms()
