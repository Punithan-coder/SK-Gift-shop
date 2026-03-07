from flask import Blueprint, jsonify, request
from . import db
from .models import Product, ShippingDetails, Transaction, User, Order
from datetime import datetime
from functools import wraps
import jwt

api = Blueprint('api', __name__)

def get_secret_key():
    from flask import current_app
    return current_app.config['SECRET_KEY']

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

# Products API
@api.route('/products', methods=['GET'])
def list_products():
    products = Product.query.all()
    return jsonify({
        'products': [{
            'id': p.id,
            'title': p.title,
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
            'price': product.price,
            'category': product.category,
            'image': product.image,
        }
    })

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
    
    order = Order(
        user_id=request.user_id,
        total_amount=total_amount,
        shipping_address=data.get('shipping_address'),
        status='pending',
        items_json=str(items)
    )
    db.session.add(order)
    db.session.commit()
    
    return jsonify({
        'order': {
            'id': order.id,
            'user_id': order.user_id,
            'total_amount': order.total_amount,
            'status': order.status,
            'created_at': order.created_at.isoformat(),
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
