from flask import Blueprint, jsonify, request, current_app
from __init__ import db
from config import OWNER_WHATSAPP_NUMBER
from models import Product, ShippingDetails, Transaction, User, Order
from datetime import datetime
from functools import wraps
import jwt
from twilio.rest import Client
import os
import json
import uuid
from werkzeug.utils import secure_filename
from urllib.parse import quote_plus

api = Blueprint('api', __name__)

def get_secret_key():
    from flask import current_app
    return current_app.config['SECRET_KEY']


def normalize_phone_digits(phone, default_country='91'):
    if not phone:
        return None
    text = str(phone).strip()
    digits = ''.join(ch for ch in text if ch.isdigit())
    if not digits:
        return None
    if len(digits) == 10:
        digits = default_country + digits
    return digits


def normalize_whatsapp_recipient(number):
    digits = normalize_phone_digits(number)
    return f'whatsapp:+{digits}' if digits else None


def phone_to_whatsapp_url(number):
    digits = normalize_phone_digits(number)
    return f'https://wa.me/{digits}' if digits else None


def send_whatsapp_notification(order, user, items=None, shipping_address=None):
    try:
        account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
        auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
        twilio_whatsapp_number = os.environ.get('TWILIO_WHATSAPP_NUMBER')

        if isinstance(shipping_address, str):
            try:
                shipping_address = json.loads(shipping_address)
            except Exception:
                shipping_address = {}

        customer_number = shipping_address.get('phone') if isinstance(shipping_address, dict) else None
        customer_whatsapp = normalize_whatsapp_recipient(customer_number) or normalize_whatsapp_recipient(OWNER_WHATSAPP_NUMBER)
        twilio_whatsapp_number = normalize_whatsapp_recipient(twilio_whatsapp_number)

        if not all([account_sid, auth_token, twilio_whatsapp_number, customer_whatsapp]):
            print("Twilio credentials or customer WhatsApp number not set, skipping WhatsApp notification")
            print(f"account_sid={account_sid}, auth_token={'set' if auth_token else 'missing'}, twilio_whatsapp_number={twilio_whatsapp_number}, customer_whatsapp={customer_whatsapp}")
            return

        print(f"Sending WhatsApp from {twilio_whatsapp_number} to {customer_whatsapp}")
        client = Client(account_sid, auth_token)

        if not shipping_address:
            try:
                shipping_address = json.loads(order.shipping_address)
            except Exception:
                shipping_address = {}

        shipping_fields = {
            'address': shipping_address.get('address', ''),
            'city': shipping_address.get('city', ''),
            'postal_code': shipping_address.get('postal_code', ''),
            'country': shipping_address.get('country', ''),
            'phone': shipping_address.get('phone', ''),
        }

        items = items or []
        items_text = '\n'.join([
            f"- {item.get('title', 'unknown')} | Qty: {item.get('quantity', 1)} | Price: ₹{item.get('price', 0)} | Subtotal: ₹{item.get('price', 0) * item.get('quantity', 1)}"
            for item in items
        ]) if items else 'No items'

        message_body = (
            f"New Order Received!\n\n"
            f"Order ID: {order.id}\n"
            f"Status: {order.status}\n"
            f"Total Amount: ₹{order.total_amount}\n\n"
            f"Shipping Address:\n"
            f"{shipping_fields['address']}\n"
            f"{shipping_fields['city']}, {shipping_fields['postal_code']}\n"
            f"{shipping_fields['country']}\n"
            f"Phone: {shipping_fields['phone']}\n\n"
            f"Items:\n{items_text}\n\n"
            f"Thank you for shopping with us! We will contact you shortly to confirm your order."
        )

        message = client.messages.create(
            body=message_body,
            from_=twilio_whatsapp_number,
            to=customer_whatsapp
        )
        print(f"WhatsApp notification sent: {message.sid} to {customer_whatsapp}")
    except Exception as e:
        print(f"Error sending WhatsApp notification: {e}")

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Token required'}), 401
        
        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, get_secret_key(), algorithms=['HS256'])
            user = User.query.get(payload['user_id'])
            if not user:
                return jsonify({'error': 'User not found'}), 401
            request.user_id = user.id
            request.user = user
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        
        return f(*args, **kwargs)
    return decorated

