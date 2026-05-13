from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv


# Load environment variables from .env file
load_dotenv()

db = SQLAlchemy()
bcrypt = Bcrypt()


def create_app():
    app = Flask(__name__)
    import os
    _backend_dir = os.path.dirname(os.path.abspath(__file__))
    if _backend_dir not in __import__('sys').path:
        __import__('sys').path.insert(0, _backend_dir)

    app.config.from_object('config')

    CORS(app, origins=[os.getenv('FRONTEND_URL', 'http://localhost:3000')], supports_credentials=True)
    db.init_app(app)
    bcrypt.init_app(app)

    from auth import auth_bp
    from routes import api as api_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(api_bp, url_prefix='/api')

    @app.route('/')
    def index():
        return {'message': 'SK Gift Shop API'}

    with app.app_context():
        db.create_all()

    return app
