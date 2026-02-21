# Placeholder data model classes — replace with ORM models later

class Product:
    def __init__(self, id=None, title=None, price=None, category=None):
        self.id = id
        self.title = title
        self.price = price
        self.category = category

class Category:
    def __init__(self, id=None, name=None):
        self.id = id
        self.name = name

class ShippingDetails:
    def __init__(self, address=None, city=None, postal_code=None, country=None):
        self.address = address
        self.city = city
        self.postal_code = postal_code
        self.country = country

class Transaction:
    def __init__(self, id=None, amount=None, status=None):
        self.id = id
        self.amount = amount
        self.status = status
