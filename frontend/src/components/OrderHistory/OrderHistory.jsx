import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './OrderHistory.css'

const OrderHistory = () => {
  const { user, isAuthenticated } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('sk_gift_token')
        const res = await fetch('/api/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          throw new Error('Failed to fetch orders')
        }

        const data = await res.json()
        setOrders(data.orders || [])
      } catch (err) {
        setError(err.message || 'Could not load orders')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="order-history-page">
        <div className="order-history-error">
          <h2>Please log in to view your orders</h2>
          <p>Sign in to see your order history.</p>
          <Link to="/login" className="btn-login">Go to Login</Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="order-history-page">
        <div className="loading-spinner">Loading your orders...</div>
      </div>
    )
  }

  return (
    <div className="order-history-page">
      <div className="order-history-container">
        <h1>Order History</h1>
        
        {error && (
          <div className="order-history-error-msg">{error}</div>
        )}

        {orders.length === 0 ? (
          <div className="order-history-empty">
            <div className="empty-icon">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <h2>No orders yet</h2>
            <p>You haven't placed any orders yet. Start shopping to see your orders here!</p>
            <Link to="/" className="btn-shop">Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order.id}</h3>
                    <p className="order-date">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="order-status">
                    <span className={`status-badge status-${order.status}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="order-details">
                  <div className="detail-item">
                    <span className="detail-label">Total Amount</span>
                    <span className="detail-value">₹{order.total_amount.toFixed(2)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status</span>
                    <span className="detail-value">{order.status}</span>
                  </div>
                </div>

                <button type="button" className="btn-view-details">
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderHistory
