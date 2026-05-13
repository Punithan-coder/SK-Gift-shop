import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import './Checkout.css'

const Checkout = () => {
  const navigate = useNavigate()
  const { items, totalPrice, clearCart } = useCart()
  const [step, setStep] = useState(1) // 1: shipping, 2: confirmation
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [orderData, setOrderData] = useState(null)
  const [whatsappUrl, setWhatsappUrl] = useState(null)

  const [shippingForm, setShippingForm] = useState({
    address: '',
    city: '',
    postal_code: '',
    country: '',
    phone: '',
  })

  if (!items.length && step === 1) {
    return (
      <div className="checkout-page">
        <div className="checkout-error">
          <h2>Your cart is empty</h2>
          <p>Add some items before proceeding to checkout.</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  const handleShippingChange = (e) => {
    const { name, value } = e.target
    setShippingForm((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const validateShipping = () => {
    const { address, city, postal_code, country, phone } = shippingForm
    if (!address || !city || !postal_code || !country || !phone) {
      setError('Please fill in all shipping fields')
      return false
    }
    if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
      setError('Please enter a valid phone number')
      return false
    }
    return true
  }

  const handlePlaceOrder = () => {
    if (whatsappUrl) {
      window.open(whatsappUrl, '_blank')
    }
  }


  const buildWhatsappUrl = () => {
    const cleanPhone = (process.env.REACT_APP_WHATSAPP_NUMBER || '918438529815').replace(/\D/g, '')
    const orderLines = items.map(
      (item, index) =>
        `${index + 1}. ${item.product.title} x ${item.quantity} = Rs.${(item.product.price * item.quantity).toFixed(2)}`
    )
    const message = [
      'Hello SK Gift Shop, I want to place this order:',
      '',
      ...orderLines,
      '',
      `Subtotal: Rs.${totalPrice.toFixed(2)}`,
      `Total: Rs.${totalPrice.toFixed(2)}`,
      '',
      'Shipping Details:',
      `Address: ${shippingForm.address}`,
      `City: ${shippingForm.city}`,
      `Postal Code: ${shippingForm.postal_code}`,
      `Country: ${shippingForm.country}`,
      `Phone: ${shippingForm.phone}`,
    ].join('\n')

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
  }

  const handleShippingNext = async () => {
    if (!validateShipping()) return

    setLoading(true)
    setError('')

    try {
      const whatsappLink = buildWhatsappUrl()
      setOrderData({
        id: Date.now(),
        total_amount: totalPrice,
      })
      setWhatsappUrl(whatsappLink)
      setStep(2)
      clearCart()
    } catch (err) {
      setError(err.message || 'Checkout failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <div className="checkout-steps">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-label">Shipping</span>
            </div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="checkout-content">
          <div className="checkout-main">
            {step === 2 && orderData && (
              <div className="checkout-confirmation">
                <div className="confirmation-animation" />
                <div className="confirmation-success">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <h2>Order Received!</h2>
                  <p>Click 'Send Order Details' to send your order via WhatsApp for confirmation.</p>
                </div>

                <div className="confirmation-details">
                  <div className="detail-section">
                    <h3>Order Number</h3>
                    <p className="detail-value">#{orderData.id}</p>
                  </div>

                  <div className="detail-section">
                    <h3>Total Amount</h3>
                    <p className="detail-value">₹{orderData.total_amount.toFixed(2)}</p>
                  </div>

                  <div className="detail-section">
                    <h3>Shipping Address</h3>
                    <p>
                      {shippingForm.address}
                      <br />
                      {shippingForm.city}, {shippingForm.postal_code}
                      <br />
                      {shippingForm.country}
                    </p>
                  </div>
                </div>

                <div className="confirmation-actions">
                  <button
                    onClick={handlePlaceOrder}
                    className="btn-primary btn-large"
                    disabled={!whatsappUrl}
                  >
                    Send Order Details via WhatsApp
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="btn-secondary btn-large"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="checkout-form">
                <h2>Shipping Address</h2>
                {error && <div className="checkout-error-msg">{error}</div>}
                <form>
                  <div className="form-group">
                    <label htmlFor="address">Street Address</label>
                    <input
                      id="address"
                      type="text"
                      name="address"
                      value={shippingForm.address}
                      onChange={handleShippingChange}
                      placeholder="123 Main St"
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="city">City</label>
                      <input
                        id="city"
                        type="text"
                        name="city"
                        value={shippingForm.city}
                        onChange={handleShippingChange}
                        placeholder="New York"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="postal_code">Postal Code</label>
                      <input
                        id="postal_code"
                        type="text"
                        name="postal_code"
                        value={shippingForm.postal_code}
                        onChange={handleShippingChange}
                        placeholder="10001"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="country">Country</label>
                      <input
                        id="country"
                        type="text"
                        name="country"
                        value={shippingForm.country}
                        onChange={handleShippingChange}
                        placeholder="United States"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone</label>
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={shippingForm.phone}
                        onChange={handleShippingChange}
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleShippingNext}
                    className="btn-primary btn-large"
                    disabled={loading}
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </button>
                </form>
              </div>
            )}

            {step === 3 && orderData && (
              <div className="checkout-confirmation">
                <div className="confirmation-success">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <h2>Order Confirmed!</h2>
                  <p>Thank you for your purchase.</p>
                </div>

                <div className="confirmation-details">
                  <div className="detail-section">
                    <h3>Order Number</h3>
                    <p className="detail-value">#{orderData.order.id}</p>
                  </div>

                  <div className="detail-section">
                    <h3>Total Amount</h3>
                    <p className="detail-value">₹{orderData.order.total_amount.toFixed(2)}</p>
                  </div>

                  <div className="detail-section">
                    <h3>Shipping Address</h3>
                    <p>
                      {shippingForm.address}
                      <br />
                      {shippingForm.city}, {shippingForm.postal_code}
                      <br />
                      {shippingForm.country}
                    </p>
                  </div>

                  <div className="detail-section">
                    <h3>Order Status</h3>
                    <p className="status-badge status-completed">{orderData.order.status}</p>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/')}
                  className="btn-primary btn-large"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="checkout-sidebar">
            <h3>Order Summary</h3>
            <div className="order-items">
              {items.map((item) => (
                <div key={item.product.id} className="order-item">
                  <div className="order-item-info">
                    <p className="order-item-title">{item.product.title}</p>
                    <p className="order-item-qty">Qty: {item.quantity}</p>
                  </div>
                  <p className="order-item-price">
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="total-row total-final">
                <span>Total:</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
