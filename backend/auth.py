import jwt
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify
from __init__ import db
from models import User
from flask_bcrypt import Bcrypt

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
bcrypt = Bcrypt()


def get_secret_key():
    from flask import current_app
    return current_app.config['SECRET_KEY']


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    if not email or '@' not in email:
        return jsonify({'error': 'Valid email required'}), 400
    if len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 409

    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(email=email, password_hash=password_hash)
    db.session.add(user)
    db.session.commit()

    token = jwt.encode(
        {'user_id': user.id, 'exp': datetime.utcnow() + timedelta(days=365)},
        get_secret_key(),
        algorithm='HS256'
    )

    return jsonify({
        'token': token,
        'user': {'id': user.id, 'email': user.email, 'is_admin': user.is_admin}
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({'error': 'Invalid email or password'}), 401

    token = jwt.encode(
        {'user_id': user.id, 'exp': datetime.utcnow() + timedelta(days=365)},
        get_secret_key(),
        algorithm='HS256'
    )

    return jsonify({
        'token': token,
        'user': {'id': user.id, 'email': user.email, 'is_admin': user.is_admin}
    })


@auth_bp.route('/me', methods=['GET'])
def me():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Token required'}), 401

    token = auth_header.split(' ')[1]
    try:
        payload = jwt.decode(token, get_secret_key(), algorithms=['HS256'])
        user = User.query.get(payload['user_id'])
        if not user:
            return jsonify({'error': 'User not found'}), 401
        return jsonify({'user': {'id': user.id, 'email': user.email, 'is_admin': user.is_admin}})
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
