import { useState, useCallback, useEffect } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import './Navbar.css'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') ?? '')
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, isAuthenticated, loading } = useAuth()
  const { itemCount } = useCart()

  const isActive = (path) => location.pathname === path

  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), [])

  useEffect(() => {
    setSearchQuery(searchParams.get('q') ?? '')
  }, [searchParams])

  const handleSearch = (e) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (q) {
      navigate(`/?q=${encodeURIComponent(q)}`)
    } else {
      navigate('/')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className={`nav-head ${menuOpen ? 'menu-open' : ''}`}>
      <Link to="/" className="nav-logo">
        <h1>SK Gift Shop</h1>
      </Link>

      <nav className="nav-center">
        <ul className="nav-links">
          <li><Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link></li>
          <li><Link to="/#products">Products</Link></li>
          <li><Link to="/contact" className={isActive('/contact') ? 'active' : ''}>Contact</Link></li>
        </ul>
        <form className="search-bar" onSubmit={handleSearch} role="search">
          <input
            type="search"
            placeholder="Search gifts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search products"
          />
          <button type="submit">Search</button>
        </form>
      </nav>

      <div className="nav-actions">
        <Link to="/cart" className="cart-btn" aria-label="View cart">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
        </Link>
        {loading ? (
          <span className="nav-auth-loading">...</span>
        ) : isAuthenticated ? (
          <div className="nav-user">
            <span className="nav-user__email">{user?.email}</span>
            <button type="button" className="signout-btn" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <>
            <Link to="/login" className="signin-btn">Sign In</Link>
            <Link to="/signup" className="signup-btn">Sign Up</Link>
          </>
        )}
      </div>

      <button
        type="button"
        className={`hamburger ${menuOpen ? 'is-active' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        <span className="bar" />
        <span className="bar" />
        <span className="bar" />
      </button>
    </header>
  )
}

export default Navbar
