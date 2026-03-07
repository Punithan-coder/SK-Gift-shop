import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import './Checkout.css'

const Checkout = () => {
  const navigate = useNavigate()
  const { items, totalPrice, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const [step, setStep] = useState(1) // 1: shipping, 2: payment, 3: confirmation
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [orderData, setOrderData] = useState(null)

  const [shippingForm, setShippingForm] = useState({
    address: '',
    city: '',
    postal_code: '',
    country: '',
    phone: '',
  })

  const [paymentForm, setPaymentForm] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    paymentMethod: 'card',
  })

  if (!isAuthenticated) {
    return (
      <div className="checkout-page">
        <div className="checkout-error">
          <h2>Please log in to checkout</h2>
          <p>You need to be signed in to complete your purchase.</p>
          <button onClick={() => navigate('/login')} className="btn-primary">
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  if (!items.length) {
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

  const handlePaymentChange = (e) => {
    const { name, value } = e.target
    setPaymentForm((prev) => ({ ...prev, [name]: value }))
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

  const validatePayment = () => {
    const { cardName, cardNumber, expiryDate, cvv } = paymentForm
    if (!cardName || !cardNumber || !expiryDate || !cvv) {
      setError('Please fill in all payment fields')
      return false
    }
    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
      setError('Please enter a valid card number (16 digits)')
      return false
    }
    if (!/^\d{3,4}$/.test(cvv)) {
      setError('Please enter a valid CVV')
      return false
    }
    return true
  }

  const handleShippingNext = () => {
    if (validateShipping()) {
      setStep(2)
      setError('')
    }
  }

  const handlePaymentSubmit = async () => {
    if (!validatePayment()) return

    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('sk_gift_token')
      
      // Create order
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            product_id: item.product.id,
            title: item.product.title,
            price: item.product.price,
            quantity: item.quantity,
          })),
          shipping_address: shippingForm,
        }),
      })

      if (!orderRes.ok) {
        const errData = await orderRes.json()
        throw new Error(errData.error || 'Failed to create order')
      }

      const orderReply = await orderRes.json()
      const order = orderReply.order

      // Create transaction
      const txRes = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          order_id: order.id,
          payment_method: paymentForm.paymentMethod,
          amount: totalPrice,
        }),
      })

      if (!txRes.ok) {
        throw new Error('Payment processing failed')
      }

      const txReply = await txRes.json()
      setOrderData({ order, transaction: txReply.transaction })
      setStep(3)
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
              <span className="step-label">Payment</span>
            </div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>
              <span className="step-number">3</span>
              <span className="step-label">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="checkout-content">
          <div className="checkout-main">
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
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="checkout-form">
                <h2>Payment Information</h2>
                {error && <div className="checkout-error-msg">{error}</div>}
                <form>
                  <div className="form-group">
                    <label htmlFor="cardName">Cardholder Name</label>
                    <input
                      id="cardName"
                      type="text"
                      name="cardName"
                      value={paymentForm.cardName}
                      onChange={handlePaymentChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cardNumber">Card Number</label>
                    <input
                      id="cardNumber"
                      type="text"
                      name="cardNumber"
                      value={paymentForm.cardNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\s/g, '').slice(0, 16)
                        setPaymentForm((prev) => ({
                          ...prev,
                          cardNumber: val.replace(/(\d{4})/g, '$1 ').trim(),
                        }))
                      }}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="expiryDate">Expiry Date</label>
                      <input
                        id="expiryDate"
                        type="text"
                        name="expiryDate"
                        value={paymentForm.expiryDate}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '').slice(0, 4)
                          if (val.length >= 2) {
                            val = val.slice(0, 2) + '/' + val.slice(2)
                          }
                          setPaymentForm((prev) => ({ ...prev, expiryDate: val }))
                        }}
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="cvv">CVV</label>
                      <input
                        id="cvv"
                        type="text"
                        name="cvv"
                        value={paymentForm.cvv}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 4)
                          setPaymentForm((prev) => ({ ...prev, cvv: val }))
                        }}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                  <div className="button-group">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="btn-secondary"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handlePaymentSubmit}
                      className="btn-primary btn-large"
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Complete Purchase'}
                    </button>
                  </div>
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
              <div className="total-row">
                <span>Shipping:</span>
                <span>₹10.00</span>
              </div>
              <div className="total-row total-final">
                <span>Total:</span>
                <span>₹{(totalPrice + 10).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
