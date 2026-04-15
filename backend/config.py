import os

SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-change-in-production'
SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///skgiftshop.db'
SQLALCHEMY_TRACK_MODIFICATIONS = False
BCRYPT_LOG_ROUNDS = 12

# Twilio settings for WhatsApp notifications
TWILIO_ACCOUNT_SID = os.environ.get('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.environ.get('TWILIO_AUTH_TOKEN')
TWILIO_WHATSAPP_NUMBER = os.environ.get('TWILIO_WHATSAPP_NUMBER')
OWNER_WHATSAPP_NUMBER = '+918438529815'  # Your WhatsApp number
