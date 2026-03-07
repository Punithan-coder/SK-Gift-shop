import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import './Cart.css'

const Cart = () => {
  const { items, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login')
    } else {
      navigate('/checkout')
    }
  }

  if (!items.length) {
    return (
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
  }

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      <ul className="cart-items">
        {items.map((item) => (
          <li key={item.product.id} className="cart-item">
            {item.product.image && (
              <img src={item.product.image} alt={item.product.title} loading="lazy" />
            )}
            <div className="cart-item-details">
              <h3>{item.product.title}</h3>
              <p>₹{item.product.price?.toFixed(2)}</p>
              <div className="cart-item-actions">
                <label>
                  Qty:
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value, 10) || 1)}
                  />
                </label>
                <button type="button" onClick={() => removeFromCart(item.product.id)}>
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="cart-summary">
        <p>Total: ₹{totalPrice.toFixed(2)}</p>
        <div className="cart-actions">
          <button type="button" onClick={clearCart} className="btn-clear">
            🗑️ Clear Cart
          </button>
          <button type="button" onClick={handleCheckout} className="btn-checkout">
            🛒 Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cart
