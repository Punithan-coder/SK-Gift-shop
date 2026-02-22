import { useState } from 'react'
import './Contactpage.css'

const Contactpage = () => {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="contact-page">
      {!showForm ? (
        <>
          <section className="contact-intro">
            <span className="contact-badge">Reach Out</span>
            <h1>Contact Us</h1>
            <p>
              Have questions or need assistance? Our customer support team is here to help! Whether
              you have inquiries about our products, need help with an order, or want to provide
              feedback, we&apos;re just a message away.
            </p>
          </section>

          <div className="contact-info">
            <div className="contact-info__item">
              <div className="contact-info__icon">📞</div>
              <div>
                <h3>Phone</h3>
                <p>+84 385 298 15</p>
              </div>
            </div>
            <div className="contact-info__item">
              <div className="contact-info__icon">✉️</div>
              <div>
                <h3>Email</h3>
                <p>support@skgiftshop.com</p>
              </div>
            </div>
            <button type="button" className="btn-contact" onClick={() => setShowForm(true)}>
              Contact Us
            </button>
          </div>
        </>
      ) : (
        <div className="contact-form-wrap">
          <h2>Send a Message</h2>
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" placeholder="John Doe" required />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" placeholder="Enter your phone number" />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <select id="subject">
                <option value="">Select a subject</option>
                <option value="order">Order Inquiry</option>
                <option value="custom">Custom Gift Inquiry</option>
                <option value="feedback">Feedback</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" rows={5} placeholder="How can we help you create magic today?" />
            </div>
            <button type="submit" className="btn-send">Send Message →</button>
          </form>
          <button type="button" className="btn-back" onClick={() => setShowForm(false)}>
            ← Back
          </button>
        </div>
      )}
    </div>
  )
}

export default Contactpage
