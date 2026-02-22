import { Link } from 'react-router-dom'
import './Cart.css'

const Cart = () => (
  <div className="cart-page">
    <div className="cart-empty">
      <div className="cart-empty__icon">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      </div>
      <h2>Your cart is empty</h2>
      <p>Looks like you haven&apos;t added any gifts yet. Start shopping to fill it up!</p>
      <Link to="/" className="btn-cart">Continue Shopping</Link>
    </div>
  </div>
)

export default Cart
