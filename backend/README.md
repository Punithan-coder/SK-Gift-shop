Backend stub — replace with your preferred framework (Flask, Django, Express, etc.).

Files:
- `app.py` - app entry
- `models.py` - data models
- `routes.py` - api endpoints

WhatsApp notification setup:
- `TWILIO_ACCOUNT_SID` (Twilio account SID)
- `TWILIO_AUTH_TOKEN` (Twilio auth token)
- `TWILIO_WHATSAPP_NUMBER` (twilio sender, e.g. `whatsapp:+14155238886`)
- `SHOP_OWNER_PHONE_NUMBER` (fallback number)

Orders API `/api/orders` now saves shipping + items JSON and triggers WhatsApp alerts to the customer when available.
