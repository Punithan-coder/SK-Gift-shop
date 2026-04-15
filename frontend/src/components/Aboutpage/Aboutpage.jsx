import { Link } from 'react-router-dom'
import './Aboutpage.css'

const Aboutpage = () => (
  <div className="about-page">
    <Link to="/" className="about-page__back">
      ← Back to shop
    </Link>
    <article className="about-page__card">
      <h1>About SK Gift Shop</h1>
      <p>
        SK Gift Shop is a curated online boutique for thoughtful gifts—romantic keepsakes, gift
        sets, and everyday pieces that make moments feel special. We focus on quality, care in
        packaging, and support you can count on from browse to delivery.
      </p>
      <p>
        Whether you&apos;re celebrating a birthday, an anniversary, or a small win, we&apos;re here
        to help you find something meaningful.
      </p>
      <p className="about-page__cta">
        Questions? <Link to="/contact">Contact us</Link>—we&apos;d love to hear from you.
      </p>
    </article>
  </div>
)

export default Aboutpage
