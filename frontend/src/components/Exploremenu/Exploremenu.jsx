import { Link } from 'react-router-dom'
import './Exploremenu.css'

const CATEGORIES = [
  { name: 'Gift Sets', icon: '🎁' },
  { name: 'Personalized', icon: '✏️' },
  { name: 'Gourmet', icon: '🍫' },
  { name: 'Home Décor', icon: '🏠' },
  { name: 'Wellness', icon: '✨' },
]

const Exploremenu = () => (
  <section className="explore-section">
    <h2>Shop by Category</h2>
    <div className="explore-grid">
      {CATEGORIES.map((cat) => (
        <Link key={cat.name} to="/#products" className="explore-card">
          <span className="explore-card__icon">{cat.icon}</span>
          <span className="explore-card__name">{cat.name}</span>
        </Link>
      ))}
    </div>
  </section>
)

export default Exploremenu
