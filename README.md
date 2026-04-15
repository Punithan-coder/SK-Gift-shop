# SK Gift Shop

A full-stack e-commerce application for a gift shop, built with React frontend and Flask backend.

## Features

- 🛍️ Product catalog with categories
- 🛒 Shopping cart functionality
- 🔐 User authentication (login/signup)
- 📱 Responsive design for mobile and desktop
- 💳 Checkout process
- 📦 Order history
- 📞 Contact page

## Tech Stack

- **Frontend**: React, React Router, CSS
- **Backend**: Flask, SQLAlchemy, JWT authentication
- **Database**: SQLite (development) / PostgreSQL (production)
- **Deployment**: Railway (recommended)

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/SK-Gift-shop.git
   cd SK-Gift-shop
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate  # On Windows
   pip install -r requirements.txt
   cp .env.example .env  # Configure your environment variables
   python app.py
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Deployment

For production deployment and to make the app accessible to users worldwide, see the [Deployment Guide](DEPLOYMENT_GUIDE.md).

### Quick Deploy to Railway

1. Connect your GitHub repo to [Railway](https://railway.app)
2. Deploy both frontend and backend services
3. Set environment variables
4. Your app will be live with a Railway domain

## Project Structure

```
SK-Gift-shop/
├── backend/                 # Flask API
│   ├── app.py              # Main application
│   ├── models.py           # Database models
│   ├── routes.py           # API routes
│   ├── auth.py             # Authentication
│   ├── config.py           # Configuration
│   └── requirements.txt    # Python dependencies
├── frontend/                # React app
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React context
│   │   └── data/           # Static data
│   └── package.json        # Node dependencies
├── docs/                   # Documentation
└── DEPLOYMENT_GUIDE.md     # Deployment instructions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.