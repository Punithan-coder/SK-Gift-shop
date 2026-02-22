import os

SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-change-in-production'
SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///skgiftshop.db'
SQLALCHEMY_TRACK_MODIFICATIONS = False
BCRYPT_LOG_ROUNDS = 12