def admin_required(f):
    @wraps(f)
    @token_required
    def decorated(*args, **kwargs):
        if not getattr(request, 'user', None) or not request.user.is_admin:
            return jsonify({'error': 'Admin privileges required'}), 403
        return f(*args, **kwargs)
    return decorated

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@api.route('/upload', methods=['POST'])
@admin_required
def upload_file():
    if 'image' not in request.files:
        return jsonify({'error': 'No image part'}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Append UUID to prevent collisions
        unique_filename = f"{uuid.uuid4().hex}_{filename}"
        
        # Ensure upload directory exists
        upload_folder = current_app.config.get('UPLOAD_FOLDER', os.path.join(current_app.root_path, 'static', 'uploads'))
        os.makedirs(upload_folder, exist_ok=True)
        
        file_path = os.path.join(upload_folder, unique_filename)
        file.save(file_path)
        
        # Return URL
        return jsonify({'url': f'/static/uploads/{unique_filename}'}), 201
    return jsonify({'error': 'File type not allowed'}), 400


# Products API
@api.route('/products', methods=['GET'])
def list_products():
    products = Product.query.all()
    return jsonify({
        'products': [{
            'id': p.id,
            'title': p.title,
            'description': p.description,
            'price': p.price,
            'category': p.category,
            'image': p.image,
        } for p in products]
    })

@api.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    return jsonify({
        'product': {
            'id': product.id,
            'title': product.title,
            'description': product.description,
            'price': product.price,
            'category': product.category,
            'image': product.image,
        }
    })

@api.route('/products', methods=['POST'])
@admin_required
def create_product():
    data = request.get_json()
    if not data or not data.get('title') or not data.get('price'):
        return jsonify({'error': 'Title and price are required'}), 400
    
    product = Product(
        title=data.get('title'),
        description=data.get('description', ''),
        price=float(data.get('price')),
        category=data.get('category', ''),
        image=data.get('image', '')
    )
    db.session.add(product)
    db.session.commit()
    
    return jsonify({
        'product': {
            'id': product.id,
            'title': product.title,
            'description': product.description,
            'price': product.price,
            'category': product.category,
            'image': product.image,
        }
    }), 201

@api.route('/products/<int:product_id>', methods=['PUT'])
@admin_required
def update_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404
        
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
        
    if 'title' in data:
        product.title = data['title']
    if 'description' in data:
        product.description = data['description']
    if 'price' in data:
        product.price = float(data['price'])
    if 'category' in data:
        product.category = data['category']
    if 'image' in data:
        product.image = data['image']
        
    db.session.commit()
    
    return jsonify({
        'product': {
            'id': product.id,
            'title': product.title,
            'description': product.description,
            'price': product.price,
            'category': product.category,
            'image': product.image,
        }
    })

@api.route('/products/<int:product_id>', methods=['DELETE'])
@admin_required
def delete_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404
        
    db.session.delete(product)
    db.session.commit()
    
    return jsonify({'message': 'Product deleted successfully'})

# Shipping API
@api.route('/shipping', methods=['POST'])
@token_required
def create_shipping():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    shipping = ShippingDetails(
        user_id=request.user_id,
        address=data.get('address'),
        city=data.get('city'),
        postal_code=data.get('postal_code'),
        country=data.get('country'),
        phone=data.get('phone')
    )
    db.session.add(shipping)
    db.session.commit()
    return jsonify({
        'shipping': {
            'id': shipping.id,
            'address': shipping.address,
            'city': shipping.city,
            'postal_code': shipping.postal_code,
            'country': shipping.country,
            'phone': shipping.phone,
        }
    }), 201

@api.route('/shipping/<int:shipping_id>', methods=['GET'])
@token_required
def get_shipping(shipping_id):
    shipping = ShippingDetails.query.get(shipping_id)
    if not shipping or shipping.user_id != request.user_id:
        return jsonify({'error': 'Shipping not found'}), 404
    return jsonify({
        'shipping': {
            'id': shipping.id,
            'address': shipping.address,
            'city': shipping.city,
            'postal_code': shipping.postal_code,
            'country': shipping.country,
            'phone': shipping.phone,
        }
    })

# Orders API
@api.route('/orders', methods=['POST'])
@token_required
def create_order():
    data = request.get_json()
    if not data or 'items' not in data:
        return jsonify({'error': 'Items required'}), 400
    
    items = data.get('items', [])
    total_amount = sum(item.get('price', 0) * item.get('quantity', 1) for item in items)
    
    shipping_address = data.get('shipping_address', {})
    owner_whatsapp_url = phone_to_whatsapp_url(OWNER_WHATSAPP_NUMBER)
    order = Order(
        user_id=request.user_id,
        total_amount=total_amount,
        shipping_address=json.dumps(shipping_address),
        status='pending',
        items_json=json.dumps(items)
    )
    db.session.add(order)
    db.session.commit()
    
    # Send WhatsApp notification to customer
    user = User.query.get(request.user_id)
    if user:
        send_whatsapp_notification(order, user, items, shipping_address)
    
    return jsonify({
        'order': {
            'id': order.id,
            'user_id': order.user_id,
            'total_amount': order.total_amount,
            'status': order.status,
            'created_at': order.created_at.isoformat(),
            'whatsapp_link': generate_whatsapp_link(order, items, shipping_address),
            'owner_whatsapp_url': owner_whatsapp_url
        }
    }), 201

@api.route('/orders/<int:order_id>', methods=['GET'])
@token_required
def get_order(order_id):
    order = Order.query.get(order_id)
    if not order or order.user_id != request.user_id:
        return jsonify({'error': 'Order not found'}), 404
    return jsonify({
        'order': {
            'id': order.id,
            'user_id': order.user_id,
            'total_amount': order.total_amount,
            'status': order.status,
            'shipping_address': order.shipping_address,
            'created_at': order.created_at.isoformat(),
        }
    })

@api.route('/orders', methods=['GET'])
@token_required
def list_orders():
    orders = Order.query.filter_by(user_id=request.user_id).all()
    return jsonify({
        'orders': [{
            'id': o.id,
            'total_amount': o.total_amount,
            'status': o.status,
            'created_at': o.created_at.isoformat(),
        } for o in orders]
    })

# Transactions API
@api.route('/transactions', methods=['POST'])
@token_required
def create_transaction():
    data = request.get_json()
    if not data or 'order_id' not in data:
        return jsonify({'error': 'Order ID required'}), 400
    
    order = Order.query.get(data.get('order_id'))
    if not order or order.user_id != request.user_id:
        return jsonify({'error': 'Order not found'}), 404
    
    transaction = Transaction(
        order_id=order.id,
        amount=order.total_amount,
        status='completed',
        payment_method=data.get('payment_method', 'card')
    )
    db.session.add(transaction)
    order.status = 'completed'
    db.session.commit()
    
    return jsonify({
        'transaction': {
            'id': transaction.id,
            'order_id': transaction.order_id,
            'amount': transaction.amount,
            'status': transaction.status,
        }
    }), 201
def generate_whatsapp_link(order, items, shipping_address):
    owner_number = phone_to_whatsapp_url(OWNER_WHATSAPP_NUMBER).replace('https://wa.me/', '')
    items_text = '\n'.join([f"- {item.get('title', 'unknown')} x{item.get('quantity', 1)}" for item in items]) if items else 'No items'
    message = (
        f"New Order Received!\n"
        f"Order ID: {order.id}\n"
        f"Status: {order.status}\n"
        f"Total: ₹{order.total_amount}\n\n"
        f"Shipping Address:\n"
        f"{shipping_address.get('address', '')}\n"
        f"{shipping_address.get('city', '')}, {shipping_address.get('postal_code', '')}\n"
        f"{shipping_address.get('country', '')}\n"
        f"Phone: {shipping_address.get('phone', '')}\n\n"
        f"Items:\n{items_text}"
    )
    return f"https://wa.me/{owner_number}?text={quote_plus(message)}"
