import { useState } from 'react'
import './Contactpage.css'

const Contactpage = () => {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subject: '',
    message: '',
  })

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const ownerPhone = (process.env.REACT_APP_WHATSAPP_NUMBER || '918438529815').replace(/\D/g, '')
    const subjectText = formData.subject || 'General Inquiry'
    const text = [
      'Hello SK Gift Shop,',
      '',
      `Name: ${formData.name}`,
      `Phone: ${formData.phone || 'Not provided'}`,
      `Subject: ${subjectText}`,
      `Message: ${formData.message || 'No message'}`,
    ].join('\n')

    const whatsappUrl = `https://wa.me/${ownerPhone}?text=${encodeURIComponent(text)}`
    window.open(whatsappUrl, '_blank')
  }

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
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" placeholder="Enter your phone number" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <select id="subject" value={formData.subject} onChange={handleChange}>
                <option value="">Select a subject</option>
                <option value="Order Inquiry">Order Inquiry</option>
                <option value="Custom Gift Inquiry">Custom Gift Inquiry</option>
                <option value="Feedback">Feedback</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" rows={5} placeholder="How can we help you create magic today?" value={formData.message} onChange={handleChange} />
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
