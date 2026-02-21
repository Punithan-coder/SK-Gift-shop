
import React, { useState } from 'react'
import './Contactpage.css'
import phoneIcon from '../../assets/phone.png'
import email from '../../assets/email.png'

function Contactpage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="Contactpage">
      {!showForm ? (
        <>
          {/* Info section */}
          <div className="Customer-support">
            <p className='reach'>Reach Out</p>
            <h1 className='cont'>Contact Us</h1>
            <p className='read-text'>
              Have questions or need assistance? Our customer support team is here to help!
              Whether you have inquiries about our products, need help with an order, or want to provide feedback,
              we're just a message away. Contact us through the form below, and we'll get back to you as soon as possible.
              Your satisfaction is our priority!
            </p>
          </div>

          <div className='Contact-info'>
            <div className='info'>
              <img className='img' src={phoneIcon} alt="Phone" />
              <div className='info-text'>
                <h3>Phone</h3>
                <p>+8438529815</p>
              </div>
            </div>
            <div className='info'>
              <img className='img' src={email} alt="Email" />
              <div className='info-text'>
                <h3>Email</h3>
                <p>support@skgiftshop.com</p>
              </div>
            </div>

            <button className='button' onClick={() => setShowForm(true)}>
              CONTACT US
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Contact form view */}
          <div className="contact-form">
            <h2>Contact Us</h2>
            <form>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" placeholder="John Doe" />
              </div>

              <div className="form-group">
                <label htmlFor="phonenumber">Phone Number</label>
                <input type="number" id="phonenumber" placeholder="Enter your phone number" />
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
                <textarea id="message" rows="5" placeholder="How can we help you create magic today?"></textarea>
              </div>

              <button type="submit" className="send-btn">
                Send Message →
              </button>
            </form>

            {/* Back button */}
            <button className="button back-btn" onClick={() => setShowForm(false)}>
              ← Back
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Contactpage



