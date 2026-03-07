"""
Seed script to populate database with sample products
Run: python seed_products.py
"""

import sys
import os

# Add parent directory to path so we can import from root
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend import create_app, db
from backend.models import Product

app = create_app()

SAMPLE_PRODUCTS = [
    {
        'title': 'Couple Love Heart Liquid Glitter Globe',
        'price': 29.99,
        'category': 'Romantic Gifts',
        'image': '/images/products/Product-1.jpeg',
    },
    {
        'title': 'Romantic Couple Figurine Pearl Ornament',
        'price': 34.99,
        'category': 'Romantic Gifts',
        'image': '/images/products/Product-2.jpeg',
    },
    {
        'title': 'Roses & Heart Gift Box with Golden Rose & Teddy',
        'price': 24.99,
        'category': 'Gift Sets',
        'image': '/images/products/Product-3.jpeg',
    },
    {
        'title': 'Cute Bunny Insulated Cups Set',
        'price': 39.99,
        'category': 'Cute Cups',
        'image': '/images/products/Product-4.jpeg',
    },
    {
        'title': 'Breathing Teddy',
        'price': 75.00,
        'category': 'Cute Cups',
        'image': '/images/products/Product-5.jpeg',
    },
    {
        'title': 'Panda Lamp',
        'price': 32.00,
        'category': 'Cute Cups',
        'image': '/images/products/Product-6.jpeg',
    },
    {
        'title': 'Nice Bottle 400ml',
        'price': 7.99,
        'category': 'Cute Cups',
        'image': '/images/products/Product-7.jpeg',
    },
    {
        'title': 'Love Magnet Keychain',
        'price': 15.00,
        'category': 'Cute Cups',
        'image': '/images/products/Product-8.jpeg',
    },
    {
        'title': 'Car Keychain Big',
        'price': 5.00,
        'category': 'Cute Cups',
        'image': '/images/products/Product-9.jpeg',
    },
    {
        'title': 'Face Change Keychain',
        'price': 6.00,
        'category': 'Cute Cups',
        'image': '/images/products/Product-10.jpeg',
    },
    {
        'title': 'Mini Toy Lamp',
        'price': 7.99,
        'category': 'Cute Cups',
        'image': '/images/products/Product-11.jpeg',
    },
]

def seed_database():
    with app.app_context():
        # Clear existing products
        Product.query.delete()
        db.session.commit()
        
        # Add sample products
        for product_data in SAMPLE_PRODUCTS:
            product = Product(**product_data)
            db.session.add(product)
        
        db.session.commit()
        print(f'✓ Successfully seeded {len(SAMPLE_PRODUCTS)} products to the database!')

if __name__ == '__main__':
    seed_database()
