import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../Header/Header'
import ProductList from '../ProductList'
import Exploremenu from '../Exploremenu/Exploremenu'
import './Homepage.css'

const Homepage = () => {
  const superheroRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    if (!superheroRef.current) return

    const handleCollision = () => {
      superheroRef.current.classList.add('collision')
      setTimeout(() => {
        superheroRef.current?.classList.remove('collision')
      }, 600)
    }

    const interval = setInterval(handleCollision, 8000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (location.hash === '#products') {
      setTimeout(() => {
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 80)
    }
  }, [location.hash])

  return (
    <div className="homepage">
      <Header />
      <Exploremenu />
      <section id="products" className="products-section">
        <h2>Featured Gifts</h2>
        <p className="section-sub">Handpicked for special moments</p>
        <ProductList />
      </section>
    </div>
  )
}

export default Homepage
