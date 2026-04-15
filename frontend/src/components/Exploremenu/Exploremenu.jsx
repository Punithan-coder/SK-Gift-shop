import { Link } from 'react-router-dom'
import './Exploremenu.css'

const CATEGORIES = [
  { name: 'Romantic Gifts', icon: '💝' },
  { name: 'Gift Sets', icon: '🎁' },
  { name: 'Cute Cups', icon: '☕' },
]

const Exploremenu = () => (
  <section className="explore-section">
    <div className="explore-grid">
      {CATEGORIES.map((cat) => (
        <Link
          key={cat.name}
          to={`/?cat=${encodeURIComponent(cat.name)}#products`}
          className="explore-card"
        >
          <span className="explore-card__icon">{cat.icon}</span>
          <span className="explore-card__name">{cat.name}</span>
        </Link>
      ))}
    </div>
  </section>
)

export default Exploremenu
