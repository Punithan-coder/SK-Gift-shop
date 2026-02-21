# Placeholder API routes — wire these to real implementations later
from flask import Blueprint, jsonify

api = Blueprint('api', __name__)

@api.route('/products')
def list_products():
    return jsonify({'products': []})

@api.route('/shipping')
def shipping_info():
    return jsonify({'shipping': {}})

@api.route('/transactions')
def transactions():
    return jsonify({'transactions': []})
