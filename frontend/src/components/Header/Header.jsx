import { Link } from 'react-router-dom'
import './Header.css'

const Header = () => (
  <header className="hero">
    <div className="hero-bg" />
    <div className="hero-content">
      <span className="hero-badge">Curated for Every Occasion</span>
      <h1>Gifts That Create Moments</h1>
      <p>Discover unique, thoughtful gifts for the people who matter most. From personalized keepsakes to luxurious treats.</p>
      <div className="hero-actions">
        <Link to="/contact" className="btn btn-outline">Contact Us</Link>
      </div>
    </div>
  </header>
)

export default Header
