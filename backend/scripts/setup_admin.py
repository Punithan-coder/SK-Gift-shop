import os
import sys
import sqlite3
from flask import Flask

# Add the backend directory to the path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from __init__ import create_app, db, bcrypt
from models import User

def upgrade_db():
    print("Upgrading database schema...")
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    db_path = os.path.join(base_dir, 'instance', 'skgiftshop.db')
    
    if os.path.exists(db_path):
        try:
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            
            # Check if is_admin exists in users
            cursor.execute("PRAGMA table_info(users)")
            columns = [info[1] for info in cursor.fetchall()]
            if 'is_admin' not in columns:
                print("Adding 'is_admin' to users table...")
                cursor.execute("ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT 0")
            
            # Check if description exists in products
            cursor.execute("PRAGMA table_info(products)")
            columns = [info[1] for info in cursor.fetchall()]
            if 'description' not in columns:
                print("Adding 'description' to products table...")
                cursor.execute("ALTER TABLE products ADD COLUMN description TEXT")
                
            conn.commit()
            conn.close()
            print("Database schema upgraded successfully.")
        except Exception as e:
            print(f"Error upgrading database: {e}")
    else:
        print(f"Database not found at {db_path}. It will be created by db.create_all().")

def create_admin():
    app = create_app()
    with app.app_context():
        upgrade_db()
        
        email = 'admin@skgiftshop.com'
        password = 'admin'
        
        admin = User.query.filter_by(email=email).first()
        if admin:
            if not admin.is_admin:
                admin.is_admin = True
                db.session.commit()
                print(f"User {email} updated to admin.")
            else:
                print(f"Admin {email} already exists.")
        else:
            password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
            admin = User(email=email, password_hash=password_hash, is_admin=True)
            db.session.add(admin)
            db.session.commit()
            print(f"Created admin user: {email} with password: {password}")

if __name__ == '__main__':
    create_admin()
